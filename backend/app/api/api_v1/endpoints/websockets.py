from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException
from fastapi.websockets import WebSocketState
from typing import Dict, List, Set, Optional, Any
import json
import logging
import asyncio
from datetime import datetime

from app.core.dependencies import get_current_user
from app.services.telemetry_service import (
    get_live_telemetry, 
    get_cached_telemetry,
    create_telemetry_data
)
from app.schemas.telemetry import TelemetryResponse
from app.db.models import User

router = APIRouter()
logger = logging.getLogger(__name__)

# Store active connections
class ConnectionManager:
    def __init__(self):
        # Maps: session_id -> set of websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # For broadcasting to all: special key "all"
        self.active_connections["all"] = set()
    
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        # Add to specific session group
        if session_id not in self.active_connections:
            self.active_connections[session_id] = set()
        self.active_connections[session_id].add(websocket)
        # Add to "all" group
        self.active_connections["all"].add(websocket)
        logger.info(f"WebSocket connected: {session_id}")
    
    def disconnect(self, websocket: WebSocket, session_id: str):
        # Remove from specific session group
        if session_id in self.active_connections:
            self.active_connections[session_id].discard(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
        # Remove from "all" group
        self.active_connections["all"].discard(websocket)
        logger.info(f"WebSocket disconnected: {session_id}")
    
    async def send_data(self, data: Dict[str, Any], websocket: WebSocket):
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.send_json(data)
    
    async def broadcast(self, data: Dict[str, Any], session_id: Optional[str] = None):
        if session_id:
            # Broadcast to specific session
            if session_id in self.active_connections:
                for connection in self.active_connections[session_id]:
                    await self.send_data(data, connection)
        else:
            # Broadcast to all connections
            for connection in self.active_connections["all"]:
                await self.send_data(data, connection)


# Create connection manager instance
manager = ConnectionManager()


@router.websocket("/telemetry/{session_id}")
async def websocket_telemetry(
    websocket: WebSocket, 
    session_id: str, 
    driver_id: Optional[str] = None
):
    """
    WebSocket endpoint for receiving real-time telemetry data.
    """
    await manager.connect(websocket, session_id)
    
    try:
        # Send initial cached telemetry data
        cached_data = await get_cached_telemetry(session_id, driver_id)
        if cached_data:
            await manager.send_data(
                {
                    "type": "cached_data",
                    "data": cached_data,
                    "timestamp": datetime.utcnow().isoformat()
                },
                websocket
            )
        
        # Main loop for receiving and sending data
        while True:
            # Wait for messages from client
            data = await websocket.receive_text()
            received_data = json.loads(data)
            
            # Process client message
            if received_data.get("type") == "ping":
                # Respond to ping
                await manager.send_data(
                    {
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    websocket
                )
            
            # Check for new telemetry data every 100ms
            telemetry_data = await get_live_telemetry(session_id, driver_id)
            if telemetry_data:
                # Send updated telemetry
                await manager.send_data(
                    {
                        "type": "telemetry_update",
                        "data": telemetry_data,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    websocket
                )
            
            # Small delay to prevent tight loop
            await asyncio.sleep(0.1)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket, session_id)


@router.websocket("/broadcast/{session_id}")
async def websocket_broadcast(
    websocket: WebSocket, 
    session_id: str
):
    """
    WebSocket endpoint for broadcasting race events and notifications.
    """
    await manager.connect(websocket, session_id)
    
    try:
        # Welcome message
        await manager.send_data(
            {
                "type": "info",
                "message": f"Connected to broadcast channel for session {session_id}",
                "timestamp": datetime.utcnow().isoformat()
            },
            websocket
        )
        
        # Main loop
        while True:
            # Wait for messages that could be broadcasted to other clients
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Validate message
            if "type" not in message or "data" not in message:
                await manager.send_data(
                    {
                        "type": "error",
                        "message": "Invalid message format",
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    websocket
                )
                continue
            
            # Broadcast to all clients in the session
            await manager.broadcast(
                {
                    "type": message["type"],
                    "data": message["data"],
                    "timestamp": datetime.utcnow().isoformat()
                },
                session_id
            )
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket, session_id)


# REST endpoint to broadcast a message to all WebSocket clients
@router.post("/broadcast/{session_id}")
async def broadcast_message(
    session_id: str,
    message: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    """
    Broadcast a message to all connected WebSocket clients in a session.
    """
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    
    # Add sender info
    message["sender"] = {
        "id": user.id,
        "username": user.username
    }
    
    # Add timestamp
    message["timestamp"] = datetime.utcnow().isoformat()
    
    # Broadcast to all clients in the session
    await manager.broadcast(message, session_id)
    
    return {"status": "Message broadcast initiated", "recipients": len(manager.active_connections.get(session_id, set()))} 