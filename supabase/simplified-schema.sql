-- Simplified approach: Remove the trigger and handle profile creation in the app

-- First, ensure RLS is properly configured
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- Create simple, permissive policies
CREATE POLICY "Enable all operations for authenticated users on their own profile" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow reading all profiles (optional, remove if you want profiles to be private)
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

-- Drop the trigger if it exists (we'll handle profile creation in the app)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();