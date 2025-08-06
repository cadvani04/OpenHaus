from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv

from app.database import engine, Base
from app.routers import auth, agreements
from app.core.config import settings

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting HomeShow Backend...")
    print(f"📊 Environment: {os.getenv('NODE_ENV', 'development')}")
    print(f"🔗 Database URL: {'set' if os.getenv('DATABASE_URL') else 'not set'}")
    print(f"🔐 JWT Secret: {'set' if os.getenv('JWT_SECRET') else 'not set'}")
    yield
    # Shutdown
    print("🛑 Shutting down HomeShow Backend...")

# Create FastAPI app
app = FastAPI(
    title="HomeShow Backend",
    description="Backend API for HomeShow real estate application",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(agreements.router, prefix="/api/agreements", tags=["agreements"])

# Health check endpoint
@app.get("/")
async def root():
    return {
        "status": "OK",
        "message": "HomeShow Backend is running",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("NODE_ENV", "development")
    }

@app.get("/health")
async def health_check():
    try:
        # Test database connection
        from app.database import get_db
        db = next(get_db())
        db.execute("SELECT 1")
        return {
            "status": "OK",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "environment": os.getenv("NODE_ENV", "development")
        }
    except Exception as e:
        return {
            "status": "WARNING",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "disconnected",
            "error": str(e),
            "environment": os.getenv("NODE_ENV", "development")
        }

@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "HomeShow backend is running!",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("NODE_ENV", "development")
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("NODE_ENV") != "production" else False
    ) 