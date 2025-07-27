-- Fix profile creation issue by using database trigger
-- This ensures profiles are created automatically when a user signs up

-- First, create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that fires when a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Alternative: Add a more permissive INSERT policy for initial profile creation
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    (auth.uid() IS NULL AND id IS NOT NULL)
  );

-- Also add a policy to allow insertion during signup process
CREATE POLICY "Allow profile creation during signup" ON profiles
  FOR INSERT WITH CHECK (
    -- Allow if the user ID matches the authenticated user
    auth.uid() = id OR
    -- Allow if we're in a signup context (no session yet but user exists in auth.users)
    (SELECT COUNT(*) FROM auth.users WHERE auth.users.id = profiles.id) > 0
  );