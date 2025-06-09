import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool

from app.core.config import settings

# Convert synchronous PostgreSQL URL to async format
# Example: postgresql://user:pass@localhost/dbname -> postgresql+asyncpg://user:pass@localhost/dbname
ASYNC_DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql://", "postgresql+asyncpg://"
) if settings.DATABASE_URL.startswith("postgresql://") else settings.DATABASE_URL

# Create async engine
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=settings.DEBUG_MODE,
    future=True,
    poolclass=NullPool if settings.DEBUG_MODE else None,
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Create declarative base for models
Base = declarative_base()

logger = logging.getLogger(__name__)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async DB session.
    """
    async with AsyncSessionLocal() as session:
        logger.debug("DB session created")
        try:
            yield session
        finally:
            logger.debug("DB session closed")
            await session.close()


async def create_tables() -> None:
    """
    Create all tables defined in models.
    """
    async with engine.begin() as conn:
        # Import all models to ensure they're registered with the metadata
        from app.db import models  # noqa
        
        logger.info("Creating database tables")
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created") 