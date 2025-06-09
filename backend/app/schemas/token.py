from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Token payload schema."""
    sub: Optional[int] = None
    exp: Optional[int] = None


class LoginRequest(BaseModel):
    """Login request schema."""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")
    
    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "secretpassword"
            }
        }


class TokenRefresh(BaseModel):
    """Token refresh request schema."""
    refresh_token: str = Field(..., description="Refresh token") 