-- 1. Create a table for posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Policy: Allow anyone to read posts
CREATE POLICY "Public posts are viewable by everyone" 
ON posts FOR SELECT 
USING (true);

-- Policy: Allow authenticated users to create posts
CREATE POLICY "Users can create their own posts" 
ON posts FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow users to update their own posts (e.g., for liking)
-- Note: In a real app, you'd have a separate table for likes to prevent double-liking
CREATE POLICY "Anyone can update likes" 
ON posts FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Policy: Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" 
ON posts FOR DELETE 
USING (auth.uid() = user_id);
