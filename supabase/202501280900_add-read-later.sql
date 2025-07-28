-- Create read_later table for "Read Later" functionality
CREATE TABLE read_later (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Prevent duplicate entries for same user and feed item
    UNIQUE(user_id, feed_item_id)
);

-- Create index for faster queries
CREATE INDEX idx_read_later_user_id ON read_later(user_id);
CREATE INDEX idx_read_later_created_at ON read_later(created_at DESC);

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
COMMENT ON TABLE read_later IS 'Stores articles that users want to read later (max 5 per user)';