const db = require('../utils/database');
const crypto = require('crypto');

class Agreement {
  static async create(agreementData) {
    const { user_id, client_name, client_phone, client_email, meeting_type, state, agreement_text } = agreementData;
    const security_token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    
    const query = `
      INSERT INTO agreements (user_id, client_name, client_phone, client_email, meeting_type, state, agreement_text, security_token, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [user_id, client_name, client_phone, client_email, meeting_type, state, agreement_text, security_token, expires_at];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByToken(token) {
    const query = 'SELECT * FROM agreements WHERE security_token = $1 AND expires_at > NOW()';
    const result = await db.query(query, [token]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM agreements WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM agreements WHERE id = $1 AND user_id = $2';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  static async markAsViewed(token, clientIP, userAgent) {
    const query = `
      UPDATE agreements 
      SET viewed_at = NOW(), client_ip = $1, user_agent = $2, status = 'viewed'
      WHERE security_token = $3
      RETURNING *
    `;
    const result = await db.query(query, [clientIP, userAgent, token]);
    return result.rows[0];
  }

  static async sign(token, signatureData, clientIP) {
    const query = `
      UPDATE agreements 
      SET signed_at = NOW(), signature_data = $1, status = 'signed'
      WHERE security_token = $2
      RETURNING *
    `;
    const result = await db.query(query, [signatureData, token]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE agreements 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM agreements WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = Agreement;