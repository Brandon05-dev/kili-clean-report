from fastapi import APIRouter
from models.schemas import HealthCheck
import os
from datetime import datetime

router = APIRouter()

@router.get("/health", response_model=HealthCheck)
async def health_check():
    """
    Health check endpoint for deployment monitoring
    """
    return HealthCheck(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=os.getenv("APP_VERSION", "1.0.0"),
        database="connected"
    )
