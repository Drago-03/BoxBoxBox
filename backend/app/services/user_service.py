from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Dict, Any
import logging

from app.core.security import get_password_hash, verify_password
from app.schemas.user import UserCreate, UserUpdate, UserSettingsCreate, UserSettingsUpdate
from app.db.models import User, UserSettings

logger = logging.getLogger(__name__)


async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    """
    Get a user by ID.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        User or None if not found
    """
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """
    Get a user by email.
    
    Args:
        db: Database session
        email: User email
        
    Returns:
        User or None if not found
    """
    query = select(User).where(User.email == email)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    """
    Get a user by username.
    
    Args:
        db: Database session
        username: Username
        
    Returns:
        User or None if not found
    """
    query = select(User).where(User.username == username)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_users(
    db: AsyncSession, skip: int = 0, limit: int = 100
) -> List[User]:
    """
    Get multiple users with pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of users
    """
    query = select(User).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    """
    Create a new user.
    
    Args:
        db: Database session
        user_data: User creation data
        
    Returns:
        Created user
        
    Raises:
        ValueError: If user with the same email or username already exists
    """
    # Check if username or email already exists
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise ValueError("Email already registered")
    
    existing_user = await get_user_by_username(db, user_data.username)
    if existing_user:
        raise ValueError("Username already taken")
    
    # Create user object
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=False
    )
    
    # Add to database
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise ValueError("Database error while creating user")
    
    # Create default user settings
    settings = UserSettings(
        user_id=db_user.id,
        favorite_driver=None,
        favorite_team=None,
        preferred_units="metric",
        ui_theme="dark",
        notifications_enabled=True
    )
    
    db.add(settings)
    try:
        await db.commit()
    except IntegrityError as e:
        logger.error(f"Error creating user settings: {str(e)}")
        # Continue even if settings creation fails
    
    return db_user


async def update_user(
    db: AsyncSession, user_id: int, user_data: UserUpdate
) -> Optional[User]:
    """
    Update an existing user.
    
    Args:
        db: Database session
        user_id: User ID
        user_data: User update data
        
    Returns:
        Updated user or None if not found
        
    Raises:
        ValueError: If update would result in a duplicate email or username
    """
    # Get user
    db_user = await get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    # Check for duplicate email/username
    if user_data.email and user_data.email != db_user.email:
        existing_user = await get_user_by_email(db, user_data.email)
        if existing_user:
            raise ValueError("Email already registered")
    
    if user_data.username and user_data.username != db_user.username:
        existing_user = await get_user_by_username(db, user_data.username)
        if existing_user:
            raise ValueError("Username already taken")
    
    # Update fields
    update_data = user_data.dict(exclude_unset=True)
    
    # Handle password separately
    if "password" in update_data:
        hashed_password = get_password_hash(update_data.pop("password"))
        setattr(db_user, "hashed_password", hashed_password)
    
    # Update other fields
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    # Commit changes
    try:
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Error updating user: {str(e)}")
        raise ValueError("Database error while updating user")


async def delete_user(db: AsyncSession, user_id: int) -> bool:
    """
    Delete a user.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        True if user was deleted, False if not found
    """
    db_user = await get_user_by_id(db, user_id)
    if not db_user:
        return False
    
    await db.delete(db_user)
    await db.commit()
    return True


async def get_user_settings(db: AsyncSession, user_id: int) -> Optional[UserSettings]:
    """
    Get user settings.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        User settings or None if not found
    """
    query = select(UserSettings).where(UserSettings.user_id == user_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def update_user_settings(
    db: AsyncSession, user_id: int, settings_data: UserSettingsUpdate
) -> Optional[UserSettings]:
    """
    Update user settings.
    
    Args:
        db: Database session
        user_id: User ID
        settings_data: Settings update data
        
    Returns:
        Updated settings or None if not found
    """
    # Get settings
    db_settings = await get_user_settings(db, user_id)
    if not db_settings:
        return None
    
    # Update fields
    update_data = settings_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_settings, field, value)
    
    # Commit changes
    try:
        await db.commit()
        await db.refresh(db_settings)
        return db_settings
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Error updating user settings: {str(e)}")
        raise ValueError("Database error while updating settings") 