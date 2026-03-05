-- 030_add_comment_replies.sql
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
