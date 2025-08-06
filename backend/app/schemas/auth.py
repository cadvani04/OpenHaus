from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    phone: str
    company_name: Optional[str] = None
    license_number: Optional[str] = None
    state: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    company_name: Optional[str] = None
    state: str
    phone: str
    is_verified: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse 