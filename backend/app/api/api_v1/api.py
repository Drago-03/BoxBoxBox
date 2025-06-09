from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    auth,
    users,
    telemetry,
    circuits,
    races,
    drivers,
    teams,
    strategies,
    websockets
)

# Initialize main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["Telemetry"])
api_router.include_router(circuits.router, prefix="/circuits", tags=["Circuits"])
api_router.include_router(races.router, prefix="/races", tags=["Races"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])
api_router.include_router(teams.router, prefix="/teams", tags=["Teams"])
api_router.include_router(strategies.router, prefix="/strategies", tags=["Strategies"])
api_router.include_router(websockets.router, prefix="/ws", tags=["WebSockets"]) 