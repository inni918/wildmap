-- ============================================
-- Wildmap 完整資料庫 Schema
-- 自動生成：合併所有 migration 檔案
-- 包含：22 張表 + 87 項特性 seed data + RLS policies
-- ============================================


-- >>>>>>>>>> 001_upgrade_spots.sql <<<<<<<<<<

-- ============================================
-- 001: 升級 spots 表（加欄位，不刪除現有資料）
-- ============================================

-- 加入新欄位（全部用 IF NOT EXISTS 或安全檢查）
DO $$
BEGIN
  -- name_en
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='name_en') THEN
    ALTER TABLE spots ADD COLUMN name_en TEXT;
  END IF;
  -- description_en
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='description_en') THEN
    ALTER TABLE spots ADD COLUMN description_en TEXT;
  END IF;
  -- address
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='address') THEN
    ALTER TABLE spots ADD COLUMN address TEXT;
  END IF;
  -- status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='status') THEN
    ALTER TABLE spots ADD COLUMN status TEXT DEFAULT 'published';
    ALTER TABLE spots ADD CONSTRAINT spots_status_check CHECK (status IN ('draft', 'published', 'hidden', 'closed', 'needs_verification'));
  END IF;
  -- quality
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='quality') THEN
    ALTER TABLE spots ADD COLUMN quality TEXT DEFAULT 'new';
    ALTER TABLE spots ADD CONSTRAINT spots_quality_check CHECK (quality IN ('new', 'community_verified', 'featured', 'official'));
  END IF;
  -- is_free
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='is_free') THEN
    ALTER TABLE spots ADD COLUMN is_free BOOLEAN;
  END IF;
  -- is_private
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='is_private') THEN
    ALTER TABLE spots ADD COLUMN is_private BOOLEAN DEFAULT false;
  END IF;
  -- group_id（FK 在 007_social.sql groups 表建好後加）
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='group_id') THEN
    ALTER TABLE spots ADD COLUMN group_id UUID;
  END IF;
  -- created_by（FK 在 002 users 表建好後加）
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='created_by') THEN
    ALTER TABLE spots ADD COLUMN created_by UUID;
  END IF;
  -- managed_by
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='managed_by') THEN
    ALTER TABLE spots ADD COLUMN managed_by UUID;
  END IF;
  -- claimed_by
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='claimed_by') THEN
    ALTER TABLE spots ADD COLUMN claimed_by UUID;
  END IF;
  -- last_verified_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='last_verified_at') THEN
    ALTER TABLE spots ADD COLUMN last_verified_at TIMESTAMPTZ;
  END IF;
  -- view_count
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='view_count') THEN
    ALTER TABLE spots ADD COLUMN view_count INT DEFAULT 0;
  END IF;
  -- updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='updated_at') THEN
    ALTER TABLE spots ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 索引
CREATE INDEX IF NOT EXISTS idx_spots_category ON spots(category);
CREATE INDEX IF NOT EXISTS idx_spots_status ON spots(status);
CREATE INDEX IF NOT EXISTS idx_spots_created_by ON spots(created_by);

-- 地理位置索引（需要 PostGIS，Supabase 預設已安裝）
-- 如果 PostGIS 未啟用，取消下一行的註解先啟用：
-- CREATE EXTENSION IF NOT EXISTS postgis;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_spots_location ON spots USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326))';
  END IF;
END $$;


-- >>>>>>>>>> 002_users_and_auth.sql <<<<<<<<<<

-- ============================================
-- 002: users 表 + auth trigger
-- ============================================

-- users 表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'google',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'business', 'admin')),
  level INT DEFAULT 1,
  points INT DEFAULT 0,
  credit_score INT DEFAULT 50 CHECK (credit_score >= 0 AND credit_score <= 100),
  is_seed_user BOOLEAN DEFAULT false,
  locale TEXT DEFAULT 'zh-TW',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);

