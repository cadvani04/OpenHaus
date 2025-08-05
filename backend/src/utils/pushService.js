const { sendNotificationSMS } = require('./smsService');

// Simple push notification service
// In production, you'd use Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNS)

const sendPushNotification = async (userId, title, message, data = {}) => {
  try {
    console.log('🔔 [PUSH] Sending push notification:', {
      userId,
      title,
      message: message.substring(0, 50) + '...',
      data
    });
    
    // For now, we'll just log the notification
    // In production, you'd send to FCM/APNS
    console.log('✅ [PUSH] Push notification logged:', {
      userId,
      title,
      message,
      data,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Push notification logged (SMS fallback will be used)'
    };
  } catch (error) {
    console.error('❌ [PUSH] Failed to send push notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const sendAgreementSignedNotification = async (realtorPhone, clientName, agreementId) => {
  try {
    const message = `Great news! ${clientName} has signed the agreement. You can view the signed document in your HomeShow dashboard.`;
    
    console.log('🔔 [PUSH] Sending agreement signed notification:', {
      realtorPhone,
      clientName,
      agreementId
    });
    
    // Send SMS notification to realtor
    const smsResult = await sendNotificationSMS(realtorPhone, message);
    
    // Also log as push notification
    const pushResult = await sendPushNotification(
      'realtor', // userId would come from database
      'Agreement Signed',
      message,
      {
        type: 'agreement_signed',
        agreementId,
        clientName
      }
    );
    
    return {
      success: smsResult.success || pushResult.success,
      sms: smsResult,
      push: pushResult
    };
  } catch (error) {
    console.error('❌ [PUSH] Failed to send agreement signed notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const sendAgreementViewedNotification = async (realtorPhone, clientName, agreementId) => {
  try {
    const message = `${clientName} has viewed the agreement. They should sign it soon!`;
    
    console.log('🔔 [PUSH] Sending agreement viewed notification:', {
      realtorPhone,
      clientName,
      agreementId
    });
    
    // Send SMS notification to realtor
    const smsResult = await sendNotificationSMS(realtorPhone, message);
    
    // Also log as push notification
    const pushResult = await sendPushNotification(
      'realtor', // userId would come from database
      'Agreement Viewed',
      message,
      {
        type: 'agreement_viewed',
        agreementId,
        clientName
      }
    );
    
    return {
      success: smsResult.success || pushResult.success,
      sms: smsResult,
      push: pushResult
    };
  } catch (error) {
    console.error('❌ [PUSH] Failed to send agreement viewed notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendPushNotification,
  sendAgreementSignedNotification,
  sendAgreementViewedNotification
}; 