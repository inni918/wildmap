-- ============================================
-- 034: 等級權限系統升級
-- - users 表新增 daily_points 相關欄位
-- - point_transactions 積分交易記錄表
-- ============================================

-- === 1. users 表新增每日積分欄位 ===
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'daily_points'
  ) THEN
    ALTER TABLE users ADD COLUMN daily_points INT DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'daily_points_date'
  ) THEN
    ALTER TABLE users ADD COLUMN daily_points_date DATE DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- === 2. point_transactions 積分交易記錄表 ===
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  points NUMERIC(6,1) NOT NULL,  -- 支援 0.5 分
  target_id TEXT,                 -- 關聯的地點/評論 ID
  metadata JSONB DEFAULT '{}',   -- 額外資訊
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_point_transactions_user
  ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_action
  ON point_transactions(user_id, action);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_date
  ON point_transactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_target
  ON point_transactions(user_id, action, target_id);

-- === 3. RLS ===
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看自己的積分紀錄
DROP POLICY IF EXISTS "Users can view own point_transactions" ON point_transactions;
CREATE POLICY "Users can view own point_transactions"
  ON point_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- 用戶可以新增自己的積分紀錄（透過 client-side 操作）
DROP POLICY IF EXISTS "Users can insert own point_transactions" ON point_transactions;
CREATE POLICY "Users can insert own point_transactions"
  ON point_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- === 4. 自動更新 users.level 的 trigger ===
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  new_level INT;
BEGIN
  -- 根據積分計算等級
  SELECT CASE
    WHEN NEW.points >= 1000 THEN 5
    WHEN NEW.points >= 500 THEN 4
    WHEN NEW.points >= 200 THEN 3
    WHEN NEW.points >= 50 THEN 2
    ELSE 1
  END INTO new_level;

  -- 只在等級改變時更新
  IF new_level <> NEW.level THEN
    NEW.level = new_level;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_auto_level ON users;
CREATE TRIGGER users_auto_level
  BEFORE UPDATE OF points ON users
  FOR EACH ROW EXECUTE FUNCTION public.update_user_level();
