-- Add is_read column to feed_items table
ALTER TABLE feed_items ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE NOT NULL;

-- Add read_at column to track when the item was read
ALTER TABLE feed_items ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when filtering by read status
CREATE INDEX IF NOT EXISTS idx_feed_items_is_read ON feed_items(is_read);
CREATE INDEX IF NOT EXISTS idx_feed_items_read_at ON feed_items(read_at) WHERE read_at IS NOT NULL;