from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging

from app.core.dependencies import get_current_user, get_current_active_superuser
from app.db.session import get_db
from app.schemas.user import (
    User, 
    UserCreate, 
    UserUpdate, 
    UserWithSettings,
    UserSettingsUpdate
)
from app.services.user_service import (
    get_user_by_id,
    get_users,
    create_user,
    update_user,
    delete_user,
    get_user_settings,
    update_user_settings
)
from app.db.models import User as UserModel

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[User])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve users. Only for superusers.
    """
    users = await get_users(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_new_user(
    user_in: UserCreate,
    current_user: UserModel = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new user. Only for superusers.
    """
    try:
        user = await create_user(db, user_in)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/me", response_model=UserWithSettings)
async def read_user_me(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user.
    """
    # Get user settings
    user_settings = await get_user_settings(db, current_user.id)
    
    # Combine user with settings
    user_dict = User.from_orm(current_user).dict()
    user_dict["settings"] = user_settings
    
    return user_dict


@router.put("/me", response_model=User)
async def update_user_me(
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user.
    """
    try:
        user = await update_user(db, current_user.id, user_in)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/me/settings", response_model=UserSettingsUpdate)
async def read_user_settings(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user settings.
    """
    settings = await get_user_settings(db, current_user.id)
    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Settings not found"
        )
    return settings


@router.put("/me/settings", response_model=UserSettingsUpdate)
async def update_user_settings_endpoint(
    settings_in: UserSettingsUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user settings.
    """
    try:
        settings = await update_user_settings(db, current_user.id, settings_in)
        if not settings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Settings not found"
            )
        return settings
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{user_id}", response_model=User)
async def read_user_by_id(
    user_id: int,
    current_user: UserModel = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific user by id. Only for superusers.
    """
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    return user


@router.put("/{user_id}", response_model=User)
async def update_user_by_id(
    user_id: int,
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a user. Only for superusers.
    """
    try:
        user = await update_user(db, user_id, user_in)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(
    user_id: int,
    current_user: UserModel = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a user. Only for superusers.
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Users cannot delete themselves"
        )
    
    success = await delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    return None 