-- spots 表加 FK（延遲到 users 表建好後）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'spots_created_by_fkey' AND table_name = 'spots'
  ) THEN
    ALTER TABLE spots ADD CONSTRAINT spots_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'spots_managed_by_fkey' AND table_name = 'spots'
  ) THEN
    ALTER TABLE spots ADD CONSTRAINT spots_managed_by_fkey FOREIGN KEY (managed_by) REFERENCES users(id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'spots_claimed_by_fkey' AND table_name = 'spots'
  ) THEN
    ALTER TABLE spots ADD CONSTRAINT spots_claimed_by_fkey FOREIGN KEY (claimed_by) REFERENCES users(id);
  END IF;
END $$;

-- handle_new_user trigger：Supabase auth 自動建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    COALESCE(NEW.raw_user_meta_data->>'provider', 'google')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at 自動更新 trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS spots_updated_at ON spots;
CREATE TRIGGER spots_updated_at
  BEFORE UPDATE ON spots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- >>>>>>>>>> 003_features.sql <<<<<<<<<<

-- ============================================
-- 003: feature_definitions + feature_votes + 87 項特性 seed data
-- ============================================

-- 特性定義表
CREATE TABLE IF NOT EXISTS feature_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  color TEXT,
  group_key TEXT NOT NULL,
  group_name_zh TEXT NOT NULL,
  applicable_categories TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 特性投票表
