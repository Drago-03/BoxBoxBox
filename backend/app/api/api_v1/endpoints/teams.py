from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
import logging

from app.core.dependencies import get_current_user, get_current_active_superuser
from app.db.session import get_db
from app.db.models import Team, Driver, User

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_teams(
    skip: int = 0,
    limit: int = 100,
    nationality: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all teams with optional filtering by nationality.
    """
    # Build query
    query = select(Team)
    
    # Apply filters
    if nationality:
        query = query.filter(Team.nationality == nationality)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    teams = result.scalars().all()
    
    # Convert to response format
    team_list = []
    for team in teams:
        # Get drivers for this team
        drivers_query = select(Driver).where(Driver.team_id == team.id)
        drivers_result = await db.execute(drivers_query)
        drivers = drivers_result.scalars().all()
        
        team_dict = {
            "id": team.id,
            "name": team.name,
            "team_id": team.team_id,
            "full_name": team.full_name,
            "nationality": team.nationality,
            "drivers": [
                {
                    "id": driver.id,
                    "name": driver.name,
                    "code": driver.code,
                    "number": driver.number
                }
                for driver in drivers
            ]
        }
        team_list.append(team_dict)
    
    return team_list


@router.get("/{team_id}", response_model=Dict[str, Any])
async def get_team_by_id(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a team by ID.
    """
    # Get team by ID
    query = select(Team).where(Team.id == team_id)
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with ID {team_id} not found"
        )
    
    # Get drivers for this team
    drivers_query = select(Driver).where(Driver.team_id == team.id)
    drivers_result = await db.execute(drivers_query)
    drivers = drivers_result.scalars().all()
    
    # Build response
    team_dict = {
        "id": team.id,
        "name": team.name,
        "team_id": team.team_id,
        "full_name": team.full_name,
        "nationality": team.nationality,
        "drivers": [
            {
                "id": driver.id,
                "name": driver.name,
                "code": driver.code,
                "number": driver.number,
                "driver_id": driver.driver_id
            }
            for driver in drivers
        ]
    }
    
    return team_dict


# Admin endpoints - only for superusers

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new team. Only for superusers.
    """
    # Check if team_id already exists
    query = select(Team).where(Team.team_id == team_data["team_id"])
    result = await db.execute(query)
    existing_team = result.scalar_one_or_none()
    
    if existing_team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Team with ID {team_data['team_id']} already exists"
        )
    
    # Create new team
    new_team = Team(**team_data)
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    
    # Build response
    team_dict = {
        "id": new_team.id,
        "name": new_team.name,
        "team_id": new_team.team_id,
        "full_name": new_team.full_name,
        "nationality": new_team.nationality
    }
    
    return team_dict


@router.put("/{team_id}", response_model=Dict[str, Any])
async def update_team(
    team_id: int,
    team_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a team. Only for superusers.
    """
    # Get team by ID
    query = select(Team).where(Team.id == team_id)
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with ID {team_id} not found"
        )
    
    # Check if team_id already exists if changing team_id
    if "team_id" in team_data and team_data["team_id"] != team.team_id:
        query = select(Team).where(Team.team_id == team_data["team_id"])
        result = await db.execute(query)
        existing_team = result.scalar_one_or_none()
        
        if existing_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Team with ID {team_data['team_id']} already exists"
            )
    
    # Update team fields
    for key, value in team_data.items():
        if hasattr(team, key):
            setattr(team, key, value)
    
    await db.commit()
    await db.refresh(team)
    
    # Build response
    team_dict = {
        "id": team.id,
        "name": team.name,
        "team_id": team.team_id,
        "full_name": team.full_name,
        "nationality": team.nationality
    }
    
    return team_dict


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a team. Only for superusers.
    """
    # Get team by ID
    query = select(Team).where(Team.id == team_id)
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with ID {team_id} not found"
        )
    
    # Check if team has drivers
    drivers_query = select(Driver).where(Driver.team_id == team.id)
    drivers_result = await db.execute(drivers_query)
    drivers = drivers_result.scalars().all()
    
    if drivers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete team with ID {team_id} as it has {len(drivers)} drivers associated with it"
        )
    
    # Delete team
    await db.delete(team)
    await db.commit()
    
    return None 