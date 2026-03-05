-- ============================================
-- 031: 成就系統完整定義（45 個成就）
-- 在 008 基礎上新增欄位 + 擴充成就
-- ============================================

-- 新增 criteria 和 sort_order 欄位（如尚未存在）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'achievements' AND column_name = 'criteria'
  ) THEN
    ALTER TABLE achievements ADD COLUMN criteria JSONB NOT NULL DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'achievements' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE achievements ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- 刪除舊的 10 筆 seed（重新用完整定義取代）
DELETE FROM achievements WHERE key IN (
  'first_visit', 'explorer_10', 'category_master',
  'first_spot', 'first_vote', 'contributor_50', 'reporter',
  'first_follower', 'helpful_10', 'genesis'
);

-- ============================================
-- 插入全部 ~45 個成就定義
-- category: exploration / contribution / community / special
-- tier: bronze / silver / gold
-- ============================================

INSERT INTO achievements (key, name_zh, name_en, description_zh, icon, category, points, tier, criteria, sort_order)
VALUES
-- ============================================
-- 🗺️ 探索類 (exploration) — 12 個
-- ============================================
('first_explore',
 '初次探索', 'First Explore',
 '查看第一個地點詳情',
 '🗺️', 'exploration', 5, 'bronze',
 '{"type": "view_spots", "threshold": 1}',
 100),

('region_north',
 '北部探索者', 'Northern Explorer',
 '查看北部地區 10 個以上地點',
 '🧭', 'exploration', 15, 'silver',
 '{"type": "view_region", "region": "north", "threshold": 10}',
 101),

('region_central',
 '中部探索者', 'Central Explorer',
 '查看中部地區 10 個以上地點',
 '🏔️', 'exploration', 15, 'silver',
 '{"type": "view_region", "region": "central", "threshold": 10}',
 102),

('region_south',
 '南部探索者', 'Southern Explorer',
 '查看南部地區 10 個以上地點',
 '🌴', 'exploration', 15, 'silver',
 '{"type": "view_region", "region": "south", "threshold": 10}',
 103),

('region_east',
 '東部探索者', 'Eastern Explorer',
 '查看東部地區 10 個以上地點',
 '🌊', 'exploration', 15, 'silver',
 '{"type": "view_region", "region": "east", "threshold": 10}',
 104),

('region_island',
 '離島探索者', 'Island Explorer',
 '查看離島地區 10 個以上地點',
 '🏝️', 'exploration', 15, 'silver',
 '{"type": "view_region", "region": "island", "threshold": 10}',
 105),

('region_mountain',
 '高山探索者', 'Mountain Explorer',
 '查看高山地區 10 個以上地點',
 '⛰️', 'exploration', 15, 'silver',
 '{"type": "view_region", "region": "mountain", "threshold": 10}',
 106),

('all_counties',
 '全台走透透', 'All Counties',
 '查看全台 22 縣市的地點',
 '🇹🇼', 'exploration', 30, 'gold',
 '{"type": "view_all_counties", "threshold": 22}',
 107),

('camping_beginner',
 '露營新手', 'Camping Beginner',
 '查看 10 個露營地',
 '🏕️', 'exploration', 10, 'bronze',
 '{"type": "view_category", "category": "camping", "threshold": 10}',
 108),

('carcamp_beginner',
 '車宿入門', 'Car Camping Beginner',
 '查看 10 個車宿點',
 '🚐', 'exploration', 10, 'bronze',
 '{"type": "view_category", "category": "carcamp", "threshold": 10}',
 109),

('explore_expert',
 '探索達人', 'Explore Expert',
 '查看 100 個地點',
 '🔭', 'exploration', 20, 'silver',
 '{"type": "view_spots", "threshold": 100}',
 110),

('explore_master',
 '探索大師', 'Explore Master',
 '查看 500 個地點',
 '🌟', 'exploration', 30, 'gold',
 '{"type": "view_spots", "threshold": 500}',
 111),

-- ============================================
-- 📝 貢獻類 (contribution) — 15 個
-- ============================================
('first_spot',
 '第一筆貢獻', 'First Contribution',
 '新增第一個地點',
 '📍', 'contribution', 10, 'bronze',
 '{"type": "add_spots", "threshold": 1}',
 200),

('photographer',
 '攝影師', 'Photographer',
 '上傳第一張照片',
 '📷', 'contribution', 5, 'bronze',
 '{"type": "upload_photos", "threshold": 1}',
 201),

('prolific_photographer',
 '多產攝影師', 'Prolific Photographer',
 '上傳 50 張照片',
 '📸', 'contribution', 20, 'silver',
 '{"type": "upload_photos", "threshold": 50}',
 202),

('first_comment',
 '評論家', 'Commentator',
 '留下第一則評論',
 '💬', 'contribution', 5, 'bronze',
 '{"type": "comments", "threshold": 1}',
 203),

('comment_100',
 '百篇評論', '100 Comments',
 '留下 100 則評論',
 '📝', 'contribution', 30, 'gold',
 '{"type": "comments", "threshold": 100}',
 204),

('first_vote',
 '投票先鋒', 'First Vote',
 '第一次特性投票',
 '🗳️', 'contribution', 5, 'bronze',
 '{"type": "votes", "threshold": 1}',
 205),

('vote_expert',
 '投票達人', 'Vote Expert',
 '投 100 次特性票',
 '✅', 'contribution', 20, 'silver',
 '{"type": "votes", "threshold": 100}',
 206),

