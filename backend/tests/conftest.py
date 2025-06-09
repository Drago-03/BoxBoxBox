import asyncio
import pytest
from typing import AsyncGenerator, Generator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.db.session import Base, get_db
from app.main import app

# Test database URL - using SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create async engine for testing
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    future=True,
    poolclass=NullPool
)

# Create async session for testing
TestingAsyncSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for overriding the database session with test session.
    """
    async with TestingAsyncSessionLocal() as session:
        yield session


# Override the database dependency
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """
    Create an instance of the default event loop for the test session.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def create_tables() -> AsyncGenerator[None, None]:
    """
    Create tables in the test database.
    """
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a fresh database session for each test.
    """
    async with TestingAsyncSessionLocal() as session:
        yield session


@pytest.fixture
async def client(create_tables) -> AsyncGenerator[AsyncClient, None]:
    """
    Create a test client for the FastAPI app.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
async def authenticated_client(create_tables, client, db_session) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an authenticated test client with a superuser token.
    """
    from app.core.security import get_password_hash, create_access_token
    from app.db.models import User
    
    # Create a test superuser
    hashed_password = get_password_hash("test_password")
    test_superuser = User(
        email="test@example.com",
        username="test_superuser",
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=True
    )
    db_session.add(test_superuser)
    await db_session.commit()
    await db_session.refresh(test_superuser)
    
    # Create token
    access_token = create_access_token(subject=test_superuser.id)
    client.headers["Authorization"] = f"Bearer {access_token}"
    
    yield client 