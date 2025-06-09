from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

from app.core.dependencies import get_current_user, get_current_active_superuser
from app.db.session import get_db
from app.db.models import Race, Circuit, User

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_races(
    skip: int = 0,
    limit: int = 100,
    season: Optional[int] = None,
    circuit_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all races with optional filtering by season or circuit.
    """
    # Build query
    query = select(Race).order_by(Race.date.desc())
    
    # Apply filters
    if season:
        query = query.filter(Race.season == season)
    if circuit_id:
        query = query.filter(Race.circuit_id == circuit_id)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    races = result.scalars().all()
    
    # Convert to response format
    race_list = []
    for race in races:
        # Get circuit info
        circuit_query = select(Circuit).where(Circuit.id == race.circuit_id)
        circuit_result = await db.execute(circuit_query)
        circuit = circuit_result.scalar_one_or_none()
        
        race_dict = {
            "id": race.id,
            "name": race.name,
            "season": race.season,
            "round": race.round,
            "circuit_id": race.circuit_id,
            "date": race.date.isoformat(),
            "weather_data": race.weather_data,
            "circuit": {
                "name": circuit.name if circuit else None,
                "location": circuit.location if circuit else None,
                "country": circuit.country if circuit else None
            } if circuit else None
        }
        race_list.append(race_dict)
    
    return race_list


@router.get("/{race_id}", response_model=Dict[str, Any])
async def get_race_by_id(
    race_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a race by ID with detailed information.
    """
    # Get race by ID
    query = select(Race).where(Race.id == race_id)
    result = await db.execute(query)
    race = result.scalar_one_or_none()
    
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Race with ID {race_id} not found"
        )
    
    # Get circuit info
    circuit_query = select(Circuit).where(Circuit.id == race.circuit_id)
    circuit_result = await db.execute(circuit_query)
    circuit = circuit_result.scalar_one_or_none()
    
    # Build response
    race_dict = {
        "id": race.id,
        "name": race.name,
        "season": race.season,
        "round": race.round,
        "circuit_id": race.circuit_id,
        "date": race.date.isoformat(),
        "weather_data": race.weather_data,
        "circuit": {
            "name": circuit.name if circuit else None,
            "location": circuit.location if circuit else None,
            "country": circuit.country if circuit else None,
            "length_km": circuit.length_km if circuit else None,
            "turns": circuit.turns if circuit else None
        } if circuit else None,
    }
    
    return race_dict


@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_race(
    race_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new race. Only for superusers.
    """
    # Validate circuit exists
    if "circuit_id" in race_data:
        circuit_query = select(Circuit).where(Circuit.id == race_data["circuit_id"])
        circuit_result = await db.execute(circuit_query)
        circuit = circuit_result.scalar_one_or_none()
        
        if not circuit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Circuit with ID {race_data['circuit_id']} not found"
            )
    
    # Convert date from string to datetime if provided as string
    if "date" in race_data and isinstance(race_data["date"], str):
        try:
            race_data["date"] = datetime.fromisoformat(race_data["date"].replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"
            )
    
    # Create new race
    new_race = Race(**race_data)
    db.add(new_race)
    await db.commit()
    await db.refresh(new_race)
    
    # Build response
    race_dict = {
        "id": new_race.id,
        "name": new_race.name,
        "season": new_race.season,
        "round": new_race.round,
        "circuit_id": new_race.circuit_id,
        "date": new_race.date.isoformat(),
        "weather_data": new_race.weather_data
    }
    
    return race_dict


@router.put("/{race_id}", response_model=Dict[str, Any])
async def update_race(
    race_id: int,
    race_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a race. Only for superusers.
    """
    # Get race by ID
    query = select(Race).where(Race.id == race_id)
    result = await db.execute(query)
    race = result.scalar_one_or_none()
    
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Race with ID {race_id} not found"
        )
    
    # Validate circuit exists if changing circuit_id
    if "circuit_id" in race_data and race_data["circuit_id"] != race.circuit_id:
        circuit_query = select(Circuit).where(Circuit.id == race_data["circuit_id"])
        circuit_result = await db.execute(circuit_query)
        circuit = circuit_result.scalar_one_or_none()
        
        if not circuit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Circuit with ID {race_data['circuit_id']} not found"
            )
    
    # Convert date from string to datetime if provided as string
    if "date" in race_data and isinstance(race_data["date"], str):
        try:
            race_data["date"] = datetime.fromisoformat(race_data["date"].replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"
            )
    
    # Update race fields
    for key, value in race_data.items():
        if hasattr(race, key):
            setattr(race, key, value)
    
    await db.commit()
    await db.refresh(race)
    
    # Build response
    race_dict = {
        "id": race.id,
        "name": race.name,
        "season": race.season,
        "round": race.round,
        "circuit_id": race.circuit_id,
        "date": race.date.isoformat(),
        "weather_data": race.weather_data
    }
    
    return race_dict


@router.delete("/{race_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_race(
    race_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a race. Only for superusers.
    """
    # Get race by ID
    query = select(Race).where(Race.id == race_id)
    result = await db.execute(query)
    race = result.scalar_one_or_none()
    
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Race with ID {race_id} not found"
        )
    
    # Delete race
    await db.delete(race)
    await db.commit()
    
    return None 