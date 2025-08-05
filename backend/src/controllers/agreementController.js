const Agreement = require('../models/Agreement');
const User = require('../models/User');
const { sendAgreementSMS } = require('../utils/smsService');
const { sendAgreementViewedNotification, sendAgreementSignedNotification } = require('../utils/pushService');

const createAgreement = async (req, res) => {
  console.log('📄 [AGREEMENT] Create agreement request:', { 
    user_id: req.user.userId, 
    client_name: req.body.client_name, 
    meeting_type: req.body.meeting_type 
  });
  
  try {
    const { client_name, client_phone, client_email, meeting_type, state, agreement_text } = req.body;
    const userId = req.user.userId;
    
    // Validate required fields
    if (!client_name || !client_phone || !meeting_type || !state || !agreement_text) {
      console.log('❌ [AGREEMENT] Create failed - missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const agreement = await Agreement.create({
      user_id: userId,
      client_name,
      client_phone,
      client_email,
      meeting_type,
      state,
      agreement_text
    });
    
    console.log('✅ [AGREEMENT] Agreement created successfully:', { 
      agreement_id: agreement.id, 
      security_token: agreement.security_token 
    });
    
    // Send SMS notification to client
    const realtor = await User.findById(userId);
    const realtorName = `${realtor.first_name} ${realtor.last_name}`;
    
    const smsResult = await sendAgreementSMS(
      client_phone,
      client_name,
      agreement.security_token,
      realtorName
    );
    
    res.status(201).json({
      message: 'Agreement created successfully',
      agreement: {
        id: agreement.id,
        security_token: agreement.security_token,
        expires_at: agreement.expires_at,
        status: agreement.status
      },
      sms: {
        sent: smsResult.success,
        messageId: smsResult.messageId,
        error: smsResult.error
      }
    });
  } catch (error) {
    console.error('❌ [AGREEMENT] Create agreement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserAgreements = async (req, res) => {
  console.log('📄 [AGREEMENT] Get user agreements request for user:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const agreements = await Agreement.findByUserId(userId);
    
    console.log('✅ [AGREEMENT] Retrieved agreements for user:', { 
      user_id: userId, 
      count: agreements.length 
    });
    
    res.json({ 
      agreements: agreements.map(agreement => ({
        id: agreement.id,
        client_name: agreement.client_name,
        client_phone: agreement.client_phone,
        meeting_type: agreement.meeting_type,
        state: agreement.state,
        status: agreement.status,
        created_at: agreement.created_at,
        expires_at: agreement.expires_at,
        signed_at: agreement.signed_at
      }))
    });
  } catch (error) {
    console.error('❌ [AGREEMENT] Get user agreements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAgreementById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const agreement = await Agreement.findById(id, userId);
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }
    
    res.json({ agreement });
  } catch (error) {
    console.error('Get agreement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAgreementByToken = async (req, res) => {
  const { token } = req.params;
  console.log('📄 [AGREEMENT] Get agreement by token request:', { token: token.substring(0, 8) + '...' });
  
  try {
    const agreement = await Agreement.findByToken(token);
    
    if (!agreement) {
      console.log('❌ [AGREEMENT] Agreement not found or expired for token:', token.substring(0, 8) + '...');
      return res.status(404).json({ error: 'Agreement not found or expired' });
    }
    
    // Get realtor info
    const realtor = await User.findById(agreement.user_id);
    
    console.log('✅ [AGREEMENT] Agreement retrieved successfully:', { 
      agreement_id: agreement.id, 
      client_name: agreement.client_name 
    });
    
    res.json({
      agreement: {
        id: agreement.id,
        client_name: agreement.client_name,
        meeting_type: agreement.meeting_type,
        state: agreement.state,
        agreement_text: agreement.agreement_text,
        expires_at: agreement.expires_at,
        status: agreement.status
      },
      realtor: {
        name: `${realtor.first_name} ${realtor.last_name}`,
        company: realtor.company_name,
        state: realtor.state
      }
    });
  } catch (error) {
    console.error('❌ [AGREEMENT] Get agreement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markAgreementAsViewed = async (req, res) => {
  try {
    const { token } = req.params;
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const agreement = await Agreement.markAsViewed(token, clientIP, userAgent);
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found or expired' });
    }
    
    // Send notification to realtor
    const realtor = await User.findById(agreement.user_id);
    if (realtor && realtor.phone) {
      await sendAgreementViewedNotification(
        realtor.phone,
        agreement.client_name,
        agreement.id
      );
    }
    
    res.json({
      message: 'Agreement marked as viewed',
      agreement: {
        id: agreement.id,
        viewed_at: agreement.viewed_at
      }
    });
  } catch (error) {
    console.error('Mark as viewed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const signAgreement = async (req, res) => {
  const { token } = req.params;
  const clientIP = req.ip || req.connection.remoteAddress;
  console.log('📄 [AGREEMENT] Sign agreement request:', { 
    token: token.substring(0, 8) + '...', 
    client_ip: clientIP 
  });
  
  try {
    const { signature_data } = req.body;
    
    if (!signature_data) {
      console.log('❌ [AGREEMENT] Sign failed - missing signature data');
      return res.status(400).json({ error: 'Signature data is required' });
    }
    
    const agreement = await Agreement.sign(token, signature_data, clientIP);
    
    if (!agreement) {
      console.log('❌ [AGREEMENT] Sign failed - agreement not found or expired for token:', token.substring(0, 8) + '...');
      return res.status(404).json({ error: 'Agreement not found or expired' });
    }
    
    console.log('✅ [AGREEMENT] Agreement signed successfully:', { 
      agreement_id: agreement.id, 
      signed_at: agreement.signed_at 
    });
    
    // Send notification to realtor
    const realtor = await User.findById(agreement.user_id);
    if (realtor && realtor.phone) {
      await sendAgreementSignedNotification(
        realtor.phone,
        agreement.client_name,
        agreement.id
      );
    }
    
    res.json({
      message: 'Agreement signed successfully',
      agreement: {
        id: agreement.id,
        signed_at: agreement.signed_at,
        status: agreement.status
      }
    });
  } catch (error) {
    console.error('❌ [AGREEMENT] Sign agreement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAgreementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const agreement = await Agreement.updateStatus(id, status);
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }
    
    res.json({
      message: 'Agreement status updated',
      agreement: {
        id: agreement.id,
        status: agreement.status
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAgreement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const agreement = await Agreement.delete(id, userId);
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }
    
    res.json({
      message: 'Agreement deleted successfully',
      agreement: {
        id: agreement.id
      }
    });
  } catch (error) {
    console.error('Delete agreement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendAgreementSMSController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const agreement = await Agreement.findById(id, userId);
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }
    
    const realtor = await User.findById(userId);
    const realtorName = `${realtor.first_name} ${realtor.last_name}`;
    
    const smsResult = await sendAgreementSMS(
      agreement.client_phone,
      agreement.client_name,
      agreement.security_token,
      realtorName
    );
    
    res.json({
      message: smsResult.success ? 'SMS sent successfully' : 'Failed to send SMS',
      sms: {
        sent: smsResult.success,
        messageId: smsResult.messageId,
        error: smsResult.error
      }
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createAgreement,
  getUserAgreements,
  getAgreementById,
  getAgreementByToken,
  markAgreementAsViewed,
  signAgreement,
  updateAgreementStatus,
  deleteAgreement,
  sendAgreementSMSController
};