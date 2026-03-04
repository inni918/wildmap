-- ============================================
-- 021: 重建 feature_definitions 106 項（6 大類定案版）
-- 2026-03-05
-- ============================================

-- 1. 先刪除 feature_votes（舊 feature_id 關聯會失效）
DELETE FROM feature_votes;

-- 2. 刪除舊的 feature_definitions
DELETE FROM feature_definitions;

-- ============================================
-- 3. INSERT 106 項特性
-- ============================================

-- 1. 營地特性 (camp_traits) - tomato - 21 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('free_site',           '免費',             'Free Site',                '💰', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 1),
('reservation_required','需預約',           'Reservation Required',     '📅', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 2),
('night_arrival',       '可夜衝',           'Night Arrival OK',         '🌙', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 3),
('campfire_allowed',    '可生火',           'Campfire Allowed',         '🔥', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 4),
('accommodation',       '提供住宿',         'Accommodation Available',  '🏠', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 5),
('equipment_rental',    '可租裝備',         'Equipment Rental',         '🎒', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 6),
('food_delivery',       '食材直配',         'Food Delivery',            '🛒', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 7),
('glamping',            '豪華露營',         'Glamping',                 '🏕️', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 8),
('small_group_area',    '少帳包區',         'Small Group Area',         '👥', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 9),
('covered_area',        '雨棚露營區',       'Covered Camping Area',     '⛺', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 10),
('car_beside_tent',     '車停帳邊',         'Car Beside Tent',          '🚗', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 11),
('power_outlet',        '提供電源',         'Power Outlet',             '🔌', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 12),
('managed_site',        '有管理員',         'Managed Site',             '👤', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 13),
('no_smoking',          '場內禁菸',         'No Smoking',               '🚭', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 14),
('no_loud_equipment',   '禁高分貝設備',     'No Loud Equipment',        '🔇', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 15),
('no_alcohol',          '禁止飲酒',         'No Alcohol',               '🚫', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 16),
('child_friendly',      '幼兒友善',         'Child Friendly',           '👶', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 17),
('disability_friendly', '身障者友善',       'Disability Friendly',      '♿', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 18),
('pet_friendly',        '寵物友善',         'Pet Friendly',             '🐾', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 19),
('wifi',                '提供Wi-Fi',        'Wi-Fi Available',          '📶', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 20),
('mobile_signal',       '4G/5G',            '4G/5G Signal',             '📱', 'tomato', 'camp_traits', '營地特性', ARRAY['camping','carcamp'], 21);

-- 2. 設施與服務 (facilities) - turquoise - 22 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('tap_water',           '自來水',           'Tap Water',                '🚰', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 1),
('water_dispenser',     '飲水機',           'Water Dispenser',          '💧', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 2),
('hot_water',           '熱水供應',         'Hot Water',                '♨️', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 3),
('flush_toilet',        '沖水馬桶',         'Flush Toilet',             '🚽', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 4),
('squat_toilet',        '蹲式廁所',         'Squat Toilet',             '🚻', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 5),
('shower',              '淋浴間',           'Shower',                   '🚿', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 6),
('private_bathroom',    '包區獨立衛浴',     'Private Bathroom',         '🛁', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 7),
('hot_spring',          '溫泉',             'Hot Spring',               '🌡️', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 8),
('hair_dryer',          '吹風機',           'Hair Dryer',               '💨', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 9),
('washing_machine',     '洗衣機',           'Washing Machine',          '🫧', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 10),
('spin_dryer',          '脫水機',           'Spin Dryer',               '🌀', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 11),
('sink',                '洗滌槽',           'Sink',                     '🧼', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 12),
('refrigerator',        '冰箱',             'Refrigerator',             '🧊', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 13),
('shared_kitchen',      '公用廚房',         'Shared Kitchen',           '🍳', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 14),
('food_service',        '餐飲服務',         'Food Service',             '🍽️', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 15),
('convenience_store',   '便利商店',         'Convenience Store',        '🏪', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 16),
('outdoor_seating',     '戶外桌椅',         'Outdoor Seating',          '🪑', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 17),
('trash_bin',           '垃圾桶',           'Trash Bin',                '🗑️', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 18),
('playground',          '遊樂設施',         'Playground',               '🛝', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 19),
('basketball_court',    '籃球場',           'Basketball Court',         '🏀', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 20),
('sandbox',             '沙坑',             'Sandbox',                  '🏖️', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 21),
('swimming_pool',       '戲水池/泳池',      'Swimming Pool',            '🏊', 'turquoise', 'facilities', '設施與服務', ARRAY['camping','carcamp'], 22);

