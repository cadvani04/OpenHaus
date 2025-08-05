-- Users table (Realtors)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    license_number VARCHAR(50),
    state VARCHAR(2) NOT NULL,
    profile_image_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agreements table
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(255),
    meeting_type VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    agreement_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    security_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    viewed_at TIMESTAMP,
    signed_at TIMESTAMP,
    client_ip VARCHAR(45),
    user_agent TEXT,
    signature_data JSONB,
    pdf_url VARCHAR(500),
    audit_trail JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_agreements_user_id ON agreements(user_id);
CREATE INDEX idx_agreements_security_token ON agreements(security_token);
CREATE INDEX idx_agreements_status ON agreements(status);
