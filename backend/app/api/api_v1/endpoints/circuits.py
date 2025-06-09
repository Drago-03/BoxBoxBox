from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import logging

from app.core.dependencies import get_current_user, get_current_active_superuser
from app.db.session import get_db
from app.db.models import Circuit, User

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[dict])
async def get_circuits(
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all circuits with optional filtering by country.
    """
    query = select(Circuit)
    
    # Apply filters
    if country:
        query = query.filter(Circuit.country == country)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    circuits = result.scalars().all()
    
    # Convert to list of dicts (with ORM mode)
    return [
        {
            "id": circuit.id,
            "name": circuit.name,
            "location": circuit.location,
            "country": circuit.country,
            "circuit_id": circuit.circuit_id,
            "length_km": circuit.length_km,
            "turns": circuit.turns,
            "lap_record": circuit.lap_record,
            "lap_record_time": circuit.lap_record_time,
            "coordinates": circuit.coordinates
        }
        for circuit in circuits
    ]


@router.get("/{circuit_id}", response_model=dict)
async def get_circuit_by_id(
    circuit_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a circuit by ID.
    """
    # Get circuit by ID
    query = select(Circuit).where(Circuit.id == circuit_id)
    result = await db.execute(query)
    circuit = result.scalar_one_or_none()
    
    if not circuit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Circuit with ID {circuit_id} not found"
        )
    
    # Return as dict (with ORM mode)
    return {
        "id": circuit.id,
        "name": circuit.name,
        "location": circuit.location,
        "country": circuit.country,
        "circuit_id": circuit.circuit_id,
        "length_km": circuit.length_km,
        "turns": circuit.turns,
        "lap_record": circuit.lap_record,
        "lap_record_time": circuit.lap_record_time,
        "coordinates": circuit.coordinates
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_circuit(
    circuit_data: dict,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new circuit. Only for superusers.
    """
    # Check if circuit_id already exists
    query = select(Circuit).where(Circuit.circuit_id == circuit_data["circuit_id"])
    result = await db.execute(query)
    existing_circuit = result.scalar_one_or_none()
    
    if existing_circuit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Circuit with ID {circuit_data['circuit_id']} already exists"
        )
    
    # Create new circuit
    new_circuit = Circuit(**circuit_data)
    db.add(new_circuit)
    await db.commit()
    await db.refresh(new_circuit)
    
    # Return as dict (with ORM mode)
    return {
        "id": new_circuit.id,
        "name": new_circuit.name,
        "location": new_circuit.location,
        "country": new_circuit.country,
        "circuit_id": new_circuit.circuit_id,
        "length_km": new_circuit.length_km,
        "turns": new_circuit.turns,
        "lap_record": new_circuit.lap_record,
        "lap_record_time": new_circuit.lap_record_time,
        "coordinates": new_circuit.coordinates
    }


@router.put("/{circuit_id}", response_model=dict)
async def update_circuit(
    circuit_id: int,
    circuit_data: dict,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a circuit. Only for superusers.
    """
    # Get circuit by ID
    query = select(Circuit).where(Circuit.id == circuit_id)
    result = await db.execute(query)
    circuit = result.scalar_one_or_none()
    
    if not circuit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Circuit with ID {circuit_id} not found"
        )
    
    # Update circuit fields
    for key, value in circuit_data.items():
        if hasattr(circuit, key):
            setattr(circuit, key, value)
    
    await db.commit()
    await db.refresh(circuit)
    
    # Return as dict (with ORM mode)
    return {
        "id": circuit.id,
        "name": circuit.name,
        "location": circuit.location,
        "country": circuit.country,
        "circuit_id": circuit.circuit_id,
        "length_km": circuit.length_km,
        "turns": circuit.turns,
        "lap_record": circuit.lap_record,
        "lap_record_time": circuit.lap_record_time,
        "coordinates": circuit.coordinates
    }


@router.delete("/{circuit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_circuit(
    circuit_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a circuit. Only for superusers.
    """
    # Get circuit by ID
    query = select(Circuit).where(Circuit.id == circuit_id)
    result = await db.execute(query)
    circuit = result.scalar_one_or_none()
    
    if not circuit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Circuit with ID {circuit_id} not found"
        )
    
    # Delete circuit
    await db.delete(circuit)
    await db.commit()
    
    return None 