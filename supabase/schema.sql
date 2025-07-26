-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RSS Feeds table
CREATE TABLE feeds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, url)
);

-- RLS policies for feeds
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feeds." ON feeds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeds." ON feeds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeds." ON feeds
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeds." ON feeds
  FOR DELETE USING (auth.uid() = user_id);

-- Feed items table
CREATE TABLE feed_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  guid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(feed_id, guid)
);

-- Index for cleanup job
CREATE INDEX idx_feed_items_created_at ON feed_items(created_at);

-- RLS policies for feed_items
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items from their feeds." ON feed_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM feeds 
      WHERE feeds.id = feed_items.feed_id 
      AND feeds.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_feeds_updated_at BEFORE UPDATE ON feeds
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to clean up old feed items (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_feed_items()
RETURNS void AS $$
BEGIN
  DELETE FROM feed_items
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Function to check feed count limit
CREATE OR REPLACE FUNCTION check_feed_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM feeds WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Feed limit reached. Maximum 10 feeds per user.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce feed limit
CREATE TRIGGER enforce_feed_limit
  BEFORE INSERT ON feeds
  FOR EACH ROW EXECUTE FUNCTION check_feed_limit();