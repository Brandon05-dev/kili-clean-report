from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our modules
from config.database import supabase_client
from routes import reports, admin, super_admin, auth, health
from middleware.auth import get_current_admin
from services.scheduler import start_scheduler
from utils.logger import setup_logger

# Setup logger
logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=os.getenv("APP_NAME", "CleanKili Backend"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="Community reporting platform backend with instant alerts and AI summaries"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(super_admin.router, prefix="/api/super-admin", tags=["Super Admin"])

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting CleanKili Backend...")
    
    # Test database connection
    try:
        response = supabase_client.table("reports").select("id").limit(1).execute()
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
    
    # Start the scheduler for daily summaries
    start_scheduler()
    logger.info("Scheduler started for daily summaries")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down CleanKili Backend...")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to CleanKili Backend API",
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "False").lower() == "true"
    )
