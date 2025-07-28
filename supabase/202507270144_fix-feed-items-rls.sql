-- Fix RLS policies for feed_items table

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view items from their feeds." ON feed_items;

-- Create comprehensive policies for feed_items
-- Allow users to insert items for their own feeds
CREATE POLICY "Users can insert items for their feeds" ON feed_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM feeds 
      WHERE feeds.id = feed_items.feed_id 
      AND feeds.user_id = auth.uid()
    )
  );

-- Allow users to view items from their feeds
CREATE POLICY "Users can view items from their feeds" ON feed_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM feeds 
      WHERE feeds.id = feed_items.feed_id 
      AND feeds.user_id = auth.uid()
    )
  );

-- Allow users to update items from their feeds (if needed)
CREATE POLICY "Users can update items from their feeds" ON feed_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM feeds 
      WHERE feeds.id = feed_items.feed_id 
      AND feeds.user_id = auth.uid()
    )
  );

-- Allow users to delete items from their feeds (for cleanup)
CREATE POLICY "Users can delete items from their feeds" ON feed_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM feeds 
      WHERE feeds.id = feed_items.feed_id 
      AND feeds.user_id = auth.uid()
    )
  );