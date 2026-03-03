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