CREATE TABLE IF NOT EXISTS feature_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES feature_definitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(spot_id, feature_id, user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_feature_defs_group ON feature_definitions(group_key);
CREATE INDEX IF NOT EXISTS idx_feature_defs_categories ON feature_definitions USING GIN(applicable_categories);
CREATE INDEX IF NOT EXISTS idx_feature_votes_spot ON feature_votes(spot_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature ON feature_votes(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user ON feature_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_spot_feature ON feature_votes(spot_id, feature_id);

-- ============================================
-- Seed: 87 項特性定義
-- ============================================

-- 營地特性 (campsite_features) - tomato - 15 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('free_site',            '免費營地',     'Free Site',           '💰', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 1),
('night_arrival',        '可夜衝',       'Night Arrival OK',    '🌙', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 2),
('pet_friendly',         '寵物友善',     'Pet Friendly',        '🐕', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp,hiking}', 3),
('car_beside_tent',      '車停帳邊',     'Car Beside Tent',     '🚗', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 4),
('reservation_required', '需預約',       'Reservation Required','📅', 'tomato', 'campsite_features', '營地特性', '{camping}', 5),
('walk_in_ok',           '免預約可入',   'Walk-in OK',          '🚶', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 6),
('rv_friendly',          '露營車可入',   'RV Friendly',         '🚐', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 7),
('managed_site',         '有管理員',     'Managed Site',        '👤', 'tomato', 'campsite_features', '營地特性', '{camping}', 8),
('group_site',           '團體營位',     'Group Site',          '👨‍👩‍👧‍👦', 'tomato', 'campsite_features', '營地特性', '{camping}', 9),
('individual_site',      '散客營位',     'Individual Site',     '🏕️', 'tomato', 'campsite_features', '營地特性', '{camping}', 10),
('glamping',             '豪華露營',     'Glamping',            '🏠', 'tomato', 'campsite_features', '營地特性', '{camping}', 11),
('tent_rental',          '帳篷出租',     'Tent Rental',         '⛺', 'tomato', 'campsite_features', '營地特性', '{camping}', 12),
('equipment_rental',     '裝備出租',     'Equipment Rental',    '🎒', 'tomato', 'campsite_features', '營地特性', '{camping}', 13),
('bbq_allowed',          '可烤肉',       'BBQ Allowed',         '🍖', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 14),
('campfire_allowed',     '可營火',       'Campfire Allowed',    '🔥', 'tomato', 'campsite_features', '營地特性', '{camping,carcamp}', 15)
ON CONFLICT (key) DO NOTHING;

-- 營區設施 (campsite_facilities) - turquoise - 18 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('flush_toilet',   '沖水馬桶',     'Flush Toilet',     '🚽', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 1),
('squat_toilet',   '蹲式廁所',     'Squat Toilet',     '🚻', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 2),
('shower',         '淋浴間',       'Shower',           '🚿', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 3),
('hot_water',      '熱水供應',     'Hot Water',        '♨️', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 4),
('power_outlet',   '電力插座',     'Power Outlet',     '🔌', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 5),
('wifi',           '提供 Wi-Fi',   'Wi-Fi',            '📶', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 6),
('drinking_water', '飲用水',       'Drinking Water',   '🚰', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp,hiking}', 7),
('sink',           '洗滌槽',       'Sink',             '🧼', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 8),
('trash_bin',      '垃圾桶',       'Trash Bin',        '🗑️', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp,hiking}', 9),
('recycling',      '資源回收',     'Recycling',        '♻️', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 10),
('laundry',        '洗衣設施',     'Laundry',          '🧺', 'turquoise', 'campsite_facilities', '營區設施', '{camping}', 11),
('playground',     '兒童遊樂設施', 'Playground',       '🛝', 'turquoise', 'campsite_facilities', '營區設施', '{camping}', 12),
('swimming_pool',  '游泳池',       'Swimming Pool',    '🏊', 'turquoise', 'campsite_facilities', '營區設施', '{camping}', 13),
('camp_store',     '營地商店',     'Camp Store',       '🏪', 'turquoise', 'campsite_facilities', '營區設施', '{camping}', 14),
('picnic_table',   '野餐桌',       'Picnic Table',     '🪑', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp,hiking}', 15),
('covered_area',   '有遮蔽區域',   'Covered Area',     '🏛️', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp}', 16),
('kitchen',        '公用廚房',     'Kitchen',          '🍳', 'turquoise', 'campsite_facilities', '營區設施', '{camping}', 17),
('parking',        '停車場',       'Parking',          '🅿️', 'turquoise', 'campsite_facilities', '營區設施', '{camping,carcamp,hiking,fishing,surfing,diving}', 18)
ON CONFLICT (key) DO NOTHING;

-- 周邊環境 (environment) - forestgreen - 16 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('river_stream',      '溪流',         'River/Stream',      '🏞️', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,fishing}', 1),
('lake',              '湖泊',         'Lake',              '🌊', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,fishing}', 2),
('ocean_view',        '海景',         'Ocean View',        '🌊', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,surfing,diving,fishing}', 3),
('mountain_view',     '山景',         'Mountain View',     '⛰️', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,hiking}', 4),
('forest',            '森林',         'Forest',            '🌲', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,hiking}', 5),
('shaded',            '大片樹蔭',     'Shaded',            '🌳', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp}', 6),
('grassland',         '草地營位',     'Grass Site',        '🌿', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp}', 7),
('gravel_site',       '碎石營位',     'Gravel Site',       '🪨', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp}', 8),
('flat_ground',       '平坦地面',     'Flat Ground',       '⬜', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp}', 9),
('sunrise_view',      '日出景觀',     'Sunrise View',      '🌅', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,hiking}', 10),
('stargazing',        '適合觀星',     'Stargazing',        '⭐', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp}', 11),
('fireflies',         '螢火蟲',       'Fireflies',         '✨', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp}', 12),
('hot_spring_nearby', '附近有溫泉',   'Hot Spring Nearby', '♨️', 'forestgreen', 'environment', '周邊環境', '{camping,carcamp,hiking}', 13),
('waterfall',         '瀑布',         'Waterfall',         '💧', 'forestgreen', 'environment', '周邊環境', '{camping,hiking}', 14),
('coral_reef',        '珊瑚礁',       'Coral Reef',        '🪸', 'forestgreen', 'environment', '周邊環境', '{diving}', 15),
('sandy_beach',       '沙灘',         'Sandy Beach',       '🏖️', 'forestgreen', 'environment', '周邊環境', '{surfing,diving,camping,carcamp}', 16)
ON CONFLICT (key) DO NOTHING;

-- 可進行活動 (activities) - navy - 16 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('swimming',            '可游泳',       'Swimming',       '🏊', 'navy', 'activities', '可進行活動', '{camping,carcamp,hiking}', 1),
('fishing_available',   '可釣魚',       'Fishing',        '🎣', 'navy', 'activities', '可進行活動', '{camping,carcamp,fishing}', 2),
('hiking_trails',       '步道健行',     'Hiking Trails',  '🥾', 'navy', 'activities', '可進行活動', '{camping,carcamp,hiking}', 3),
('cycling',             '可騎腳踏車',   'Cycling',        '🚴', 'navy', 'activities', '可進行活動', '{camping,carcamp}', 4),
('kayaking',            '可划獨木舟',   'Kayaking',       '🛶', 'navy', 'activities', '可進行活動', '{camping,carcamp,fishing}', 5),
('rock_climbing',       '攀岩',         'Rock Climbing',  '🧗', 'navy', 'activities', '可進行活動', '{hiking}', 6),
('bird_watching',       '賞鳥',         'Bird Watching',  '🐦', 'navy', 'activities', '可進行活動', '{camping,carcamp,hiking}', 7),
('snorkeling',          '浮潛',         'Snorkeling',     '🤿', 'navy', 'activities', '可進行活動', '{diving,surfing}', 8),
('scuba_diving',        '水肺潛水',     'Scuba Diving',   '🤿', 'navy', 'activities', '可進行活動', '{diving}', 9),
('freediving',          '自由潛水',     'Freediving',     '🏊', 'navy', 'activities', '可進行活動', '{diving}', 10),
('sup',                 'SUP 立槳',     'SUP',            '🏄', 'navy', 'activities', '可進行活動', '{surfing,camping,carcamp}', 11),
('surfing_available',   '可衝浪',       'Surfing',        '🏄', 'navy', 'activities', '可進行活動', '{surfing}', 12),
('night_fishing',       '可夜釣',       'Night Fishing',  '🌙', 'navy', 'activities', '可進行活動', '{fishing}', 13),
('shore_fishing',       '岸釣',         'Shore Fishing',  '🎣', 'navy', 'activities', '可進行活動', '{fishing}', 14),
('boat_fishing',        '船釣',         'Boat Fishing',   '🚤', 'navy', 'activities', '可進行活動', '{fishing}', 15),
('fly_fishing',         '飛蠅釣',       'Fly Fishing',    '🪝', 'navy', 'activities', '可進行活動', '{fishing}', 16)
ON CONFLICT (key) DO NOTHING;

-- 區域限制 (restrictions) - fuchsia - 12 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('4wd_required',      '需四輪傳動',     '4WD Required',        '🚙', 'fuchsia', 'restrictions', '區域限制', '{camping,carcamp,hiking,fishing}', 1),
('paved_road',        '柏油路可達',     'Paved Road Access',   '🛣️', 'fuchsia', 'restrictions', '區域限制', '{camping,carcamp,hiking,fishing,surfing,diving}', 2),
('no_noise_after_10', '晚十點後禁噪音', 'Quiet After 10pm',    '🤫', 'fuchsia', 'restrictions', '區域限制', '{camping,carcamp}', 3),
('no_alcohol',        '禁止飲酒',       'No Alcohol',          '🚫', 'fuchsia', 'restrictions', '區域限制', '{camping}', 4),
('no_pets',           '禁止寵物',       'No Pets',             '🐕‍🦺', 'fuchsia', 'restrictions', '區域限制', '{camping}', 5),
('permit_required',   '需入山證',       'Permit Required',     '📋', 'fuchsia', 'restrictions', '區域限制', '{hiking,camping}', 6),
('seasonal_access',   '季節性開放',     'Seasonal Access',     '📅', 'fuchsia', 'restrictions', '區域限制', '{camping,hiking,surfing,diving}', 7),
('size_limit',        '有車輛尺寸限制', 'Vehicle Size Limit',  '📏', 'fuchsia', 'restrictions', '區域限制', '{carcamp,camping}', 8),
('no_campfire',       '禁止營火',       'No Campfire',         '🔥', 'fuchsia', 'restrictions', '區域限制', '{camping,carcamp}', 9),
('fishing_license',   '需釣魚證',       'Fishing License Req', '📋', 'fuchsia', 'restrictions', '區域限制', '{fishing}', 10),
('dive_cert_required','需潛水證照',     'Dive Cert Required',  '📋', 'fuchsia', 'restrictions', '區域限制', '{diving}', 11),
('booking_essential', '旺季需提早訂位', 'Booking Essential',   '⏰', 'fuchsia', 'restrictions', '區域限制', '{camping}', 12)
ON CONFLICT (key) DO NOTHING;

-- 注意事項 (warnings) - maroon - 10 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('no_cell_signal',      '無手機訊號',       'No Cell Signal',     '📵', 'maroon', 'warnings', '注意事項', '{camping,carcamp,hiking,fishing}', 1),
('limited_cell_signal', '手機訊號微弱',     'Limited Signal',     '📱', 'maroon', 'warnings', '注意事項', '{camping,carcamp,hiking,fishing}', 2),
('mosquitoes',          '蚊蟲多',           'Mosquitoes',         '🦟', 'maroon', 'warnings', '注意事項', '{camping,carcamp,hiking,fishing}', 3),
('leeches',             '有水蛭',           'Leeches',            '🪱', 'maroon', 'warnings', '注意事項', '{hiking,camping}', 4),
('snakes',              '有蛇出沒',         'Snakes',             '🐍', 'maroon', 'warnings', '注意事項', '{camping,carcamp,hiking}', 5),
('wild_boar',           '有山豬出沒',       'Wild Boar',          '🐗', 'maroon', 'warnings', '注意事項', '{camping,hiking}', 6),
('strong_current',      '水流湍急',         'Strong Current',     '🌊', 'maroon', 'warnings', '注意事項', '{fishing,diving,surfing,camping}', 7),
('steep_terrain',       '地形陡峭',         'Steep Terrain',      '⛰️', 'maroon', 'warnings', '注意事項', '{hiking,camping}', 8),
('flash_flood_risk',    '有溪水暴漲風險',   'Flash Flood Risk',   '🌧️', 'maroon', 'warnings', '注意事項', '{camping,carcamp,fishing}', 9),
('jellyfish',           '有水母',           'Jellyfish',          '🪼', 'maroon', 'warnings', '注意事項', '{diving,surfing,fishing}', 10)
ON CONFLICT (key) DO NOTHING;


-- >>>>>>>>>> 004_interactions.sql <<<<<<<<<<

-- ============================================
-- 004: ratings, comments, spot_images, trip_reports, favorites
-- ============================================

-- 評分
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(spot_id, user_id)
);

-- 留言
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_verified_visit BOOLEAN DEFAULT false,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 地標照片
CREATE TABLE IF NOT EXISTS spot_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 遊記
CREATE TABLE IF NOT EXISTS trip_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 收藏
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, spot_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_ratings_spot ON ratings(spot_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_spot ON comments(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spot_images_spot ON spot_images(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_images_user ON spot_images(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_reports_spot ON trip_reports(spot_id);
CREATE INDEX IF NOT EXISTS idx_trip_reports_user ON trip_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_spot ON favorites(spot_id);

-- updated_at triggers
DROP TRIGGER IF EXISTS comments_updated_at ON comments;
CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trip_reports_updated_at ON trip_reports;
CREATE TRIGGER trip_reports_updated_at
  BEFORE UPDATE ON trip_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- >>>>>>>>>> 005_governance.sql <<<<<<<<<<

-- ============================================
-- 005: spot_edits, reports, check_ins
-- ============================================

-- 版本歷史（地標編輯建議）
CREATE TABLE IF NOT EXISTS spot_edits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diff JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 檢舉
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('spot', 'comment', 'image', 'trip_report')),
  target_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('incorrect', 'duplicate', 'fake', 'inappropriate', 'spam')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- GPS 打卡
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, spot_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_spot_edits_spot ON spot_edits(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_edits_status ON spot_edits(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_spot ON check_ins(spot_id);


-- >>>>>>>>>> 006_business.sql <<<<<<<<<<

-- ============================================
-- 006: business_claims, business_subscriptions
-- ============================================

-- 商家認證聲明
CREATE TABLE IF NOT EXISTS business_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 商家訂閱
CREATE TABLE IF NOT EXISTS business_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'pro')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_business_claims_spot ON business_claims(spot_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_user ON business_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_status ON business_claims(status);
CREATE INDEX IF NOT EXISTS idx_business_subs_user ON business_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_business_subs_plan ON business_subscriptions(plan);


-- >>>>>>>>>> 007_social.sql <<<<<<<<<<

-- ============================================
-- 007: groups, group_members, follows, user_activities,
--      user_category_stats, notifications
-- ============================================

-- 私房地點群組
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 群組成員
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- spots.group_id FK（groups 表建好後加）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'spots_group_id_fkey' AND table_name = 'spots'
  ) THEN
    ALTER TABLE spots ADD CONSTRAINT spots_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id);
  END IF;
END $$;

-- 追蹤
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 用戶動態
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'visited', 'added_spot', 'uploaded_photo', 'wrote_report',
    'voted_feature', 'commented', 'rated', 'check_in'
  )),
  spot_id UUID REFERENCES spots(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用戶分類積分
CREATE TABLE IF NOT EXISTS user_category_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('camping', 'fishing', 'diving', 'surfing', 'hiking', 'carcamp')),
  points INT DEFAULT 0,
  level INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- 通知
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'booking_confirm', 'business_announcement', 'report_resolved',
    'edit_approved', 'edit_rejected', 'new_follower',
    'comment_reply', 'achievement_unlocked', 'level_up'
  )),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_groups_owner ON groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_category_stats_user ON user_category_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- updated_at trigger
DROP TRIGGER IF EXISTS user_category_stats_updated_at ON user_category_stats;
CREATE TRIGGER user_category_stats_updated_at
  BEFORE UPDATE ON user_category_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- >>>>>>>>>> 008_achievements.sql <<<<<<<<<<

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


-- >>>>>>>>>> 009_rls.sql <<<<<<<<<<

-- ============================================
-- 009: 所有表的 RLS policies
-- ============================================

-- ==========================================
-- Helper: is_admin function
-- ==========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 1. spots
-- ==========================================
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
-- 移除舊 policies（安全起見）
DROP POLICY IF EXISTS "Anyone can read spots" ON spots;
DROP POLICY IF EXISTS "Anyone can insert spots" ON spots;
DROP POLICY IF EXISTS "spots_insert_auth" ON spots;
DROP POLICY IF EXISTS "spots_update_own" ON spots;

-- SELECT: 公開地標所有人可看，私房地標只有群組成員可看
CREATE POLICY "spots_select" ON spots FOR SELECT USING (
  is_private = false
  OR created_by = auth.uid()
  OR managed_by = auth.uid()
  OR group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  OR is_admin()
);

-- INSERT: 登入用戶可新增
CREATE POLICY "spots_insert" ON spots FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- UPDATE: 創建者、管理員、認證商家、admin
CREATE POLICY "spots_update" ON spots FOR UPDATE USING (
  auth.uid() = created_by
  OR auth.uid() = managed_by
  OR auth.uid() = claimed_by
  OR is_admin()
);

-- DELETE: 只有 admin
CREATE POLICY "spots_delete" ON spots FOR DELETE USING (
  is_admin()
);

-- ==========================================
-- 2. users
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

-- SELECT: 所有人可看基本資料
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
-- INSERT: 只能建自己的 profile（trigger 處理）
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);
-- UPDATE: 只能改自己的，admin 可改所有人
CREATE POLICY "users_update" ON users FOR UPDATE USING (
  auth.uid() = id OR is_admin()
);

