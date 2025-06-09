from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
import logging

from app.core.dependencies import get_current_user, get_current_active_superuser
from app.db.session import get_db
from app.db.models import Driver, Team, User

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_drivers(
    skip: int = 0,
    limit: int = 100,
    team_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all drivers with optional filtering by team.
    """
    # Build query
    query = select(Driver)
    
    # Apply filters
    if team_id:
        query = query.filter(Driver.team_id == team_id)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    drivers = result.scalars().all()
    
    # Convert to response format
    driver_list = []
    for driver in drivers:
        # Get team info if available
        team = None
        if driver.team_id:
            team_query = select(Team).where(Team.id == driver.team_id)
            team_result = await db.execute(team_query)
            team = team_result.scalar_one_or_none()
        
        driver_dict = {
            "id": driver.id,
            "name": driver.name,
            "driver_id": driver.driver_id,
            "number": driver.number,
            "code": driver.code,
            "team_id": driver.team_id,
            "team": {
                "name": team.name if team else None,
                "team_id": team.team_id if team else None
            } if team else None
        }
        driver_list.append(driver_dict)
    
    return driver_list


@router.get("/{driver_id}", response_model=Dict[str, Any])
async def get_driver_by_id(
    driver_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a driver by ID.
    """
    # Get driver by ID
    query = select(Driver).where(Driver.id == driver_id)
    result = await db.execute(query)
    driver = result.scalar_one_or_none()
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    
    # Get team info if available
    team = None
    if driver.team_id:
        team_query = select(Team).where(Team.id == driver.team_id)
        team_result = await db.execute(team_query)
        team = team_result.scalar_one_or_none()
    
    # Build response
    driver_dict = {
        "id": driver.id,
        "name": driver.name,
        "driver_id": driver.driver_id,
        "number": driver.number,
        "code": driver.code,
        "team_id": driver.team_id,
        "team": {
            "name": team.name if team else None,
            "team_id": team.team_id if team else None,
            "full_name": team.full_name if team else None,
            "nationality": team.nationality if team else None
        } if team else None
    }
    
    return driver_dict


# Admin endpoints - only for superusers

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_driver(
    driver_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new driver. Only for superusers.
    """
    # Validate team exists if team_id is provided
    if driver_data.get("team_id"):
        team_query = select(Team).where(Team.id == driver_data["team_id"])
        team_result = await db.execute(team_query)
        team = team_result.scalar_one_or_none()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Team with ID {driver_data['team_id']} not found"
            )
    
    # Check if driver_id already exists
    query = select(Driver).where(Driver.driver_id == driver_data["driver_id"])
    result = await db.execute(query)
    existing_driver = result.scalar_one_or_none()
    
    if existing_driver:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Driver with ID {driver_data['driver_id']} already exists"
        )
    
    # Create new driver
    new_driver = Driver(**driver_data)
    db.add(new_driver)
    await db.commit()
    await db.refresh(new_driver)
    
    # Build response
    driver_dict = {
        "id": new_driver.id,
        "name": new_driver.name,
        "driver_id": new_driver.driver_id,
        "number": new_driver.number,
        "code": new_driver.code,
        "team_id": new_driver.team_id
    }
    
    return driver_dict


@router.put("/{driver_id}", response_model=Dict[str, Any])
async def update_driver(
    driver_id: int,
    driver_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a driver. Only for superusers.
    """
    # Get driver by ID
    query = select(Driver).where(Driver.id == driver_id)
    result = await db.execute(query)
    driver = result.scalar_one_or_none()
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    
    # Validate team exists if changing team_id
    if "team_id" in driver_data and driver_data["team_id"] != driver.team_id:
        team_query = select(Team).where(Team.id == driver_data["team_id"])
        team_result = await db.execute(team_query)
        team = team_result.scalar_one_or_none()
        
        if not team and driver_data["team_id"] is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Team with ID {driver_data['team_id']} not found"
            )
    
    # Update driver fields
    for key, value in driver_data.items():
        if hasattr(driver, key):
            setattr(driver, key, value)
    
    await db.commit()
    await db.refresh(driver)
    
    # Build response
    driver_dict = {
        "id": driver.id,
        "name": driver.name,
        "driver_id": driver.driver_id,
        "number": driver.number,
        "code": driver.code,
        "team_id": driver.team_id
    }
    
    return driver_dict


@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_driver(
    driver_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a driver. Only for superusers.
    """
    # Get driver by ID
    query = select(Driver).where(Driver.id == driver_id)
    result = await db.execute(query)
    driver = result.scalar_one_or_none()
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    
    # Delete driver
    await db.delete(driver)
    await db.commit()
    
    return None 