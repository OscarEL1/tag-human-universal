CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_phone_used ON password_resets(phone, used);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at);
