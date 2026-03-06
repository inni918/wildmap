-- ============================================
-- 034: 成就系統擴充
-- 新增 20 個成就 + featured_achievements 表
-- ============================================

-- ============================================
-- 1. 新增 featured_achievements 表（精選徽章）
-- ============================================
CREATE TABLE IF NOT EXISTS featured_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL CHECK (slot BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, slot),
  UNIQUE (user_id, achievement_id)
);

-- RLS
ALTER TABLE featured_achievements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'featured_achievements' AND policyname = 'Users can view anyone''s featured achievements'
  ) THEN
    CREATE POLICY "Users can view anyone's featured achievements"
      ON featured_achievements FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'featured_achievements' AND policyname = 'Users can manage their own featured achievements'
  ) THEN
    CREATE POLICY "Users can manage their own featured achievements"
      ON featured_achievements FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================
-- 2. 新增 20 個成就
-- ============================================

INSERT INTO achievements (key, name_zh, name_en, description_zh, icon, category, points, tier, criteria, sort_order)
VALUES

-- ============================================
-- 🗺️ 探索類新增 (+5)
-- ============================================
('all_regions',
 '全島探索者', 'All Regions Explorer',
 '完成六大區域探索（Meta 成就）',
 '🏆', 'exploration', 50, 'gold',
 '{"type": "meta_achievement", "required_keys": ["region_north", "region_central", "region_south", "region_east", "region_island", "region_mountain"]}',
 112),

('camping_expert',
 '露營達人', 'Camping Expert',
 '打卡 50 個露營地',
 '⛺', 'exploration', 20, 'silver',
 '{"type": "view_category", "category": "camping", "threshold": 50}',
 113),

('carcamp_expert',
 '車宿達人', 'Car Camping Expert',
 '打卡 50 個車宿點',
 '🚙', 'exploration', 20, 'silver',
 '{"type": "view_category", "category": "carcamp", "threshold": 50}',
 114),

('altitude_variety',
 '海拔收集者', 'Altitude Collector',
 '打卡海平面到 3000m 的地點（各海拔帶至少一個）',
 '📊', 'exploration', 20, 'silver',
 '{"type": "altitude_variety", "bands": [0, 500, 1500, 3000]}',
 115),

('county_souvenir',
 '縣市紀念章', 'County Souvenir',
 '打卡 10 個不同縣市',
 '🎖️', 'exploration', 15, 'silver',
 '{"type": "view_all_counties", "threshold": 10}',
 116),

-- ============================================
-- 📝 貢獻類新增 (+4)
-- ============================================
('detailed_review',
 '詳細評論家', 'Detailed Reviewer',
 '寫 10 則超過 200 字的評論',
 '📖', 'contribution', 20, 'silver',
 '{"type": "detailed_comments", "min_length": 200, "threshold": 10}',
 215),

('spot_master',
 '地標大師', 'Spot Master',
 '新增 50 個地點',
 '🗻', 'contribution', 30, 'gold',
 '{"type": "add_spots", "threshold": 50}',
 216),

('photo_master',
 '攝影大師', 'Photography Master',
 '上傳 200 張照片',
 '🎞️', 'contribution', 30, 'gold',
 '{"type": "upload_photos", "threshold": 200}',
 217),

('quality_voter',
 '品質鑑定師', 'Quality Voter',
 '投票準確率 ≥ 80%（投票結果與最終結果一致）',
 '🔬', 'contribution', 20, 'silver',
 '{"type": "vote_accuracy", "min_accuracy": 0.8, "min_votes": 20, "reserved": true}',
 218),

-- ============================================
-- 🤝 社群類新增 (+4)
-- ============================================
('helpful_guide',
 '熱心嚮導', 'Helpful Guide',
 '你的評論被 50 人按有用',
 '🧭', 'community', 20, 'silver',
 '{"type": "comment_helpful", "threshold": 50, "reserved": true}',
 308),

('local_expert',
 '在地達人', 'Local Expert',
 '在同一縣市貢獻 30+ 筆資料',
 '🏡', 'community', 20, 'silver',
 '{"type": "local_contributions", "threshold": 30}',
 309),

('mentor',
 '導師', 'Mentor',
 '回覆 50 則新手的評論',
 '🎓', 'community', 20, 'silver',
 '{"type": "mentor_replies", "threshold": 50, "reserved": true}',
 310),

('influencer',
 '影響力達人', 'Influencer',
 '你新增的地點被 100 人查看',
 '🌍', 'community', 30, 'gold',
 '{"type": "spot_views", "threshold": 100, "reserved": true}',
 311),

-- ============================================
-- 🎪 特殊類新增 (+7)
-- ============================================
('sunrise_camper',
 '日出露營家', 'Sunrise Camper',
 '在早上 5-7 點於露營地打卡',
 '🌅', 'special', 10, 'bronze',
 '{"type": "time_category_checkin", "start_hour": 5, "end_hour": 7, "category": "camping"}',
 408),

('stargazer',
 '觀星者', 'Stargazer',
 '在海拔 2000m+ 地點夜間打卡',
 '🌌', 'special', 15, 'silver',
 '{"type": "night_altitude_checkin", "min_elevation": 2000, "start_hour": 20, "end_hour": 5}',
 409),

('rainy_explorer',
 '雨中探索者', 'Rainy Explorer',
 '在雨天打卡（天氣 API）',
 '🌧️', 'special', 10, 'bronze',
 '{"type": "weather_checkin", "weather": "rain", "reserved": true}',
 410),

('streak_7',
 '週連勝', 'Weekly Streak',
 '連續 7 天使用平台',
 '🔥', 'special', 10, 'bronze',
 '{"type": "consecutive_days", "threshold": 7}',
 411),

('new_year_camper',
 '跨年露營', 'New Year Camper',
 '在 12/31-1/1 打卡露營地（年度限定）',
 '🎆', 'special', 20, 'gold',
 '{"type": "date_range_checkin", "month_start": 12, "day_start": 31, "month_end": 1, "day_end": 1, "category": "camping", "reserved": true}',
 412),

('family_explorer',
 '親子探索家', 'Family Explorer',
 '加入家庭群組並一起完成 5 次打卡（未來功能）',
 '👨‍👩‍👧', 'special', 15, 'silver',
 '{"type": "group_checkins", "threshold": 5, "reserved": true}',
 413),

('hotspring_lover',
 '溫泉控', 'Hot Spring Lover',
 '打卡 10 個有溫泉特性的地點',
 '♨️', 'special', 15, 'silver',
 '{"type": "view_feature", "feature": "hot_spring", "threshold": 10}',
 414)

ON CONFLICT (key) DO UPDATE SET
  name_zh = EXCLUDED.name_zh,
  name_en = EXCLUDED.name_en,
  description_zh = EXCLUDED.description_zh,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  points = EXCLUDED.points,
  tier = EXCLUDED.tier,
  criteria = EXCLUDED.criteria,
  sort_order = EXCLUDED.sort_order;
