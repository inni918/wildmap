-- ============================================
-- 038: 使用者行為追蹤系統
-- 
-- 包含：
--   1. user_events 表（行為事件記錄）
--   2. user_profiles_cache 表（用戶畫像快取）
--   3. user_spot_signals VIEW（推薦引擎統一信號）
--   4. 索引設計
--   5. RLS 安全策略
--   6. 資料清理函式
--
-- 設計原則：
--   - 不重複已有表（favorites/ratings/comments 等）的資料
--   - 專注追蹤隱性信號（瀏覽、停留、搜尋、點擊）
--   - 高寫入效能，支援前端 batch insert
--   - user_id 允許 NULL（匿名瀏覽也有統計價值）
-- ============================================

-- ============================================
-- 1. user_events 表
-- ============================================

CREATE TABLE IF NOT EXISTS user_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 用戶識別（允許 NULL = 匿名用戶）
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Session 識別（前端 per-tab 生成的 UUID）
  session_id UUID NOT NULL,
  
  -- 事件類型（如 spot_view, search, share, filter_change）
  event_type TEXT NOT NULL,
  
  -- 常用外鍵：獨立出來比放 JSONB 查詢效率高 10x+
  spot_id    UUID,
  
  -- 彈性業務欄位（每種 event_type 有不同的 metadata）
  -- 範例：
  --   spot_view:  {"source": "map", "category": "camping", "county": "新竹縣"}
  --   spot_dwell: {"dwell_seconds": 45, "tab_viewed": "overview"}
  --   search:     {"query": "新竹 免費", "results_count": 12}
  --   share:      {"share_target": "line"}
  metadata   JSONB DEFAULT '{}',
  
  -- 裝置/環境資訊（與業務 metadata 分離）
  -- 範例：{"type": "mobile", "screen_width": 375, "is_pwa": false}
  device     JSONB DEFAULT '{}',
  
  -- 事件時間
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表說明
COMMENT ON TABLE user_events IS '使用者行為事件追蹤表，記錄隱性信號（瀏覽、搜尋、點擊等）';
COMMENT ON COLUMN user_events.user_id IS '用戶 ID，NULL = 匿名用戶。刪帳時 SET NULL 保留匿名統計';
COMMENT ON COLUMN user_events.session_id IS '前端 per-tab 生成的 UUID，用於串聯同次瀏覽的事件';
COMMENT ON COLUMN user_events.spot_id IS '相關地點 ID，獨立出來方便索引查詢';
COMMENT ON COLUMN user_events.metadata IS '彈性業務欄位，每種 event_type 存不同資料';
COMMENT ON COLUMN user_events.device IS '裝置資訊：type, screen_width, os, browser, is_pwa';

-- ============================================
-- 2. 索引設計
-- ============================================

-- 核心查詢：某用戶的行為時間線（個人頁面、畫像計算）
CREATE INDEX IF NOT EXISTS idx_user_events_user_time 
  ON user_events(user_id, created_at DESC);

-- 推薦引擎：某地點被哪些用戶互動過
CREATE INDEX IF NOT EXISTS idx_user_events_spot 
  ON user_events(spot_id, created_at DESC) 
  WHERE spot_id IS NOT NULL;

-- 事件類型分析：例如所有搜尋事件、所有分享事件
CREATE INDEX IF NOT EXISTS idx_user_events_type_time 
  ON user_events(event_type, created_at DESC);

-- Session 追蹤：串聯同次瀏覽的所有事件
CREATE INDEX IF NOT EXISTS idx_user_events_session 
  ON user_events(session_id, created_at);

-- ============================================
-- 3. RLS 安全策略
-- ============================================

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看自己的行為記錄（個人資料頁面用）
DROP POLICY IF EXISTS "Users can view own events" ON user_events;
CREATE POLICY "Users can view own events"
  ON user_events FOR SELECT
  USING (auth.uid() = user_id);

-- 用戶可以新增自己的行為記錄（前端 batch insert）
DROP POLICY IF EXISTS "Users can insert own events" ON user_events;
CREATE POLICY "Users can insert own events"
  ON user_events FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR user_id IS NULL  -- 允許匿名事件
  );

-- 用戶不可以更新或刪除行為記錄（防止竄改）
-- （不建 UPDATE/DELETE policy = 完全禁止）

