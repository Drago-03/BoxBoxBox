from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
import json
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql.expression import or_
import redis.asyncio as redis
from sqlalchemy import desc, and_

from app.db.models import TelemetrySession, TelemetryData, User, Driver, Circuit, Race
from app.schemas.telemetry import TelemetryResponse, TelemetryDataPoint
from app.core.config import settings

logger = logging.getLogger(__name__)

# Connect to Redis
redis_client = None

async def get_redis_client() -> redis.Redis:
    """
    Get or create Redis client.
    """
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
            logger.info("Connected to Redis")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            raise
    return redis_client


async def get_telemetry_session(db: AsyncSession, session_id: int) -> Optional[TelemetrySession]:
    """
    Get a telemetry session by ID.
    """
    stmt = select(TelemetrySession).where(TelemetrySession.id == session_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_telemetry_data(
    db: AsyncSession, session_id: int, driver_id: Optional[str] = None
) -> List[TelemetryData]:
    """
    Get telemetry data for a session and optional driver.
    """
    stmt = select(TelemetryData).where(TelemetryData.session_id == session_id)
    
    if driver_id:
        # Get driver ID from driver code
        driver_stmt = select(Driver).where(Driver.code == driver_id)
        driver_result = await db.execute(driver_stmt)
        driver = driver_result.scalar_one_or_none()
        
        if driver:
            stmt = stmt.where(TelemetryData.driver_id == driver.id)
    
    stmt = stmt.order_by(desc(TelemetryData.timestamp))
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_cached_telemetry(
    session_id: str, driver_id: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Get cached telemetry data from Redis.
    """
    try:
        redis_client = await get_redis_client()
        
        # Construct cache key
        cache_key = f"telemetry:{session_id}"
        if driver_id:
            cache_key += f":{driver_id}"
        
        # Try to get data from cache
        cached_data = await redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
        
        return None
    except Exception as e:
        logger.error(f"Redis error when getting cached telemetry: {str(e)}")
        return None


async def cache_telemetry_data(
    session_id: str, 
    data: Dict[str, Any], 
    driver_id: Optional[str] = None,
    expire: int = 3600
) -> bool:
    """
    Cache telemetry data in Redis.
    """
    try:
        redis_client = await get_redis_client()
        
        # Construct cache key
        cache_key = f"telemetry:{session_id}"
        if driver_id:
            cache_key += f":{driver_id}"
        
        # Cache data
        await redis_client.set(cache_key, json.dumps(data), ex=expire)
        return True
    except Exception as e:
        logger.error(f"Redis error when caching telemetry: {str(e)}")
        return False


async def get_live_telemetry(
    session_id: str, driver_id: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Get real-time telemetry data.
    
    This is a placeholder function that should be replaced with actual
    implementation based on your data source (FastF1, UDP stream, etc.)
    """
    # First check if we have cached data
    cached_data = await get_cached_telemetry(session_id, driver_id)
    if cached_data:
        # In a real app, we'd return only newer data than what the client has
        # For simplicity, just return what we have
        return cached_data
    
    # No cached data, so generate dummy data for demo purposes
    # In a real app, this would come from FastF1 or a similar data source
    import random
    from datetime import datetime, timedelta
    
    # Generate simulated telemetry data
    data_points = []
    now = datetime.utcnow()
    
    for i in range(10):  # Generate 10 data points
        timestamp = now - timedelta(seconds=i)
        
        data_points.append({
            "timestamp": timestamp.isoformat(),
            "speed": random.uniform(80, 320),
            "throttle": random.uniform(0, 100),
            "brake": random.uniform(0, 100) if random.random() < 0.3 else 0,
            "gear": random.randint(1, 8),
            "rpm": random.uniform(5000, 12000),
            "drs": 1 if random.random() < 0.2 else 0,
            "position_x": random.uniform(0, 1000),
            "position_y": random.uniform(0, 1000),
            "position_z": random.uniform(-10, 10),
            "tire_compound": random.choice(["soft", "medium", "hard"]),
            "tire_life": random.uniform(30, 100),
            "sector": random.randint(1, 3),
            "lap": random.randint(1, 50)
        })
    
    telemetry_data = {
        "session_id": session_id,
        "driver_id": driver_id,
        "data": data_points,
        "lap_count": 50,
        "current_lap": random.randint(1, 50),
        "last_update": now.isoformat()
    }
    
    # Cache the generated data
    await cache_telemetry_data(session_id, telemetry_data, driver_id)
    
    return telemetry_data


async def create_telemetry_data(
    db: AsyncSession, 
    session_id: int, 
    driver_id: int, 
    data: Dict[str, Any]
) -> TelemetryData:
    """
    Create a new telemetry data point.
    """
    telemetry_data = TelemetryData(
        session_id=session_id,
        driver_id=driver_id,
        timestamp=data.get("timestamp", datetime.utcnow()),
        lap=data.get("lap"),
        speed=data.get("speed"),
        throttle=data.get("throttle"),
        brake=data.get("brake"),
        gear=data.get("gear"),
        rpm=data.get("rpm"),
        drs=data.get("drs"),
        position_x=data.get("position_x"),
        position_y=data.get("position_y"),
        position_z=data.get("position_z"),
        tire_compound=data.get("tire_compound"),
        tire_life=data.get("tire_life"),
        sector=data.get("sector"),
    )
    
    db.add(telemetry_data)
    await db.commit()
    await db.refresh(telemetry_data)
    
    return telemetry_data 