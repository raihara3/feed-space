-- Fix auth flow to ensure profiles are created properly

-- First, let's check and fix the RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- Create more permissive policies for profile creation
-- Allow users to create their own profile even before email confirmation
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view all profiles
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Ensure the foreign key constraint allows for the user flow
-- The feeds table should reference profiles, not auth.users directly
-- This is already correct in your schema, but let's verify
-- If you're still having issues, you might need to temporarily disable email confirmations