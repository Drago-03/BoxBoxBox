from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import List

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.core.logger import setup_logging
from app.db.session import create_tables
from app.core.dependencies import get_current_user

# Setup logging
logger = logging.getLogger(__name__)
setup_logging()

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-enhanced Formula 1 platform API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_db_client():
    logger.info("Creating database tables if they don't exist")
    await create_tables()
    logger.info("Database tables created")


# Include API router
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return JSONResponse(
        content={
            "message": "Welcome to the BoxBoxBox F1 Platform API",
            "docs": "/api/docs",
        }
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return JSONResponse(status_code=200, content={"status": "healthy"})


# Protected test endpoint
@app.get("/protected", tags=["Test"])
async def protected_route(current_user=Depends(get_current_user)):
    return JSONResponse(
        content={
            "message": "This is a protected route",
            "user": current_user.username,
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG_MODE,
    ) 