-- ==========================================
-- 🔧 PATCH: Add missing comment_likes table and fix policies
-- ==========================================
-- Run this in Supabase SQL Editor to fix the "no posts showing" bug
-- This patch does NOT drop existing data
-- ==========================================

-- 1. Create the missing comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, username)
);

-- 2. Enable RLS on comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- 3. Add missing policies
-- Read policy for comment_likes
CREATE POLICY "Public Read Comment Likes" ON public.comment_likes FOR SELECT USING (true);

-- Write policy for comment_likes (toggle own likes)
CREATE POLICY "Users can toggle own comment likes" ON public.comment_likes FOR ALL USING (username = (SELECT username FROM profiles WHERE id = auth.uid()));

-- Comment INSERT policy (was missing!)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Authenticated users can comment') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can comment" ON public.comments FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Comment DELETE policy (was missing!)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can delete own comments') THEN
    EXECUTE 'CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (username = (SELECT username FROM profiles WHERE id = auth.uid()))';
  END IF;
END $$;
