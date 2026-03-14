-- ============================================
-- 049: 成就系統 v2 — 架構大改
--
-- 廢除「點數→升等→解鎖權限」
-- 改成「成就達標→解鎖對應權限」
--
-- 變更清單：
--   1. user_stats 表擴充（新增 checkins_total 等欄位）
--   2. user_category_stats 新表
--   3. achievements 表擴充（category_scope, tiers, unlock_permissions, hint_text, sort_order 已有）
--   4. user_achievements 表擴充（tier_unlocked, progress, progress_max）
--   5. check_ins 表擴充（移除 UNIQUE, 新增 verified/distance/accuracy）
--   6. users 表新增 permissions_cache, profile_completed
--   7. business_badges 新表
--   8. RLS 政策
--   9. 清理舊積分系統
-- ============================================

-- ============================================
-- 1. user_stats 表（建立 + 擴充）
-- ============================================

-- 建立表（如果不存在）
CREATE TABLE IF NOT EXISTS user_stats (
  user_id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  spots_total      INT DEFAULT 0,
  photos_total     INT DEFAULT 0,
  comments_total   INT DEFAULT 0,
  replies_total    INT DEFAULT 0,
  votes_total      INT DEFAULT 0,
  ratings_total    INT DEFAULT 0,
  edits_total      INT DEFAULT 0,
  reports_total    INT DEFAULT 0,
  shares_total     INT DEFAULT 0,
  favorites_unique INT DEFAULT 0,
  streak_current   INT DEFAULT 0,
  streak_longest   INT DEFAULT 0,
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- 新增 v2 欄位
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS checkins_total INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS detailed_comments INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS comments_with_photo INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS last_active_date DATE;

-- RLS（冪等）
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_stats_updated_at ON user_stats(updated_at DESC);

-- 回填現有用戶資料
INSERT INTO user_stats (user_id, spots_total, photos_total, comments_total, replies_total, votes_total, ratings_total, edits_total, reports_total)
SELECT
  u.id,
  COALESCE(s.cnt, 0),
  COALESCE(p.cnt, 0),
  COALESCE(c.cnt, 0),
  COALESCE(r.cnt, 0),
  COALESCE(v.cnt, 0),
  COALESCE(ra.cnt, 0),
  COALESCE(e.cnt, 0),
  COALESCE(rep.cnt, 0)
FROM users u
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM spots WHERE created_by = u.id) s ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM spot_images WHERE user_id = u.id) p ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM comments WHERE user_id = u.id AND parent_id IS NULL) c ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM comments WHERE user_id = u.id AND parent_id IS NOT NULL) r ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM feature_votes WHERE user_id = u.id) v ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM ratings WHERE user_id = u.id) ra ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM spot_edits WHERE user_id = u.id) e ON true
LEFT JOIN LATERAL (SELECT COUNT(*) as cnt FROM reports WHERE user_id = u.id) rep ON true
ON CONFLICT (user_id) DO UPDATE SET
  spots_total = EXCLUDED.spots_total,
  photos_total = EXCLUDED.photos_total,
  comments_total = EXCLUDED.comments_total,
  replies_total = EXCLUDED.replies_total,
  votes_total = EXCLUDED.votes_total,
  ratings_total = EXCLUDED.ratings_total,
  edits_total = EXCLUDED.edits_total,
  reports_total = EXCLUDED.reports_total;

-- 回填 favorites_unique
UPDATE user_stats us
SET favorites_unique = COALESCE((
  SELECT COUNT(DISTINCT spot_id) FROM favorites WHERE user_id = us.user_id
), 0);

-- 回填 checkins_total
UPDATE user_stats us
SET checkins_total = COALESCE((
  SELECT COUNT(*) FROM check_ins WHERE user_id = us.user_id
), 0);

-- ============================================
-- 2. user_category_stats 新表
-- ============================================

CREATE TABLE IF NOT EXISTS user_category_stats (
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category      VARCHAR(50) NOT NULL,
  checkins      INT DEFAULT 0,
  counties      INT DEFAULT 0,
  subtypes      INT DEFAULT 0,
  comments      INT DEFAULT 0,
  photos        INT DEFAULT 0,
  votes         INT DEFAULT 0,
  spots_created INT DEFAULT 0,
  PRIMARY KEY (user_id, category)
);

-- ============================================
-- 3. achievements 表擴充
-- ============================================

-- category_scope：區分共同/分類專屬成就
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS category_scope VARCHAR(50) DEFAULT 'common';

-- tiers：銅/銀/金條件合併在同一筆成就
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS tiers JSONB;

-- unlock_permissions：此成就解鎖什麼權限
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS unlock_permissions JSONB;

-- hint_text：模糊提示文案（未解鎖時顯示）
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS hint_text TEXT;

-- sort_order 已存在（033 加的），不需要再加

-- category CHECK 需要擴充（原有 exploration/contribution/community/special）
-- 先 DROP 舊 CHECK，再加新的（包含新分類）
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_category_check;
ALTER TABLE achievements ADD CONSTRAINT achievements_category_check 
  CHECK (category IN ('exploration', 'contribution', 'community', 'special', 'entry', 'governance'));

