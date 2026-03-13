-- 048: 用戶回饋系統
-- feedback 表：讓用戶回報 bug 或提交改進建議

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('bug', 'suggestion', 'other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'adopted', 'ignored')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 任何人都可以新增回饋（包含匿名）
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert feedback' AND tablename = 'feedback'
  ) THEN
    CREATE POLICY "Users can insert feedback" ON feedback FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 用戶可以查看自己的回饋（含匿名回饋 user_id IS NULL）
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own feedback' AND tablename = 'feedback'
  ) THEN
    CREATE POLICY "Users can view own feedback" ON feedback FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- 管理員可以做所有操作
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can do all on feedback' AND tablename = 'feedback'
  ) THEN
    CREATE POLICY "Admins can do all on feedback" ON feedback FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- 索引：加速常見查詢
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- ============================================
-- 新增 3 個回饋相關成就
-- ============================================
INSERT INTO achievements (key, name_zh, name_en, description_zh, icon, category, points, tier, criteria, sort_order)
VALUES
('bug_reporter',
 '除蟲先鋒', 'Bug Reporter',
 '首次回報 Bug',
 '🐛', 'community', 10, 'bronze',
 '{"type": "feedback_bugs", "threshold": 1}',
 320),

('feedback_veteran',
 '平台守護者', 'Feedback Veteran',
 '累計回報 5 次回饋（任何類型）',
 '🔧', 'community', 20, 'silver',
 '{"type": "feedback_total", "threshold": 5}',
 321),

('idea_adopted',
 '點子王', 'Idea Adopted',
 '你的改進建議被管理員採納',
 '⭐', 'special', 30, 'gold',
 '{"type": "feedback_adopted", "threshold": 1}',
 322)
ON CONFLICT (key) DO NOTHING;
