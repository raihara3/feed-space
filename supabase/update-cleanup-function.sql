-- Drop the old cleanup function that deletes items older than 24 hours
DROP FUNCTION IF EXISTS cleanup_old_feed_items();

-- Create new function to keep only the latest 50 items per feed
CREATE OR REPLACE FUNCTION cleanup_feed_items_limit()
RETURNS void AS $$
DECLARE
  feed_record RECORD;
BEGIN
  -- Loop through all feeds
  FOR feed_record IN SELECT id FROM feeds LOOP
    -- Delete all but the most recent 50 items for each feed
    DELETE FROM feed_items
    WHERE feed_id = feed_record.id
    AND id NOT IN (
      SELECT id 
      FROM feed_items 
      WHERE feed_id = feed_record.id 
      ORDER BY created_at DESC 
      LIMIT 50
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Comment explaining the function
COMMENT ON FUNCTION cleanup_feed_items_limit() IS 'Keeps only the latest 50 items per feed based on created_at timestamp';

-- Function to verify item counts per feed
CREATE OR REPLACE FUNCTION check_feed_item_counts()
RETURNS TABLE(feed_id UUID, feed_title TEXT, item_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.title, COUNT(fi.id)
  FROM feeds f
  LEFT JOIN feed_items fi ON f.id = fi.feed_id
  GROUP BY f.id, f.title
  ORDER BY COUNT(fi.id) DESC;
END;
$$ LANGUAGE plpgsql;