-- Debug script to check user synchronization between auth.users and custom users table
-- Run this in Supabase SQL Editor to diagnose OAuth login issues

-- Check what users exist in auth.users
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Check what users exist in custom users table
SELECT
  id,
  email,
  full_name,
  created_at,
  updated_at,
  last_login
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- Check for orphaned auth users (exist in auth but not in users)
SELECT
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;

-- Check for orphaned users table entries (exist in users but not in auth)
SELECT
  u.id,
  u.email,
  u.created_at
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.id IS NULL;

-- Check trigger function exists
SELECT
  proname,
  pg_get_function_identity_arguments(oid) as args
FROM pg_proc
WHERE proname = 'handle_new_user';

-- Check trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- Check recent trigger executions (if logging was enabled)
-- This would require additional logging setup

-- Manually sync any missing users
INSERT INTO users (id, email, full_name, created_at, updated_at)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', ''),
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Check RLS policies on users table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
