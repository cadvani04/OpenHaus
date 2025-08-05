const db = require('../utils/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, first_name, last_name, phone, company_name, license_number, state } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, company_name, license_number, state)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, company_name, state, created_at
    `;
    
    const values = [email, password_hash, first_name, last_name, phone, company_name, license_number, state];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, company_name, state FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;