-- ============================================
-- 4. user_achievements 表擴充
-- ============================================

ALTER TABLE user_achievements ADD COLUMN IF NOT EXISTS tier_unlocked VARCHAR(10);
ALTER TABLE user_achievements ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0;
ALTER TABLE user_achievements ADD COLUMN IF NOT EXISTS progress_max INT DEFAULT 0;

-- ============================================
-- 5. check_ins 表擴充
-- ============================================

-- 5a. 移除 UNIQUE(user_id, spot_id) — 允許多次打卡同一地點
ALTER TABLE check_ins DROP CONSTRAINT IF EXISTS check_ins_user_id_spot_id_key;

-- 5b. 新增欄位
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS distance_meters INT;
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS accuracy_meters FLOAT;

-- 5c. 打卡時間索引（連續天數計算用）
CREATE INDEX IF NOT EXISTS idx_check_ins_user_time ON check_ins(user_id, checked_in_at DESC);

-- ============================================
-- 6. users 表新增
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions_cache JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;

-- account_age_days 不需要欄位，用 created_at 計算

-- 回填 profile_completed（有頭像 + 暱稱 + 至少有 display_name）
-- 簡介欄位（bio）目前不存在於 users 表，先標記有頭像+暱稱的用戶
-- 完整的 profile_completed 邏輯由前端 checkProfileComplete 處理
UPDATE users
SET profile_completed = (
  avatar_url IS NOT NULL AND avatar_url != ''
  AND display_name IS NOT NULL AND display_name != ''
);

-- ============================================
-- 7. business_badges 新表（商家動態徽章）
-- ============================================

CREATE TABLE IF NOT EXISTS business_badges (
  spot_id    UUID REFERENCES spots(id) ON DELETE CASCADE,
  badge_key  VARCHAR(50) NOT NULL,
  earned_at  TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata   JSONB,
  PRIMARY KEY (spot_id, badge_key)
);

-- ============================================
-- 8. RLS 政策
-- ============================================

-- === user_category_stats ===
ALTER TABLE user_category_stats ENABLE ROW LEVEL SECURITY;

-- 所有已認證用戶可讀（Profile 頁面需要看別人的）
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can read user_category_stats' AND tablename = 'user_category_stats'
  ) THEN
    CREATE POLICY "Authenticated can read user_category_stats" ON user_category_stats
      FOR SELECT USING (true);
  END IF;
END $$;

-- 用戶可更新/插入自己的
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upsert own category stats' AND tablename = 'user_category_stats'
  ) THEN
    CREATE POLICY "Users can upsert own category stats" ON user_category_stats
      FOR ALL USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- === user_stats RLS ===
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can read all user_stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Authenticated can read all user_stats" ON user_stats
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Users can update own stats" ON user_stats
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Users can insert own stats" ON user_stats
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on user_stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Service role full access on user_stats" ON user_stats
      FOR ALL USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

-- === user_achievements：所有人可讀（公開展示）===
-- 已有 RLS（009），確保有公開讀取政策
-- 先檢查現有政策
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view user achievements' AND tablename = 'user_achievements'
  ) THEN
    CREATE POLICY "Anyone can view user achievements" ON user_achievements
      FOR SELECT USING (true);
  END IF;
END $$;

-- === business_badges ===
ALTER TABLE business_badges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view business badges' AND tablename = 'business_badges'
  ) THEN
    CREATE POLICY "Anyone can view business badges" ON business_badges
      FOR SELECT USING (true);
  END IF;
END $$;

-- Service role 可寫入 business_badges（cron job 更新用）
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage business badges' AND tablename = 'business_badges'
  ) THEN
    CREATE POLICY "Service role can manage business badges" ON business_badges
      FOR ALL USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

-- === check_ins：用戶可讀/寫自己的（已在 009 設定）===
-- 已有 check_ins_select (SELECT true) + check_ins_insert (auth.uid() = user_id)
-- 不需要額外政策

-- ============================================
-- 9. 清理舊積分系統（保留 users.level 作榮譽稱號）
-- ============================================

-- 移除 point_transactions 表（積分交易記錄不再需要）
DROP TABLE IF EXISTS point_transactions CASCADE;

-- 移除 users.daily_points 相關欄位
ALTER TABLE users DROP COLUMN IF EXISTS daily_points;
ALTER TABLE users DROP COLUMN IF EXISTS daily_points_date;

-- 移除 update_user_level trigger（不再靠點數自動升等）
DROP TRIGGER IF EXISTS users_auto_level ON users;
DROP FUNCTION IF EXISTS public.update_user_level();

-- 保留 users.level 和 users.points 欄位（純榮譽稱號用途）

-- ============================================
-- 10. 索引
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_category_stats_category ON user_category_stats(category);
CREATE INDEX IF NOT EXISTS idx_business_badges_spot ON business_badges(spot_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category_scope ON achievements(category_scope);

-- ============================================
-- 完成
-- ============================================
