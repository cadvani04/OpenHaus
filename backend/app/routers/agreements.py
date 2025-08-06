from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from typing import List, Optional

from app.database import get_db, User, Agreement
from app.routers.auth import get_current_user
from app.schemas.agreements import AgreementCreate, AgreementResponse, AgreementPublic
from app.services.sms import send_agreement_sms
from app.core.config import settings

router = APIRouter()

def generate_security_token():
    return secrets.token_urlsafe(32)

@router.post("/", response_model=AgreementResponse)
async def create_agreement(
    agreement_data: AgreementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Generate security token and expiration
    security_token = generate_security_token()
    expires_at = datetime.utcnow() + timedelta(hours=48)
    
    # Create agreement
    db_agreement = Agreement(
        user_id=current_user.id,
        client_name=agreement_data.client_name,
        client_phone=agreement_data.client_phone,
        client_email=agreement_data.client_email,
        meeting_type=agreement_data.meeting_type,
        state=agreement_data.state,
        agreement_text=agreement_data.agreement_text,
        security_token=security_token,
        expires_at=expires_at
    )
    
    db.add(db_agreement)
    db.commit()
    db.refresh(db_agreement)
    
    # Send SMS notification (optional)
    if settings.TWILIO_ACCOUNT_SID:
        try:
            await send_agreement_sms(
                db_agreement.client_phone,
                db_agreement.client_name,
                security_token,
                f"{current_user.first_name} {current_user.last_name}"
            )
        except Exception as e:
            print(f"SMS sending failed: {e}")
    
    return {
        "id": str(db_agreement.id),
        "security_token": db_agreement.security_token,
        "expires_at": db_agreement.expires_at,
        "status": db_agreement.status
    }

@router.get("/user", response_model=List[AgreementResponse])
async def get_user_agreements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    agreements = db.query(Agreement).filter(Agreement.user_id == current_user.id).all()
    return [
        {
            "id": str(agreement.id),
            "client_name": agreement.client_name,
            "client_phone": agreement.client_phone,
            "meeting_type": agreement.meeting_type,
            "state": agreement.state,
            "status": agreement.status,
            "created_at": agreement.created_at,
            "expires_at": agreement.expires_at,
            "signed_at": agreement.signed_at
        }
        for agreement in agreements
    ]

@router.get("/public/{token}", response_model=AgreementPublic)
async def get_agreement_by_token(token: str, db: Session = Depends(get_db)):
    agreement = db.query(Agreement).filter(
        Agreement.security_token == token,
        Agreement.expires_at > datetime.utcnow()
    ).first()
    
    if not agreement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agreement not found or expired"
        )
    
    return {
        "id": str(agreement.id),
        "client_name": agreement.client_name,
        "meeting_type": agreement.meeting_type,
        "state": agreement.state,
        "agreement_text": agreement.agreement_text,
        "status": agreement.status,
        "expires_at": agreement.expires_at
    }

@router.post("/public/{token}/view")
async def mark_agreement_as_viewed(
    token: str,
    request: Request,
    db: Session = Depends(get_db)
):
    agreement = db.query(Agreement).filter(
        Agreement.security_token == token,
        Agreement.expires_at > datetime.utcnow()
    ).first()
    
    if not agreement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agreement not found or expired"
        )
    
    # Update viewed status
    agreement.viewed_at = datetime.utcnow()
    agreement.client_ip = request.client.host
    agreement.user_agent = request.headers.get("user-agent")
    agreement.status = "viewed"
    
    db.commit()
    
    return {"message": "Agreement marked as viewed"}

@router.post("/public/{token}/sign")
async def sign_agreement(
    token: str,
    signature_data: dict,
    request: Request,
    db: Session = Depends(get_db)
):
    agreement = db.query(Agreement).filter(
        Agreement.security_token == token,
        Agreement.expires_at > datetime.utcnow()
    ).first()
    
    if not agreement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agreement not found or expired"
        )
    
    if agreement.signed_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agreement already signed"
        )
    
    # Update signed status
    agreement.signed_at = datetime.utcnow()
    agreement.signature_data = signature_data
    agreement.status = "signed"
    agreement.client_ip = request.client.host
    agreement.user_agent = request.headers.get("user-agent")
    
    db.commit()
    
    return {"message": "Agreement signed successfully"} 