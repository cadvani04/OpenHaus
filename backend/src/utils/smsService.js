const twilio = require('twilio');

// Initialize Twilio client only if credentials are available
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

const sendAgreementSMS = async (phoneNumber, clientName, agreementToken, realtorName) => {
  try {
    // Check if Twilio is configured
    if (!client) {
      console.log('⚠️ [SMS] Twilio not configured, skipping SMS send');
      return {
        success: false,
        error: 'SMS service not configured',
        message: 'SMS notifications are disabled'
      };
    }
    
    const agreementUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${agreementToken}`;
    
    const message = `Hi ${clientName}, ${realtorName} has sent you a meeting agreement to review and sign. Please click this secure link to access it: ${agreementUrl} - HomeShow`;
    
    console.log('📱 [SMS] Sending agreement SMS:', {
      to: phoneNumber,
      clientName,
      agreementToken: agreementToken.substring(0, 8) + '...',
      realtorName
    });
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log('✅ [SMS] SMS sent successfully:', {
      messageId: result.sid,
      status: result.status
    });
    
    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('❌ [SMS] Failed to send SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const sendNotificationSMS = async (phoneNumber, message) => {
  try {
    // Check if Twilio is configured
    if (!client) {
      console.log('⚠️ [SMS] Twilio not configured, skipping notification SMS');
      return {
        success: false,
        error: 'SMS service not configured',
        message: 'SMS notifications are disabled'
      };
    }
    
    console.log('📱 [SMS] Sending notification SMS:', {
      to: phoneNumber,
      message: message.substring(0, 50) + '...'
    });
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log('✅ [SMS] Notification SMS sent successfully:', {
      messageId: result.sid,
      status: result.status
    });
    
    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('❌ [SMS] Failed to send notification SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendAgreementSMS,
  sendNotificationSMS
}; 