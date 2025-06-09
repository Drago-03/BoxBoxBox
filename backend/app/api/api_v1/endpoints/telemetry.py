from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import logging

from app.core.dependencies import get_current_user, get_current_active_superuser
from app.db.session import get_db
from app.db.models import User, TelemetrySession
from app.schemas.telemetry import (
    TelemetryResponse, 
    TelemetrySessionCreate, 
    TelemetrySessionResponse
)
from app.services.telemetry_service import (
    get_live_telemetry,
    get_telemetry_session,
    get_telemetry_data,
    create_telemetry_data,
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Get live telemetry data
@router.get("/live/{session_id}", response_model=TelemetryResponse)
async def get_live_telemetry_data(
    session_id: str,
    driver_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Get live telemetry data for a session.
    
    This endpoint simulates a real-time telemetry feed. In a real implementation,
    this would connect to a data source like FastF1 API or a UDP telemetry stream.
    
    For more continuous data streaming, consider using the WebSocket endpoint.
    """
    logger.info(f"Getting live telemetry for session {session_id}")
    
    telemetry_data = await get_live_telemetry(session_id, driver_id)
    if not telemetry_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No telemetry data available for this session"
        )
    
    return telemetry_data

# Get user's telemetry sessions
@router.get("/sessions", response_model=List[TelemetrySessionResponse])
async def get_user_telemetry_sessions(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all telemetry sessions for the current user.
    """
    from sqlalchemy.future import select
    
    query = (
        select(TelemetrySession)
        .where(TelemetrySession.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    
    return sessions

# Create a new telemetry session
@router.post("/sessions", response_model=TelemetrySessionResponse, status_code=status.HTTP_201_CREATED)
async def create_telemetry_session(
    session_data: TelemetrySessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new telemetry session.
    """
    new_session = TelemetrySession(
        user_id=current_user.id,
        session_type=session_data.session_type,
        circuit_id=session_data.circuit_id,
        race_id=session_data.race_id,
        session_date=session_data.session_date,
        notes=session_data.notes
    )
    
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    logger.info(f"Created new telemetry session {new_session.id}")
    return new_session

# Get a specific telemetry session
@router.get("/sessions/{session_id}", response_model=TelemetrySessionResponse)
async def get_telemetry_session_by_id(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific telemetry session by ID.
    """
    session = await get_telemetry_session(db, session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Telemetry session not found"
        )
    
    # Check that the session belongs to the current user
    if session.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this session"
        )
    
    return session

# Delete a telemetry session
@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_telemetry_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a specific telemetry session.
    """
    session = await get_telemetry_session(db, session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Telemetry session not found"
        )
    
    # Check that the session belongs to the current user
    if session.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this session"
        )
    
    await db.delete(session)
    await db.commit()
    
    logger.info(f"Deleted telemetry session {session_id}")
    return None 