-- ==========================================
-- 3. feature_definitions
-- ==========================================
ALTER TABLE feature_definitions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feature_defs_select_all" ON feature_definitions;

-- SELECT: 所有人可讀
CREATE POLICY "feature_defs_select" ON feature_definitions FOR SELECT USING (true);
-- INSERT/UPDATE/DELETE: 只有 admin
CREATE POLICY "feature_defs_admin_insert" ON feature_definitions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "feature_defs_admin_update" ON feature_definitions FOR UPDATE USING (is_admin());
CREATE POLICY "feature_defs_admin_delete" ON feature_definitions FOR DELETE USING (is_admin());

-- ==========================================
-- 4. feature_votes
-- ==========================================
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feature_votes_select_all" ON feature_votes;
DROP POLICY IF EXISTS "feature_votes_insert_auth" ON feature_votes;
DROP POLICY IF EXISTS "feature_votes_update_own" ON feature_votes;
DROP POLICY IF EXISTS "feature_votes_delete_own" ON feature_votes;

-- SELECT: 所有人可讀
CREATE POLICY "feature_votes_select" ON feature_votes FOR SELECT USING (true);
-- INSERT: 登入用戶只能以自己的 user_id 投票
CREATE POLICY "feature_votes_insert" ON feature_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: 只能改自己的投票
CREATE POLICY "feature_votes_update" ON feature_votes FOR UPDATE USING (auth.uid() = user_id);
-- DELETE: 只能刪自己的投票
CREATE POLICY "feature_votes_delete" ON feature_votes FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 5. ratings
-- ==========================================
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ratings_select" ON ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update" ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ratings_delete" ON ratings FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 6. comments
-- ==========================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- 7. spot_images
-- ==========================================
ALTER TABLE spot_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spot_images_select" ON spot_images FOR SELECT USING (true);
CREATE POLICY "spot_images_insert" ON spot_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spot_images_delete" ON spot_images FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- 8. trip_reports
-- ==========================================
ALTER TABLE trip_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trip_reports_select" ON trip_reports FOR SELECT USING (true);
CREATE POLICY "trip_reports_insert" ON trip_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trip_reports_update" ON trip_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trip_reports_delete" ON trip_reports FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- 9. favorites
-- ==========================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
-- SELECT: 只能看自己的收藏
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 10. spot_edits
-- ==========================================
ALTER TABLE spot_edits ENABLE ROW LEVEL SECURITY;
-- SELECT: 所有人可看（透明度）
CREATE POLICY "spot_edits_select" ON spot_edits FOR SELECT USING (true);
CREATE POLICY "spot_edits_insert" ON spot_edits FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: admin 或地標管理員可審核
CREATE POLICY "spot_edits_update" ON spot_edits FOR UPDATE USING (
  is_admin()
  OR EXISTS (
    SELECT 1 FROM spots WHERE spots.id = spot_edits.spot_id
    AND (spots.managed_by = auth.uid() OR spots.claimed_by = auth.uid())
  )
);

