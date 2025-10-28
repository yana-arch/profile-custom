-- Fix for Template Upload RLS Policy Issue
-- This script fixes the template creation issue for authenticated users

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Authors can manage own templates" ON templates;

-- Create separate, more permissive INSERT policy
CREATE POLICY "Users can create own templates" ON templates
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- Recreate the general management policy (without INSERT)
CREATE POLICY "Authors can manage own templates" ON templates
FOR SELECT, UPDATE, DELETE USING (auth.uid() = author_id);

-- Keep existing VIEW policies
CREATE POLICY "Anyone can view templates" ON templates
FOR SELECT USING (NOT is_premium OR auth.role() = 'authenticated');

-- Ensure permissions are correct
GRANT SELECT, INSERT, UPDATE, DELETE ON templates TO authenticated;
GRANT SELECT ON templates TO anon;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Template upload should now work for authenticated users
