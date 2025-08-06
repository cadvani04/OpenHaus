from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AgreementCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    meeting_type: str
    state: str
    agreement_text: str

class AgreementResponse(BaseModel):
    id: str
    client_name: str
    client_phone: str
    meeting_type: str
    state: str
    status: str
    created_at: datetime
    expires_at: datetime
    signed_at: Optional[datetime] = None

class AgreementPublic(BaseModel):
    id: str
    client_name: str
    meeting_type: str
    state: str
    agreement_text: str
    status: str
    expires_at: datetime 