-- ==========================================
-- 11. reports
-- ==========================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
-- SELECT: 只能看自己的檢舉 + admin 看全部
CREATE POLICY "reports_select" ON reports FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: 只有 admin 可處理檢舉
CREATE POLICY "reports_update" ON reports FOR UPDATE USING (is_admin());

-- ==========================================
-- 12. check_ins
-- ==========================================
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
-- SELECT: 所有人可看（顯示「已到訪」標記）
CREATE POLICY "check_ins_select" ON check_ins FOR SELECT USING (true);
CREATE POLICY "check_ins_insert" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 13. business_claims
-- ==========================================
ALTER TABLE business_claims ENABLE ROW LEVEL SECURITY;
-- SELECT: 自己的 + admin
CREATE POLICY "business_claims_select" ON business_claims FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
CREATE POLICY "business_claims_insert" ON business_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: admin 審核
CREATE POLICY "business_claims_update" ON business_claims FOR UPDATE USING (is_admin());

-- ==========================================
-- 14. business_subscriptions
-- ==========================================
ALTER TABLE business_subscriptions ENABLE ROW LEVEL SECURITY;
-- SELECT: 自己的 + admin
CREATE POLICY "business_subs_select" ON business_subscriptions FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
-- INSERT/UPDATE: 透過 server 函式處理（payment webhook）
CREATE POLICY "business_subs_admin_insert" ON business_subscriptions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "business_subs_admin_update" ON business_subscriptions FOR UPDATE USING (is_admin());

