from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class TelemetryDataPoint(BaseModel):
    """Schema for a single telemetry data point."""
    timestamp: datetime
    speed: Optional[float] = None
    throttle: Optional[float] = None
    brake: Optional[float] = None
    gear: Optional[int] = None
    rpm: Optional[float] = None
    drs: Optional[int] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    position_z: Optional[float] = None
    tire_compound: Optional[str] = None
    tire_life: Optional[float] = None
    sector: Optional[int] = None
    lap: Optional[int] = None


class TelemetryResponse(BaseModel):
    """Schema for telemetry data response."""
    session_id: str
    driver_id: Optional[str] = None
    data: List[TelemetryDataPoint]
    lap_count: Optional[int] = None
    current_lap: Optional[int] = None
    last_update: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "12345",
                "driver_id": "HAM",
                "data": [
                    {
                        "timestamp": "2023-07-09T14:32:10.123456",
                        "speed": 285.5,
                        "throttle": 95.0,
                        "brake": 0.0,
                        "gear": 8,
                        "rpm": 11200.0,
                        "drs": 1,
                        "position_x": 125.4,
                        "position_y": 78.2,
                        "position_z": 0.0,
                        "tire_compound": "medium",
                        "tire_life": 75.5,
                        "sector": 2,
                        "lap": 24
                    }
                ],
                "lap_count": 50,
                "current_lap": 24,
                "last_update": "2023-07-09T14:32:10.123456"
            }
        }


class TelemetrySessionCreate(BaseModel):
    """Schema for creating a new telemetry session."""
    session_type: str = Field(..., description="Type of session (Race, Qualifying, FP1, FP2, FP3)")
    circuit_id: Optional[int] = Field(None, description="ID of the circuit")
    race_id: Optional[int] = Field(None, description="ID of the race")
    session_date: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None


class TelemetrySessionResponse(BaseModel):
    """Schema for telemetry session response."""
    id: int
    user_id: int
    session_type: str
    circuit_id: Optional[int] = None
    race_id: Optional[int] = None
    session_date: datetime
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True 