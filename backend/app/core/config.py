import os
from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings using environment variables with Pydantic.
    """
    # Project info
    PROJECT_NAME: str = "BoxBoxBox F1 Platform"
    API_V1_STR: str = "/api/v1"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG_MODE: bool = False
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # APIs
    OPENAI_API_KEY: Optional[str] = None
    JOLPICA_API_KEY: Optional[str] = None
    
    # Model paths
    MODEL_DIR: str = "app/ml_models/saved"
    
    # Cache settings
    CACHE_EXPIRATION: int = 3600  # 1 hour in seconds
    
    @field_validator("DATABASE_URL")
    def validate_database_url(cls, v: Optional[str]) -> str:
        if not v:
            raise ValueError("DATABASE_URL must be provided")
        return v
    
    @field_validator("SECRET_KEY")
    def validate_secret_key(cls, v: Optional[str]) -> str:
        if not v or len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()  # type: ignore

# Ensure required directories exist
os.makedirs(settings.MODEL_DIR, exist_ok=True) 