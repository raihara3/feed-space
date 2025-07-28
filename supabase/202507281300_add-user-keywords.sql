-- Add user_keywords table for favorite keywords feature
CREATE TABLE user_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL CHECK (length(keyword) <= 20 AND length(keyword) > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, keyword)
);

-- Create index for better performance when querying user keywords
CREATE INDEX idx_user_keywords_user_id ON user_keywords(user_id);
CREATE INDEX idx_user_keywords_created_at ON user_keywords(created_at);

-- Enable RLS
ALTER TABLE user_keywords ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can only see and manage their own keywords
CREATE POLICY "Users can view their own keywords" ON user_keywords
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keywords" ON user_keywords
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keywords" ON user_keywords
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keywords" ON user_keywords
  FOR DELETE USING (auth.uid() = user_id);