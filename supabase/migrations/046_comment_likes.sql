-- Migration 046: comment_likes 表（備援，若 045 未執行）
-- comment_likes 表已在 045_comment_likes_and_rating_unique.sql 建立
-- 此 migration 確保向後相容

-- 確保 comment_likes 表存在
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '任何人可查看留言讚' AND tablename = 'comment_likes') THEN
    CREATE POLICY "任何人可查看留言讚" ON comment_likes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '登入用戶可按讚' AND tablename = 'comment_likes') THEN
    CREATE POLICY "登入用戶可按讚" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '只能取消自己的讚' AND tablename = 'comment_likes') THEN
    CREATE POLICY "只能取消自己的讚" ON comment_likes FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- INDEX
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
