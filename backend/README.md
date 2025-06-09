# BoxBoxBox Backend

This is the Python backend for the BoxBoxBox F1 Platform, providing APIs for telemetry data, race analysis, and user management.

## 🚀 Features

- RESTful API built with FastAPI
- Async database operations with SQLAlchemy 2.0
- PostgreSQL database with Alembic migrations
- Redis for caching and real-time data
- WebSocket support for live telemetry
- JWT authentication and role-based access control
- Comprehensive API documentation with Swagger/OpenAPI

## 📋 Requirements

- Python 3.9+
- PostgreSQL 14+
- Redis 7+

## 🔧 Installation

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd boxboxbox/backend
   ```
3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```
4. The API will be available at http://localhost:8000
5. API documentation is available at http://localhost:8000/api/docs

### Option 2: Local Development

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd boxboxbox/backend
   ```
3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -e .
   ```
5. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
6. Run database migrations:
   ```bash
   alembic upgrade head
   ```
7. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## 🔄 API Endpoints

The BoxBoxBox API is organized into several modules:

### Authentication
- `POST /api/v1/auth/login` - Get an access token
- `POST /api/v1/auth/login/json` - Login with JSON
- `POST /api/v1/auth/register` - Register a new user

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/me/settings` - Get user settings
- `PUT /api/v1/users/me/settings` - Update user settings

### Telemetry
- `GET /api/v1/telemetry/live/{session_id}` - Get live telemetry
- `GET /api/v1/telemetry/sessions` - List user sessions
- `POST /api/v1/telemetry/sessions` - Create a session
- `GET /api/v1/telemetry/sessions/{session_id}` - Get session by ID
- `DELETE /api/v1/telemetry/sessions/{session_id}` - Delete a session

### WebSockets
- `WebSocket /api/v1/ws/telemetry/{session_id}` - Live telemetry stream
- `WebSocket /api/v1/ws/broadcast/{session_id}` - Broadcast channel

### Other Endpoints
- Circuits, Races, Drivers, Teams, and Strategy endpoints
- See the API documentation for full details

## 🧪 Testing

Run tests with pytest:

```bash
pytest
```

For coverage report:

```bash
pytest --cov=app
```

## 🔄 Database Migrations

The project uses Alembic for database migrations:

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## 📝 Development Guidelines

1. **Type Hints**: All Python code must use type hints.
2. **Async Operations**: Use async/await for database operations.
3. **Error Handling**: Always use appropriate error handling and HTTP status codes.
4. **Documentation**: All API endpoints must have docstrings and Swagger documentation.
5. **Testing**: Write tests for new features and maintain existing test coverage.
6. **Code Formatting**: Use Black and isort for consistent code formatting.

## 🛠️ Project Structure

```
backend/
├── app/
│   ├── api/                  # API endpoints
│   ├── core/                 # Core functionality (config, security, etc.)
│   ├── db/                   # Database models and session management
│   ├── schemas/              # Pydantic schemas for request/response validation
│   ├── services/             # Business logic
│   ├── main.py               # FastAPI application entry point
├── alembic/                  # Database migrations
├── tests/                    # Test cases
├── .env.example              # Example environment variables
├── pyproject.toml            # Project dependencies
└── README.md                 # This file
```

## 🔑 Environment Variables

The following environment variables are used:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SECRET_KEY`: JWT secret key
- `DEBUG_MODE`: Set to true for development
- `CORS_ORIGINS`: List of allowed origins for CORS

## 📄 License

MIT License 