('vote_master',
 '投票大師', 'Vote Master',
 '投 500 次特性票',
 '🏆', 'contribution', 30, 'gold',
 '{"type": "votes", "threshold": 500}',
 207),

('first_edit',
 '地圖編輯者', 'Map Editor',
 '第一次編輯地點資訊',
 '✏️', 'contribution', 5, 'bronze',
 '{"type": "edits", "threshold": 1}',
 208),

('edit_guardian',
 '資料守護者', 'Data Guardian',
 '編輯 50 個地點',
 '🛡️', 'contribution', 20, 'silver',
 '{"type": "edits", "threshold": 50}',
 209),

('star_collector',
 '星星收集者', 'Star Collector',
 '給 10 個地點評分',
 '⭐', 'contribution', 10, 'bronze',
 '{"type": "ratings", "threshold": 10}',
 210),

('rating_expert',
 '評分達人', 'Rating Expert',
 '給 50 個地點評分',
 '🌟', 'contribution', 20, 'silver',
 '{"type": "ratings", "threshold": 50}',
 211),

('five_star',
 '五星好評', 'Five Star',
 '給出第一個 5 星評分',
 '🌠', 'contribution', 5, 'bronze',
 '{"type": "rating_score", "score": 5, "threshold": 1}',
 212),

('strict_judge',
 '嚴格評審', 'Strict Judge',
 '給出第一個 1 星評分',
 '🔍', 'contribution', 5, 'bronze',
 '{"type": "rating_score", "score": 1, "threshold": 1}',
 213),

('spot_pioneer',
 '地標開拓者', 'Spot Pioneer',
 '新增 10 個地點',
 '🗺️', 'contribution', 20, 'silver',
 '{"type": "add_spots", "threshold": 10}',
 214),

-- ============================================
-- 🤝 社群類 (community) — 8 個（預留 2 個）
-- ============================================
('social_butterfly',
 '社交蝴蝶', 'Social Butterfly',
 '回覆 10 則評論',
 '🦋', 'community', 10, 'bronze',
 '{"type": "replies", "threshold": 10}',
 300),

('collector',
 '收藏家', 'Collector',
 '收藏 10 個地點',
 '❤️', 'community', 10, 'bronze',
 '{"type": "favorites", "threshold": 10}',
 301),

('super_collector',
 '超級收藏家', 'Super Collector',
 '收藏 50 個地點',
 '💎', 'community', 20, 'silver',
 '{"type": "favorites", "threshold": 50}',
 302),

('popular_spot',
 '人氣地點', 'Popular Spot',
 '你新增的地點被 10 人收藏',
 '🔥', 'community', 20, 'silver',
 '{"type": "spot_favorited", "threshold": 10}',
 303),

('hot_comment',
 '熱門評論', 'Hot Comment',
 '你的評論被 5 人按讚（預留）',
 '👍', 'community', 15, 'silver',
 '{"type": "comment_liked", "threshold": 5, "reserved": true}',
 304),

('share_expert',
 '分享達人', 'Share Expert',
 '分享地點 10 次（預留）',
 '🔗', 'community', 15, 'silver',
 '{"type": "shares", "threshold": 10, "reserved": true}',
 305),

('good_neighbor',
 '好鄰居', 'Good Neighbor',
 '回報 5 個地點問題',
 '🏘️', 'community', 10, 'bronze',
 '{"type": "reports", "threshold": 5}',
 306),

('community_guardian',
 '社群守護者', 'Community Guardian',
 '回報 20 個問題',
 '🛡️', 'community', 20, 'silver',
 '{"type": "reports", "threshold": 20}',
 307),

-- ============================================
-- 🎪 特殊類 (special) — 8 個
-- ============================================
('genesis',
 '創始探索者', 'Genesis Explorer',
 '前 100 名註冊用戶（永久絕版）',
 '🌟', 'special', 30, 'gold',
 '{"type": "early_user", "threshold": 100}',
 400),

('night_owl',
 '夜貓子', 'Night Owl',
 '凌晨 2-5 點使用平台',
 '🦉', 'special', 5, 'bronze',
 '{"type": "time_range", "start_hour": 2, "end_hour": 5}',
 401),

('early_bird',
 '早起鳥', 'Early Bird',
 '早上 5-7 點使用平台',
 '🐦', 'special', 5, 'bronze',
 '{"type": "time_range", "start_hour": 5, "end_hour": 7}',
 402),

('weekend_warrior',
 '週末戰士', 'Weekend Warrior',
 '連續 4 個週末都有使用',
 '⚔️', 'special', 15, 'silver',
 '{"type": "consecutive_weekends", "threshold": 4}',
 403),

('perfect_attendance',
 '全勤達人', 'Perfect Attendance',
 '連續 30 天登入',
 '📅', 'special', 30, 'gold',
 '{"type": "consecutive_days", "threshold": 30}',
 404),

('season_explorer',
 '季節探索者', 'Season Explorer',
 '在春夏秋冬都使用過平台',
 '🍂', 'special', 15, 'silver',
 '{"type": "all_seasons"}',
 405),

('mountain_challenge',
 '百岳挑戰', 'Mountain Challenge',
 '查看海拔 3000m+ 的地點',
 '🏔️', 'special', 20, 'silver',
 '{"type": "view_elevation", "min_elevation": 3000, "threshold": 1}',
 406),

('beach_person',
 '海邊人', 'Beach Person',
 '查看 20 個海邊地點',
 '🏖️', 'special', 15, 'silver',
 '{"type": "view_feature", "feature": "sandy_beach", "threshold": 20}',
 407)

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
