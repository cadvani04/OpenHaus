from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # JWT
    JWT_SECRET: str = "test-secret-key-for-development-only"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN: int = 7 * 24 * 60 * 60  # 7 days in seconds
    
    # Environment
    NODE_ENV: str = "development"
    PORT: int = 8000
    
    # Twilio (optional)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    
    # Frontend URL
    FRONTEND_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields

settings = Settings() 