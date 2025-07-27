-- This script cleans up existing feed items to keep only the latest 50 items per feed
-- Run this once to clean up existing data

DO $$
DECLARE
  feed_record RECORD;
  deleted_count INTEGER := 0;
  feed_count INTEGER := 0;
BEGIN
  -- Loop through all feeds
  FOR feed_record IN SELECT id, title FROM feeds LOOP
    feed_count := feed_count + 1;
    
    -- Delete all but the most recent 50 items for each feed
    WITH deleted AS (
      DELETE FROM feed_items
      WHERE feed_id = feed_record.id
      AND id NOT IN (
        SELECT id 
        FROM feed_items 
        WHERE feed_id = feed_record.id 
        ORDER BY created_at DESC 
        LIMIT 50
      )
      RETURNING 1
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    IF deleted_count > 0 THEN
      RAISE NOTICE 'Deleted % old items from feed: %', deleted_count, feed_record.title;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Cleanup completed for % feeds', feed_count;
END $$;