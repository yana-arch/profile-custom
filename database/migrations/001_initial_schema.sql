-- Dynamic Profile Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2025-09-30
-- Basic schema for Supabase PostgreSQL

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table - Main user authentication and info
CREATE TABLE users
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Template categories for organization
CREATE TABLE template_categories
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Templates table - Community contributed templates
CREATE TABLE templates
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    preview_image TEXT,
    data JSONB NOT NULL,
    author_id UUID REFERENCES users(id),
    category_id UUID REFERENCES template_categories(id),
    is_premium BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    downloads INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Main profiles table - Stores complete profile data
CREATE TABLE profiles
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    data JSONB NOT NULL,
    custom_css TEXT,
    custom_css_hash TEXT,
    template_id UUID REFERENCES templates(id),
    is_public BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profile shares table - For public profile sharing
CREATE TABLE profile_shares
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User sessions table - For session management
CREATE TABLE user_sessions
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CSS validations table - For custom CSS security and validation
CREATE TABLE css_validations
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    css_content TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT false,
    errors JSONB,
    validated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Core lookup indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Profile performance indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_public ON profiles(is_public);
CREATE INDEX idx_profiles_default ON profiles(user_id, is_default);

-- Template indexes
CREATE INDEX idx_templates_category ON templates(category_id);
CREATE INDEX idx_templates_featured ON templates(is_featured);
CREATE INDEX idx_templates_premium ON templates(is_premium);
CREATE INDEX idx_templates_downloads ON templates(downloads);

-- Sharing indexes
CREATE INDEX idx_profile_shares_token ON profile_shares(share_token);
CREATE INDEX idx_profile_shares_expires ON profile_shares(expires_at);

-- Session indexes
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- JSONB indexes for advanced querying
CREATE INDEX idx_profiles_data_personal ON profiles USING GIN
((data->'personalInfo'));
CREATE INDEX idx_profiles_data_skills ON profiles USING GIN
((data->'skills'));
CREATE INDEX idx_templates_data ON templates USING GIN
(data);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default template categories
INSERT INTO template_categories
    (name, description, icon, sort_order)
VALUES
    ('Technology', 'Templates for tech professionals', 'code', 1),
    ('Creative', 'Templates for designers and creatives', 'palette', 2),
    ('Business', 'Professional business templates', 'briefcase', 3),
    ('Academic', 'Templates for students and academics', 'graduation-cap', 4),
    ('Minimal', 'Clean and minimal designs', 'square', 5);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Schema is ready for Supabase deployment
-- Next steps:
-- 1. Create new Supabase project
-- 2. Run this SQL in SQL Editor
-- 3. Enable Row Level Security policies in Supabase dashboard
-- 4. Create API keys for authentication