-- ==========================================
-- 15. groups
-- ==========================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
-- SELECT: 群組成員 + admin
CREATE POLICY "groups_select" ON groups FOR SELECT USING (
  owner_id = auth.uid()
  OR id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "groups_insert" ON groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "groups_update" ON groups FOR UPDATE USING (auth.uid() = owner_id OR is_admin());
CREATE POLICY "groups_delete" ON groups FOR DELETE USING (auth.uid() = owner_id OR is_admin());

-- ==========================================
-- 16. group_members
-- ==========================================
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
-- SELECT: 同群組成員可看
CREATE POLICY "group_members_select" ON group_members FOR SELECT USING (
  user_id = auth.uid()
  OR group_id IN (SELECT group_id FROM group_members gm WHERE gm.user_id = auth.uid())
  OR is_admin()
);
-- INSERT: 群組 owner 可邀請
CREATE POLICY "group_members_insert" ON group_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM groups WHERE id = group_members.group_id AND owner_id = auth.uid())
  OR is_admin()
);
-- DELETE: 群組 owner 或自己退出
CREATE POLICY "group_members_delete" ON group_members FOR DELETE USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM groups WHERE id = group_members.group_id AND owner_id = auth.uid())
  OR is_admin()
);

-- ==========================================
-- 17. follows
-- ==========================================
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ==========================================
-- 18. user_activities
-- ==========================================
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
-- SELECT: 所有人可看（個人頁面動態牆）
CREATE POLICY "user_activities_select" ON user_activities FOR SELECT USING (true);
-- INSERT: 系統或本人
CREATE POLICY "user_activities_insert" ON user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 19. user_category_stats
-- ==========================================
ALTER TABLE user_category_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_category_stats_select" ON user_category_stats FOR SELECT USING (true);
CREATE POLICY "user_category_stats_insert" ON user_category_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_category_stats_update" ON user_category_stats FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 20. notifications
-- ==========================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- SELECT: 只能看自己的通知
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
-- INSERT: 系統建立（透過 server 函式）
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (is_admin());
-- UPDATE: 本人可標已讀
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 21. achievements
-- ==========================================
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "achievements_select_all" ON achievements;
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_insert" ON achievements FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "achievements_admin_update" ON achievements FOR UPDATE USING (is_admin());

-- ==========================================
-- 22. user_achievements
-- ==========================================
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_achievements_select_all" ON user_achievements;
DROP POLICY IF EXISTS "user_achievements_insert_system" ON user_achievements;
CREATE POLICY "user_achievements_select" ON user_achievements FOR SELECT USING (true);
-- INSERT: 系統自動解鎖（透過 server 函式或 trigger）
CREATE POLICY "user_achievements_insert" ON user_achievements FOR INSERT WITH CHECK (
  auth.uid() = user_id OR is_admin()
);

