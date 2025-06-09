from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, Union, Dict, Any
import logging

from app.core.config import settings
from app.core.security import verify_password
from app.db.session import get_db
from app.db.models import User
from app.schemas.token import TokenPayload

# OAuth2 setup for FastAPI
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

logger = logging.getLogger(__name__)


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Validate token and return current user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        # Extract user ID from token
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            logger.warning("Invalid token payload: missing sub field")
            raise credentials_exception
    
    except JWTError as e:
        logger.warning(f"JWT validation error: {str(e)}")
        raise credentials_exception
    
    # Get user from database
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if user is None:
        logger.warning(f"User not found: {user_id}")
        raise credentials_exception
    
    if not user.is_active:
        logger.warning(f"Inactive user: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Validate that the current user is a superuser.
    """
    if not current_user.is_superuser:
        logger.warning(f"User {current_user.id} is not a superuser")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return current_user


async def authenticate_user(
    db: AsyncSession, username: str, password: str
) -> Optional[User]:
    """
    Authenticate a user by username/email and password.
    """
    # Try username first
    stmt = select(User).where(User.username == username)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    # If not found, try email
    if not user:
        stmt = select(User).where(User.email == username)
        result = await db.execute(stmt)
        user = result.scalars().first()
    
    # Verify user and password
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    return user 