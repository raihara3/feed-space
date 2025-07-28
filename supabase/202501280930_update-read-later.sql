-- Drop existing read_later table if exists
DROP TABLE IF EXISTS read_later;

-- Create read_later table with full article data
CREATE TABLE read_later (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Original feed_item_id for reference (nullable if feed_item is deleted)
    feed_item_id UUID REFERENCES feed_items(id) ON DELETE SET NULL,
    
    -- Store complete article data
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    feed_title TEXT NOT NULL,
    feed_id UUID REFERENCES feeds(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Prevent duplicate entries for same user and link
    UNIQUE(user_id, link)
);

-- Create indexes for better performance
CREATE INDEX idx_read_later_user_id ON read_later(user_id);
CREATE INDEX idx_read_later_created_at ON read_later(created_at DESC);
CREATE INDEX idx_read_later_feed_item_id ON read_later(feed_item_id);

-- Enable RLS
ALTER TABLE read_later ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own read_later items" ON read_later
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own read_later items" ON read_later
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own read_later items" ON read_later
    FOR DELETE USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE read_later IS 'Stores articles that users want to read later with full article data (max 5 per user)';