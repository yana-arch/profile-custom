-- Comprehensive Row Level Security Setup for All Tables
-- Run this in Supabase SQL Editor after running initial migrations
-- Replaces and extends the basic setup_rls.sql

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE css_validations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Users table permissions
GRANT ALL ON users TO anon, authenticated;

-- Template categories - read for all
GRANT SELECT ON template_categories TO anon, authenticated;

-- Templates - read for all, insert/update for owners
GRANT SELECT ON templates TO anon, authenticated;
GRANT INSERT, UPDATE ON templates TO authenticated;
GRANT SELECT ON templates TO service_role;

-- Profiles - CRUD for owners, read public profiles
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Profile shares - read for public sharing, CRUD for owners
GRANT SELECT, INSERT, UPDATE, DELETE ON profile_shares TO authenticated;
GRANT SELECT ON profile_shares TO anon;

-- User sessions - CRUD for authenticated users
GRANT ALL ON user_sessions TO authenticated;

-- CSS validations - CRUD for profile owners
GRANT ALL ON css_validations TO authenticated;

-- =====================================================
-- USERS TABLE POLICIES (ENHANCED)
-- =====================================================

-- Service role has full access
DROP POLICY IF EXISTS "Service role has full access on users" ON users;
CREATE POLICY "Service role has full access on users" ON users FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own record (handled by trigger)
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- TEMPLATE CATEGORIES POLICIES
-- =====================================================

-- Everyone can view template categories
DROP POLICY IF EXISTS "Anyone can view template categories" ON template_categories;
CREATE POLICY "Anyone can view template categories" ON template_categories FOR SELECT USING (true);

-- Service role can manage categories
DROP POLICY IF EXISTS "Service role manages categories" ON template_categories;
CREATE POLICY "Service role manages categories" ON template_categories FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TEMPLATES POLICIES
-- =====================================================

-- Everyone can view public templates (not marked as premium without auth)
DROP POLICY IF EXISTS "Anyone can view public templates" ON templates;
CREATE POLICY "Anyone can view public templates" ON templates FOR SELECT
USING (NOT is_premium OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Authors can manage their own templates
DROP POLICY IF EXISTS "Authors can manage own templates" ON templates;
CREATE POLICY "Authors can manage own templates" ON templates FOR ALL USING (auth.uid() = author_id);

-- Service role can manage all templates
DROP POLICY IF EXISTS "Service role manages templates" ON templates;
CREATE POLICY "Service role manages templates" ON templates FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can manage their own profiles
DROP POLICY IF EXISTS "Users can manage own profiles" ON profiles;
CREATE POLICY "Users can manage own profiles" ON profiles FOR ALL USING (auth.uid() = user_id);

-- Anyone can view public profiles
DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;
CREATE POLICY "Anyone can view public profiles" ON profiles FOR SELECT USING (is_public = true);

-- Service role has full access
DROP POLICY IF EXISTS "Service role manages profiles" ON profiles;
CREATE POLICY "Service role manages profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- PROFILE SHARES POLICIES
-- =====================================================

-- Users can manage shares for their own profiles
DROP POLICY IF EXISTS "Users can manage own profile shares" ON profile_shares;
CREATE POLICY "Users can manage own profile shares" ON profile_shares FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_shares.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- Anyone can view valid (non-expired) profile shares
DROP POLICY IF EXISTS "Anyone can view valid profile shares" ON profile_shares;
CREATE POLICY "Anyone can view valid profile shares" ON profile_shares FOR SELECT
USING (expires_at IS NULL OR expires_at > NOW());

-- Service role has full access
DROP POLICY IF EXISTS "Service role manages profile shares" ON profile_shares;
CREATE POLICY "Service role manages profile shares" ON profile_shares FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- USER SESSIONS POLICIES
-- =====================================================

-- Users can manage their own sessions
DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;
CREATE POLICY "Users can manage own sessions" ON user_sessions FOR ALL USING (auth.uid() = user_id);

-- Service role has full access
DROP POLICY IF EXISTS "Service role manages user sessions" ON user_sessions;
CREATE POLICY "Service role manages user sessions" ON user_sessions FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- CSS VALIDATIONS POLICIES
-- =====================================================

-- Users can manage CSS validations for their own profiles
DROP POLICY IF EXISTS "Users can manage own CSS validations" ON css_validations;
CREATE POLICY "Users can manage own CSS validations" ON css_validations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = css_validations.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- Service role has full access
DROP POLICY IF EXISTS "Service role manages CSS validations" ON css_validations;
CREATE POLICY "Service role manages CSS validations" ON css_validations FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(profile_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  iterator INTEGER := 0;
  final_slug TEXT;
  slug_exists BOOLEAN;
BEGIN
  -- Generate base slug
  base_slug := LOWER(REPLACE(REPLACE(REPLACE(profile_name, ' ', '-'), '[^a-zA-Z0-9\-]', ''), '--', '-'));

  -- Start with base slug
  final_slug := base_slug;

  -- Keep checking until we find a unique slug
  LOOP
    SELECT EXISTS(SELECT 1 FROM profiles WHERE slug = final_slug) INTO slug_exists;

    EXIT WHEN NOT slug_exists;

    iterator := iterator + 1;
    final_slug := base_slug || '-' || iterator::TEXT;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate share tokens
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN gen_random_uuid()::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment counters safely
CREATE OR REPLACE FUNCTION increment_counter(table_name TEXT, record_id UUID, counter_column TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1, updated_at = NOW() WHERE id = $1', table_name, counter_column, counter_column)
  USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PERFORMANCE INDEXES (ADDITIONAL)
-- =====================================================

-- Template search and filtering indexes
CREATE INDEX IF NOT EXISTS idx_templates_featured_premium ON templates(is_featured, is_premium, downloads DESC);
CREATE INDEX IF NOT EXISTS idx_templates_author_featured ON templates(author_id, is_featured);

-- Profile performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_created ON profiles(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_public_created ON profiles(is_public, created_at DESC);

-- Share lookups
CREATE INDEX IF NOT EXISTS idx_profile_shares_expires_active ON profile_shares(expires_at) WHERE expires_at IS NOT NULL;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- RLS is now comprehensively configured for all tables
-- Next: Run this SQL in Supabase Dashboard SQL Editor
-- Then: Restart your application to test the new security policies
