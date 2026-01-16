-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index sur email pour performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Note: RLS is not enabled for this table because:
-- 1. Server-side API endpoints use service role key with full access
-- 2. JWT authentication is handled at the API level, not database level
-- 3. All access control is enforced through API middleware checking JWT tokens
