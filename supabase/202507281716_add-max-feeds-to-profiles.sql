-- Add max_feeds column to profiles table
-- This allows per-user feed limits (default: 5 feeds per user)

ALTER TABLE profiles 
ADD COLUMN max_feeds INTEGER DEFAULT 5 NOT NULL;

-- Update existing users to have the default limit
UPDATE profiles SET max_feeds = 5 WHERE max_feeds IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN profiles.max_feeds IS 'Maximum number of feeds a user can add (default: 5)';