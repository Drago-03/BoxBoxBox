from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Any, Dict

from app.db.session import Base


class TimestampMixin:
    """Mixin for adding created_at and updated_at timestamps."""
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )


class User(Base, TimestampMixin):
    """User model for authentication and personalization."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Relationships
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    saved_strategies = relationship("RaceStrategy", back_populates="user")
    telemetry_sessions = relationship("TelemetrySession", back_populates="user")


class UserSettings(Base, TimestampMixin):
    """User preferences and settings."""
    
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    favorite_driver = Column(String(50))
    favorite_team = Column(String(50))
    preferred_units = Column(String(10), default="metric")  # metric or imperial
    ui_theme = Column(String(20), default="dark")  # dark, light, or auto
    notifications_enabled = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="settings")


class Circuit(Base):
    """F1 circuits/tracks information."""
    
    __tablename__ = "circuits"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    country = Column(String(50), nullable=False)
    circuit_id = Column(String(50), unique=True, nullable=False)  # FastF1 circuit ID
    length_km = Column(Float, nullable=False)
    turns = Column(Integer, nullable=False)
    lap_record = Column(String(100))
    lap_record_time = Column(Float)
    coordinates = Column(JSON)  # {lat: float, lng: float}
    
    # Relationships
    races = relationship("Race", back_populates="circuit")
    telemetry_sessions = relationship("TelemetrySession", back_populates="circuit")


class Race(Base):
    """F1 race information."""
    
    __tablename__ = "races"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    season = Column(Integer, nullable=False)
    round = Column(Integer, nullable=False)
    circuit_id = Column(Integer, ForeignKey("circuits.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    
    # Weather data
    weather_data = Column(JSON)  # JSON object with weather information
    
    # Relationships
    circuit = relationship("Circuit", back_populates="races")
    results = relationship("RaceResult", back_populates="race")
    telemetry_sessions = relationship("TelemetrySession", back_populates="race")


class Driver(Base):
    """F1 driver information."""
    
    __tablename__ = "drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    driver_id = Column(String(50), unique=True, nullable=False)  # FastF1 driver ID
    number = Column(Integer, nullable=False)
    code = Column(String(3), nullable=False)  # Three-letter code (e.g., HAM, VER)
    team_id = Column(Integer, ForeignKey("teams.id"))
    
    # Relationships
    team = relationship("Team", back_populates="drivers")
    results = relationship("RaceResult", back_populates="driver")
    telemetry_data = relationship("TelemetryData", back_populates="driver")


class Team(Base):
    """F1 team information."""
    
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    team_id = Column(String(50), unique=True, nullable=False)  # FastF1 team ID
    full_name = Column(String(200))
    nationality = Column(String(50))
    
    # Relationships
    drivers = relationship("Driver", back_populates="team")


class RaceResult(Base):
    """Race results for each driver."""
    
    __tablename__ = "race_results"
    
    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey("races.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    position = Column(Integer)
    points = Column(Float)
    grid = Column(Integer)
    status = Column(String(50))  # Finished, DNF, DSQ, etc.
    lap_count = Column(Integer)
    fastest_lap = Column(Boolean, default=False)
    fastest_lap_time = Column(Float)
    
    # Relationships
    race = relationship("Race", back_populates="results")
    driver = relationship("Driver", back_populates="results")


class TelemetrySession(Base, TimestampMixin):
    """User telemetry session information."""
    
    __tablename__ = "telemetry_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    race_id = Column(Integer, ForeignKey("races.id"))
    circuit_id = Column(Integer, ForeignKey("circuits.id"))
    session_type = Column(String(20))  # Race, Qualifying, FP1, FP2, FP3
    session_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="telemetry_sessions")
    race = relationship("Race", back_populates="telemetry_sessions")
    circuit = relationship("Circuit", back_populates="telemetry_sessions")
    telemetry_data = relationship("TelemetryData", back_populates="session")


class TelemetryData(Base):
    """Raw telemetry data points."""
    
    __tablename__ = "telemetry_data"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("telemetry_sessions.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    lap = Column(Integer)
    
    # Telemetry values
    speed = Column(Float)
    throttle = Column(Float)
    brake = Column(Float)
    gear = Column(Integer)
    rpm = Column(Float)
    drs = Column(Integer)  # 0=Off, 1=On
    
    # Position data
    position_x = Column(Float)
    position_y = Column(Float)
    position_z = Column(Float)
    
    # Additional data
    tire_compound = Column(String(20))
    tire_life = Column(Float)
    sector = Column(Integer)
    
    # Relationships
    session = relationship("TelemetrySession", back_populates="telemetry_data")
    driver = relationship("Driver", back_populates="telemetry_data")


class RaceStrategy(Base, TimestampMixin):
    """User-saved race strategies."""
    
    __tablename__ = "race_strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    circuit_id = Column(Integer, ForeignKey("circuits.id"))
    
    # Strategy details
    starting_position = Column(Integer)
    starting_compound = Column(String(20))
    strategy_json = Column(JSON, nullable=False)  # Full strategy JSON
    estimated_finishing_position = Column(Integer)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="saved_strategies")
    circuit = relationship("Circuit") 