from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
import re


class UserBase(BaseModel):
    """Base user schema with common fields."""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username must contain only alphanumeric characters, underscores, and hyphens')
        return v
    
    @validator('password')
    def password_strength(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john.doe@example.com",
                "password": "SecurePass123"
            }
        }


class UserUpdate(BaseModel):
    """Schema for updating an existing user."""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if v is not None and not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username must contain only alphanumeric characters, underscores, and hyphens')
        return v
    
    @validator('password')
    def password_strength(cls, v):
        if v is not None:
            if not re.search(r'[A-Z]', v):
                raise ValueError('Password must contain at least one uppercase letter')
            if not re.search(r'[a-z]', v):
                raise ValueError('Password must contain at least one lowercase letter')
            if not re.search(r'[0-9]', v):
                raise ValueError('Password must contain at least one digit')
        return v


class UserInDBBase(UserBase):
    """Base schema for users in the database."""
    id: int
    
    class Config:
        orm_mode = True


class User(UserInDBBase):
    """Schema for user responses."""
    pass


class UserInDB(UserInDBBase):
    """Schema for users in the database, including the hashed password."""
    hashed_password: str


class UserWithSettings(User):
    """User schema with settings included."""
    settings: Optional["UserSettingsResponse"] = None


class UserSettingsBase(BaseModel):
    """Base schema for user settings."""
    favorite_driver: Optional[str] = None
    favorite_team: Optional[str] = None
    preferred_units: Optional[str] = "metric"
    ui_theme: Optional[str] = "dark"
    notifications_enabled: Optional[bool] = True


class UserSettingsCreate(UserSettingsBase):
    """Schema for creating user settings."""
    user_id: int


class UserSettingsUpdate(UserSettingsBase):
    """Schema for updating user settings."""
    pass


class UserSettingsResponse(UserSettingsBase):
    """Schema for user settings responses."""
    id: int
    user_id: int
    
    class Config:
        orm_mode = True


# Update forward references
UserWithSettings.update_forward_refs() 