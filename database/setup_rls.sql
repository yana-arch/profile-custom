-- Row Level Security Setup for users table
-- Run this in Supabase SQL Editor

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policy: Service role can do everything (for triggers)
CREATE POLICY "Service role has full access" ON users FOR ALL USING (auth.role() = 'service_role');
