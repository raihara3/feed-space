-- Quick cleanup for recently added feed with 300+ items
-- This will keep only the latest 50 items per feed based on created_at

-- First, check how many items each feed has
SELECT 
  f.id,
  f.title,
  COUNT(fi.id) as item_count
FROM feeds f
LEFT JOIN feed_items fi ON f.id = fi.feed_id
GROUP BY f.id, f.title
ORDER BY item_count DESC;

-- Delete all but the most recent 50 items for each feed
DO $$
DECLARE
  feed_record RECORD;
  deleted_count INTEGER;
  total_deleted INTEGER := 0;
BEGIN
  FOR feed_record IN 
    SELECT f.id, f.title, COUNT(fi.id) as item_count
    FROM feeds f
    LEFT JOIN feed_items fi ON f.id = fi.feed_id
    GROUP BY f.id, f.title
    HAVING COUNT(fi.id) > 50
  LOOP
    -- Delete excess items
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
    
    total_deleted := total_deleted + deleted_count;
    RAISE NOTICE 'Deleted % items from feed: % (had % items)', 
      deleted_count, feed_record.title, feed_record.item_count;
  END LOOP;
  
  RAISE NOTICE 'Total items deleted: %', total_deleted;
END $$;

-- Verify the cleanup
SELECT 
  f.id,
  f.title,
  COUNT(fi.id) as item_count
FROM feeds f
LEFT JOIN feed_items fi ON f.id = fi.feed_id
GROUP BY f.id, f.title
ORDER BY item_count DESC;