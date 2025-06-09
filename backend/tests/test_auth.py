import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.db.models import User


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """
    Create a test user for authentication tests.
    """
    hashed_password = get_password_hash("testpassword123")
    test_user = User(
        email="user@example.com",
        username="testuser",
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=False
    )
    db_session.add(test_user)
    await db_session.commit()
    await db_session.refresh(test_user)
    return test_user


async def test_login(client: AsyncClient, test_user: User):
    """
    Test login endpoint with valid credentials.
    """
    response = await client.post("/api/v1/auth/login", data={
        "username": "testuser",
        "password": "testpassword123"
    })
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


async def test_login_invalid_password(client: AsyncClient, test_user: User):
    """
    Test login endpoint with invalid password.
    """
    response = await client.post("/api/v1/auth/login", data={
        "username": "testuser",
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401
    assert "detail" in response.json()


async def test_login_invalid_username(client: AsyncClient, test_user: User):
    """
    Test login endpoint with invalid username.
    """
    response = await client.post("/api/v1/auth/login", data={
        "username": "wronguser",
        "password": "testpassword123"
    })
    
    assert response.status_code == 401
    assert "detail" in response.json()


async def test_login_json(client: AsyncClient, test_user: User):
    """
    Test JSON login endpoint with valid credentials.
    """
    response = await client.post("/api/v1/auth/login/json", json={
        "username": "testuser",
        "password": "testpassword123"
    })
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


async def test_register(client: AsyncClient):
    """
    Test user registration endpoint.
    """
    response = await client.post("/api/v1/auth/register", json={
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "NewPassword123"
    })
    
    assert response.status_code == 201
    assert response.json()["username"] == "newuser"
    assert response.json()["email"] == "newuser@example.com"
    assert "id" in response.json()


async def test_register_duplicate_username(client: AsyncClient, test_user: User):
    """
    Test user registration with duplicate username.
    """
    response = await client.post("/api/v1/auth/register", json={
        "username": "testuser",  # Same as test_user
        "email": "different@example.com",
        "password": "NewPassword123"
    })
    
    assert response.status_code == 400
    assert "detail" in response.json()


async def test_register_duplicate_email(client: AsyncClient, test_user: User):
    """
    Test user registration with duplicate email.
    """
    response = await client.post("/api/v1/auth/register", json={
        "username": "differentuser",
        "email": "user@example.com",  # Same as test_user
        "password": "NewPassword123"
    })
    
    assert response.status_code == 400
    assert "detail" in response.json()


async def test_protected_route(authenticated_client: AsyncClient):
    """
    Test a protected route with authentication.
    """
    response = await authenticated_client.get("/protected")
    
    assert response.status_code == 200
    assert "user" in response.json()


async def test_protected_route_no_auth(client: AsyncClient):
    """
    Test a protected route without authentication.
    """
    response = await client.get("/protected")
    
    assert response.status_code == 401
    assert "detail" in response.json() 