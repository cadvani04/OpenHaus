from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Text, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
import uuid
from datetime import datetime
import os

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    company_name = Column(String(255))
    license_number = Column(String(50))
    state = Column(String(2), nullable=False)
    profile_image_url = Column(String(500))
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Agreement model
class Agreement(Base):
    __tablename__ = "agreements"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False)
    client_name = Column(String(255), nullable=False)
    client_phone = Column(String(20), nullable=False)
    client_email = Column(String(255))
    meeting_type = Column(String(100), nullable=False)
    state = Column(String(2), nullable=False)
    agreement_text = Column(Text, nullable=False)
    status = Column(String(50), default="draft")
    security_token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    viewed_at = Column(DateTime)
    signed_at = Column(DateTime)
    client_ip = Column(String(45))
    user_agent = Column(Text)
    signature_data = Column(SQLiteJSON)
    pdf_url = Column(String(500))
    audit_trail = Column(SQLiteJSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 