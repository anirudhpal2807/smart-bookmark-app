-- ================================================
-- Smart Bookmark App - Supabase Migration Script
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query

-- ================================================
-- 1. Create the bookmarks table
-- ================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 2. Enable Row Level Security (RLS)
-- ================================================
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 3. Create RLS Policies
-- ================================================

-- Policy: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- 4. Create index for better query performance
-- ================================================
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);

-- ================================================
-- 5. Enable Realtime for the bookmarks table
-- ================================================
-- Go to Supabase Dashboard > Database > Replication
-- Or run this SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- ================================================
-- Done! Your database is now set up.
-- ================================================