-- 3. 周邊環境 (environment) - forestgreen - 20 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('shaded',              '大片樹蔭',         'Shaded Area',              '🌳', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 1),
('grassland',           '大片草皮',         'Grassland',                '🌿', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 2),
('forest',              '森林',             'Forest',                   '🌲', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 3),
('river_stream',        '溪流',             'River/Stream',             '🏞️', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 4),
('lake',                '湖泊',             'Lake',                     '🌊', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 5),
('sandy_beach',         '沙灘',             'Sandy Beach',              '🏖️', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 6),
('waterfall',           '瀑布',             'Waterfall',                '💧', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 7),
('wild_hot_spring',     '野溪溫泉',         'Wild Hot Spring',          '♨️', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 8),
('mountain_view',       '山景',             'Mountain View',            '⛰️', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 9),
('ocean_view',          '海景',             'Ocean View',               '🌊', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 10),
('sea_of_clouds',       '雲海',             'Sea of Clouds',            '☁️', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 11),
('panoramic_view',      '視野遼闊',         'Panoramic View',           '🔭', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 12),
('sunrise_view',        '日出景觀',         'Sunrise View',             '🌅', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 13),
('night_view',          '夜景',             'Night View',               '🌃', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 14),
('stargazing',          '適合觀星',         'Stargazing',               '⭐', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 15),
('fireflies',           '螢火蟲',           'Fireflies',                '✨', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 16),
('wildlife',            '野生動物',         'Wildlife',                 '🦌', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 17),
('bird_watching',       '賞鳥',             'Bird Watching',            '🐦', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 18),
('seasonal_flowers',    '季節賞花',         'Seasonal Flowers',         '🌸', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 19),
('autumn_leaves',       '賞楓',             'Autumn Leaves',            '🍂', 'forestgreen', 'environment', '周邊環境', ARRAY['camping','carcamp'], 20);

-- 4. 可進行活動 (activities) - navy - 18 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('hiking_trails',       '健行步道',         'Hiking Trails',            '🥾', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 1),
('cycling',             '自行車道',         'Cycling',                  '🚴', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 2),
('rock_climbing',       '攀岩',             'Rock Climbing',            '🧗', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 3),
('high_ropes',          '高空探索',         'High Ropes Course',        '🪢', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 4),
('grass_sledding',      '滑草',             'Grass Sledding',           '🛷', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 5),
('swimming',            '玩水/游泳',        'Swimming',                 '🏊', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 6),
('river_tracing',       '溯溪',             'River Tracing',            '🌊', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 7),
('water_sports',        '水上活動',         'Water Sports',             '🚣', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 8),
('fishing',             '釣魚',             'Fishing',                  '🎣', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 9),
('paintball',           '漆彈',             'Paintball',                '🎯', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 10),
('sky_lantern',         '天燈',             'Sky Lantern',              '🏮', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 11),
('craft_workshop',      '手作課程',         'Craft Workshop',           '✂️', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 12),
('ecology_tour',        '生態體驗',         'Ecology Tour',             '🔬', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 13),
('farm_experience',     '農場體驗',         'Farm Experience',          '🌾', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 14),
('ranch_experience',    '牧場體驗',         'Ranch Experience',         '🐄', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 15),
('science_experience',  '科學體驗',         'Science Experience',       '🔭', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 16),
('cultural_experience', '文化體驗',         'Cultural Experience',      '🎭', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 17),
('indigenous_activity', '原住民傳統活動',   'Indigenous Activity',      '🪘', 'navy', 'activities', '可進行活動', ARRAY['camping','carcamp'], 18);

-- 5. 區域與限制 (restrictions) - fuchsia - 14 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('indigenous_area',     '原住民地區',               'Indigenous Area',          '🗺️', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 1),
('high_mountain',       '百岳',                     'High Mountain (100 Peaks)','⛰️', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 2),
('national_park',       '國家公園/國家風景區',       'National Park',            '🏞️', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 3),
('nature_reserve',      '自然保護區',               'Nature Reserve',           '🌿', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 4),
('permit_required',     '需申請進入',               'Permit Required',          '📋', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 5),
('seasonal_access',     '季節性開放',               'Seasonal Access',          '📅', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 6),
('public_transit',      '大眾運輸可抵達',           'Public Transit Accessible','🚌', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 7),
('motorcycle_ok',       '機車可通行',               'Motorcycle Accessible',    '🏍️', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 8),
('car_ok',              '小客車可通行',             'Car Accessible',           '🚗', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 9),
('rv_ok',               '露營車可通行/露營',         'RV Accessible',            '🚐', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 10),
('trailer_ok',          '露營拖車可通行/露營',       'Trailer Accessible',       '🚛', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 11),
('4wd_required',        '僅四輪驅動通行',           '4WD Required',             '🚙', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 12),
('unpaved_road',        '無鋪設道路',               'Unpaved Road',             '🛤️', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 13),
('tent_allowed',        '可搭帳篷',                 'Tent Allowed',             '⛺', 'fuchsia', 'restrictions', '區域與限制', ARRAY['camping','carcamp'], 14);

-- 6. 注意事項 (warnings) - maroon - 11 項
INSERT INTO feature_definitions (key, name_zh, name_en, icon, color, group_key, group_name_zh, applicable_categories, sort_order) VALUES
('near_highway',        '鄰近公路',         'Near Highway',             '🛣️', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 1),
('poor_drainage',       '排水不良',         'Poor Drainage',            '💧', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 2),
('steep_terrain',       '地形陡峭',         'Steep Terrain',            '⛰️', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 3),
('gravel_ground',       '碎石營地',         'Gravel Ground',            '🪨', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 4),
('biting_midges',       '小黑蚊',           'Biting Midges',            '🦟', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 5),
('mosquitoes',          '蚊蟲多',           'Mosquitoes',               '🦟', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 6),
('leeches',             '有水蛭',           'Leeches',                  '🪱', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 7),
('snakes',              '蛇',               'Snakes',                   '🐍', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 8),
('bees_wasps',          '蜂類',             'Bees/Wasps',               '🐝', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 9),
('venomous_creatures',  '有毒生物',         'Venomous Creatures',       '☠️', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 10),
('wild_boar',           '有山豬出沒',       'Wild Boar',                '🐗', 'maroon', 'warnings', '注意事項', ARRAY['camping','carcamp'], 11);
