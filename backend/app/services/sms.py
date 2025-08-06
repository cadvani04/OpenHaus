from twilio.rest import Client
from app.core.config import settings

async def send_agreement_sms(phone_number: str, client_name: str, token: str, realtor_name: str):
    """Send SMS notification for agreement"""
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_PHONE_NUMBER]):
        print("⚠️ Twilio not configured, skipping SMS")
        return {"success": False, "error": "Twilio not configured"}
    
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Create agreement URL
        frontend_url = settings.FRONTEND_URL or "http://localhost:3000"
        agreement_url = f"{frontend_url}?token={token}"
        
        message = f"Hi {client_name}, {realtor_name} has sent you a meeting agreement to review and sign. Please click this secure link to access it: {agreement_url} - HomeShow"
        
        # Send SMS
        message_obj = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        
        return {
            "success": True,
            "message_id": message_obj.sid,
            "status": message_obj.status
        }
        
    except Exception as e:
        print(f"❌ SMS sending failed: {e}")
        return {
            "success": False,
            "error": str(e)
        } 