-- ============================================
-- 4. user_profiles_cache 表（用戶畫像快取）
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles_cache (
  user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- 活動偏好：根據瀏覽/收藏/評分行為加權計算
  -- 格式：{"camping": 0.6, "carcamp": 0.3, "hiking": 0.1}
  preferred_categories JSONB DEFAULT '{}',
  
  -- 地區偏好
  -- 格式：{"north": 0.4, "east": 0.3, "central": 0.2, "south": 0.1}
  preferred_regions    JSONB DEFAULT '{}',
  
  -- 消費傾向：unknown / budget / mid / premium
  price_sensitivity    TEXT DEFAULT 'unknown',
  
  -- 使用頻率：new / casual / active / power
  activity_level       TEXT DEFAULT 'new',
  
  -- 推測用戶類型：unknown / solo / couple / family / group
  user_persona         TEXT DEFAULT 'unknown',
  
  -- 裝備等級推測：unknown / beginner / intermediate / expert
  experience_level     TEXT DEFAULT 'unknown',
  
  -- 統計數字
  total_views          INT DEFAULT 0,
  total_searches       INT DEFAULT 0,
  total_shares         INT DEFAULT 0,
  
  -- 最近活躍時間
  last_active_at       TIMESTAMPTZ,
  
  -- 快取更新時間
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_profiles_cache IS '用戶畫像快取表，由 cron job 或 edge function 定期更新';

-- 索引：按活躍度分群查詢
CREATE INDEX IF NOT EXISTS idx_user_profiles_activity
  ON user_profiles_cache(activity_level);

-- 索引：按最近活躍時間（找流失用戶）
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active
  ON user_profiles_cache(last_active_at DESC);

-- RLS
ALTER TABLE user_profiles_cache ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看自己的畫像
DROP POLICY IF EXISTS "Users can view own profile cache" ON user_profiles_cache;
CREATE POLICY "Users can view own profile cache"
  ON user_profiles_cache FOR SELECT
  USING (auth.uid() = user_id);

-- 只有系統可以寫入（透過 service_role key）
-- 前端不能直接修改畫像快取
DROP POLICY IF EXISTS "Service role can manage profile cache" ON user_profiles_cache;
CREATE POLICY "Service role can manage profile cache"
  ON user_profiles_cache FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 5. user_spot_signals VIEW（推薦引擎統一信號）
-- ============================================
-- 
-- 把所有正向信號統一成一個 view，方便推薦引擎使用
-- signal_strength: 1-5，數字越大信號越強
--

CREATE OR REPLACE VIEW user_spot_signals AS

-- 收藏 = 信號強度 5（明確表達喜歡）
SELECT user_id, spot_id, 5 AS signal_strength, 'favorite'::TEXT AS source, created_at
FROM favorites

UNION ALL

-- 高評分（≥3） = 信號強度 = 評分值
SELECT user_id, spot_id, score AS signal_strength, 'rating'::TEXT AS source, created_at
FROM ratings 
WHERE score >= 3

UNION ALL

-- 留言 = 信號強度 4（願意花時間寫）
SELECT user_id, spot_id, 4 AS signal_strength, 'comment'::TEXT AS source, created_at
FROM comments

UNION ALL

-- 打卡 = 信號強度 5（實際到訪）
SELECT user_id, spot_id, 5 AS signal_strength, 'check_in'::TEXT AS source, checked_in_at AS created_at
FROM check_ins

UNION ALL

-- 瀏覽 > 30 秒 = 信號強度 3（認真看了）
SELECT user_id, spot_id, 3 AS signal_strength, 'view'::TEXT AS source, created_at
FROM user_events
WHERE event_type = 'spot_dwell' 
  AND (metadata->>'dwell_seconds')::int > 30
  AND user_id IS NOT NULL
  AND spot_id IS NOT NULL

UNION ALL

-- 分享 = 信號強度 4（願意推薦給別人）
SELECT user_id, spot_id, 4 AS signal_strength, 'share'::TEXT AS source, created_at
FROM user_events
WHERE event_type = 'share' 
  AND spot_id IS NOT NULL
  AND user_id IS NOT NULL

UNION ALL

-- 點擊導航 = 信號強度 5（準備去了）
SELECT user_id, spot_id, 5 AS signal_strength, 'direction'::TEXT AS source, created_at
FROM user_events
WHERE event_type = 'direction_click' 
  AND spot_id IS NOT NULL
  AND user_id IS NOT NULL;

COMMENT ON VIEW user_spot_signals IS '推薦引擎統一信號 VIEW：整合所有正向互動，signal_strength 1-5';

-- ============================================
-- 6. 資料清理函式（Phase 2 啟用）
-- ============================================

-- 每日摘要表（壓縮用，Phase 2 才需要資料）
CREATE TABLE IF NOT EXISTS user_events_daily_summary (
  user_id    UUID,
  event_date DATE,
  event_type TEXT,
  spot_id    UUID,
  count      INT DEFAULT 0,
  metadata   JSONB DEFAULT '{}',  -- 聚合資訊（如 avg_dwell_seconds）
  PRIMARY KEY (user_id, event_date, event_type, COALESCE(spot_id, '00000000-0000-0000-0000-000000000000'::UUID))
);

COMMENT ON TABLE user_events_daily_summary IS '行為事件每日摘要（壓縮舊資料用），Phase 2 啟用';

-- RLS
ALTER TABLE user_events_daily_summary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own daily summary" ON user_events_daily_summary;
CREATE POLICY "Users can view own daily summary"
  ON user_events_daily_summary FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage daily summary" ON user_events_daily_summary;
CREATE POLICY "Service role can manage daily summary"
  ON user_events_daily_summary FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 7. 壓縮舊資料的函式（Phase 2 呼叫）
-- ============================================

CREATE OR REPLACE FUNCTION compress_old_events(months_to_keep INT DEFAULT 18)
RETURNS TABLE(compressed_count BIGINT, deleted_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cutoff TIMESTAMPTZ;
  v_compressed BIGINT;
  v_deleted BIGINT;
BEGIN
  cutoff := NOW() - (months_to_keep || ' months')::INTERVAL;
  
  -- 壓縮：聚合舊事件到 daily_summary
  INSERT INTO user_events_daily_summary (user_id, event_date, event_type, spot_id, count, metadata)
  SELECT 
    user_id,
    created_at::date AS event_date,
    event_type,
    spot_id,
    count(*) AS count,
    jsonb_build_object(
      'avg_dwell', CASE 
        WHEN event_type = 'spot_dwell' 
        THEN round(avg((metadata->>'dwell_seconds')::numeric), 1)
        ELSE NULL 
      END
    ) AS metadata
  FROM user_events
  WHERE created_at < cutoff
  GROUP BY user_id, created_at::date, event_type, spot_id
  ON CONFLICT (user_id, event_date, event_type, COALESCE(spot_id, '00000000-0000-0000-0000-000000000000'::UUID))
  DO UPDATE SET 
    count = user_events_daily_summary.count + EXCLUDED.count;
  
  GET DIAGNOSTICS v_compressed = ROW_COUNT;
  
  -- 刪除已壓縮的原始事件
  DELETE FROM user_events WHERE created_at < cutoff;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT v_compressed, v_deleted;
END;
$$;

COMMENT ON FUNCTION compress_old_events IS '壓縮超過 N 個月的事件到 daily_summary 並刪除原始資料。用法：SELECT * FROM compress_old_events(18);';

-- ============================================
-- 8. 更新用戶畫像的函式（Phase 2 cron 呼叫）
-- ============================================

CREATE OR REPLACE FUNCTION refresh_user_profile_cache(target_user_id UUID DEFAULT NULL)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected INT;
BEGIN
  -- 如果指定用戶就只更新一個，否則更新所有 30 天內活躍的
  INSERT INTO user_profiles_cache (
    user_id, 
    total_views, 
    total_searches, 
    total_shares,
    activity_level,
    last_active_at,
    updated_at
  )
  SELECT 
    u.id,
    COALESCE(views.cnt, 0),
    COALESCE(searches.cnt, 0),
    COALESCE(shares.cnt, 0),
    CASE 
      WHEN COALESCE(recent.cnt, 0) >= 15 THEN 'power'
      WHEN COALESCE(recent.cnt, 0) >= 5 THEN 'active'
      WHEN COALESCE(recent.cnt, 0) >= 1 THEN 'casual'
      ELSE 'new'
    END,
    COALESCE(recent.last_at, u.created_at),
    NOW()
  FROM users u
  -- 總瀏覽數
  LEFT JOIN LATERAL (
    SELECT count(*) AS cnt FROM user_events 
    WHERE user_id = u.id AND event_type = 'spot_view'
  ) views ON true
  -- 總搜尋數
  LEFT JOIN LATERAL (
    SELECT count(*) AS cnt FROM user_events 
    WHERE user_id = u.id AND event_type = 'search'
  ) searches ON true
  -- 總分享數
  LEFT JOIN LATERAL (
    SELECT count(*) AS cnt FROM user_events 
    WHERE user_id = u.id AND event_type = 'share'
  ) shares ON true
  -- 最近 7 天活躍度（判斷分群用）
  LEFT JOIN LATERAL (
    SELECT count(*) AS cnt, max(created_at) AS last_at 
    FROM user_events 
    WHERE user_id = u.id AND created_at > NOW() - INTERVAL '7 days'
  ) recent ON true
  WHERE 
    (target_user_id IS NOT NULL AND u.id = target_user_id)
    OR (target_user_id IS NULL AND u.created_at > NOW() - INTERVAL '90 days')
  ON CONFLICT (user_id) DO UPDATE SET
    total_views = EXCLUDED.total_views,
    total_searches = EXCLUDED.total_searches,
    total_shares = EXCLUDED.total_shares,
    activity_level = EXCLUDED.activity_level,
    last_active_at = EXCLUDED.last_active_at,
    updated_at = NOW();
  
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

COMMENT ON FUNCTION refresh_user_profile_cache IS '更新用戶畫像快取。指定 user_id 更新單人，NULL 批次更新 90 天內活躍用戶';
