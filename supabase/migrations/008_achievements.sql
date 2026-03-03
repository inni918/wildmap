-- ============================================
-- 008: achievements, user_achievements（預留）
-- ============================================

-- 成就定義
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT,
  description_zh TEXT,
  description_en TEXT,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('exploration', 'contribution', 'community', 'special')),
  points INT DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用戶已解鎖成就
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_tier ON achievements(tier);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);

-- ============================================
-- Seed: 基礎成就（先放 10 個，後續擴充）
-- ============================================
INSERT INTO achievements (key, name_zh, name_en, description_zh, icon, category, points, tier) VALUES
-- 🗺️ 探索類
('first_visit',       '初次探索',     'First Visit',        '完成第一次 GPS 打卡',           '🗺️', 'exploration', 10, 'bronze'),
('explorer_10',       '地圖探險家',   'Explorer',           '造訪 10 個不同地標',            '🧭', 'exploration', 30, 'silver'),
('category_master',   '類型達人',     'Category Master',    '在同一類型造訪 20 個地標',       '🏅', 'exploration', 50, 'gold'),
-- 📝 貢獻類
('first_spot',        '地標開拓者',   'Spot Pioneer',       '新增第一個地標',                '📍', 'contribution', 15, 'bronze'),
('first_vote',        '特性投票員',   'First Vote',         '完成第一次特性投票',             '🗳️', 'contribution', 5,  'bronze'),
('contributor_50',    '資深貢獻者',   'Senior Contributor', '累計 50 次特性投票',             '⭐', 'contribution', 40, 'silver'),
('reporter',          '遊記作家',     'Trip Reporter',      '撰寫第一篇遊記',                '📝', 'contribution', 20, 'bronze'),
-- 🌟 社群類
('first_follower',    '初露鋒芒',     'First Follower',     '獲得第一個追蹤者',              '👥', 'community', 10, 'bronze'),
('helpful_10',        '熱心幫手',     'Helpful',            '留言被 10 人標為有幫助',         '💡', 'community', 30, 'silver'),
-- 🎪 特殊類
('genesis',           '創世紀',       'Genesis',            '平台前 100 名註冊用戶',          '🌟', 'special', 50, 'gold')
ON CONFLICT (key) DO NOTHING;
