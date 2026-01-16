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

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy : seuls les admins peuvent voir tous les users
CREATE POLICY admin_read_users ON users
  FOR SELECT
  USING (auth.role() = 'admin');

-- Policy : seuls les admins peuvent créer des users
CREATE POLICY admin_create_users ON users
  FOR INSERT
  WITH CHECK (auth.role() = 'admin');
