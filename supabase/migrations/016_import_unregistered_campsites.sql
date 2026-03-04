-- 016: 匯入未登記（違反相關法規）露營場
-- 來源：gov-campsites.csv 中「違反相關法規露營場」且營業中有經緯度的資料
-- 使用 ON CONFLICT 防止重複匯入

-- 加入唯一約束用於防重複（如果不存在）
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spots_name_lat_lng_unique') THEN
    ALTER TABLE spots ADD CONSTRAINT spots_name_lat_lng_unique UNIQUE (name, latitude, longitude);
  END IF;
END $$;

INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大秦會館', 'camping', 24.6775763, 121.7138058, '大埔六路236號', '宜蘭縣三星鄉 — 未登記露營場', '0926728280', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('牛鬥一角民宿野營渡假村', 'camping', 24.63590614, 121.5690785, '宜蘭縣三星鄉泰雅一路 525巷牛頭203號', '宜蘭縣三星鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山谷星空', 'camping', 24.635325, 121.5837013, '宜蘭縣三星鄉泰雅一路301巷71號', '宜蘭縣三星鄉 — 未登記露營場', '0932164669', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬丁迷露', 'camping', 24.69431358, 121.7286618, '大洲路87巷36號', '宜蘭縣三星鄉 — 未登記露營場', '0921099666', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('安農露營區', 'camping', 24.65544333, 121.6474668, '宜蘭市神農路1段130號', '宜蘭縣三星鄉 — 未登記露營場', '0277565296', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三星秘露營區', 'camping', 24.67102717, 121.6859429, '26648宜蘭縣三星鄉安農北路五段32號', '宜蘭縣三星鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天際線茶園營地', 'camping', 24.67665, 121.601629, '泰雅路一段88巷88號', '宜蘭縣大同鄉 — 未登記露營場', '0932359832', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('周家口露營區', 'camping', 24.60945403, 121.6908189, '宜蘭縣大同鄉寒溪巷70-27號', '宜蘭縣大同鄉 — 未登記露營場', '0925367111', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('景好露營場', 'camping', 24.69179779, 121.6126976, '宜蘭縣宜蘭市泰山路112巷5弄25號', '宜蘭縣大同鄉 — 未登記露營場', '0916159727', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溪河木', 'camping', 24.656605, 121.57666, '宜蘭縣大同鄉松羅村松羅南巷115-7號', '宜蘭縣大同鄉 — 未登記露營場', '0910356735', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Uwah露營區', 'camping', 24.623456, 121.685002, '華興巷42-18號', '宜蘭縣大同鄉 — 未登記露營場', '0953517925', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星亮點Kayu露營區', 'camping', 24.678558, 121.601031, '宜蘭縣大同鄉崙埤村泰雅路一段88巷99號', '宜蘭縣大同鄉 — 未登記露營場', '0925290965', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武林秘密基地', 'camping', 24.62145527, 121.685608, '宜蘭縣五結鄉三吉二路80巷13弄16號', '宜蘭縣大同鄉 — 未登記露營場', '0983005759', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('斯揚莫那休閒露營區', 'camping', 24.51306149, 121.4385216, '宜蘭縣礁溪鄉漳福路192之10號', '宜蘭縣大同鄉 — 未登記露營場', '0910549801', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('玉蘭茶園', 'camping', 24.67457854, 121.5850311, '宜蘭縣大同鄉松羅村玉蘭路80號', '宜蘭縣大同鄉 — 未登記露營場', '0919283988', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('淺山休閒露營區', 'camping', 24.60362664, 121.686915, '宜蘭縣羅東鎮純精路2段248巷8號', '宜蘭縣大同鄉 — 未登記露營場', '0926635282', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水之定莊園', 'camping', 24.700327, 121.610145, '宜蘭縣大同鄉中華村長嶺路187號', '宜蘭縣大同鄉 — 未登記露營場', '0952121777', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露山林套房露營區', 'camping', 24.594803, 121.686319, '宜蘭縣大同鄉寒溪村古魯巷1-8號', '宜蘭縣大同鄉 — 未登記露營場', '0910748875', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('摩西露營區', 'camping', 24.60851859, 121.5180952, '宜蘭縣大同鄉英士村林森24-50號', '宜蘭縣大同鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('5859露營區', 'camping', 24.59498352, 121.6840994, '宜蘭縣大同鄉古魯巷1-1號', '宜蘭縣大同鄉 — 未登記露營場', '0908093697', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天梯露營區', 'camping', 24.677041, 121.603768, '泰雅路一段88巷66號', '宜蘭縣大同鄉 — 未登記露營場', '0921591070', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('依拜・吉娃斯生態園區', 'camping', 24.614719, 121.522632, '宜蘭市嵐峰路三段326巷2號2樓之1', '宜蘭縣大同鄉 — 未登記露營場', '0920154207', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲端紅土咖啡露營區', 'camping', 24.69228006, 121.6064993, '宜蘭縣大同鄉崙埤村5鄰朝陽3-1號', '宜蘭縣大同鄉 — 未登記露營場', '0911835587', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一山半水露營區', 'camping', 24.62174162, 121.703894, '宜蘭縣大同鄉寒溪巷68之9號', '宜蘭縣大同鄉 — 未登記露營場', '0916937663', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亞爸的山', 'camping', 24.41681178, 121.3672426, '泰雅路七段363之1號', '宜蘭縣大同鄉 — 未登記露營場', '0976385026', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('宇世格爵露營區', 'camping', 24.59361296, 121.5361266, '宜蘭縣大同鄉樂水村碼崙路90巷16號', '宜蘭縣大同鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('秘密基地露營區', 'camping', 24.661397, 121.566116, '宜蘭縣大同鄉泰雅路二段88巷211-9號.', '宜蘭縣大同鄉 — 未登記露營場', '0976521583', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夏諾營', 'camping', 24.66304711, 121.5887417, '宜蘭縣大同鄉泰雅路二段33巷31號之7', '宜蘭縣大同鄉 — 未登記露營場', '0939124993', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哇吉散露營區', 'camping', 24.62715, 121.560853, '泰雅一路牛鬥81之1號', '宜蘭縣大同鄉 — 未登記露營場', '0912094473', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛亞蘭露營區', 'camping', 24.538569, 121.455694, '泰雅路五段46號', '宜蘭縣大同鄉 — 未登記露營場', '0988066912', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大同圓頂360露營區', 'camping', 24.6802, 121.595035, '267宜蘭縣大同鄉Unnamed Rd', '宜蘭縣大同鄉 — 未登記露營場', '0933772874', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('太平山森活趣渡假農場', 'camping', 24.5227352, 121.4474264, '泰雅路六段2巷6-3號', '宜蘭縣大同鄉 — 未登記露營場', '0922497473', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原最露營場', 'camping', 24.66395665, 121.5771887, '泰雅路2段46巷118-25號', '宜蘭縣大同鄉 — 未登記露營場', '0926261041', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪崙菓園親子露營區', 'camping', 24.604367, 121.543363, '樂水路20巷150-1號', '宜蘭縣大同鄉 — 未登記露營場', '0901228833', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('歐浪哈勇露營區', 'camping', 24.60985707, 121.6820979, '宜蘭縣大同鄉華興巷1-61號', '宜蘭縣大同鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星光山夜露營區', 'camping', 24.610982, 121.689319, '寒溪村寒溪巷71-6號', '宜蘭縣大同鄉 — 未登記露營場', '0921956430', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐野露營區', 'camping', 24.650488, 121.569051, '宜蘭縣大同鄉泰雅路二段92巷99-1號', '宜蘭縣大同鄉 — 未登記露營場', '0922157971', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五葉松林休閒露營區', 'camping', 24.66435533, 121.5923908, '宜蘭縣大同鄉松羅村泰雅路二段33巷31-1號', '宜蘭縣大同鄉 — 未登記露營場', '0927806958', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹杯杯館', 'camping', 24.613557, 121.685643, '267039宜蘭縣大同鄉華興巷1-7號', '宜蘭縣大同鄉 — 未登記露營場', '0922633488', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('幸福城景觀露營區', 'camping', 24.666572, 121.584639, '大同鄉泰雅路二段29巷58-6號', '宜蘭縣大同鄉 — 未登記露營場', '0935668316,0966637131', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田野森農場Morilife', 'camping', 24.63403718, 121.7206899, '大進二路246號', '宜蘭縣冬山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松櫻秘境', 'camping', 24.61960877, 121.7259401, '宜蘭縣冬山鄉中山路768巷28號-1號', '宜蘭縣冬山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('峇里島漫活民宿', 'camping', 24.64111335, 121.7799427, '宜蘭縣冬山鄉永和路160號', '宜蘭縣冬山鄉 — 未登記露營場', '0972720508', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天ㄟ藝文露營區', 'camping', 24.64583936, 121.7325582, '宜蘭縣冬山鄉', '宜蘭縣冬山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('舊寮之心', 'camping', 24.627531, 121.74247, '宜蘭縣冬山鄉舊寮路131巷37號', '宜蘭縣冬山鄉 — 未登記露營場', '0937161773', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('又想露營趣', 'camping', 24.614275, 121.794337, '269宜蘭縣冬山鄉照安一路360之1號', '宜蘭縣冬山鄉 — 未登記露營場', '0911963012', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('LoopLand 露營度假村', 'camping', 24.6344434, 121.7664169, '宜蘭縣冬山鄉寶修路86號', '宜蘭縣冬山鄉 — 未登記露營場', '039901133', 'https://loopland.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('同樂休閒綠園道', 'camping', 24.780464, 121.737832, '宜蘭縣宜蘭市梅洲二路60號', '宜蘭縣宜蘭市 — 未登記露營場', '039330000', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白雲楓香露營區', 'camping', 24.331821, 121.751113, '宜蘭縣南澳鄉澳花村和平路9巷21-1號.', '宜蘭縣南澳鄉 — 未登記露營場', '0925009068', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露境東岳', 'camping', 24.525425, 121.834061, '宜蘭縣南澳鄉蘇花路5段1巷5之1號', '宜蘭縣南澳鄉 — 未登記露營場', '039616866', 'https://www.camping085.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('依山傍水露營場', 'camping', 24.32962677, 121.7698373, '新北市板橋區漢生東路193巷42號', '宜蘭縣南澳鄉 — 未登記露營場', '0903071039', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('BULABULA.KC布拉布拉露營區(原八福原地)', 'camping', 24.526896, 121.832341, '宜蘭縣南澳鄉81巷', '宜蘭縣南澳鄉 — 未登記露營場', '0919182697', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金洋山豬露營區', 'camping', 24.42851901, 121.7484964, '宜蘭縣南澳鄉博愛路14之1號', '宜蘭縣南澳鄉 — 未登記露營場', '0988088203', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天涯九號露營區', 'camping', 24.44678922, 121.7639237, '橫山路13-16號', '宜蘭縣南澳鄉 — 未登記露營場', '0921040936', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Myasa 迷雅薩農場', 'camping', 24.46387595, 121.7866997, '宜蘭縣南澳鄉中正路9號', '宜蘭縣南澳鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金岳秘境露營區', 'camping', 24.46939277, 121.765132, '宜蘭縣南澳鄉金岳村鹿皮路5-3號', '宜蘭縣南澳鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('友露溪谷露營區', 'camping', 24.46552743, 121.7770993, '宜蘭縣南澳鄉金岳村6鄰鹿皮路6之2號', '宜蘭縣南澳鄉 — 未登記露營場', '0970161388', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老柯農莊', 'camping', 24.42529781, 121.7453136, '宜蘭縣南澳鄉金洋村博愛路18-1號', '宜蘭縣南澳鄉 — 未登記露營場', '0919283363', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瀧雲山莊露營區(伊娜達漾)', 'camping', 24.44064626, 121.7633494, '武塔村橫山路13-7號', '宜蘭縣南澳鄉 — 未登記露營場', '0910057727', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿皮山水露營區', 'camping', 24.46582355, 121.7613752, '金岳村鹿皮路3號', '宜蘭縣南澳鄉 — 未登記露營場', '0932070136', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('摩諾營地', 'camping', 24.4377, 121.749566, '宜蘭縣南澳鄉金洋村金洋路2之2號', '宜蘭縣南澳鄉 — 未登記露營場', '0934282298', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春風谷露營區', 'camping', 24.48727972, 121.7759126, '宜蘭縣南澳鄉金岳路98-28號', '宜蘭縣南澳鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雙連埤露營區', 'camping', 24.75466152, 121.6383692, '宜蘭縣員山鄉雙埤路19-5號', '宜蘭縣員山鄉 — 未登記露營場', '0953028886', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花間露休閒露營區', 'camping', 24.69622989, 121.6179393, '長嶺路131號', '宜蘭縣員山鄉 — 未登記露營場', '0922118665', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山門共享基地露營場', 'camping', 24.71413235, 121.7018759, '宜蘭縣員山鄉深福路128號', '宜蘭縣員山鄉 — 未登記露營場', '0986669856', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('宜蘭深溝_車宿_露營', 'camping', 24.72226461, 121.7252656, '宜蘭縣員山鄉惠深二路一段82-8號', '宜蘭縣員山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鵲子山露營地', 'camping', 24.856751, 121.773996, '宜蘭縣頭城鎮北宜路二段71巷60號', '宜蘭縣頭城鎮 — 未登記露營場', '0919900262', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山海匯靜思露營區', 'camping', 24.868124, 121.804526, '宜蘭縣頭城鎮福德坑路5-1號', '宜蘭縣頭城鎮 — 未登記露營場', '0925590329', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('得天露營車', 'camping', 24.82647306, 121.7568719, '五峰路69號', '宜蘭縣礁溪鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('跑馬古道露營區', 'camping', 24.84369768, 121.7768363, '宜蘭縣礁溪鄉白石腳路61號', '宜蘭縣礁溪鄉 — 未登記露營場', '039886232', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉林奇蹟', 'camping', 24.815089, 121.696394, '262宜蘭縣礁溪鄉二結路94號', '宜蘭縣礁溪鄉 — 未登記露營場', '0958636633', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露樹露營區(原白石腳露營區)', 'camping', 24.838186, 121.780796, '宜蘭縣羅東鎮河濱路30巷13號', '宜蘭縣礁溪鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('926露營基地', 'camping', 24.817127, 121.697139, '宜蘭縣礁溪鄉匏崙村匏杓崙路150之50號', '宜蘭縣礁溪鄉 — 未登記露營場', '0937162068', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('無憂花露營區', 'camping', 24.8431368, 121.7751629, '宜蘭縣礁溪鄉白石腳路157巷88號', '宜蘭縣礁溪鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('充電莊', 'camping', 24.808826, 121.696143, '宜蘭縣礁溪鄉匏崙村匏杓崙路150-8號', '宜蘭縣礁溪鄉 — 未登記露營場', '0919347289', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橘子園露營區', 'camping', 24.84035646, 121.7815742, '宜蘭縣礁溪鄉白石腳路55號', '宜蘭縣礁溪鄉 — 未登記露營場', '0919934039', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Lemon Tree 檸檬樹露營區', 'camping', 24.786678, 121.749328, '宜蘭縣礁溪鄉龍潭路172巷16號.', '宜蘭縣礁溪鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('睡海邊露營區', 'camping', 24.516189, 121.836179, '宜蘭縣蘇澳鎮東澳路121巷25號', '宜蘭縣蘇澳鎮 — 未登記露營場', '0932090655', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東豐露營區', 'camping', 23.33629541, 121.339579, '花蓮縣玉里鎮', '花蓮縣玉里鎮 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('奇蹟露營農場', 'camping', 24.13824392, 121.6052922, '花蓮縣秀林鄉', '花蓮縣秀林鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('佐倉高地', 'camping', 24.01217689, 121.5521466, '花蓮縣秀林鄉', '花蓮縣秀林鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花蓮彩虹屋露營區', 'camping', 24.15548699, 121.6539445, '花蓮縣秀林鄉', '花蓮縣秀林鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巴罕營家-清水斷崖露營', 'camping', 24.15979129, 121.6595264, '花蓮縣秀林鄉', '花蓮縣秀林鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('崇德瀅農場', 'camping', 24.14805584, 121.6616882, '花蓮縣秀林鄉', '花蓮縣秀林鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('悠悠太魯閣露營村', 'camping', 24.12415759, 121.6285692, '花蓮縣秀林鄉', '花蓮縣秀林鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('羅山露營區', 'camping', 23.20195695, 121.2767821, '花蓮縣富里鄉', '花蓮縣富里鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('海憩露營區', 'camping', 24.10949667, 121.6286149, '花蓮縣新城鄉', '花蓮縣新城鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('踏浪星辰露營區', 'camping', 24.02598126, 121.6318777, '花蓮縣新城鄉', '花蓮縣新城鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('後山星月', 'camping', 23.87584798, 121.5594781, '花蓮縣壽豐鄉', '花蓮縣壽豐鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('牛山呼庭休閒園區', 'camping', 23.76368938, 121.5691587, '花蓮縣壽豐鄉', '花蓮縣壽豐鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹽寮民宿露營區', 'camping', 23.91558495, 121.6034411, '花蓮縣壽豐鄉', '花蓮縣壽豐鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花蓮海洋露營區', 'camping', 23.92234916, 121.6069405, '大橋30之6號', '花蓮縣壽豐鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('磯崎好聚落高山森林基地', 'camping', 23.68454234, 121.5468559, '花蓮縣豐濱鄉', '花蓮縣豐濱鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('海浪 Cafe 露營區', 'camping', 23.54074952, 121.5068962, '花蓮縣豐濱鄉', '花蓮縣豐濱鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('洞九的山莊', 'camping', 23.9558857, 120.8226572, '清水村頂坑巷12號', '南投縣中寮鄉 — 未登記露營場', '0932561535', 'https://www.facebook.com/Kuo009/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長壽天然農場露營區', 'camping', 23.9151358, 120.8143417, '永樂路158號', '南投縣中寮鄉 — 未登記露營場', '0972952039', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲峯景觀莊園(雲の景觀莊園)', 'camping', 23.939829, 120.825115, '清水村瀧林巷35-13號', '南投縣中寮鄉 — 未登記露營場', '0937767367', 'http://yunfeng2015.blogspot.tw/?m=1', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('賞星月慕露營區', 'camping', 23.8955372, 120.7818953, '南投縣中寮鄉復興村復興巷31-12號旁', '南投縣中寮鄉 — 未登記露營場', '0932057655', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森呼吸', 'camping', 23.9245307, 120.8133036, '合興村永樂路201號', '南投縣中寮鄉 — 未登記露營場', '0936313139', 'https://www.facebook.com/profile.php?id=100064168291942', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('本之山農場(本之山露營區)', 'camping', 23.88733, 120.75952, '愛鄉巷39-25號', '南投縣中寮鄉 — 未登記露營場', '0912579478', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲淡風清營地', 'camping', 23.9386587, 120.7983336, '瀧淋巷 81-8 號', '南投縣中寮鄉 — 未登記露營場', '0932596277', 'https://www.facebook.com/clear818/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鶴里翁露營區', 'camping', 23.9415135, 120.7684353, '南投縣中寮鄉龍南路151-20號', '南投縣中寮鄉 — 未登記露營場', '0932658049', 'https://www.easycamp.com.tw/Store_2312.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('心花露FUN露營區', 'camping', 23.9367015, 120.8083164, '清水村瀧林巷56號', '南投縣中寮鄉 — 未登記露營場', NULL, 'https://www.facebook.com/profile.php?id=100063906461448', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('潺潺森活', 'camping', 23.9055349, 120.8005562, '仙洞巷39-8 號', '南投縣中寮鄉 — 未登記露營場', '0935080173', 'https://www.facebook.com/Zen.Life.Camping.398/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('依星生態農場', 'camping', 23.96077, 120.83453, '清水村頂坑巷1-1號', '南投縣中寮鄉 — 未登記露營場', '0932631420', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('腸寶圖露營農場', 'camping', 23.88115, 120.8036, '福盛村福山路149號', '南投縣中寮鄉 — 未登記露營場', '0932691802', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('言葉之庭露營區', 'camping', 23.9007125, 120.8062038, '永樂路134之2號', '南投縣中寮鄉 — 未登記露營場', '0921742387', 'https://campground-227.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('舞蝶到了露營區', 'camping', 23.87292, 120.78514, '永平路100-36號', '南投縣中寮鄉 — 未登記露營場', '0939881231', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('海豚星露營區(疑似為晨星露營區遷址前舊名)', 'camping', 23.910725, 120.811106, '南投縣中寮鄉永樂路165-8號', '南投縣中寮鄉 — 未登記露營場', '0980554443', 'https://facebook.com/home.php?_rdr', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橋頭溪畔露營區', 'camping', 23.9108014, 120.8109905, '永樂路165-8號', '南投縣中寮鄉 — 未登記露營場', '0933166997', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迷露1850(原青青草原露營客棧)', 'camping', 24.059529, 121.168031, '仁和路179-5號', '南投縣仁愛鄉 — 未登記露營場', '0492563802', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('士官長露營區', 'camping', 24.0237664, 121.1694974, '南投縣仁愛鄉虎門巷68號', '南投縣仁愛鄉 — 未登記露營場', '0911237824', 'https://www.facebook.com/yong0809', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('波露克爾咖啡露營棧(瑪羅伊休息站)', 'camping', 23.9678726, 121.1199891, '南投縣仁愛鄉大安路107號', '南投縣仁愛鄉 — 未登記露營場', '0912998686', 'https://www.facebook.com/ï¼E6ï¼B3ï¼A2ï¼E9ï¼9Cï¼B2ï¼E5ï¼85ï¼8Bï¼E7ï¼88ï¼BEï¼E5ï¼92ï¼96ï¼E5ï¼95ï¼A1ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E6ï¼A3ï¼A7-1191360597651327/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花鳥蟲鳴高山露營區', 'camping', 24.07446, 121.17148, '大同村博望巷30-2號', '南投縣仁愛鄉 — 未登記露營場', '0913953559', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂中原', 'camping', 24.0542975, 120.9801336, '原名路43附7號', '南投縣仁愛鄉 — 未登記露營場', '0987375536', 'https://www.facebook.com/happy.m0918123472/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('舒谷露營區', 'camping', 24.03042, 121.17279, '無', '南投縣仁愛鄉 — 未登記露營場', '0921353385', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘋果園景觀露營區', 'camping', 24.0673, 121.16662, '仁和路224附1號', '南投縣仁愛鄉 — 未登記露營場', '0907327935', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武界開心茶園', 'camping', 23.9128887, 121.0244494, '南投縣仁愛鄉法治村茶園巷18-1號', '南投縣仁愛鄉 — 未登記露營場', NULL, 'https://www.facebook.com/teaplantation/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溪寶梅園', 'camping', 24.0745462, 120.9511918, '明月巷95-1號', '南投縣仁愛鄉 — 未登記露營場', '0968285158', 'https://www.facebook.com/sbmy496/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪莉溫泉休閒農莊', 'camping', 24.024158, 121.163843, '虎門巷100號', '南投縣仁愛鄉 — 未登記露營場', '0919695384', 'https://www.facebook.com/marryonshine681201/?fref=ts', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('灥流露營區', 'camping', 24.0377646, 121.1581278, '南投縣仁愛鄉壽亭巷20-2號', '南投縣仁愛鄉 — 未登記露營場', '0915919557', 'https://www.my-camp.com.tw/index.php', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('愛和華林園', 'camping', 24.0470246, 121.1588962, '遠定村39號', '南投縣仁愛鄉 — 未登記露營場', '0933450225', 'https://www.facebook.com/AiHeHuaLinYuan/?locale2=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('圓山5號露營區', 'camping', 23.9153274, 121.0510812, '武安路716之1號', '南投縣仁愛鄉 — 未登記露營場', '0986537921', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('賽德克公主美食文化露營區', 'camping', 24.0127762, 121.0888527, '南投縣仁愛鄉松原巷78-1號', '南投縣仁愛鄉 — 未登記露營場', '0980618781', 'https://www.facebook.com/mm0492920288/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('姥姥莊園', 'camping', 24.08143, 120.994, '山林巷6號', '南投縣仁愛鄉 — 未登記露營場', '0910593942', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('採茶媽媽景觀露營區', 'camping', 23.98964, 121.10077, '無', '南投縣仁愛鄉 — 未登記露營場', '0912901038', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清境陽光露營', 'camping', 24.0358621, 121.154192, '榮光巷50號之5', '南投縣仁愛鄉 — 未登記露營場', '0953990559', 'https://www.facebook.com/profile.php?id=100057676568784', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('部落尋奇溫泉農場', 'camping', 24.0268603, 121.1701913, '南投縣仁愛鄉虎門巷80號', '南投縣仁愛鄉 — 未登記露營場', '0492803076', 'http://0492803076.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿霞露營區', 'camping', 24.16305, 121.1805, '溫泉巷1號', '南投縣仁愛鄉 — 未登記露營場', '0910775540', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('朵娜朵露營區donato glamping', 'camping', 24.04493984, 121.159261, '定遠新村25之3附1', '南投縣仁愛鄉 — 未登記露營場', '0980717623', 'https://booking.owlting.com/donatoglamping?start=2024-05-30%C3%AF%C2%BC%C2%86end%3D2024-05-31%C3%AF%C2%BC%C2%86adult%3D2%C3%AF%C2%BC%C2%86source%3Dgha%C3%AF%C2%BC%C2%86child%3D0%C3%AF%C2%BC%C2%86infant%3D0%C3%AF%C2%BC%C2%86lang%3Dzh_TW&lang=zh_TW&adult=1&child=0&infant=0', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('虹谷有機農場', 'camping', 23.9429587, 121.0772526, '清華巷124之2號', '南投縣仁愛鄉 — 未登記露營場', '0933626865', 'https://www.facebook.com/hongku97/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藍瑪司露營地', 'camping', 23.967957, 121.120101, '親愛村大安路107附2號', '南投縣仁愛鄉 — 未登記露營場', '0978175585', 'https://www.facebook.com/lamasu.camp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('靼靶嶺森林露營區', 'camping', 23.8911409, 121.0524871, '南投縣仁愛鄉', '南投縣仁愛鄉 — 未登記露營場', '0912687986', 'https://www.facebook.com/ï¼E9ï¼9Fï¼83ï¼E9ï¼9Dï¼BCï¼E5ï¼B6ï¼BAï¼E6ï¼A3ï¼AEï¼E6ï¼9Eï¼97ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-651519245024665/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬赫坡9號秘境(原馬赫坡露營區)', 'camping', 24.01666, 121.18733, '溫泉馬赫坡路9號精英村廬山', '南投縣仁愛鄉 — 未登記露營場', '0921066250', 'http://www.mahebo.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黑米咖啡露營區', 'camping', 23.96976, 121.0924187, '無', '南投縣仁愛鄉 — 未登記露營場', '0905268975', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露野森林SNUWING', 'camping', 24.02432, 121.15627, '春陽村龍山巷25號', '南投縣仁愛鄉 — 未登記露營場', '0939646963', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松林農場露營區', 'camping', 24.02377, 121.16589, '春陽村虎門巷96附1號', '南投縣仁愛鄉 — 未登記露營場', '0937219924', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('合歡仙境民宿露營區', 'camping', 24.0588283, 121.1451034, '南投縣仁愛鄉福壽路介壽巷40號', '南投縣仁愛鄉 — 未登記露營場', '0492801633', 'https://www.facebook.com/lovecampingeveryday/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('畢祿山水源營地', 'camping', 24.2043518, 121.3403014, '820線林道', '南投縣仁愛鄉 — 未登記露營場', '0495991195', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武界觀景茶園露營區', 'camping', 23.9183867, 121.0246882, '南投縣仁愛鄉茶園巷17附2號', '南投縣仁愛鄉 — 未登記露營場', '0966417299', 'https://www.facebook.com/cherlene0821', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溫莎花園民宿', 'camping', 24.0748894, 121.170823, '南投縣仁愛鄉大同村博望巷39號', '南投縣仁愛鄉 — 未登記露營場', '0988105968', 'https://www.facebook.com/profile.php?id=100069794288041', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日出藏雲', 'camping', 23.9841, 121.10474, '親和巷43之3附3號', '南投縣仁愛鄉 — 未登記露營場', '0928278267', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('非比露營區', 'camping', 23.9832, 121.103968, '高峰巷70號', '南投縣仁愛鄉 — 未登記露營場', '0910922276', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('歐敏露營區(原酋長茅蘆露營區)', 'camping', 24.023568, 121.1903066, '南投縣仁愛鄉榮華巷50號', '南投縣仁愛鄉 — 未登記露營場', '0492802939', 'https://www.facebook.com/om423/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬赫坡森林咖啡民宿', 'camping', 24.0230869, 121.1834834, '南投縣仁愛鄉榮華巷1-1號', '南投縣仁愛鄉 — 未登記露營場', '0917777705', 'http://www.mahebo.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武界雲頂露營天地', 'camping', 23.9174753, 121.0247449, '南投縣仁愛鄉法治村茶園巷17-1號', '南投縣仁愛鄉 — 未登記露營場', '0932615574', 'http://gentingcampground.wixsite.com/genting-wujie', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('月夢田', 'camping', 24.07967, 120.9896, '山林巷6-2號', '南投縣仁愛鄉 — 未登記露營場', '0910566765', 'https://www.facebook.com/YMTBandB/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山上有魚', 'camping', 24.06474, 120.95513, '清風路', '南投縣仁愛鄉 — 未登記露營場', '0975120340', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('芭喇露營區生態休閒農莊', 'camping', 23.9069458, 121.0520012, '武界林道', '南投縣仁愛鄉 — 未登記露營場', '0905112883', 'https://www.facebook.com/p/%E8%8A%AD%E5%96%87%E9%9C%B2%E7%87%9F%E5%8D%80%E7%94%9F%E6%85%8B%E8%BE%B2%E5%A0%B4-100063518425704/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沙庫斯露營區', 'camping', 24.0164984, 121.1892008, '精英村榮華巷202-2號', '南投縣仁愛鄉 — 未登記露營場', '0911613026', 'https://www.facebook.com/SakusLuYingQu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('螢營的天空', 'camping', 24.0367618, 121.1516304, '榮光巷1附2號', '南投縣仁愛鄉 — 未登記露營場', '0901005861', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原夢觀光農園', 'camping', 24.013965, 121.0894206, '松原巷80號', '南投縣仁愛鄉 — 未登記露營場', '0987239826', 'https://www.facebook.com/wef2759k/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('曉山秋', 'camping', 23.96501, 121.09093, '親愛村親和巷150附5號', '南投縣仁愛鄉 — 未登記露營場', '0966598362', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛瀑露營區feipucamping', 'camping', 24.03253656, 121.1117121, '南豐村中正路1-1號', '南投縣仁愛鄉 — 未登記露營場', '0965658566', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達巴斯露營區', 'camping', 23.908737, 121.0517349, '栗溪路1號', '南投縣仁愛鄉 — 未登記露營場', '0966712612', 'http://www.facebook.com/Dabas.2015', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('旅人蕉小棧(旅人蕉露營區)', 'camping', 24.06751, 120.95352, '明月巷1附1號', '南投縣仁愛鄉 — 未登記露營場', '0982001602', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青天樂活露營區', 'camping', 23.9175, 121.047642, '界山巷6之1號', '南投縣仁愛鄉 — 未登記露營場', '0492977258', 'https://www.facebook.com/people/%E9%9D%92%E5%A4%A9%E6%A8%82%E6%B4%BB%E9%9C%B2%E7%87%9F%E5%8D%80/100054638490687/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲窩森林露營區', 'camping', 23.9238772, 121.0513508, '茶園巷1附2號', '南投縣仁愛鄉 — 未登記露營場', '0978377711', 'https://www.facebook.com/p/%E6%AD%A6%E7%95%8C-%E9%9B%B2%E7%AA%A9%E6%A3%AE%E6%9E%97%E9%9C%B2%E7%87%9F%E5%8D%80-100070202198717/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星空谷露營地', 'camping', 23.8901308, 120.9890694, '中正村平等巷1號', '南投縣仁愛鄉 — 未登記露營場', '0901005861', 'https://campground-94.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('漫活幸福露營區', 'camping', 24.1192901, 121.1551857, '發祥村7鄰光復巷199附2號', '南投縣仁愛鄉 — 未登記露營場', '0932521031', 'https://www.facebook.com/happy99camp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('伴天聊露營區', 'camping', 24.0839351, 120.990465, '新生村山林巷18附1號', '南投縣仁愛鄉 — 未登記露營場', '0936964799', 'https://www.facebook.com/BTL1116/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('卡度6號角落', 'camping', 23.9109, 120.983925, '中正村光明路102-6號', '南投縣仁愛鄉 — 未登記露營場', '0970312818', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('紅香露營區', 'camping', 24.145841, 121.178008, '發祥村溪門巷19-1號', '南投縣仁愛鄉 — 未登記露營場', '0935685389', 'https://www.facebook.com/gpo8001i/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('玩皮獵人藝棧', 'camping', 24.0193725, 121.0870871, '無', '南投縣仁愛鄉 — 未登記露營場', '0492920089', 'https://alanhunter.weebly.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('諾亞方舟野地露營區', 'camping', 24.0273294, 121.1439148, '南投縣仁愛鄉信義巷30之6號', '南投縣仁愛鄉 — 未登記露營場', '0492803470', 'http://www.facebook.com/noahark597', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('博拉廬露營區', 'camping', 24.0305203, 121.1972274, '榮華巷203-3號', '南投縣仁愛鄉 — 未登記露營場', '0937248996', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('築露中原露營區', 'camping', 24.0661482, 120.9778531, '原名路43附2號', '南投縣仁愛鄉 — 未登記露營場', '0932976796', 'https://www.facebook.com/jimmy4128/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('太魯灣溫泉露營區', 'camping', 24.0229731, 121.1669268, '虎門巷97附1號', '南投縣仁愛鄉 — 未登記露營場', '0928177926', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山林好蒔光', 'camping', 23.9895278, 121.1078327, '高峰巷70附1號', '南投縣仁愛鄉 — 未登記露營場', '0918575357', 'https://www.facebook.com/slhsg514/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白熊屋', 'camping', 24.0449, 121.1608, '大同村定遠新村30-1號', '南投縣仁愛鄉 — 未登記露營場', '0936265411', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春陽.觀休閒露營區(觀溫泉營地)', 'camping', 24.02618, 121.16926, '虎門巷135號', '南投縣仁愛鄉 — 未登記露營場', '0935755444', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('德貝頌露營區', 'camping', 24.1242696, 121.1621104, '南投縣仁愛鄉瑞和路64號', '南投縣仁愛鄉 — 未登記露營場', '0935996150', 'https://www.facebook.com/TbsunCampArea/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樹不老露營區', 'camping', 24.0766317, 120.9852215, '山林巷46附2號', '南投縣仁愛鄉 — 未登記露營場', '0912648626', 'https://www.facebook.com/lmosay/?modal=admin_todo_tour', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清翠露營園區', 'camping', 24.03927373, 121.1462194, '大同村信義巷38附2號', '南投縣仁愛鄉 — 未登記露營場', '0933539638', 'https://www.facebook.com/highmountaincamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('來來圓夢露營區DreamerCamp', 'camping', 23.90332, 120.99043, '無', '南投縣仁愛鄉 — 未登記露營場', '0935926921', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('辣妹子露營區', 'camping', 24.0282169, 121.1605948, '虎門巷61-3號', '南投縣仁愛鄉 — 未登記露營場', '0939713335', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迦南之地露營區', 'camping', 23.90854, 121.04081, '投71鄉道34號', '南投縣仁愛鄉 — 未登記露營場', '0988785051', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('木谷森林', 'camping', 23.9988, 121.07969, '中正路105號', '南投縣仁愛鄉 — 未登記露營場', '0963169865', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武界快樂營區', 'camping', 23.93041, 121.03515, '無', '南投縣仁愛鄉 — 未登記露營場', '0937262954', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夢谷伊優達雅露營區', 'camping', 24.019468, 121.087227, '信義巷', '南投縣仁愛鄉 — 未登記露營場', '0921920593', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('富野溪露營區(原熊溯溪露營區)', 'camping', 24.06312, 120.97975, '原名路43附5號', '南投縣仁愛鄉 — 未登記露營場', '0905865286', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('滿天馨露營區', 'camping', 24.02052, 121.13676, '仁和路', '南投縣仁愛鄉 — 未登記露營場', '0982836007', 'https://www.facebook.com/mtx0982836007/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森林烈人', 'camping', 23.918829, 121.046008, '茶園巷1附4號', '南投縣仁愛鄉 — 未登記露營場', '0975706651', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清流溪畔露營區', 'camping', 24.0720293, 120.9496957, '明月巷95-1附2號', '南投縣仁愛鄉 — 未登記露營場', '0933334966', 'https://www.facebook.com/groups/211833692566166/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大塊森林', 'camping', 24.0797723, 120.9873531, '南投縣仁愛鄉山林巷54618號附2', '南投縣仁愛鄉 — 未登記露營場', '0975277399', 'https://www.facebook.com/DakuaiForest', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('相逢部落露營區', 'camping', 23.89464071, 120.9908738, '平等巷1-10號', '南投縣仁愛鄉 — 未登記露營場', '0967046031', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('卑里露營區', 'camping', 24.0237511, 121.1629367, '南投縣仁愛鄉虎門巷100號', '南投縣仁愛鄉 — 未登記露營場', '0988957788', 'https://www.facebook.com/beli0963422209', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('川中島落羽松露營祕境', 'camping', 24.070265, 120.947725, '清風路27-1號', '南投縣仁愛鄉 — 未登記露營場', '0938227885', 'https://www.facebook.com/pjb3143v/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清流明月星空民宿/露營區', 'camping', 24.0957274, 120.9549952, '明月巷100號', '南投縣仁愛鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小太陽景觀木屋', 'camping', 24.0604489, 121.172597, '仁和路179號', '南投縣仁愛鄉 — 未登記露營場', '0492803861', 'http://suncabane.nantou.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('62階櫻花露營區', 'camping', 24.0536182, 121.1607686, '南投縣仁愛鄉仁和路186之5附1號', '南投縣仁愛鄉 — 未登記露營場', '0937916296', 'https://www.facebook.com/flowericamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈爾斯塔特露營區', 'camping', 24.04094, 121.15753, '無', '南投縣仁愛鄉 — 未登記露營場', '0928514215', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山鷹露營區', 'camping', 24.07411, 120.9498, '明月巷95之1附2號', '南投縣仁愛鄉 — 未登記露營場', '0974188318', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('廬山仙境溫泉會館', 'camping', 24.0214127, 121.1898409, '南投縣仁愛鄉榮華巷40附1號', '南投縣仁愛鄉 — 未登記露營場', '0910577192', 'https://www.facebook.com/profile.php?id=100057842881552', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一家人露營區', 'camping', 24.0273801, 121.1438336, '南投縣仁愛鄉信義巷30-6附1', '南投縣仁愛鄉 — 未登記露營場', '0939564307', 'https://www.facebook.com/familycampsite/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('畫眉園露營區', 'camping', 24.077213, 120.9866307, '山林巷10號', '南投縣仁愛鄉 — 未登記露營場', '0988720902', 'https://facebook.com/huameiyuan/?locale2=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('曲冰岱牧露營區(曲冰金龍露營區)', 'camping', 23.934111, 121.075358, '萬豐村清華巷138附3號', '南投縣仁愛鄉 — 未登記露營場', '0910622069', 'http://www.facebook.com/goGDcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('櫻花村民宿', 'camping', 24.0255953, 121.1634681, '南投縣仁愛鄉虎門巷54之1號', '南投縣仁愛鄉 — 未登記露營場', '0910583572', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五六露營農場', 'camping', 24.01341, 121.11941, '仁和路1附3號', '南投縣仁愛鄉 — 未登記露營場', '0982188005', 'https://www.facebook.com/56camping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夢谷瀑布露營區', 'camping', 24.020343, 121.087199, '無', '南投縣仁愛鄉 — 未登記露營場', '0980618781', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星願村露營區(原川中島七里香露營區)', 'camping', 24.0766283, 120.9518223, '明月巷95之1附1號', '南投縣仁愛鄉 — 未登記露營場', '0931364697', 'https://www.facebook.com/wishcamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('廬山日記露營區', 'camping', 24.01619788, 121.1890371, '精英村榮華巷153號', '南投縣仁愛鄉 — 未登記露營場', '0932789816', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清境彩虹露營區', 'camping', 24.0326004, 121.1549755, '南投縣仁愛鄉大同村信義巷39附2號', '南投縣仁愛鄉 — 未登記露營場', '0909377797', 'https://www.facebook.com/rainbowcampsite/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彌格的露營區', 'camping', 23.91314716, 121.0470913, '武安路22附3號', '南投縣仁愛鄉 — 未登記露營場', '0985883266', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('曲冰嫚遊露營區(里格列營地)', 'camping', 23.928099, 121.071538, '萬豐村10鄰清華巷148附1號', '南投縣仁愛鄉 — 未登記露營場', '0905182807', 'https://www.facebook.com/abis777/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲裳谷露營區', 'camping', 24.06597, 120.9481, '清風路27附8號', '南投縣仁愛鄉 — 未登記露營場', '0978903260', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙境傳說景觀露營區', 'camping', 24.0147835, 121.1291571, '高峰巷70號', '南投縣仁愛鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田心小營地', 'camping', 24.06757, 120.97106, '互助村原名路136附1號', '南投縣仁愛鄉 — 未登記露營場', '0977408845', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('161•森林/161•Bbuyu', 'camping', 24.04755, 120.95894, '原名路66附5號號', '南投縣仁愛鄉 — 未登記露營場', '0921707177', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武界松露露營區＆小木屋', 'camping', 23.902857, 121.047635, '武安路1附6號', '南投縣仁愛鄉 — 未登記露營場', '0911103553', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麒帆如露營山莊', 'camping', 23.9100116, 121.0483967, '武界林道投71鄉道', '南投縣仁愛鄉 — 未登記露營場', '0912648245', 'https://www.chifanru.com/?fbclid=IwAR21ELbWOZZ9h4e4jIx-0n5bFLnfFnUM7tUQdrkTf7wy7EHXhKhkZ4z6ikA', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翠峰露營區(卡爾小鎮)', 'camping', 24.1035065, 121.194702, '仁和路235號', '南投縣仁愛鄉 — 未登記露營場', '0917231233', 'https://www.okgocamping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山中流域露營區', 'camping', 23.8250558, 120.8514146, '水里五路', '南投縣水里鄉 — 未登記露營場', '0915001531', 'https://www.facebook.com/mountainrivercamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美麗水里生態園', 'camping', 23.8209636, 120.8578189, '南投縣水里鄉農富路93號', '南投縣水里鄉 — 未登記露營場', '0932890187', 'https://www.facebook.com/shuiliriver/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大灣農園露營區', 'camping', 23.8258421, 120.8632216, '南投縣水里鄉大灣路11號', '南投縣水里鄉 — 未登記露營場', '0931564808', 'https://www.facebook.com/GBFCS/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('浬賀露營區', 'camping', 23.82615, 120.86065, '水里路', '南投縣水里鄉 — 未登記露營場', '0989729138', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('采荷莊民宿', 'camping', 23.8022528, 120.8651139, '南投縣水里鄉回窯路35巷7號', '南投縣水里鄉 — 未登記露營場', '0937594655', 'https://www.facebook.com/bearloveholiday.lotusfantasy/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('邊界Boundary露營區', 'camping', 23.7527, 120.87172, '新南路', '南投縣水里鄉 — 未登記露營場', '0960087699', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南田牧野家', 'camping', 23.8661479, 120.6440585, '南投縣名間鄉籃口巷20號', '南投縣名間鄉 — 未登記露營場', '0492273581', 'http://www.muyejia2011.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春秋茶事', 'camping', 23.8245196, 120.6434239, '埔中巷32-7號', '南投縣名間鄉 — 未登記露營場', '0492581494', 'http://www.fingertea.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('茶語露親子露營區', 'camping', 23.68192, 120.73979, '無', '南投縣竹山鎮 — 未登記露營場', '0931648523', 'https://www.facebook.com/p/%E8%8C%B6%E8%AA%9E%E9%9C%B2%E8%A6%AA%E5%AD%90%E9%9C%B2%E7%87%9F%E5%8D%80-100076070085367/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露自在', 'camping', 23.6736, 120.76621, '大鞍里羊灣巷236-1號', '南投縣竹山鎮 — 未登記露營場', '0934061958', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('右下四角村', 'camping', 23.776094, 120.709922, '集山路二段892之18號', '南投縣竹山鎮 — 未登記露營場', '0492658785', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天山水茗茶', 'camping', 23.6595061, 120.7636389, '安山路35號', '南投縣竹山鎮 — 未登記露營場', '0919670956', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大鞍星空露營區', 'camping', 23.7014602, 120.7167006, '南投縣竹山鎮竹寮巷19之15號', '南投縣竹山鎮 — 未登記露營場', '0958917905', 'https://www.facebook.com/DA.starlit.campsite/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('風秀露營fog showing camping(二城禧茶)', 'camping', 23.701066, 120.73084, '南投縣鹿谷鄉中湖巷16-39號(導航地址)', '南投縣竹山鎮 — 未登記露營場', '0921301087', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲野露營區', 'camping', 23.71231, 120.71502, '中坑路318號', '南投縣竹山鎮 — 未登記露營場', '0988112366', 'https://www.facebook.com/profile.php?id=100090494427486', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大鞍松林露營區', 'camping', 23.70192, 120.72017, '竹寮巷8號', '南投縣竹山鎮 — 未登記露營場', '0921390129', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Henyea Forest Life亨野草堂', 'camping', 23.66866862, 120.7664178, '杉林溪羊灣巷250-1號', '南投縣竹山鎮 — 未登記露營場', '0918088815', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大鞍幸福農場', 'camping', 23.7118396, 120.7144582, '中坑路319號', '南投縣竹山鎮 — 未登記露營場', '0909661177', 'https://www.facebook.com/da.an2009886', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲頂星空', 'camping', 23.67904, 120.74146, '無', '南投縣竹山鎮 — 未登記露營場', '0919012345', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('深山林內', 'camping', 23.6877, 120.71511, '大鞍里頂林路累藤巷6-66號', '南投縣竹山鎮 — 未登記露營場', '0914091455', 'https://bamboo1100.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('回歸自然二八露營場', 'camping', 23.74051, 120.71872, '鹿山路606-7號', '南投縣竹山鎮 — 未登記露營場', '0921301171', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('上山樂活', 'camping', 23.6956014, 120.7191819, '頂林路461號', '南投縣竹山鎮 — 未登記露營場', '0933779848', 'http://www.lohascamp.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('江澤休閒民宿', 'camping', 23.779618, 120.67533, '南投縣竹山鎮下坪路199號', '南投縣竹山鎮 — 未登記露營場', '0980936047', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('空中邊境景觀農場', 'camping', 23.699018, 120.7133487, '大林巷16-50號', '南投縣竹山鎮 — 未登記露營場', '0492841229', 'http://skylounge.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('垂枝女貞農場', 'camping', 23.7700549, 120.6748775, '枋坪巷22-50號', '南投縣竹山鎮 — 未登記露營場', '0932558513', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹山地心谷營區（2棧）', 'camping', 23.6667, 120.73448, '大鞍里頂林路590號', '南投縣竹山鎮 — 未登記露營場', '0986332777', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('霧的羅曼史', 'camping', 23.6981434, 120.7140591, '南投縣竹山鎮頂林路累藤巷5之1號', '南投縣竹山鎮 — 未登記露營場', '0492841139', 'https://www.facebook.com/mistromance/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('湖山水庫祕境', 'camping', 23.69742, 120.64495, '鯉行路152號', '南投縣竹山鎮 — 未登記露營場', '0921655046', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('旭爸爸の窩', 'camping', 23.6565628, 120.7684007, '大鞍里安山路70-1號', '南投縣竹山鎮 — 未登記露營場', '0919724219', 'http://www.xu-baba.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迦南美地園區', 'camping', 23.7527635, 120.6919969, '中山路7之88號', '南投縣竹山鎮 — 未登記露營場', '0928224484', 'https://www.facebook.com/921cannan/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麻吉露營區', 'camping', 23.6676798, 120.7674096, '鹿谷鄉羊仔灣236號', '南投縣竹山鎮 — 未登記露營場', '0933584748', 'https://maji-camp.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉林雲境露營區', 'camping', 23.6579906, 120.7661271, '安山路41-1號', '南投縣竹山鎮 — 未登記露營場', '0975553823', 'https://evshhips.pixnet.net/blog/post/347956582', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喆閒茶園露營區', 'camping', 23.6634202, 120.7490285, '南投縣竹山鎮五寮巷6-1號', '南投縣竹山鎮 — 未登記露營場', '0965020980', 'https://www.facebook.com/profile.php?id=100054659700900', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈比露營區', 'camping', 23.8144931, 120.752848, '南投縣竹山鎮集山路一段437號', '南投縣竹山鎮 — 未登記露營場', '0966678138', 'https://www.facebook.com/groups/557529097750033/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山湖水岸', 'camping', 23.69848, 120.71456, '竹山鎮大鞍里頂林路562-5號', '南投縣竹山鎮 — 未登記露營場', '0915282578', 'https://www.facebook.com/p/%E5%B1%B1%E6%B9%96%E6%B0%B4%E5%B2%B8-100066362992945/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翠山', 'camping', 23.70374, 120.71632, '大鞍里竹寮巷1-3號', '南投縣竹山鎮 — 未登記露營場', '0932010030', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('牛母坪露營區', 'camping', 23.7002132, 120.6455855, '鲤魚里鲤行路134號', '南投縣竹山鎮 — 未登記露營場', '0933651978', 'https://www.facebook.com/cowhillcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹杉林園露營區', 'camping', 23.79618, 120.67353, '下坪里枋平巷22-100號', '南投縣竹山鎮 — 未登記露營場', '0932661128', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('里山生態農場', 'camping', 23.6839246, 120.737028, '鹿寮巷2-2號', '南投縣竹山鎮 — 未登記露營場', '0933536509', 'https://www.facebook.com/lsst432', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老茶緣露營場', 'camping', 23.7487202, 120.7132589, '鹿山路688號', '南投縣竹山鎮 — 未登記露營場', '0939592165', 'https://www.facebook.com/people/%E8%80%81%E8%8C%B6%E7%B7%A3%E9%9C%B2%E7%87%9F%E5%A0%B4/100063762317703/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹屋部落民宿', 'camping', 23.765011, 120.719071, '南投縣竹山鎮東鄉路1-67號', '南投縣竹山鎮 — 未登記露營場', '0492639161', 'https://www.facebook.com/profile.php?id=100045433947176', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山思雲想', 'camping', 23.697535, 120.7183, '大林巷16-32號', '南投縣竹山鎮 — 未登記露營場', '0921357692', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉野露營區', 'camping', 23.6564352, 120.7677144, '安山路70號', '南投縣竹山鎮 — 未登記露營場', '0932596090', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('忘憂天空露營區', 'camping', 23.7014212, 120.6922231, '南投縣竹山鎮田南巷22-2', '南投縣竹山鎮 — 未登記露營場', '0923142871', 'https://www.facebook.com/ï¼E5ï¼BFï¼98ï¼E6ï¼86ï¼82ï¼E5ï¼A4ï¼A9ï¼E7ï¼A9ï¼BAï¼E6ï¼B8ï¼A1ï¼E5ï¼81ï¼87ï¼E6ï¼9Dï¼91-1732918630360533/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹內露營區', 'camping', 23.6819712, 120.7255602, '頂林路588號55', '南投縣竹山鎮 — 未登記露營場', '0919035308', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑞櫻山莊露營區', 'camping', 23.6975026, 120.7162157, '頂林路562-3號', '南投縣竹山鎮 — 未登記露營場', '0933017038', 'https://www.facebook.com/luckysakura.villa/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('延山露營區', 'camping', 23.7323332, 120.7316827, '南投縣鹿谷鄉和雅村愛鄉路1-2號', '南投縣竹山鎮 — 未登記露營場', '0492755177', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('靜竹星空觀景露營區', 'camping', 23.7413405, 120.7174274, '鹿山路604號', '南投縣竹山鎮 — 未登記露營場', '0935397685', 'https://www.facebook.com/profile.php?id=100064171411727', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雙龍景觀營地(雙龍橋)', 'camping', 23.7856043, 120.9467607, '光復巷11-5號', '南投縣信義鄉 — 未登記露營場', '0921355088', 'https://www.facebook.com/balan001/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿里曼山莊', 'camping', 23.7990983, 120.9980809, '丹大林道舊線', '南投縣信義鄉 — 未登記露營場', '0935998957', 'https://www.facebook.com/godbless0906487675/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石方緣', 'camping', 23.79262, 120.9654, '開信巷土虱灣1-1號', '南投縣信義鄉 — 未登記露營場', '0982017628', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拿哥的秘密基地浪漫露營區', 'camping', 23.8245493, 120.9417081, '和平巷85~3號', '南投縣信義鄉 — 未登記露營場', '0985838322', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('玉山星空露營區', 'camping', 23.557782, 120.922959, '南投縣信義鄉東埔村開高巷30號', '南投縣信義鄉 — 未登記露營場', '0927788966', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('源頭溫泉民宿', 'camping', 23.5649401, 120.9324414, '開高巷61-6號', '南投縣信義鄉 — 未登記露營場', '0923100510', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪莎魯營地', 'camping', 23.7084164, 120.8533503, '玉山路117-2號', '南投縣信義鄉 — 未登記露營場', '0982369049', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪兒屋營地', 'camping', 23.6310644, 120.8812423, '信筆巷170-5號', '南投縣信義鄉 — 未登記露營場', '0928666571', 'https://bed-and-breakfast-675.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('都構密思木屋民宿', 'camping', 23.598355, 120.881031, '南投縣信義鄉望和巷10之10號', '南投縣信義鄉 — 未登記露營場', '0926698523', 'https://www.facebook.com/profile.php?id=100063650626997', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈努英餐坊營地', 'camping', 23.7923, 120.95264, '地利村開信巷18-6號', '南投縣信義鄉 — 未登記露營場', '0958184000', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山裡面的嵐卡', 'camping', 23.7943056, 120.96325, '地利村姑姑山(台16線臨29號3公里)', '南投縣信義鄉 — 未登記露營場', '0979625638', 'https://www.facebook.com/sai0326/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迪仰露營區', 'camping', 23.6006283, 120.8871606, '望和巷12-4號', '南投縣信義鄉 — 未登記露營場', '0985925488', 'http://www.facebook.com/Diang.1990', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吉娜田園露營區', 'camping', 23.6281524, 120.8829127, '信筆巷173號', '南投縣信義鄉 — 未登記露營場', '0980277042', 'https://www.facebook.com/ginaesu1125/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雙龍部落伊希岸農場露營區', 'camping', 23.7645348, 120.9473155, '無', '南投縣信義鄉 — 未登記露營場', '0963275383', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長城高山休閒農莊', 'camping', 23.7649701, 120.9388046, '雙龍村光復巷5鄰89-6號', '南投縣信義鄉 — 未登記露營場', '0937769212', 'https://www.facebook.com/ZhangChengGaoShanXiuJianNongZhuang/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吟玖鄉溫泉別館', 'camping', 23.5660195, 120.92006, '南投縣信義鄉開高巷136-2號', '南投縣信義鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森谷漫活', 'camping', 23.7857498, 121.0014116, '台16線2-1號', '南投縣信義鄉 — 未登記露營場', '0975388633', 'https://sites.google.com/site/sengumanhuo633/home', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪南吾瑪芙露營區', 'camping', 23.6070232, 120.885331, '望美村望和巷19號望鄉部落', '南投縣信義鄉 — 未登記露營場', '0935897706', 'https://www.facebook.com/profile.php?id=100064007162003', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天時農莊', 'camping', 23.7884733, 121.0013261, '河流坪', '南投縣信義鄉 — 未登記露營場', '0911798707', 'https://www.facebook.com/profile.php?id=100063827799818', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('惠源營地', 'camping', 23.628765, 120.8743957, '無', '南投縣信義鄉 — 未登記露營場', '0985599338', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('甲一仙營地', 'camping', 23.670314, 120.863095, '自強村6鄰陽和巷12號', '南投縣信義鄉 — 未登記露營場', '0492791377', 'https://www.facebook.com/pamcampsite/timeline', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小烏坵露營區', 'camping', 23.7846861, 120.9493288, '光復巷8號', '南投縣信義鄉 — 未登記露營場', '0925272388', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('法拉娜露營區', 'camping', 23.5667012, 120.920474, '南投縣信義鄉開高巷110-7號', '南投縣信義鄉 — 未登記露營場', '0923587830', 'https://www.facebook.com/profile.php?id=100054632161488', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達洛鞍休閒民宿', 'camping', 23.7979974, 120.9404075, '地利村開信巷31之6旁', '南投縣信義鄉 — 未登記露營場', '0911742386', 'http://daluoan.mmweb.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('塔古斯戶外營地', 'camping', 23.6031534, 120.8853944, '望和巷卡里布安村', '南投縣信義鄉 — 未登記露營場', '0912455489', 'https://www.facebook.com/Taqus001/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五餅二魚咖啡露營', 'camping', 23.6020664, 120.8884375, '望鄉部落聯絡道路127號', '南投縣信義鄉 — 未登記露營場', '0980110406', 'https://www.facebook.com/enjoyofcoffee/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野放巴蒂露營區', 'camping', 23.79363757, 120.9511805, '青雲路段656號', '南投縣信義鄉 — 未登記露營場', '0966525482', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Tama singhu 天使營地', 'camping', 23.7827, 120.94167, '雙龍村雙龍林道', '南投縣信義鄉 — 未登記露營場', '0939364453', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('邦谷安楠樹屋休閒營地', 'camping', 23.7872841, 120.945272, '光復巷79之8號', '南投縣信義鄉 — 未登記露營場', '0958494049', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山谷露瑪露營區', 'camping', 23.79193, 120.96807, '地利村', '南投縣信義鄉 — 未登記露營場', '0933475595', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪兒莎莎 Mal-Sa Sa 露營區', 'camping', 23.600552, 120.886752, '望美村望和巷12-3號', '南投縣信義鄉 — 未登記露營場', '0928237348', 'https://www.facebook.com/malsasa123/info?tab=page_info', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('住在玉山園', 'camping', 23.5396956, 120.9250592, '南投縣信義鄉', '南投縣信義鄉 — 未登記露營場', '0931543048', 'https://www.facebook.com/profile.php?id=100063868091304', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('久美瑪夏兒露營區', 'camping', 23.61309, 120.88347, '無', '南投縣信義鄉 — 未登記露營場', '0968325035', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('陌上冬梅露營區', 'camping', 23.6887889, 120.8637202, '新開巷11之9號', '南投縣信義鄉 — 未登記露營場', '0975790508', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('曉樂園露營區.南投住宿', 'camping', 23.945363, 120.6603699, '吉利路126號', '南投縣南投市 — 未登記露營場', '0975778598', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('心無境園區', 'camping', 23.9424079, 120.6511792, '鳳山路742號', '南投縣南投市 — 未登記露營場', '0988299922', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橫山仙境', 'camping', 23.889421, 120.633899, '南投縣南投市八卦路橫山觀日步道', '南投縣南投市 — 未登記露營場', '0978298785', 'https://www.facebook.com/anne298785/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水与松森林莊園', 'camping', 23.965349, 120.944817, '南村路9-7號', '南投縣埔里鎮 — 未登記露營場', '0976182893', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('8508高地露營區', 'camping', 23.95651498, 120.9153023, '南投縣埔里鎮種瓜路33-5號', '南投縣埔里鎮 — 未登記露營場', '0929004329', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('草湳濕地農場', 'camping', 23.9486386, 120.9150979, '種瓜路44號', '南投縣埔里鎮 — 未登記露營場', '0492915455', 'http://chiounan.okgo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('聽瀑營地', 'camping', 23.9311193, 121.0155488, '武界路33-8號', '南投縣埔里鎮 — 未登記露營場', '0932959361', 'https://m.icamping.app/store/pltbyd193', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('印象山水', 'camping', 23.95995, 120.89309, '成功里種瓜路120-9號', '南投縣埔里鎮 — 未登記露營場', '0932066835', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('茶吾此露', 'camping', 23.9579079, 120.9138034, '種瓜路33-13號', '南投縣埔里鎮 — 未登記露營場', '0968551169', 'https://www.facebook.com/teafarmlifecamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('獅象開心', 'camping', 23.939438, 120.940142, '桃米巷9-2號', '南投縣埔里鎮 — 未登記露營場', '0937291657', 'https://www.facebook.com/a88400a/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('埔里紫月樹葡萄營地', 'camping', 23.9446445, 120.9510149, '水墻巷5號', '南投縣埔里鎮 — 未登記露營場', '0912982445', 'https://pulijabuticaba.okgo.tw/?ShopID=7481', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('合成仙谷露營區', 'camping', 24.0216639, 120.9173775, '合成巷22號', '南投縣埔里鎮 — 未登記露營場', '0953461458', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('遇見東平莊薗', 'camping', 24.0330862, 120.9523112, '覆金路21之1號', '南投縣埔里鎮 — 未登記露營場', '0932539586', 'https://www.facebook.com/yjdp460/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂活森林農場', 'camping', 23.9351106, 120.9277077, '桃米路55-1號', '南投縣埔里鎮 — 未登記露營場', '0937219523', 'http://www.lohaforest.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('ToMe桃米生態露營區', 'camping', 23.943899, 120.9032391, '種瓜路66-1號', '南投縣埔里鎮 — 未登記露營場', '0930012167', 'https://www.facebook.com/tomecampsite/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('玫花露', 'camping', 24.0051808, 120.9445926, '東峰路18號', '南投縣埔里鎮 — 未登記露營場', '0912687662', 'https://www.facebook.com/groups/RoseCampsite168', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露宿Lùsù Camping', 'camping', 23.93748193, 120.903161, '水上巷25-1號', '南投縣埔里鎮 — 未登記露營場', '0975321550', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('湯尼瑪麗露營區', 'camping', 23.9561413, 120.9113494, '種瓜路', '南投縣埔里鎮 — 未登記露營場', '0933219398', 'https://www.facebook.com/Tonymarycamping', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蛙揪愛露營', 'camping', 23.9565188, 120.9106732, '種瓜路33-9號', '南投縣埔里鎮 — 未登記露營場', '0931681148', 'https://www.facebook.com/wj095506/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃米山生態露營區', 'camping', 23.9468373, 120.9016988, '種瓜路52號', '南投縣埔里鎮 — 未登記露營場', '0937262758', 'http://www.red-villa.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('顏氏牧場', 'camping', 23.9323611, 120.906349, '水上巷28號', '南投縣埔里鎮 — 未登記露營場', '0492912041', 'http://yenpasture.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍泉營地', 'camping', 23.9261682, 121.0039022, '武界路28之10號', '南投縣埔里鎮 — 未登記露營場', '0910543983', 'https://www.facebook.com/Gr.0903568521', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('農家樂露營區', 'camping', 23.9281687, 121.0095793, '麒麟里武界路35-3號', '南投縣埔里鎮 — 未登記露營場', '0963577718', 'https://www.facebook.com/kyd3201v/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水墻映月景觀露營區', 'camping', 23.944746, 120.944947, '水墻巷8-8號', '南投縣埔里鎮 — 未登記露營場', '0985845689', 'http://waterwallmoon.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麒麟岩臼苑', 'camping', 23.93447, 120.98883, '武界路7-1號', '南投縣埔里鎮 — 未登記露營場', '0921378861', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('宸羽坊衫', 'camping', 23.9465199, 120.9409692, '桃米路12-15號', '南投縣埔里鎮 — 未登記露營場', '0903853827', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('成功秘境露營場', 'camping', 23.9582029, 120.8938625, '種瓜路120-8號', '南投縣埔里鎮 — 未登記露營場', '0492910969', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福長果園露營區', 'camping', 24.0120246, 120.9748803, '福長路100 號', '南投縣埔里鎮 — 未登記露營場', '0921931984', 'https://www.facebook.com/fulong.ego.tw', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('LOLO農場-休閒露營園區', 'camping', 24.0238723, 120.9526784, '眉原路3號', '南投縣埔里鎮 — 未登記露營場', '0905224119', 'https://www.facebook.com/LOLOCamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('mushroom 山林民宿露營區', 'camping', 23.9795613, 121.009458, '中山路一段175-1號', '南投縣埔里鎮 — 未登記露營場', '0965329868', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠舍潭果農場', 'camping', 23.964508, 120.9993608, '無', '南投縣埔里鎮 — 未登記露營場', '0492990259', 'https://www.facebook.com/rstg497/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('愛聚時光森林露營區(原名外寓民宿露營區)', 'camping', 23.95037, 120.91935, '種瓜路37-1號', '南投縣埔里鎮 — 未登記露營場', '0936288804', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('賽德克公主之熊本部親子露營區', 'camping', 23.964967, 121.000647, '南投縣埔里鎮鯉魚路22-7號', '南投縣埔里鎮 — 未登記露營場', '0980618781', 'https://www.facebook.com/Bearcamground/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('愛玩客露營區', 'camping', 23.9405271, 120.9260426, '桃米巷52-12號', '南投縣埔里鎮 — 未登記露營場', '0492918346', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('虎嘯山莊', 'camping', 23.9640674, 120.9895489, '南投縣埔里鎮知安路100號', '南投縣埔里鎮 — 未登記露營場', '0905700129', 'https://www.pulitiger.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('燈火嵐杉野奢露營區inHere', 'camping', 23.95648769, 120.915459, '種瓜路33-5號', '南投縣埔里鎮 — 未登記露營場', '0958998309', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('童心園露營區', 'camping', 24.0912063, 120.9458441, '中成路13之2號', '南投縣埔里鎮 — 未登記露營場', '0928348428', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('埔里獨角仙親子露營生態園區', 'camping', 24.014235, 120.9228072, '西安路三段167巷103號', '南投縣埔里鎮 — 未登記露營場', '0936175376', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野森林農場', 'camping', 23.9844096, 120.9749549, '西安路一段550巷12-1號', '南投縣埔里鎮 — 未登記露營場', '0977001535', 'http://lyuye.ego.tw/?mobile=0', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('暮雲春樹露營區', 'camping', 23.955324, 120.911101, '種瓜路33-3號', '南投縣埔里鎮 — 未登記露營場', '0933536625', 'https://www.facebook.com/Pulicamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青森咖啡莊園', 'camping', 24.0083594, 120.9141908, '向善路176號', '南投縣埔里鎮 — 未登記露營場', '0928383103', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森露其境渡假村', 'camping', 23.95489, 120.91103, '種瓜路33-15號', '南投縣埔里鎮 — 未登記露營場', '0955067838', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲風箏自然手感露營農場', 'camping', 23.9346171, 120.9105706, '水上巷35-1號', '南投縣埔里鎮 — 未登記露營場', '0953111262', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('咿喲ㄟ故鄉', 'camping', 23.9597838, 120.8908763, '種瓜路126-2號', '南投縣埔里鎮 — 未登記露營場', '0492915368', 'http://www.yiyo.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('江山樂活', 'camping', 23.9323221, 120.8943295, '水上巷68號', '南投縣埔里鎮 — 未登記露營場', '0977142575', 'https://www.facebook.com/1476455339312993/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('左岸民宿露營區', 'camping', 23.976008, 120.989758, '蜈蚣路1巷16號', '南投縣埔里鎮 — 未登記露營場', '0921980064', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('外大坪觀星民宿(嫻安軒觀星民宿)', 'camping', 23.9576468, 120.9130158, '種瓜路33-6號', '南投縣埔里鎮 — 未登記露營場', '0931223095', 'https://zh-tw.facebook.com/pulisas/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('珊林露營區', 'camping', 23.956915, 120.913445, '南投縣埔里鎮種瓜路33-6號', '南投縣埔里鎮 — 未登記露營場', '0972711658', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('幸埔森農場', 'camping', 23.9229739, 121.0071906, '武界路50-29號', '南投縣埔里鎮 — 未登記露營場', '0911103669', 'https://m.icamping.app/store/hps368', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山野星空親子露營區(原龍坑農場親子露營區)', 'camping', 24.0180695, 120.9697676, '南投縣埔里鎮福長路260號', '南投縣埔里鎮 — 未登記露營場', '0968605609', 'https://shanyexingkong.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蔽月山房', 'camping', 23.9387146, 120.9206829, '水上巷8號', '南投縣埔里鎮 — 未登記露營場', '0980548469', 'https://zh-tw.facebook.com/pg/themoontain/about/?ref=page_internal', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青青農場親子露營區', 'camping', 24.0066009, 120.9739355, '福興路146號', '南投縣埔里鎮 — 未登記露營場', '0923594859', 'https://www.facebook.com/profile.php?id=100063769604885', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('外寓民宿露營區(改名為愛聚時光露營區)', 'camping', 23.950273, 120.9193488, '南投縣埔里鎮種瓜路37-1號', '南投縣埔里鎮 — 未登記露營場', '0921108545', 'https://www.facebook.com/waiyugarden/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桂花庭藝術生態營地', 'camping', 23.9506888, 120.9664531, '隆生路111巷99-1號', '南投縣埔里鎮 — 未登記露營場', '0966770686', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黃金雨露營區', 'camping', 24.0269414, 120.9445306, '南投縣埔里鎮西安路三段118號', '南投縣埔里鎮 — 未登記露營場', '0985261246', 'https://www.facebook.com/ï¼E9ï¼BBï¼83ï¼E9ï¼87ï¼91ï¼E9ï¼9Bï¼A8ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-590559401344832/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('廣成宋爸農場', 'camping', 24.035047, 120.945728, '中成路8-1號', '南投縣埔里鎮 — 未登記露營場', '0928310751', 'http://www.songfatherfarm.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃米香露營區', 'camping', 23.9556201, 120.9111064, '種瓜路33-2號', '南投縣埔里鎮 — 未登記露營場', '0935682799', 'https://www.facebook.com/profile.php?id=100057458147593', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山上的茶樹', 'camping', 23.984981, 120.814046, '雙冬里山茶巷', '南投縣草屯鎮 — 未登記露營場', '0935090930', 'https://www.facebook.com/teastree/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三乘山露營區', 'camping', 23.9779433, 120.7518207, '土城里三層巷50號', '南投縣草屯鎮 — 未登記露營場', '0975023329', 'https://facebook.com/threeXmountain/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山茶瀑布露營區', 'camping', 23.985447, 120.8139229, '南投縣草屯鎮茶鍋路', '南投縣草屯鎮 — 未登記露營場', '0906585089', 'https://www.facebook.com/yl1968/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森活家露營渡假山莊', 'camping', 23.96713, 120.7873, '雙冬里雙龍巷5-20號', '南投縣草屯鎮 — 未登記露營場', '0918755265', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大衛營露營農場', 'camping', 23.9830662, 120.7123936, '富德街66巷75號', '南投縣草屯鎮 — 未登記露營場', '0932619018', 'http://www.david-camp.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂在足中足球營地', 'camping', 23.966175, 120.7283655, '股坑巷10-3號', '南投縣草屯鎮 — 未登記露營場', '0975912778', 'https://www.facebook.com/p/%E6%A8%82%E5%9C%A8%E8%B6%B3%E4%B8%AD%E8%B6%B3%E7%90%83%E7%87%9F%E5%9C%B0-100064165506052/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('宿與樹', 'camping', 23.9852099, 120.8137149, '無', '南投縣草屯鎮 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樹寄屋籬景觀民宿', 'camping', 23.951936, 120.723025, '南投縣仁愛鄉仁和路179之5號', '南投縣草屯鎮 — 未登記露營場', '0492801001', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('覓境露營x行者咖啡', 'camping', 24.0582624, 120.9177878, '國姓路25之12號', '南投縣國姓鄉 — 未登記露營場', '0492462688', 'https://www.facebook.com/profile.php?id=100064014848815', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('朱家寨露營區', 'camping', 24.05845, 120.85516, '旗洞巷2-1號', '南投縣國姓鄉 — 未登記露營場', '0933475512', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東原秘境露營區', 'camping', 23.9553495, 120.8313606, '長石巷43之6號', '南投縣國姓鄉 — 未登記露營場', '0921731909', 'https://www.tyzenping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('廿十八路露營區', 'camping', 23.94106, 120.83312, '南港村長石巷28-2號', '南投縣國姓鄉 — 未登記露營場', '0928175895', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('上野左岸露營區', 'camping', 23.93736341, 120.8466596, '南投縣國姓鄉南港村長石巷', '南投縣國姓鄉 — 未登記露營場', '0916798011', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('羅氏後花園', 'camping', 23.9518481, 120.8615548, '南港路110-13號', '南投縣國姓鄉 — 未登記露營場', '0932668057', 'https://www.facebook.com/garden0932668057', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('友樹溪露營區', 'camping', 24.056465, 120.886837, '北港村長北路95-26號', '南投縣國姓鄉 — 未登記露營場', '0923126171', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山嵐謐靜', 'camping', 24.077498, 120.878821, '大長路299-2號544號', '南投縣國姓鄉 — 未登記露營場', '0953203688', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('放乎自然露營基地 Fun of nature glamping', 'camping', 24.06493, 120.92875, '北原路60之1號', '南投縣國姓鄉 — 未登記露營場', '0988793651', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水中月民宿咖啡露營區', 'camping', 24.0529697, 120.8831586, '長北路117-1號', '南投縣國姓鄉 — 未登記露營場', '0919555815', 'https://www.facebook.com/0919555815s', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新境露營區', 'camping', 24.062135, 120.890812, '長北路70之1號', '南投縣國姓鄉 — 未登記露營場', '0911114265', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美好年代露營區', 'camping', 24.0573168, 120.8981694, '南投縣國姓鄉國姓路68-3號', '南投縣國姓鄉 — 未登記露營場', '0928366398', 'https://www.facebook.com/mhnd402/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山林曉境露營區', 'camping', 23.9560838, 120.8712727, '南港二號橋', '南投縣國姓鄉 — 未登記露營場', '0932562608', 'https://www.facebook.com/campsitenantou', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('北港溪沙八渡假村', 'camping', 24.0624419, 120.9345423, '北原路34-1號', '南投縣國姓鄉 — 未登記露營場', '0492461776', 'http://www.pkcv.net/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水悅左岸露營區', 'camping', 24.0500123, 120.8669106, '大長路622之1號', '南投縣國姓鄉 — 未登記露營場', '0921300708', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喬園渡假山莊', 'camping', 23.964966, 120.870576, '鳳鳴巷5之2號', '南投縣國姓鄉 — 未登記露營場', '0492452311', 'http://joygarden.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高峰農場', 'camping', 23.9514631, 120.8327208, '長石巷42-9號', '南投縣國姓鄉 — 未登記露營場', '0975237660', 'https://www.facebook.com/highpeakfarm/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('北山露營農場', 'camping', 23.9467524, 120.8290402, '長石巷42-5號', '南投縣國姓鄉 — 未登記露營場', '0910217959', 'http://0966586112.emmm.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('糯米橋時尚露營會館', 'camping', 24.0597989, 120.903386, '南投縣國姓鄉長北路27-2號', '南投縣國姓鄉 — 未登記露營場', '0938288289', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野逸境露營區', 'camping', 24.0620656, 120.8768352, '大長路587-1號', '南投縣國姓鄉 — 未登記露營場', '0982987479', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五葉松(素食)露營區', 'camping', 24.0516151, 120.8965519, '國姓路85-1號', '南投縣國姓鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小樹蛙露營區', 'camping', 24.056751, 120.8513725, '大旗村福旗巷', '南投縣國姓鄉 — 未登記露營場', '0932578765', 'https://www.facebook.com/tot1688/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('猴洞坑露營區', 'camping', 23.76507, 120.68775, '旗洞巷29號', '南投縣國姓鄉 — 未登記露營場', '0906543258', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小豬迷露', 'camping', 23.9092333, 120.8526028, '港頭巷10-13號', '南投縣國姓鄉 — 未登記露營場', '0937580629', 'https://piggy-camping.neocities.org/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星星的故鄉', 'camping', 24.106512, 120.914754, '大長路80-2號', '南投縣國姓鄉 — 未登記露營場', '0492432101', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('國姓858高地景觀露營區', 'camping', 24.068349, 120.823669, '乾溝村3鄰中西巷鹿食水123號', '南投縣國姓鄉 — 未登記露營場', '0937476757', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲享清峰', 'camping', 24.0596875, 120.8240787, '中西巷111-13號', '南投縣國姓鄉 — 未登記露營場', '0958360889', 'https://www.facebook.com/13641KM/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小胖露營區', 'camping', 24.0572882, 120.8934086, '北港村國姓路90號', '南投縣國姓鄉 — 未登記露營場', '0935884093', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('聽花山川', 'camping', 23.90288, 120.8506, '無', '南投縣國姓鄉 — 未登記露營場', '0912571817', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山的抱抱', 'camping', 24.06173, 120.85671, '無', '南投縣國姓鄉 — 未登記露營場', '0912253403', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('九號森霖露營區', 'camping', 23.983133, 120.892282, '南投縣國姓鄉中正路四段42-2號', '南投縣國姓鄉 — 未登記露營場', '0902372552', 'http://www.ninth-camping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黃金森林露營區', 'camping', 24.1148419, 120.8911387, '長福村長雙巷9號', '南投縣國姓鄉 — 未登記露營場', '0931226677', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('祿鹿生態農場露營區(橄欖樹下的祿鹿營區)', 'camping', 23.9651694, 120.8752023, '無', '南投縣國姓鄉 — 未登記露營場', '0926314118', 'https://www.facebook.com/Olivetreelulu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐晨露營區', 'camping', 24.1188931, 120.8566818, '長豐村東一巷51-8號', '南投縣國姓鄉 — 未登記露營場', '0937219911', 'https://www.facebook.com/sunfuncamping', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('隱山蹤 露營區', 'camping', 24.06225, 120.85665, '旗洞巷4-18號', '南投縣國姓鄉 — 未登記露營場', '0917236859', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石竹山水露營區(原石竹莊)', 'camping', 24.0640868, 120.9397661, '北原路', '南投縣國姓鄉 — 未登記露營場', '0966894411', 'https://www.facebook.com/bearloveholiday.jp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花沐楠', 'camping', 24.0438251, 120.8599508, '國姓路222之2號', '南投縣國姓鄉 — 未登記露營場', '0910136858', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('糯米橋石灶松林露營區', 'camping', 24.0609268, 120.9066971, '長北路16之5號', '南投縣國姓鄉 — 未登記露營場', '0922988589', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樟湖山居民宿', 'camping', 23.90585, 120.84783, '港頭路10-8號', '南投縣國姓鄉 — 未登記露營場', '0933565738', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森之境露營區', 'camping', 23.955264, 120.87138, '南港二號橋', '南投縣國姓鄉 — 未登記露營場', '0918755265', 'http://campground-334.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長豐露營區', 'camping', 24.1158444, 120.8543197, '東二巷116-16號', '南投縣國姓鄉 — 未登記露營場', '0931640968', 'https://www.facebook.com/profile.php?id=100063652465104', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('漾嵐山庄', 'camping', 24.0620309, 120.8742079, '長流村大長路584之9號', '南投縣國姓鄉 — 未登記露營場', '0985678080', 'https://www.facebook.com/scott19293949/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黃金藍海秘境露營區', 'camping', 24.059746, 120.872119, '大長路613號', '南投縣國姓鄉 — 未登記露營場', '0973063778', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('騰雲農莊', 'camping', 23.9556579, 120.8294322, '長石巷42號', '南投縣國姓鄉 — 未登記露營場', '0910462752', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金青松露營區', 'camping', 24.06269, 120.923889, '北圳巷26-3號', '南投縣國姓鄉 — 未登記露營場', '0932624050', 'https://www.facebook.com/jcs888/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水岸松林農場', 'camping', 24.06612, 120.925112, '北圳巷30-8號', '南投縣國姓鄉 — 未登記露營場', '0906577942', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐光山居', 'camping', 24.0748235, 120.93325, '南投縣國姓鄉北圳巷51號', '南投縣國姓鄉 — 未登記露營場', '0958566731', 'https://www.facebook.com/thedawnvalley/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙徠山莊', 'camping', 24.1018629, 120.877072, '長豐村東二巷71號', '南投縣國姓鄉 — 未登記露營場', '0986603931', 'https://xianlei2015.mystrikingly.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬沙露營區', 'camping', 24.052274, 120.874422, '大長路616-1號', '南投縣國姓鄉 — 未登記露營場', '0988298967', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('趣露營 GOLY', 'camping', 24.0517339, 120.8470136, '旗洞巷29號', '南投縣國姓鄉 — 未登記露營場', '0968704818', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('九份二山連興露營區', 'camping', 23.9641667, 120.8439553, '鳳鳴巷39-6號', '南投縣國姓鄉 — 未登記露營場', '0921784737', 'https://www.facebook.com/lianxing.camping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('港寮枝179景觀農場', 'camping', 23.9455865, 120.8313303, '南港村長石巷68之6號', '南投縣國姓鄉 — 未登記露營場', '0952854008', 'http://www.camping-179.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('滾石部落', 'camping', 24.0940834, 120.8559988, '無', '南投縣國姓鄉 — 未登記露營場', '0972777528', 'https://www.facebook.com/RollingStoneTribe/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('浚晟茶葉農場', 'camping', 23.9646946, 120.8365219, '無', '南投縣國姓鄉 — 未登記露營場', '0982581079', 'https://www.facebook.com/ChunChengLouLuYing', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑩光森林露營區', 'camping', 24.021826, 120.84614, '中正路二段341-1號', '南投縣國姓鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山水園露營農莊', 'camping', 24.090589, 120.886385, '大長路117-1號', '南投縣國姓鄉 — 未登記露營場', '0987316918', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拂水山莊', 'camping', 23.9037706, 120.9586553, '五馬巷2-15號', '南投縣魚池鄉 — 未登記露營場', '0952000857', 'https://traiwan.com/official/booking.php?id=budawater', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('魚雅筑渡假村', 'camping', 23.9091899, 120.88857, '華龍巷56-1號', '南投縣魚池鄉 — 未登記露營場', '0492895188', 'http://www.fishlife.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巫婆的森林露營區', 'camping', 23.8897322, 120.9613593, '東光村水尾巷1-5號', '南投縣魚池鄉 — 未登記露營場', '0919552592', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('入森林露森林', 'camping', 23.9015333, 120.956315, '水埔產業道路131號', '南投縣魚池鄉 — 未登記露營場', '0975030983', 'https://www.facebook.com/camping131', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月潭齊樂事露營區', 'camping', 23.84352, 120.92815, '中正路336號', '南投縣魚池鄉 — 未登記露營場', '0977737732', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('入樹村露營區', 'camping', 23.91978, 120.91949, '大雁巷31-7號', '南投縣魚池鄉 — 未登記露營場', '0928164649', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('居大雁', 'camping', 23.9229187, 120.9171701, '大雁巷41之33號', '南投縣魚池鄉 — 未登記露營場', '0933407021', 'https://www.facebook.com/chutayen/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('活盆地觀景民宿', 'camping', 23.8379588, 120.9015291, '南投縣魚池鄉平和巷106-1號', '南投縣魚池鄉 — 未登記露營場', '0492861323', 'http://paradise.okgo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梢楠園', 'camping', 23.9117819, 120.8872515, '華龍巷31-2號', '南投縣魚池鄉 — 未登記露營場', '0492897119', 'http://greentrip.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月潭金龍山曙光營地', 'camping', 23.90013, 120.89767, '華龍巷14號', '南投縣魚池鄉 — 未登記露營場', '0918005858', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月潭村自然Glamping', 'camping', 23.8213, 120.9056, '平和巷39-2號', '南投縣魚池鄉 — 未登記露營場', '0919005559', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('帖泊喀露營區', 'camping', 23.8512141, 120.9349366, '中正路102號', '南投縣魚池鄉 — 未登記露營場', '0918611797', 'https://www.facebook.com/%E5%B8%96%E6%B3%8A%E5%96%80-636074496896774/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('峰芢苑露營區', 'camping', 23.8800834, 120.9413802, '永川巷25之6號', '南投縣魚池鄉 — 未登記露營場', '0932336379', 'https://www.facebook.com/groups/477404315769534/?ref=bookmarks', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('香菇寮小吃露營', 'camping', 23.914848, 120.8862529, '華龍巷41-2號', '南投縣魚池鄉 — 未登記露營場', '0492895458', 'http://www.xianggu.com.tw/product_show.html?id=8541', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('涵香小屋露營驛站', 'camping', 23.9034896, 120.9592329, '五馬巷2之10號', '南投縣魚池鄉 — 未登記露營場', '0989032308', 'https://www.facebook.com/HS.hansiang/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('親手窯茶莊營地', 'camping', 23.8915592, 120.923295, '烏山62號', '南投縣魚池鄉 — 未登記露營場', '024933603', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('攝手座營地', 'camping', 23.9109135, 120.8885007, '華龍巷31-10號', '南投縣魚池鄉 — 未登記露營場', '0935318321', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月潭夢想親子露營區', 'camping', 23.8840751, 120.9228591, '有水巷28-3號', '南投縣魚池鄉 — 未登記露營場', '0968695859', 'http://dreamcamptw.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樹樂露營區', 'camping', 23.9026739, 120.9564817, '五馬巷5-1號', '南投縣魚池鄉 — 未登記露營場', '0912131381', 'https://www.facebook.com/profile.php?id=100076331290695', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青螢露營區', 'camping', 23.8847203, 120.8875308, '五城巷十七號', '南投縣魚池鄉 — 未登記露營場', '0989300289', 'https://www.facebook.com/BlueFireflyCAMP/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('聖多羅森林素食露營區', 'camping', 23.9005862, 120.9760112, '南投縣魚池鄉共和村', '南投縣魚池鄉 — 未登記露營場', '0931405646', 'https://facebook.com/profile.php?id=1621945098071799', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月潭翠湖休閒渡假中心', 'camping', 23.8439381, 120.9270622, '中正路338-1號', '南投縣魚池鄉 — 未登記露營場', '0934190780', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('聖愛營地', 'camping', 23.847152, 120.920963, '南投縣魚池鄉日月村中正路261之10號', '南投縣魚池鄉 — 未登記露營場', '0492850202', 'https://www.facebook.com/holylove.sunmoonlake/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田螺屋清新露營區', 'camping', 23.891547, 120.9222436, '文正巷5-3號', '南投縣魚池鄉 — 未登記露營場', '0937216579', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('紫竹山莊休閒露營區', 'camping', 23.9056842, 120.8878912, '南投縣魚池鄉華龍巷40-5號', '南投縣魚池鄉 — 未登記露營場', '0900454980', 'https://m.icamping.app/store/tjsj422', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('念念小憩', 'camping', 23.90304, 120.95748, '長寮段555號', '南投縣魚池鄉 — 未登記露營場', '0925075185', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('魚宙露營區', 'camping', 23.89978, 120.94453, '埔尾路', '南投縣魚池鄉 — 未登記露營場', '0978051515', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梢楠林民宿露營', 'camping', 23.91255, 120.88949, '五城村華龍巷31-8號', '南投縣魚池鄉 — 未登記露營場', '0933658203', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂沐山林_親子友善露營區', 'camping', 23.905887, 120.960401, '五馬巷4號', '南投縣魚池鄉 — 未登記露營場', '0928366314', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一樂農場露營區', 'camping', 23.90424, 120.92236, '新城村通文巷7-6號', '南投縣魚池鄉 — 未登記露營場', '0939079923', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙聞露營區', 'camping', 23.9035379, 120.8913063, '華龍巷73號', '南投縣魚池鄉 — 未登記露營場', '0966366199', 'https://www.facebook.com/sw477/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('空若水營地', 'camping', 23.889193, 120.9389994, '文武巷1-33號', '南投縣魚池鄉 — 未登記露營場', '0911448888', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森星林驛站', 'camping', 23.89873, 120.91124, '山楂腳巷5-36號', '南投縣魚池鄉 — 未登記露營場', '0913011099', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('峇嵐杉丘 奢華露營', 'camping', 23.88878, 120.92088, '文正巷2之6號', '南投縣魚池鄉 — 未登記露營場', '0492895688', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('頭社後尖山休閒營地(更名為森露快樂休閒營地)', 'camping', 23.8205894, 120.901552, '平和巷10號', '南投縣魚池鄉 — 未登記露營場', '0937262521', 'https://www.facebook.com/campinggogogo/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹天空親子營地', 'camping', 23.9019668, 120.9554733, '五馬巷131號縣道8k處', '南投縣魚池鄉 — 未登記露營場', '0963561621', 'https://m.icamping.app/store/thtk311', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('合興休閒營區', 'camping', 23.9039916, 120.8911655, '華龍巷73-1號', '南投縣魚池鄉 — 未登記露營場', '0492899677', 'http://www.facebook.com/hophing731/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('唯樂露營區', 'camping', 23.825112, 120.894982, '協力巷11-6號', '南投縣魚池鄉 — 未登記露營場', '0975086680', 'https://www.facebook.com/welove.camping006888', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('幽幽小憩', 'camping', 23.90332, 120.95511, '共和村長興巷27-6號', '南投縣魚池鄉 — 未登記露營場', '0921504303', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('四心小草露營區', 'camping', 23.918047, 120.886002, '華龍巷43-16號', '南投縣魚池鄉 — 未登記露營場', '0921652067', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('享樂玩家', 'camping', 23.8909492, 120.9547523, '五馬巷2-3號', '南投縣魚池鄉 — 未登記露營場', '0908993555', 'https://www.facebook.com/play94236/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森林寓-露營區', 'camping', 23.8981379, 120.9476414, '東興巷19號', '南投縣魚池鄉 — 未登記露營場', '0921301290', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('暮沐露營小庄。Moonmood', 'camping', 23.92054, 120.88875, '華龍巷31號', '南投縣魚池鄉 — 未登記露營場', '0965106268', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山宇晴莊園', 'camping', 23.9132079, 120.9299845, '通文巷54-16號', '南投縣魚池鄉 — 未登記露營場', '0910470887', 'https://www.facebook.com/shan.yu.qing5416/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月潭九蛙秘境露營區', 'camping', 23.8659603, 120.8998404, '中山路510巷9之22號', '南投縣魚池鄉 — 未登記露營場', '0972373259', 'https://www.facebook.com/profile.php?id=100063883309968', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('部落之丘 Camping', 'camping', 23.98116, 120.92423, '文正巷1-45號', '南投縣魚池鄉 — 未登記露營場', '0981823645', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿露露營區', 'camping', 23.92617, 120.94663, '新城村香茶巷28-5號', '南投縣魚池鄉 — 未登記露營場', '0918373221', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('半山秘境', 'camping', 23.89754604, 120.9196136, '無', '南投縣魚池鄉 — 未登記露營場', '0937852632', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日月松林營地', 'camping', 23.883045, 120.925912, '南投縣魚池鄉有水巷21-41號', '南投縣魚池鄉 — 未登記露營場', '0905140950', 'http://www.sunmooncamp.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('祿野營地', 'camping', 23.9232223, 120.9374628, '香茶巷12-13號', '南投縣魚池鄉 — 未登記露營場', '0903728362', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('文化村喜樂營地', 'camping', 23.8836216, 120.9401302, '南投縣魚池鄉文武巷1-2號', '南投縣魚池鄉 — 未登記露營場', '0968335496', 'https://www.facebook.com/ï¼E6ï¼96ï¼87ï¼E5ï¼8Cï¼96ï¼E6ï¼9Dï¼91ï¼E5ï¼96ï¼9Cï¼E6ï¼A8ï¼82ï¼E7ï¼87ï¼9Fï¼E5ï¼9Cï¼B0-2324479387578257/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('威廉莊園露營區', 'camping', 23.8824813, 120.9469362, '永川巷', '南投縣魚池鄉 — 未登記露營場', '0933510320', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青綠園露營區', 'camping', 23.8854337, 120.8936673, '五城巷11-22號', '南投縣魚池鄉 — 未登記露營場', '0922131159', 'https://www.facebook.com/GDcamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('頭社水庫露營區', 'camping', 23.835961, 120.8986284, '平和巷127-12號', '南投縣魚池鄉 — 未登記露營場', '0492861497', 'https://www.facebook.com/profile.php?id=100071606181892', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山福情森露營區', 'camping', 23.9181587, 120.8856009, '華龍巷43-3號', '南投縣魚池鄉 — 未登記露營場', '0905399051', 'http://www.sfqs.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍之泉休閒露營區', 'camping', 23.8862414, 120.9540492, '華山巷16號', '南投縣魚池鄉 — 未登記露營場', '0910895887', 'https://www.facebook.com/Dragon.FamilyFarm/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('靜心露營站', 'camping', 23.8981116, 120.9562298, '南投縣魚池鄉水尾巷1-11 號', '南投縣魚池鄉 — 未登記露營場', '0980618668', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('林坡微步 露營區', 'camping', 23.899604, 120.9274923, '通文巷', '南投縣魚池鄉 — 未登記露營場', '0936289748', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森露快樂休閒營地(原頭社後尖山休閒營地)', 'camping', 23.8205574, 120.9014018, '平和巷10號', '南投縣魚池鄉 — 未登記露營場', '0955067838', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('畢瓦客', 'camping', 23.8670377, 120.9040157, '中山路361-3號', '南投縣魚池鄉 — 未登記露營場', '0492855168', 'https://www.biwak.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嬉皮國度-入樹二村', 'camping', 23.91994, 120.92196, '大雁巷31-8號', '南投縣魚池鄉 — 未登記露營場', '0939079923', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍品園', 'camping', 23.8686272, 120.9735512, '無', '南投縣魚池鄉 — 未登記露營場', '0952983293', 'https://www.facebook.com/longcamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溪泮小屋露營區', 'camping', 23.9025528, 120.9581948, '五馬巷2-2號', '南投縣魚池鄉 — 未登記露營場', '0906563897', 'https://www.facebook.com/Xipanhut/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('能通農場露營區', 'camping', 23.70349, 120.77368, '愛鄉路64-1號', '南投縣鹿谷鄉 — 未登記露營場', '0921796881', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新初鄉847露營區', 'camping', 23.7612358, 120.7406612, '仁愛路256號', '南投縣鹿谷鄉 — 未登記露營場', '0988847848', 'http://847.ego.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿過星境景觀露營區', 'camping', 23.759452, 120.736525, '中正路三段101之26號', '南投縣鹿谷鄉 — 未登記露營場', '0937723539', 'https://www.facebook.com/L0492750849/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三生園生態露營區', 'camping', 23.7264494, 120.7768762, '民生巷8-1號', '南投縣鹿谷鄉 — 未登記露營場', '0919829135', 'https://www.facebook.com/people/%E4%B8%89%E7%94%9F%E5%9C%92%E7%94%9F%E6%85%8B%E9%9C%B2%E7%87%9F%E5%8D%80/100063611719109/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿谷麒麟潭湖光露營區', 'camping', 23.7536994, 120.7720784, '南投縣鹿谷鄉堀邊巷1之27號', '南投縣鹿谷鄉 — 未登記露營場', '0933931555', 'https://www.facebook.com/clt302', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溪頭和興露營區', 'camping', 23.6934557, 120.772595, '愛鄉路39-30號', '南投縣鹿谷鄉 — 未登記露營場', '0918124527', 'http://hexing-camp.ezgo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('湖畔露營區', 'camping', 23.7525472, 120.7685632, '南投縣鹿谷鄉堀邊巷1-22號', '南投縣鹿谷鄉 — 未登記露營場', '0939169266', 'https://www.facebook.com/profile.php?id=100048617365216', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石盤阬露營區', 'camping', 23.7569613, 120.7926819, '秀林巷13-7號', '南投縣鹿谷鄉 — 未登記露營場', '0919835607', 'https://www.facebook.com/shihpankeng', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小半天後花園自然生態園區', 'camping', 23.7175664, 120.7468271, '南投縣鹿谷鄉堀邊巷1-36號', '南投縣鹿谷鄉 — 未登記露營場', '0492752869', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山自在人文生態營地', 'camping', 23.71263, 120.77047, '和雅村愛鄉路97-45號', '南投縣鹿谷鄉 — 未登記露營場', '0919581555', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亨宿露營區', 'camping', 23.740638, 120.7429939, '光復路8之60號', '南投縣鹿谷鄉 — 未登記露營場', '0903090538', 'https://www.facebook.com/people/%E6%84%9B%E9%9C%B2%E7%87%9F-%E4%BA%A8%E5%AE%BF%E9%9C%B2%E7%87%9F/100063966816901/?sk=about', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小樟園營地', 'camping', 23.7459536, 120.780459, '南投縣鹿谷鄉中央巷13號', '南投縣鹿谷鄉 — 未登記露營場', '0492751152', 'https://www.facebook.com/tree751152/?locale2=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一陽露營區', 'camping', 23.690958, 120.7727741, '愛鄉路39之153號', '南投縣鹿谷鄉 — 未登記露營場', '0936964115', 'https://www.facebook.com/OneSunCampingTW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小半天休閒露營園區', 'camping', 23.7272444, 120.7506292, '中湖巷28之16號', '南投縣鹿谷鄉 — 未登記露營場', '0935056276', 'https://sbt.mmweb.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('明谷山莊', 'camping', 23.7279277, 120.7657479, '南投縣鹿谷鄉田底巷10之30號', '南投縣鹿谷鄉 — 未登記露營場', '0492752418', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('腳踏石地露營區', 'camping', 23.76179, 120.79211, '無', '南投縣鹿谷鄉 — 未登記露營場', '0972099935', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('凍頂山露營農場', 'camping', 23.7480112, 120.7659084, '彰雅村凍頂巷33之2號', '南投縣鹿谷鄉 — 未登記露營場', '0932698832', 'https://www.facebook.com/349645295409588/photos/350080952032689/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露‧山曉露營區', 'camping', 23.716353, 120.7725763, '愛鄉路98-16號', '南投縣鹿谷鄉 — 未登記露營場', '0979882918', 'https://www.facebook.com/126496351202953/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野趣凍頂-奢華露營', 'camping', 23.74643593, 120.7636399, '凍頂村7-26號', '南投縣鹿谷鄉 — 未登記露營場', '0915310099', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桂香園露營區', 'camping', 23.7478744, 120.7494306, '南投縣鹿谷鄉中正路二段211巷19號', '南投縣鹿谷鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楠林與露', 'camping', 23.72128063, 120.7698552, '竹林村愛鄉路101-17號', '南投縣鹿谷鄉 — 未登記露營場', '0953777383', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('世外陶莊', 'camping', 23.7441421, 120.7414875, '鹿彰路45之300號', '南投縣鹿谷鄉 — 未登記露營場', '0935315471', 'http://angel.nantou.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好呆庄', 'camping', 23.69108, 120.78644, '和雅村愛鄉路1-2號', '南投縣鹿谷鄉 — 未登記露營場', '0492661070', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白雲朵朵•露營•', 'camping', 23.7513, 120.76381, '凍頂巷32-18號', '南投縣鹿谷鄉 — 未登記露營場', '0928053625', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('和雅六分營地', 'camping', 23.69763, 120.77694, '和雅村愛鄉路39-42號', '南投縣鹿谷鄉 — 未登記露營場', '0910540958', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('錦屏之窗', 'camping', 23.7539212, 120.7776786, '南投縣鹿谷鄉和平巷20之2號', '南投縣鹿谷鄉 — 未登記露營場', '0492750907', 'https://www.facebook.com/profile.php?id=100064279172651', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鳳凰渡假山莊', 'camping', 23.7108249, 120.8226776, '南投縣鹿谷鄉竹林村光復路174-67號', '南投縣鹿谷鄉 — 未登記露營場', '0492677389', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('W.H窩', 'camping', 23.7720106, 120.7301327, '中正路三段686巷21號', '南投縣鹿谷鄉 — 未登記露營場', '0963154168', 'https://www.facebook.com/worldhousecamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鳳凰山日出湖秘密基地', 'camping', 23.7376436, 120.7797251, '鳳園路88之50號', '南投縣鹿谷鄉 — 未登記露營場', '0910662386', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('集元果觀光工廠露營區', 'camping', 23.825049, 120.814285, '大坪巷38號', '南投縣集集鎮 — 未登記露營場', '0492764562', 'http://www.jijibanana.net/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('集集對岸農場露營區', 'camping', 23.8297355, 120.8084179, '梨頭巷26號', '南投縣集集鎮 — 未登記露營場', '0928177277', 'https://www.facebook.com/jan9033/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麥凡諾休閒住宿露營農場', 'camping', 23.8408342, 120.7859028, '南投縣集集鎮環山街270巷70號', '南投縣集集鎮 — 未登記露營場', '0983474499', 'https://www.facebook.com/ï¼E9ï¼BAï¼A5ï¼E5ï¼87ï¼A1ï¼E8ï¼ABï¼BEï¼E4ï¼BCï¼91ï¼E9ï¼96ï¼91ï¼E6ï¼9Cï¼A8ï¼E5ï¼B1ï¼8Bï¼E4ï¼BDï¼8Fï¼E5ï¼AEï¼BFï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-1128025770588116/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('集樂森林', 'camping', 23.8405207, 120.7838578, '環山街270巷71號', '南投縣集集鎮 — 未登記露營場', '0975250288', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('君伯園露營區', 'camping', 22.18936, 120.87779, '旭海路99-1號', '屏東縣牡丹鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('旭海舞浪園露營區', 'camping', 22.19186, 120.87699, '旭海路95之6號945', '屏東縣牡丹鄉 — 未登記露營場', '0927319395', 'https://www.facebook.com/profile.php?id=100063717769029', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('kikiu綠地露營區', 'camping', 22.12759, 120.77555, '牡丹鄉石門村1-14號', '屏東縣牡丹鄉 — 未登記露營場', '0920386288', 'https://www.facebook.com/groups/1574104066146056/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('左岸民宿露營區', 'camping', 22.1932, 120.88789, '屏東縣牡丹鄉', '屏東縣牡丹鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('華園鄉村民宿露營區', 'camping', 22.10094, 120.74675, '屏東縣牡丹鄉', '屏東縣牡丹鄉 — 未登記露營場', '0938771758', 'https://www.facebook.com/huayuanbnbfb/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('河畔露營區', 'camping', 22.1013319, 120.7478664, '大梅路1之20號', '屏東縣牡丹鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('九大露營區', 'camping', 22.19345, 120.88593, '旭海路1-16號', '屏東縣牡丹鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('悠客驛境露營區', 'camping', 22.07659, 120.73437, '統埔路23-1號', '屏東縣車城鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嘉後休閒農園', 'camping', 22.55977198, 120.656285, '屏東縣來義鄉', '屏東縣來義鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沙島露營區', 'camping', 21.91243091, 120.8483567, '屏東縣恆春鎮砂島路200號之1', '屏東縣恆春鎮 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青山露營區', 'camping', 21.91443645, 120.8479736, '砂島路234-3號', '屏東縣恆春鎮 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('海山露營區', 'camping', 21.91121807, 120.8482643, '屏東縣恆春鎮砂島路200-2號', '屏東縣恆春鎮 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂白沙露營區', 'camping', 21.93672304, 120.715985, '屏東縣恆春鎮', '屏東縣恆春鎮 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雕瓦納休閒露營區', 'camping', 22.56885528, 120.6501113, '泰武鄉武潭段601-2地號、來義鄉古樓段381地號', '屏東縣泰武鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日光境露營區', 'camping', 22.5984447, 120.6508782, '屏東縣泰武鄉', '屏東縣泰武鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松秀雅筑', 'camping', 22.74180791, 120.622509, '廣興村祥興街179號', '屏東縣高樹鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('OD的家', 'camping', 22.81064886, 120.5851827, '公平路1-75號', '屏東縣高樹鄉 — 未登記露營場', '0938800157', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野遊蹤民宿露營區', 'camping', 22.87038579, 120.6423085, '新豐村義興路16-1號', '屏東縣高樹鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('獅頭庄水農場', 'camping', 22.467, 120.609, '屏東縣新埤鄉進化路12之156號', '屏東縣新埤鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夢露露營空間', 'camping', 22.58661859, 120.6033201, '佳和村光明路42-10號', '屏東縣萬巒鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('諾亞方舟生態園區', 'camping', 22.59229565, 120.6024184, '五溝村東興路58-3號', '屏東縣萬巒鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蒙馬羅露營農莊', 'camping', 21.98804639, 120.8011133, '永南路20-7號', '屏東縣滿州鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('碧連天農場', 'camping', 22.03568697, 120.8314116, '屏東縣滿州鄉', '屏東縣滿州鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('卡拉達然露營區', 'camping', 22.67019704, 120.6791854, '屏東縣瑪家鄉', '屏東縣瑪家鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('獵人驛站', 'camping', 22.66660473, 120.6809172, '屏東縣瑪家鄉', '屏東縣瑪家鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃花園', 'camping', 22.66567149, 120.682767, '屏東縣瑪家鄉', '屏東縣瑪家鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('神山民宿山莊', 'camping', 22.75304816, 120.7278091, '屏東縣霧台鄉神山巷1-16號', '屏東縣霧臺鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('冒煙屋', 'camping', 22.75056357, 120.7297042, '神山巷38號', '屏東縣霧臺鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('霧台山莊', 'camping', 22.74356774, 120.7290859, '屏東縣霧台鄉中山巷87-4號', '屏東縣霧臺鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('諾維琪露營基地', 'camping', 24.361682, 120.797029, '苗栗縣三義鄉龍騰村9鄰草排10-1號', '苗栗縣三義鄉 — 未登記露營場', '0905130059', 'https://norwich.epo.tw/?.p=HjEY', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五福山莊', 'camping', 24.372816, 120.793316, '苗栗縣三義鄉龍騰村草排12鄰40號', '苗栗縣三義鄉 — 未登記露營場', '0912964383', 'https://www.easycamp.com.tw/Store_2432.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('半月彎露營區', 'camping', 24.387728, 120.809814, '苗栗縣三義鄉雙潭村崩山下80之6號', '苗栗縣三義鄉 — 未登記露營場', '037873887', 'http://www.halfmoonbent.com.tw/reserve.php', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩園親子露營區', 'camping', 24.383947, 120.804995, '苗栗縣三義鄉大通公路12號', '苗栗縣三義鄉 — 未登記露營場', '0932953898', 'https://m.facebook.com/profile.php?id=1753773234947251', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('不遠露營度假山莊', 'camping', 24.39526, 120.785431, '苗栗縣三義鄉雙連潭9鄰199號', '苗栗縣三義鄉 — 未登記露營場', '0918833021', 'https://www.close-2.com/content/campinfo', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春田窯陶藝休閒渡假園', 'camping', 24.40941, 120.79922, '苗栗縣三義鄉雙潭村大坪7號', '苗栗縣三義鄉 — 未登記露營場', '037877820', 'https://www.facebook.com/springkiln/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石濤園山莊', 'camping', 24.395676, 120.804193, '苗栗縣三義鄉石崀32號', '苗栗縣三義鄉 — 未登記露營場', '0955772977', 'https://www.facebook.com/shitaoyuan.sanyi/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('貝岩居農場/山谷露營區', 'camping', 24.376797, 120.777405, '苗栗縣三義鄉龍騰村13鄰龍鰧3號', '苗栗縣三義鄉 — 未登記露營場', '0933980007', 'https://www.facebook.com/BeiYanJu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍騰讚露營趣', 'camping', 24.359479, 120.773342, '苗栗縣三義鄉外庄20號之三', '苗栗縣三義鄉 — 未登記露營場', '0933549269', 'https://m.icamping.app/store/ltz353', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('斷橋部落．輕奢露營', 'camping', 24.355957, 120.774177, '苗栗縣三義鄉龍騰村外庄40號', '苗栗縣三義鄉 — 未登記露營場', '0963299652,0933403833', 'https://www.brokenbridgetribecmap.com/?lang=tw', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溫馨農場露營區', 'camping', 24.38734, 120.81745, '苗栗縣三義鄉雙潭村16鄰崩山下38號', '苗栗縣三義鄉 — 未登記露營場', '037871551', 'https://www.easycamp.com.tw/Store_2282.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲想家露營區', 'camping', 24.386799, 120.806614, '苗栗縣三義鄉雙潭村15鄰崩山下36-8號', '苗栗縣三義鄉 — 未登記露營場', '0903012963', 'http://www.queenyscottages.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('依杉林露營區', 'camping', 24.409259, 120.778412, '苗栗縣三義鄉雙潭村102號', '苗栗縣三義鄉 — 未登記露營場', '0988557085', 'https://www.facebook.com/k5886/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('關刀山景庭露營區', 'camping', 24.387071, 120.813852, '苗栗縣三義鄉双潭村崩山下16鄰88號', '苗栗縣三義鄉 — 未登記露營場', '0928651428', 'https://www.easycamp.com.tw/Store_2160.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('棠春休閒莊園', 'camping', 24.653003, 121.003793, '苗栗縣三灣鄉竹湖15-1號', '苗栗縣三灣鄉 — 未登記露營場', '037832606', 'https://www.facebook.com/TangChunCamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙境山露營區', 'camping', 24.596467, 120.966009, '352苗栗縣三灣鄉15-2號', '苗栗縣三灣鄉 — 未登記露營場', '0933835181', 'http://www.sianjingshan.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三號秘境露營區', 'camping', 24.633351, 120.946496, '苗栗縣三灣鄉16-2號', '苗栗縣三灣鄉 — 未登記露營場', '0925143229', 'https://www.facebook.com/NO.3CAMP/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('斑比跳跳', 'camping', 24.64447, 120.965788, '苗栗縣三灣鄉小北埔27號', '苗栗縣三灣鄉 — 未登記露營場', '0932093859', 'https://iglamping.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('童趣露營區', 'camping', 24.600937, 120.95671, '苗栗縣三灣鄉大河村三洽坑2鄰14號', '苗栗縣三灣鄉 — 未登記露營場', '0919676167', 'https://www.easycamp.com.tw/Store_2287.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逗點露營區', 'camping', 24.667906, 120.959308, '苗栗縣三灣鄉內灣村龍峎頂5-17號', '苗栗縣三灣鄉 — 未登記露營場', '0905326118', 'https://www.hipoutdoor.com/Comma/campsite.aspx', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('神農渡假農場', 'camping', 24.672585, 120.951768, '苗栗縣三灣鄉內灣村小份美12號', '苗栗縣三灣鄉 — 未登記露營場', '0937800057', 'http://www.shennong.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鄉町露營區', 'camping', 24.668572, 120.979977, '苗栗縣三灣鄉大銅鑼圈88號', '苗栗縣三灣鄉 — 未登記露營場', '0928020933', 'https://www.easycamp.com.tw/Store_2461.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自由之丘露營地', 'camping', 24.66961, 120.96072, '內灣村1鄰龍峎6-2號', '苗栗縣三灣鄉 — 未登記露營場', '0979076679', 'https://www.hillfreedom.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水漾森林露營場', 'camping', 24.64645066, 120.9596393, '苗栗縣三灣鄉北埔村小北埔7鄰2-13號', '苗栗縣三灣鄉 — 未登記露營場', '0911000855', 'https://m.icamping.app/store/sysl389', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小份美營地', 'camping', 24.669959, 120.951161, '苗栗縣三灣鄉小份美20-1 號', '苗栗縣三灣鄉 — 未登記露營場', '0911892891', 'https://www.hipoutdoor.com/Bpol/campsite.aspx', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('微笑山丘', 'camping', 24.39544, 120.861392, '苗栗縣大湖鄉義和村和興22-5號', '苗栗縣大湖鄉 — 未登記露營場', '0978096750', 'https://www.smilecamping.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楓葉情露營區', 'camping', 24.37859, 120.887528, '364苗栗縣大湖鄉東興產業道路27號', '苗栗縣大湖鄉 — 未登記露營場', '0931173075', 'http://m.easycamp.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花香果樂', 'camping', 24.37627, 120.860817, '水流東路1之19號', '苗栗縣大湖鄉 — 未登記露營場', '0912750393', 'https://www.facebook.com/p/%E6%84%9B%E9%9C%B2%E7%87%9F-%E8%8A%B1%E9%A6%99%E6%9E%9C%E6%A8%82%E9%9C%B2%E7%87%9F%E5%8D%80-100076812488229/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('熊班長小團露', 'camping', 24.420093, 120.904233, '364苗栗縣大湖鄉小南勢43號', '苗栗縣大湖鄉 — 未登記露營場', '0912380080', 'https://www.facebook.com/Bearscaptain/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Coffee Industry｜Camp Sora露營區', 'camping', 24.363631, 120.844881, '竹橋20號', '苗栗縣大湖鄉 — 未登記露營場', '0979538823', 'https://www.campsora.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山美學', 'camping', 24.3645, 120.874507, '苗栗市大湖鄉武榮村 8 鄰坑美寮 39 之 5 號', '苗栗縣大湖鄉 — 未登記露營場', '0900377828', 'https://www.kkday.com/zh-tw/product/30331', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一遊味境親子露營區', 'camping', 24.41210292, 120.9005261, '苗栗縣大湖鄉大南村反水3-6號', '苗栗縣大湖鄉 — 未登記露營場', '0921249177', 'https://www.facebook.com/enjoyforcamping', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福人居民宿', 'camping', 24.412334, 120.906707, '苗栗縣大湖鄉大南勢32-1號', '苗栗縣大湖鄉 — 未登記露營場', '0912379579', 'https://www.easycamp.com.tw/Store_2283.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石門客棧休閒農場露營區', 'camping', 24.363551, 120.84489, '栗林村竹橋20號', '苗栗縣大湖鄉 — 未登記露營場', '0931193427', 'https://www.facebook.com/shimen.77/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('社寮角露營區', 'camping', 24.427537, 120.880664, '苗栗縣大湖鄉', '苗栗縣大湖鄉 — 未登記露營場', '0912861289', 'https://miaolicamping.simplybook.asia/v2/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夏綠地露營區', 'camping', 24.38601, 120.8818, '東興村小邦2鄰34-10號', '苗栗縣大湖鄉 — 未登記露營場', '0918360365', 'https://www.evergreen-glamping.com/?gad_source=1&gclid=EAIaIQobChMIo-jJ6MyvhwMVw1oPAh1nmSg3EAAYASAAEgKvAvD_BwE', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天恩農莊畫家咖啡屋', 'camping', 24.433139, 120.85323, '4苗栗縣大湖鄉芎蕉坑20號', '苗栗縣大湖鄉 — 未登記露營場', '037993472', 'https://www.facebook.com/TianEnNongZhuangHuaJiaKaFeiWu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('禾森 Ichigo 露營區', 'camping', 24.417942, 120.899415, '苗栗縣大湖鄉', '苗栗縣大湖鄉 — 未登記露營場', '0936244624', 'https://www.hosenichigo.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山水居', 'camping', 24.378043, 120.831796, '苗栗縣大湖鄉栗林村薑麻園13鄰5-3號', '苗栗縣大湖鄉 — 未登記露營場', '0928250191', 'http://www.sansui.idv.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪那邦之星-蟲蟲生態營地', 'camping', 24.368093, 120.901205, '36446苗栗縣大湖鄉東興村12鄰上湖31號', '苗栗縣大湖鄉 — 未登記露營場', '0968241561', 'https://www.facebook.com/WINDandCLOUDcamping/?ref=bookmarks', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃源山城', 'camping', 24.38505, 120.8233, '栗林村薑麻園16號', '苗栗縣大湖鄉 — 未登記露營場', '0952370882', 'https://www.facebook.com/p/%E6%A1%83%E6%BA%90%E5%B1%B1%E5%9F%8E%E9%9C%B2%E7%87%9F%E5%8D%80-100064001319973/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夢之谷露營區', 'camping', 24.370399, 120.902814, '苗栗縣大湖鄉東興村', '苗栗縣大湖鄉 — 未登記露營場', '0900292062', 'https://www.dreamcamping.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東和露營區', 'camping', 24.38557077, 120.8935569, '苗栗縣大湖鄉東興村', '苗栗縣大湖鄉 — 未登記露營場', '0424716284', 'https://www.easycamp.com.tw/Store_2495.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迎客山', 'camping', 24.40994, 120.90374, '大南村7鄰8之12號', '苗栗縣大湖鄉 — 未登記露營場', '0932283419', 'https://www.facebook.com/yingke2023', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山之間', 'camping', 24.362258, 120.839522, '開村7鄰雙坑 27 號', '苗栗縣大湖鄉 — 未登記露營場', '0902313768', 'https://www.facebook.com/p/%E5%B1%B1%E4%B9%8B%E9%96%93-100064181708328/?locale=zh_TW&_rdr', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('四季非露不可 (豪華野營/一般營位)', 'camping', 24.374503, 120.879301, '苗栗縣大湖鄉坪林道路八十之六號', '苗栗縣大湖鄉 — 未登記露營場', '0972607103', 'https://www.easycamp.com.tw/Store_1981.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('微笑山妍', 'camping', 24.42768, 120.89189, '大湖段 208-40地號', '苗栗縣大湖鄉 — 未登記露營場', '0988128992', 'https://www.facebook.com/BeautifulCampingTW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天藍露營區', 'camping', 24.37349, 120.862229, '苗栗縣大湖鄉武榮村4鄰23-10號', '苗栗縣大湖鄉 — 未登記露營場', '0933545047', 'https://www.easycamp.com.tw/Store_2345.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪菈棒(MaLa！棒)露營區', 'camping', 24.371789, 120.891401, '苗栗縣大湖鄉大寮村', '苗栗縣大湖鄉 — 未登記露營場', '0937591244', 'https://www.facebook.com/groups/2491691514414917/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('香林露營區', 'camping', 24.431428, 120.896999, '苗栗縣大湖鄉靜湖村鷂婆山海拔550處', '苗栗縣大湖鄉 — 未登記露營場', '0905533696', 'https://www.facebook.com/hakkadahu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬拉邦渡假山莊', 'camping', 24.364208, 120.900113, '苗栗縣大湖鄉東興村上湖87號', '苗栗縣大湖鄉 — 未登記露營場', '037996889', 'https://manapan.okgo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲霧肖楠森林樹屋露營', 'camping', 24.40152, 120.83854, '苗栗縣大湖鄉細邦道23號', '苗栗縣大湖鄉 — 未登記露營場', '0903168958', 'https://www.facebook.com/greentrip2/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Mele Hula 音樂之舞藝術露營區', 'camping', 24.351082, 120.814475, '苗栗縣大湖鄉新開村網形16-10號', '苗栗縣大湖鄉 — 未登記露營場', '0925688686', 'https://www.facebook.com/MeleHulacamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩雲露螢谷露營區', 'camping', 24.377595, 120.871639, '苗栗縣大湖鄉武榮村坑美寮一鄰七號', '苗栗縣大湖鄉 — 未登記露營場', '0905633688', 'https://m.facebook.com/ï¼E5ï¼A4ï¼A7ï¼E6ï¼B9ï¼96ï¼E9ï¼84ï¼89ï¼E5ï¼BDï¼A9ï¼E9ï¼9Bï¼B2ï¼E9ï¼9Cï¼B2ï¼E8ï¼9Eï¼A2ï¼E8ï¼B0ï¼B7ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-125750421095933/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('紮營趣', 'camping', 24.4092, 120.906456, '36445苗栗縣大湖鄉大南村8鄰 大南勢34-1號', '苗栗縣大湖鄉 — 未登記露營場', '0928196657', 'https://www.facebook.com/gocamp168/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('筑林居露營區', 'camping', 24.417975, 120.841937, '苗栗縣大湖鄉', '苗栗縣大湖鄉 — 未登記露營場', '0921978055', 'https://www.facebook.com/groups/1587740348174282/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('祺立農場大獅露營區', 'camping', 24.443636, 120.892401, '苗栗縣大湖鄉苗62縣道2公里處', '苗栗縣大湖鄉 — 未登記露營場', '0928388056', 'https://0928388056.wixsite.com/camp', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大南之美露營區', 'camping', 24.405162, 120.908965, '苗栗縣大湖鄉大南村大南勢57號', '苗栗縣大湖鄉 — 未登記露營場', '0937502979', 'https://m.icamping.app/store/dnjm469', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('開礦露營區', 'camping', 24.456193, 120.848368, '苗栗縣公館鄉開礦村2鄰26號', '苗栗縣公館鄉 — 未登記露營場', '0906775770', 'https://www.facebook.com/kkcamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂活露營區', 'camping', 24.521317, 120.886593, '北河段 435-7地號', '苗栗縣公館鄉 — 未登記露營場', '0919519498', 'https://m.icamping.app/store/lh708', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('希望樂園露營區', 'camping', 24.546938, 120.842707, '苗栗縣公館鄉公館3鄰40號', '苗栗縣公館鄉 — 未登記露營場', '0966350365', 'https://www.facebook.com/%E8%8B%97%E6%A0%97%E5%B8%8C%E6%9C%9B%E6%A8%82%E5%9C%92%E9%9C%B2%E7%87%9F%E5%8D%80-2001564386736825/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小日子露營區', 'camping', 24.540768, 120.842031, '苗栗縣公館鄉尖山74-1號', '苗栗縣公館鄉 — 未登記露營場', '098299365', 'https://www.simplelifecamp.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('再露營露營區', 'camping', 24.483403, 120.838174, '363苗栗縣公館鄉福星村227-1 號', '苗栗縣公館鄉 — 未登記露營場', '0911833908', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大山清境露營區', 'camping', 24.458714, 120.840812, '苗栗縣公館鄉10號', '苗栗縣公館鄉 — 未登記露營場', '0911122328', 'https://www.facebook.com/bigmountain037', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福基老家', 'camping', 24.46772756, 120.8367878, '苗栗縣公館鄉福基村11鄰福基257之1號', '苗栗縣公館鄉 — 未登記露營場', '0937727883', 'https://m.icamping.app/store/fg338', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('奈思寵物nice露營區', 'camping', 24.514052, 120.86767, '南河村9鄰98-12號', '苗栗縣公館鄉 — 未登記露營場', '0975884112', 'https://woodsecret.weebly.com/32879320972604124335.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('衝到山上去放空', 'camping', 24.483024, 120.839576, '苗栗縣公館鄉福星村福星227-3', '苗栗縣公館鄉 — 未登記露營場', '0961398628', 'https://go2mountain.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日旺休閒露營區', 'camping', 24.520092, 120.886596, '苗栗縣公館鄉18鄰北河186-3號', '苗栗縣公館鄉 — 未登記露營場', '0910371234', 'https://www.facebook.com/RiWangCAMPING/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樹語星晴露營區', 'camping', 24.483168, 120.838909, '苗栗縣公館鄉福星村7鄰227之8號,', '苗栗縣公館鄉 — 未登記露營場', '0938519835', 'https://www.facebook.com/AllanShen888', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('享樂秘境民宿露營農場', 'camping', 24.534636, 120.84897, '苗栗縣公館鄉北河村北河21號', '苗栗縣公館鄉 — 未登記露營場', '0905588811', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山水 518 露營區', 'camping', 24.455012, 120.849589, '苗栗縣公館鄉開礦村', '苗栗縣公館鄉 — 未登記露營場', '0918392456', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('築夢農莊', 'camping', 24.485153, 120.821983, '苗栗縣公館鄉福星村43-2號', '苗栗縣公館鄉 — 未登記露營場', '0920808970', 'http://www.unds.com.tw/dream/charges.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('銃庫營地', 'camping', 24.520247, 120.885502, '苗栗縣公館鄉北河村', '苗栗縣公館鄉 — 未登記露營場', '037235758', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野神農休閒民宿露營區', 'camping', 24.514763, 120.845265, '苗栗縣公館鄉仁安村9鄰仁安122-28號', '苗栗縣公館鄉 — 未登記露營場', '0912223458', 'http://www.luye2014.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金滿山露營山莊', 'camping', 24.50503, 120.859431, '苗栗縣公館鄉仁安村仁安219-1號', '苗栗縣公館鄉 — 未登記露營場', '0932677646', 'https://www.facebook.com/%E9%87%91%E6%BB%BF%E5%B1%B1%E9%9C%B2%E7%87%9F%E5%B1%B1%E8%8E%8A-591426951021366/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐林而居', 'camping', 24.483213, 120.839517, '福星村227-1 號', '苗栗縣公館鄉 — 未登記露營場', '0911833908', 'https://mulinkeepcamping.wixsite.com/my-site-3?fbclid=IwAR34vK0_pIoAxTMtke6i50Zf3ZGmLBH6K20i5FtlIMxxv6uao6raj96X-04', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('再~露營', 'camping', 24.483019, 120.837998, '苗栗縣公館鄉福星村227-1 號', '苗栗縣公館鄉 — 未登記露營場', '0911833908', 'https://www.easycamp.com.tw/Store_1921.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('跳跳城堡', 'camping', 24.483585, 120.839407, '苗栗縣公館鄉福星村福星7鄰227號', '苗栗縣公館鄉 — 未登記露營場', '0912953255', 'https://www.facebook.com/dreamcastel888/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拍片場', 'camping', 24.453391, 120.849154, '開礦村開礦 26-26 號', '苗栗縣公館鄉 — 未登記露營場', '0919664780', 'https://camping5261.epo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃樂絲露營區', 'camping', 24.546198, 120.841096, '苗栗縣公館鄉尖山村尖山40號', '苗栗縣公館鄉 — 未登記露營場', '0966350365', 'http://www.dorothycamp.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('築鄉霖露營區', 'camping', 24.49744, 120.8224, '苗栗縣公館鄉館南村206之1號', '苗栗縣公館鄉 — 未登記露營場', '0975016966', 'https://www.easycamp.com.tw/Store_2057.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('戀戀山水農莊', 'camping', 24.463536, 120.845936, '苗栗縣公館鄉開礦村2鄰開礦30號', '苗栗縣公館鄉 — 未登記露營場', '0903929218', 'https://www.inlove.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橄欖莊園', 'camping', 24.458214, 120.840672, '出礦坑段 179-1地號', '苗栗縣公館鄉 — 未登記露營場', '0222527966', 'https://www.easycamp.com.tw/Store_2598.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('四方鮮乳休閒農場', 'camping', 24.724204, 120.892785, '崎頂里崎頂里12鄰東崎頂9-6號', '苗栗縣竹南鎮 — 未登記露營場', '037584743', 'https://www.facebook.com/fourwaysranch/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('西湖祕密花園露營區', 'camping', 24.551187, 120.786107, '苗栗縣西湖鄉9鄰茶亭6-1號', '苗栗縣西湖鄉 — 未登記露營場', '037923029', 'https://www.facebook.com/SecretGarden923029/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('祕密花園露營區', 'camping', 24.551592, 120.78591, '苗栗縣西湖鄉金獅村茶亭6-1號', '苗栗縣西湖鄉 — 未登記露營場', '0937220911', 'https://m.icamping.app/store/xhmmhy093', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('湖櫻養生休閒農場', 'camping', 24.556341, 120.781347, '苗栗縣西湖鄉金獅村8鄰杜石地10號', '苗栗縣西湖鄉 — 未登記露營場', '0919580580', 'https://www.kongfu.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('悠閒時光小本營', 'camping', 24.53081, 120.765268, '五湖村16鄰216號', '苗栗縣西湖鄉 — 未登記露營場', '0915809965', 'https://www.facebook.com/people/%E6%82%A0%E9%96%92%E6%99%82%E5%85%89%E5%B0%8F%E6%9C%AC%E7%87%9F/100082581000395/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('只今漫漫', 'camping', 24.49928, 120.770605, '西湖鄉高埔村筧窩1鄰7-1號', '苗栗縣西湖鄉 — 未登記露營場', '037985686', 'https://www.facebook.com/xihumm/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('義芳農場', 'camping', 24.541678, 120.782454, '368苗栗縣西湖鄉11鄰9號', '苗栗縣西湖鄉 — 未登記露營場', '037920715', 'https://www.yi-farm.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('悄悄話Whiscamper', 'camping', 24.33259, 120.819991, '西坪段103地號', '苗栗縣卓蘭鎮 — 未登記露營場', '0905136782,0934367862', 'https://ms-my.facebook.com/whiscp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('寨酌然野奢莊園', 'camping', 24.3336076, 120.8282217, '苗栗縣卓蘭鎮西坪里43-20號', '苗栗縣卓蘭鎮 — 未登記露營場', '0989981285', 'http://modolcr.swmall.com.tw', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水玉妮光', 'camping', 24.333517, 120.81781, '苗栗縣卓蘭鎮西坪里109-21號', '苗栗縣卓蘭鎮 — 未登記露營場', '0911118383', 'https://hostel.url.com.tw/Mhome/showRoom/3375', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山林野地露營區', 'camping', 24.333422, 120.817855, '苗栗縣卓蘭鎮西坪里109-21號', '苗栗縣卓蘭鎮 — 未登記露營場', '0911118383', 'https://www.xiping.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿姑ㄟ兜', 'camping', 24.3185, 120.84823, '食水坑段267地號', '苗栗縣卓蘭鎮 — 未登記露營場', '0981178809/0987160724', 'https://www.facebook.com/aunthomecamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Glamping Hygge Hill山野森活', 'camping', 24.328285, 120.832565, '苗栗縣卓蘭鎮西坪里3鄰西坪33-1號', '苗栗縣卓蘭鎮 — 未登記露營場', '425895858', 'https://www.glampinghyggehill.com.tw/tw/about', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有里日子露營區', 'camping', 24.333217, 120.818014, '西坪段 103-2地號', '苗栗縣卓蘭鎮 — 未登記露營場', '0905136782', 'https://www.facebook.com/Ulivingu/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野景山露營地', 'camping', 24.347254, 120.852303, '苗栗縣卓蘭鎮景山里景山7鄰113號', '苗栗縣卓蘭鎮 — 未登記露營場', '0910080999', 'https://m.facebook.com/%E7%B6%A0%E9%87%8E%E6%99%AF%E5%B1%B1%E9%9C%B2%E7%87%9F%E5%9C%B0-280944845733053/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('饗果樂露營區', 'camping', 24.296152, 120.860964, '苗栗縣卓蘭鎮內灣里東盛31之2號', '苗栗縣卓蘭鎮 — 未登記露營場', '0937733139', 'https://www.easycamp.com.tw/Store_2065.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逸香園休閒莊園', 'camping', 24.33202, 120.876811, '苗栗縣卓蘭鎮坪林里坪林8鄰87號', '苗栗縣卓蘭鎮 — 未登記露營場', '0222527966', 'https://www.easycamp.com.tw/Store_1702.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('流壁下露營區', 'camping', 24.32406, 120.886703, '苗栗縣卓蘭鎮內灣里東盛31-2號', '苗栗縣卓蘭鎮 — 未登記露營場', '0933413086', 'https://www.facebook.com/Q0933413086/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森日快樂露營區', 'camping', 24.33220929, 120.8229518, '西坪里西坪36之29號', '苗栗縣卓蘭鎮 — 未登記露營場', '0911586966', 'https://www.facebook.com/HBDCAMP/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自然圈農場', 'camping', 24.332785, 120.821362, '苗栗縣卓蘭鎮西坪里西坪36-20號', '苗栗縣卓蘭鎮 — 未登記露營場', '0928691919', 'https://www.facebook.com/lofiland/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('緣野營客', 'camping', 24.33049, 120.87626, '苗栗縣卓蘭鎮坪林里9鄰103號', '苗栗縣卓蘭鎮 — 未登記露營場', '0965118565', 'https://m.icamping.app/store/cyyk391', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('遇見露營區', 'camping', 24.30494, 120.85363, '369苗栗縣卓蘭鎮內灣130之1號', '苗栗縣卓蘭鎮 — 未登記露營場', '0922653917,0928450538', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小森時光農場', 'camping', 24.324903, 120.847627, '苗栗縣卓蘭鎮西坪里2鄰10號東側', '苗栗縣卓蘭鎮 — 未登記露營場', '0921557116', 'https://www.facebook.com/jeandon1216/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('頤生園', 'camping', 24.32796, 120.89141, '坪林里坪林99-9號', '苗栗縣卓蘭鎮 — 未登記露營場', '0931228080', 'https://www.facebook.com/p/%E9%A0%A4%E7%94%9F%E5%9C%92%E9%9C%B2%E7%87%9F%E5%8D%80-100088882152792/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小白屋農園', 'camping', 24.317292, 120.845573, '苗栗縣卓蘭鎮老庄17鄰147之15號', '苗栗縣卓蘭鎮 — 未登記露營場', '0935302257', 'https://www.easycamp.com.tw/Store_2437.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('代觀山湖畔農場露營區', 'camping', 24.35233, 120.84825, '苗栗縣卓蘭鎮景山119-3號', '苗栗縣卓蘭鎮 — 未登記露營場', '0928997347', 'https://www.facebook.com/daiguanshan.1962/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小巷清風', 'camping', 24.337702, 120.816004, '西坪里西坪109之8號1樓', '苗栗縣卓蘭鎮 — 未登記露營場', '0965610360', 'https://www.facebook.com/lealleyautocamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('1961的星空', 'camping', 24.326151, 120.834488, '369苗栗縣卓蘭鎮西坪里3鄰西坪27-1號', '苗栗縣卓蘭鎮 — 未登記露營場', '0976165235', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長青谷森林遊樂區', 'camping', 24.314204, 120.870071, '苗栗縣卓蘭鎮食水坑78號', '苗栗縣卓蘭鎮 — 未登記露營場', '0425893329', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃花源露營區', 'camping', 24.32959115, 120.8890796, '苗栗縣卓蘭鎮坪林里8鄰98號', '苗栗縣卓蘭鎮 — 未登記露營場', '0425921072', 'https://m.icamping.app/store/thy244', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東耕露營地', 'camping', 24.332235, 120.815432, '苗栗縣卓蘭鎮西坪里9鄰109-37號', '苗栗縣卓蘭鎮 — 未登記露營場', '0933865939', 'https://www.facebook.com/donggengcamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('滝貓谷-山林漫遊渡假村', 'camping', 24.342246, 120.875938, '369苗栗縣卓蘭鎮坪林25-1號', '苗栗縣卓蘭鎮 — 未登記露營場', '0928121677', 'https://www.facebook.com/longmaovalley25?mibextid=LQQJ4d', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橘舍三食', 'camping', 24.332853, 120.828575, '苗栗縣卓蘭鎮西坪里西坪43-15號', '苗栗縣卓蘭鎮 — 未登記露營場', '0966511591', 'https://www.orangefarmhouse3.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自然風情', 'camping', 24.332446, 120.781314, '苗栗縣卓蘭鎮西坪里西坪134之7號', '苗栗縣卓蘭鎮 — 未登記露營場', '0425898080', 'https://naturalview.tw/h/Index?key=v88kb', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('游孟儒', 'camping', 24.332853, 120.828575, '豐田段274號', '苗栗縣卓蘭鎮 — 未登記露營場', '0966511591', 'https://www.orangefarmhouse3.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('流壁下10.5k露營區', 'camping', 24.324286, 120.886233, '369苗栗縣卓蘭鎮坪林里 113之9號', '苗栗縣卓蘭鎮 — 未登記露營場', '0933413086', 'https://website-2574047208101526925132-campground.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松山露營區', 'camping', 24.33074, 120.820138, '苗栗縣卓蘭鎮松山農路', '苗栗縣卓蘭鎮 — 未登記露營場', '0938476970', 'https://m.facebook.com/ï¼E6ï¼9Dï¼BEï¼E5ï¼B1ï¼B1ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-970947863011636/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('333露營區', 'camping', 24.340288, 120.841257, '雙連道路33之3號', '苗栗縣卓蘭鎮 — 未登記露營場', '0910567118', 'https://www.facebook.com/p/333%E9%9C%B2%E7%87%9F%E5%8D%80camping-100084316220737/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('怡心園歡樂露營區', 'camping', 24.332993, 120.831594, '苗栗縣卓蘭鎮西坪里西坪4鄰43之6號', '苗栗縣卓蘭鎮 — 未登記露營場', '0911767358', 'https://www.facebook.com/gogoecu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('兩朵雲露營區', 'camping', 24.336199, 120.803805, '苗栗縣卓蘭鎮西坪125之3號', '苗栗縣卓蘭鎮 — 未登記露營場', '0937211579', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新百香自然農場', 'camping', 24.574465, 120.99747, '苗栗縣南庄鄉小東河23號', '苗栗縣南庄鄉 — 未登記露營場', '037821850', 'https://www.facebook.com/newpassinfarm/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南洋62之森', 'camping', 24.574045, 120.997788, '南江村小東河23號', '苗栗縣南庄鄉 — 未登記露營場', '037821850', 'https://baeshi.com.tw/index.php/camping', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪雅庭園露營區', 'camping', 24.596937, 120.996734, '苗栗縣南庄鄉西村大屋坑', '苗栗縣南庄鄉 — 未登記露營場', '0989554115', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有鬼露營區', 'camping', 24.54064, 121.025976, '苗栗縣南庄鄉東河村鹿場部落24鄰13-5號', '苗栗縣南庄鄉 — 未登記露營場', '037824232', 'https://www.easycamp.com.tw/Store_2204.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南苑渡假莊園', 'camping', 24.57504, 120.99649, '苗栗縣南庄鄉南江村小東河21號', '苗栗縣南庄鄉 — 未登記露營場', '037821850,037825798', 'https://nanyuanmanor.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山川密境露營區', 'camping', 24.59644, 121.01898, '353005苗栗縣南庄鄉東江1鄰9號1鄰2-6號', '苗栗縣南庄鄉 — 未登記露營場', '0926955971', 'http://www.33camping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一葉蘭農場', 'camping', 24.530513, 121.024055, '苗栗縣南庄鄉東河村鹿場24鄰21號', '苗栗縣南庄鄉 — 未登記露營場', '0927610610', 'https://pft.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('紅毛印象露營窩', 'camping', 24.54175, 120.97533, '苗栗縣南庄鄉蓬萊村紅毛館五鄰66號', '苗栗縣南庄鄉 — 未登記露營場', '0937465062', 'https://www.easycamp.com.tw/Store_1644.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原高露營區', 'camping', 24.52271089, 120.9739069, '苗栗縣南庄鄉大湳', '苗栗縣南庄鄉 — 未登記露營場', '0958934936', 'https://m.icamping.app/store/yg705', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉彩露營區', 'camping', 24.535679, 120.975905, '14之1號, 南庄鄉苗栗縣353', '苗栗縣南庄鄉 — 未登記露營場', NULL, 'https://www.facebook.com/pages/category/Campground/%E6%9D%89%E5%BD%A9%E9%9C%B2%E7%87%9F%E5%8D%80-1204456929679182/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('啊露吧Camping聖地', 'camping', 24.557124, 120.9774, '蓬萊村2鄰紅毛館35號', '苗栗縣南庄鄉 — 未登記露營場', '0911902992', 'https://www.facebook.com/p/%E5%95%8A-%E9%9C%B2%E5%90%A7Camping%E8%81%96%E5%9C%B0-ChinUp-Cafe-100076319873510/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('半是青山半白雲露營區', 'camping', 24.553886, 120.974294, '苗栗縣南庄鄉蓬萊村3鄰紅毛館41號', '苗栗縣南庄鄉 — 未登記露營場', '0905293319', 'https://www.facebook.com/lordcamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('河岸星空露營地', 'camping', 24.58098, 120.989845, '苗栗縣南庄鄉南江村小東河14鄰8-1號', '苗栗縣南庄鄉 — 未登記露營場', '0926218982', 'https://riverstar-camp.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('德佬露營區', 'camping', 24.538821, 121.026963, '苗栗縣南庄鄉東河村鹿場', '苗栗縣南庄鄉 — 未登記露營場', '0933494641', 'https://www.facebook.com/pages/%E5%BE%B7%E4%BD%AC%E9%9C%B2%E7%87%9F%E5%8D%80/258660748010392', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仁心茶園露營區', 'camping', 24.530059, 121.021288, '苗栗縣南庄鄉東河村24鄰鹿場28號', '苗栗縣南庄鄉 — 未登記露營場', '0920486270', 'https://www.easycamp.com.tw/Store_2621.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春友彩虹露營區', 'camping', 24.612719, 121.003761, '苗栗縣南庄鄉東村17 鄰 111 號', '苗栗縣南庄鄉 — 未登記露營場', '0966096816', 'https://www.easycamp.com.tw/Store_2207.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('加里山登山口森林露營區', 'camping', 24.527285, 121.024822, '苗栗縣南庄鄉東河村鹿場24鄰19-20號', '苗栗縣南庄鄉 — 未登記露營場', '0938078265', 'https://www.facebook.com/%E5%8A%A0%E9%87%8C%E5%B1%B1%E7%99%BB%E5%B1%B1%E5%8F%A3%E6%A3%AE%E6%9E%97%E9%9C%B2%E7%87%9F%E5%8D%80-1793112290941021/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('力新小築', 'camping', 24.595166, 121.000532, '苗栗縣南庄鄉南江村東江100號', '苗栗縣南庄鄉 — 未登記露營場', '0933190564', 'https://www.lisin.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('如是露營區', 'camping', 24.53888, 120.96846, '苗栗縣南庄鄉蓬萊村8鄰142-18號', '苗栗縣南庄鄉 — 未登記露營場', '0932155247', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清景農場', 'camping', 24.559216, 120.973743, '苗栗縣南庄鄉蓬萊村紅毛館30號', '苗栗縣南庄鄉 — 未登記露營場', '037821040', 'https://www.facebook.com/love.30camp.farm/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星宿景觀咖啡民宿', 'camping', 24.55075, 120.97335, '苗栗縣南庄鄉四鄰53之1號', '苗栗縣南庄鄉 — 未登記露營場', '0928747946', 'https://www.starcoffee.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('知泉渡假山莊', 'camping', 24.538081, 120.969189, '苗栗縣南庄鄉蓬萊村8鄰139號', '苗栗縣南庄鄉 — 未登記露營場', '0921370718', 'http://campe.idv.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('百香自然農場', 'camping', 24.57378, 120.99758, '苗栗縣南庄鄉小東河23號', '苗栗縣南庄鄉 — 未登記露營場', '037821850,037825798', 'https://www.facebook.com/wellhead.8898.tw', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水與樹莊園', 'camping', 24.566627, 120.985779, '苗栗縣南庄鄉南江村18鄰長崎下9號', '苗栗縣南庄鄉 — 未登記露營場', '0966551665', 'https://www.facebook.com/watertreemanor/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('裕見生活', 'camping', 24.596533, 121.006798, '南江村3鄰東江38之12號', '苗栗縣南庄鄉 — 未登記露營場', '037821188', 'https://www.facebook.com/yumountainlife/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('慕木露營區', 'camping', 24.53525, 121.019076, '苗栗縣南庄鄉', '苗栗縣南庄鄉 — 未登記露營場', '0918530305', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星原谷露營區', 'camping', 24.590222, 120.997639, '南江村里金館8鄰25號', '苗栗縣南庄鄉 — 未登記露營場', '0937300250', 'https://starvalley.camp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('轉個彎露營', 'camping', 24.53535, 121.02042, '苗栗縣南庄鄉東河村鹿場24鄰19-12號', '苗栗縣南庄鄉 — 未登記露營場', '0982388928', 'https://m.icamping.app/store/jgw475', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星星杉丘露營地', 'camping', 24.570637, 120.999995, '苗栗縣南庄鄉南江村14鄰小東河', '苗栗縣南庄鄉 — 未登記露營場', '0988020657', 'https://www.facebook.com/starshillcampsite/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司焉慕', 'camping', 24.59753, 121.05386, '8鄰', '苗栗縣南庄鄉 — 未登記露營場', '0972109335,0975501967', 'https://www.facebook.com/sym565/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山居蘭園民宿', 'camping', 24.616558, 120.987178, '苗栗縣南庄鄉4灣22鄰77號', '苗栗縣南庄鄉 — 未登記露營場', '0970618793', 'https://bnb.many30.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一畝田(蓮花帳系列)', 'camping', 24.544092, 120.973199, '苗栗縣南庄鄉篷萊村5鄰64-2號', '苗栗縣南庄鄉 — 未登記露營場', '0976281182', 'https://www.easycamp.com.tw/Store_2372.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鳳凰谷露營區', 'camping', 24.6246, 121.00631, '苗栗縣南庄鄉田美村7鄰田美125-1號', '苗栗縣南庄鄉 — 未登記露營場', '0912123414', 'https://m.icamping.app/store/nzfhg119', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉瓦露營區', 'camping', 24.539772, 121.026629, '苗栗縣南庄鄉鹿場聯絡道路24鄰11號', '苗栗縣南庄鄉 — 未登記露營場', '0911819898', 'https://www.facebook.com/LawaCamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南庄雲水度假森林', 'camping', 24.59887, 121.01052, '苗栗縣南庄鄉南江村東江31-3號', '苗栗縣南庄鄉 — 未登記露營場', '037825285', 'https://www.cloudlandresort.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日杉林露營區', 'camping', 24.61614, 121.0427, '苗栗縣南庄鄉東河村11鄰橫屏背8之1號', '苗栗縣南庄鄉 — 未登記露營場', '0930267311,0932617311', 'https://www.facebook.com/sunsun.camping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('槌球趣露營區', 'camping', 24.579055, 120.988797, '南江20鄰21號', '苗栗縣南庄鄉 — 未登記露營場', '0934279132', 'https://www.facebook.com/groups/907749666900182/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('木偶精靈休閒農莊', 'camping', 24.631237, 120.993918, '苗栗縣南庄鄉南富村18村四灣47-17號', '苗栗縣南庄鄉 — 未登記露營場', '0921693380', 'https://camp.many30.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翰爸的家', 'camping', 24.52105, 120.96492, '蓬萊段1-2、1-3地號', '苗栗縣南庄鄉 — 未登記露營場', '0936454869,0936596099', 'https://www.facebook.com/people/%E7%BF%B0%E7%88%B8%E7%9A%84%E5%AE%B6/100064162326554/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲舞露營區', 'camping', 24.530542, 121.021486, '苗栗縣南庄鄉鹿場舊風美部落', '苗栗縣南庄鄉 — 未登記露營場', '0970636296', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田美虹橋露營區', 'camping', 24.633804, 121.010213, '苗栗縣南庄鄉員林獅頭山道23號', '苗栗縣南庄鄉 — 未登記露營場', '0937958121', 'https://www.facebook.com/twcampin/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好山好水民宿', 'camping', 24.549294, 120.973046, '苗栗縣南庄蓬萊村4鄰53-6號', '苗栗縣南庄鄉 — 未登記露營場', '037825789', 'https://www.gmgw.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南山傳奇露營區', 'camping', 24.525127, 120.970857, '苗栗縣南庄鄉大湳連絡道路二', '苗栗縣南庄鄉 — 未登記露營場', '0910001542', 'https://www.easycamp.com.tw/Store_2208.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('向天湖露營區', 'camping', 24.57892, 121.03141, '東河村向天湖17鄰18號', '苗栗縣南庄鄉 — 未登記露營場', '0935635716', 'https://www.campingmap.com.tw/listings/xiangtian-lake-campsite--miaoli-county', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('岩岩露營區', 'camping', 24.605269, 120.998555, '353苗栗縣南庄鄉環清路25之1號', '苗栗縣南庄鄉 — 未登記露營場', '0933461465', 'https://m.facebook.com/0933461465ROCK/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達喇改露營區', 'camping', 24.538104, 121.027433, '東河村24鄰鹿場部落內', '苗栗縣南庄鄉 — 未登記露營場', '0938429121', 'https://www.facebook.com/dalagai/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('河畔露營區', 'camping', 24.580536, 120.989704, '苗栗縣南庄鄉南江村14鄰小東河8-1號', '苗栗縣南庄鄉 — 未登記露營場', '0988252939', 'https://m.icamping.app/store/njhp398', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('陶然山莊', 'camping', 24.535236, 120.962299, '苗栗縣南庄鄉蓬萊村42份8-5號', '苗栗縣南庄鄉 — 未登記露營場', '037823015', 'https://nzt.mmweb.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('搭漾露營區', 'camping', 24.539649, 121.026089, '苗栗縣南庄鄉', '苗栗縣南庄鄉 — 未登記露營場', NULL, 'https://www.facebook.com/kaotayal', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘿菈松靜露營區', 'camping', 24.559846, 121.04005, '苗栗縣南庄鄉東河村21鄰石壁22號', '苗栗縣南庄鄉 — 未登記露營場', '0966536037', 'https://m.icamping.app/store/llsj104', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('食水窩露營區', 'camping', 24.626422, 121.027046, '苗栗縣南庄鄉獅山村7鄰5之6號', '苗栗縣南庄鄉 — 未登記露營場', '0928972876', 'https://www.easycamp.com.tw/Store_2203.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新之助民宿', 'camping', 24.595439, 121.003922, '苗栗縣南江村東江73-6號', '苗栗縣南庄鄉 — 未登記露營場', '0932615151', 'https://www.facebook.com/sdj342/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逍遙居山庄', 'camping', 24.627894, 121.018822, '苗栗縣南庄鄉獅山村150號之16', '苗栗縣南庄鄉 — 未登記露營場', '0975556333', 'http://play.many30.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('栗田庄露營區', 'camping', 24.58365, 120.99297, '苗栗縣南庄鄉南江村14鄰小東河17之2號', '苗栗縣南庄鄉 — 未登記露營場', '037824978', 'https://ltc-camping.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南庄麒麟山露營區', 'camping', 24.522784, 120.972262, '苗栗縣南庄鄉南江村小東河11號', '苗栗縣南庄鄉 — 未登記露營場', '0916062830', 'https://www.easycamp.com.tw/Store_2356.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('川夏野奢露營區', 'camping', 24.57387, 120.9856, '苗栗縣南庄鄉南江村17鄰福南50-1號', '苗栗縣南庄鄉 — 未登記露營場', '037821595', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南庄山河苑露營區', 'camping', 24.5756, 120.98841, '南江村福南24-1號', '苗栗縣南庄鄉 — 未登記露營場', '0938263802,09113084a06', 'https://www.facebook.com/sunlightCamp/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('秘境露營區', 'camping', 24.567346, 120.98509, '苗栗縣南庄鄉', '苗栗縣南庄鄉 — 未登記露營場', '0937515333', 'https://www.facebook.com/alfa0156gta', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星晨露營區', 'camping', 24.633189, 121.004749, '苗栗縣南庄鄉田美村12鄰四灣47之5號', '苗栗縣南庄鄉 — 未登記露營場', '0921102925', 'https://www.starmorning.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長青露營區', 'camping', 24.574007, 120.987205, '苗栗縣南庄鄉南江村福南23鄰25-1號', '苗栗縣南庄鄉 — 未登記露營場', '0972297322', 'https://www.easycamp.com.tw/Store_1813.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蓬萊灣露營區', 'camping', 24.564221, 120.985228, '苗栗縣南庄鄉南江村長崎下18鄰13之3', '苗栗縣南庄鄉 — 未登記露營場', '0966717287', 'https://www.easycamp.com.tw/Store_2411.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿場斜坑民宿露營區', 'camping', 24.54005, 121.027733, '苗栗縣南庄鄉鹿場部落', '苗栗縣南庄鄉 — 未登記露營場', '0912619636', 'https://www.facebook.com/%E9%B9%BF%E5%A0%B4%E6%96%9C%E5%9D%91%E6%AF%94%E9%BB%9B%E9%9C%B2%E7%87%9F%E5%8D%80-1061412917230399/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南庄慢生活露營區', 'camping', 24.616578, 121.018958, '田美村4鄰72-6號', '苗栗縣南庄鄉 — 未登記露營場', '0922981930,0922169700', 'https://www.facebook.com/p/%E5%8D%97%E5%BA%84%E6%85%A2%E7%94%9F%E6%B4%BB-%E9%9C%B2%E7%87%9F%E5%8D%80-100063769095306/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松濤意境', 'camping', 24.6105, 120.99652, '苗栗縣南庄鄉田美村15鄰四灣90-1號', '苗栗縣南庄鄉 — 未登記露營場', '0919676258', 'https://www.facebook.com/%E6%9D%BE%E6%BF%A4%E6%84%8F%E5%A2%83%E9%9C%B2%E7%87%9F-1727374790815411/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈洛客露營區', 'camping', 24.6069, 121.05214, '苗栗縣南庄鄉東河農路137號', '苗栗縣南庄鄉 — 未登記露營場', '0975024555,0926786100', 'https://www.facebook.com/Hororok.camp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('秘境露營', 'camping', 24.567925, 120.984876, '苗栗縣南庄鄉中山高速公路8號南江村', '苗栗縣南庄鄉 — 未登記露營場', '0937515333', 'https://www.facebook.com/%E7%A7%98%E5%A2%83%E9%9C%B2%E7%87%9Fpart2-1935412963350944/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巴卡的天空', 'camping', 24.525237, 120.972443, '苗栗縣南庄鄉蓬萊村14大湳30-16號', '苗栗縣南庄鄉 — 未登記露營場', '0980235171', 'https://m.icamping.app/store/bkdtk079', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('撒萬露營區', 'camping', 24.522241, 120.976019, '苗栗縣南庄鄉紅毛館14鄰30號', '苗栗縣南庄鄉 — 未登記露營場', '0938933900', 'https://m.icamping.app/store/sw426', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吻吻 bun bun 露營區', 'camping', 24.52895, 121.02118, '苗栗縣南庄鄉東河村鹿場部落24鄰鹿場16號', '苗栗縣南庄鄉 — 未登記露營場', '037825785', 'https://www.facebook.com/people/%E5%90%BB%E5%90%BBbun-bun%E9%9C%B2%E7%87%9F%E5%8D%80/100063930373992/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南庄露露', 'camping', 24.572404, 120.983186, '苗栗縣南庄鄉南江村19鄰8-1號', '苗栗縣南庄鄉 — 未登記露營場', '0921666783', 'https://www.facebook.com/%E5%8D%97%E5%BA%84%E9%9C%B2%E9%9C%B2-x-Lulu-Camping-1440942022883508/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('慢生活露營區', 'camping', 24.61733, 121.01842, '苗栗縣南庄鄉田美村4鄰72-6號', '苗栗縣南庄鄉 — 未登記露營場', '0922169700', 'https://www.easycamp.com.tw/Store_2321.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('法愛露營區', 'camping', 24.536712, 121.025364, '苗栗縣南庄鄉東河村鹿場部落', '苗栗縣南庄鄉 — 未登記露營場', '0911770200', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('上長崎露營區', 'camping', 24.56426, 120.985439, '南江村18鄰長崎下13之3號（此為商號所在地）', '苗栗縣南庄鄉 — 未登記露營場', '0966717287', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('食水窩露營區', 'camping', 24.626368, 121.027168, '苗栗縣南庄鄉獅山村7鄰5之6號', '苗栗縣南庄鄉 — 未登記露營場', '0928972876', 'https://www.easycamp.com.tw/Store_2203.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晴園山莊', 'camping', 24.61477, 120.987571, '苗栗縣南庄鄉南富村四灣76號', '苗栗縣南庄鄉 — 未登記露營場', '0988570855', 'https://www.facebook.com/sungardentrip/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桂花園鄉村會館', 'camping', 24.595909, 121.003783, '苗栗縣南庄鄉東江5鄰73之7號', '苗栗縣南庄鄉 — 未登記露營場', '037823066', 'https://www.laurals.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星語軒渡假村', 'camping', 24.53637, 120.96363, '苗栗縣南庄鄉蓬萊村9鄰42份8號', '苗栗縣南庄鄉 — 未登記露營場', '037825359', 'https://www.037825359.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲境松林', 'camping', 24.523248, 120.971914, '苗栗縣南庄鄉蓬萊村大湳14鄰36號', '苗栗縣南庄鄉 — 未登記露營場', '0932094779', 'https://m.icamping.app/store/yjs495', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('六呆露營區', 'camping', 24.608818, 121.015367, '苗栗縣南庄鄉田美村', '苗栗縣南庄鄉 — 未登記露營場', '0906931657', 'http://www.sixfoolcamp.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山窩露營地', 'camping', 24.62614, 121.01307, '苗栗縣南庄鄉獅山村田美22-3號', '苗栗縣南庄鄉 — 未登記露營場', '0935343130', 'https://www.facebook.com/%E5%B1%B1%E7%AA%A9-448965415308185/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青杉嶴', 'camping', 24.557089, 121.040283, '苗栗縣南庄鄉東河村石壁23號', '苗栗縣南庄鄉 — 未登記露營場', '037821510', 'https://www.facebook.com/Ao.cafe.BnB/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森之奧', 'camping', 24.58062, 121.02566, '北獅里興段獅頭驛小段78-2號', '苗栗縣南庄鄉 — 未登記露營場', '0986054514', 'https://www.facebook.com/p/%E6%A3%AE%E4%B9%8B%E5%A5%A7-100089121821914/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('赫利豐岳', 'camping', 24.60539, 120.99321, '苗栗縣南庄鄉西村11鄰大屋坑32之6號', '苗栗縣南庄鄉 — 未登記露營場', '0986676099', 'https://tw-camping.tw/hotel_info.asp?hid=237ï¼EFï¼BCï¼89', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翔晶南庄麒麟山露營區', 'camping', 24.567903, 120.984847, '苗栗縣南庄鄉南江村小東河11號', '苗栗縣南庄鄉 — 未登記露營場', '0958343232', 'https://www.easycamp.com.tw/Store_2356.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘇維拉莊園', 'camping', 24.60697, 120.994102, '田美村四灣92號', '苗栗縣南庄鄉 — 未登記露營場', '0905313077', 'https://sudvista.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('林泉休閒露營區', 'camping', 24.57303, 120.98726, '苗栗縣南庄鄉南江村17鄰福南30號', '苗栗縣南庄鄉 — 未登記露營場', '0953973153,0937243591', 'https://camping.many30.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高山青露營區', 'camping', 24.52223, 120.976026, '苗栗縣南庄鄉蓬萊村14鄰30號', '苗栗縣南庄鄉 — 未登記露營場', '0958934936', 'https://www.facebook.com/MountainsAreGreen/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晨境森林', 'camping', 24.5515981, 120.9757543, '苗栗縣南庄鄉北獅里蓬萊村4鄰紅毛館46號', '苗栗縣南庄鄉 — 未登記露營場', '033243199', 'https://m.icamping.app/store/cjsl280', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鑽石林4', 'camping', 24.427447, 120.919896, '大興村高熊卡4鄰61-16號', '苗栗縣南庄鄉 — 未登記露營場', '0910270025', 'https://www.facebook.com/emdfcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東風營地', 'camping', 24.559088, 120.978377, '苗栗縣南庄鄉蓬萊村2鄰24號', '苗栗縣南庄鄉 — 未登記露營場', '0910585224', 'https://www.facebook.com/profile.php?id=100063718124215', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好望角蕃薯園', 'camping', 24.597341, 120.731325, '苗栗縣後龍鎮中和里12鄰崎頂117號', '苗栗縣後龍鎮 — 未登記露營場', '037923953', 'http://www.wkz.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藍天綠地露營區', 'camping', 24.588187, 120.764904, '苗栗縣後龍鎮福寧里頭湖6-2號', '苗栗縣後龍鎮 — 未登記露營場', '0952617157', 'https://www.facebook.com/bag1155/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黃金好望角', 'camping', 24.587727, 120.763706, '苗栗縣後龍鎮', '苗栗縣後龍鎮 — 未登記露營場', '0920350365', 'http://www.goldenttcamp.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('台灣水牛城', 'camping', 24.587489, 120.768068, '苗栗縣後龍鎮龍坑里17鄰十班坑181-11號', '苗栗縣後龍鎮 — 未登記露營場', '037732097', 'https://www.732097.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杜石地一號', 'camping', 24.56623, 120.7886, '苗栗縣苗栗市新英里1鄰新英9之1號', '苗栗縣苗栗市 — 未登記露營場', '037375062', 'https://www.facebook.com/DuShiDiNO1/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('英台休閒牧場', 'camping', 24.560876, 120.797161, '苗栗縣苗栗市新英27號', '苗栗縣苗栗市 — 未登記露營場', '0921319464', 'https://www.facebook.com/%E8%8B%B1%E5%8F%B0%E4%BC%91%E9%96%92%E7%89%A7%E5%A0%B4-476556999176979/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('盛格露營區', 'camping', 24.403902, 120.740545, '苗栗縣苑裡鎮', '苗栗縣苑裡鎮 — 未登記露營場', '0932666974', 'https://m.facebook.com/yasugu2016', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('珍愛-幸福親子手作露營趣', 'camping', 24.404758, 120.738382, '35877苗栗縣苑裡鎮1鄰7-2號', '苗栗縣苑裡鎮 — 未登記露營場', '0975860756', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逸山露營', 'camping', 24.406035, 120.730435, '苗栗縣苑裡鎮', '苗栗縣苑裡鎮 — 未登記露營場', '0931457202', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('盛格（蕉埔）露營區', 'camping', 24.404344, 120.74043, '苗栗縣苑裡鎮蕉埔里蕉埔1鄰3號', '苗栗縣苑裡鎮 — 未登記露營場', '0932666974', 'https://www.facebook.com/yasugu2016/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉行居', 'camping', 24.402911, 120.980594, '梅園段65號', '苗栗縣泰安鄉 — 未登記露營場', '0930305582', 'https://www.facebook.com/65.camping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('跋ㄚ諾乎露營區', 'camping', 24.39065892, 120.9789299, '苗栗縣泰安鄉梅園村6鄰天狗20之2號', '苗栗縣泰安鄉 — 未登記露營場', '0923803636', 'https://www.facebook.com/baanohu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露也楓情 (羽楓區)', 'camping', 24.43008484, 120.9146246, '苗栗縣泰安鄉大興村部落', '苗栗縣泰安鄉 — 未登記露營場', '0989183989', 'https://m.icamping.app/store/lyfc017', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有bear來 休閒露營區', 'camping', 24.450111, 120.94451, '365008苗栗縣泰安鄉29之5號', '苗栗縣泰安鄉 — 未登記露營場', '0970993311', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鑽石林5', 'camping', 24.427447, 120.919896, '大興村高熊卡4鄰61-16號', '苗栗縣泰安鄉 — 未登記露營場', '0910270025', 'https://www.facebook.com/emdfcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逢雲露營區', 'camping', 24.390949, 120.95543, '苗栗縣泰安鄉梅園村2鄰66-25號', '苗栗縣泰安鄉 — 未登記露營場', '0933458305', 'https://m.icamping.app/store/fy374', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高腳屋草莓園', 'camping', 24.429405, 120.93268, '苗栗縣泰安鄉8鄰193號', '苗栗縣泰安鄉 — 未登記露營場', '0926653912', 'https://zh-tw.facebook.com/pages/category/Travel-Company/%E9%AB%98%E8%85%B3%E5%B1%8B%E8%8D%89%E8%8E%93%E5%9C%92-343987258964914/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('象鼻休閒山莊', 'camping', 24.36190739, 120.9448419, '苗栗縣泰安鄉象鼻村1鄰9-3號', '苗栗縣泰安鄉 — 未登記露營場', '0912948440', 'https://m.icamping.app/store/sb531', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老鷹山・鑽石林', 'camping', 24.428267, 120.918959, '苗栗縣泰安鄉', '苗栗縣泰安鄉 — 未登記露營場', '0910270025', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('悠然之地', 'camping', 24.35662, 120.96575, '苗栗縣泰安鄉麻必浩部落', '苗栗縣泰安鄉 — 未登記露營場', '0905857501', 'https://www.facebook.com/people/%E6%82%A0%E7%84%B6%E4%B9%8B%E5%9C%B0%E9%9C%B2%E7%87%9F%E5%8D%80/61560607550062/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('忘憂小築休閒俱樂部', 'camping', 24.429196, 120.91985, '365苗栗縣泰安鄉小南角66之2號', '苗栗縣泰安鄉 — 未登記露營場', '0923989988', 'http://www.wangucamping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('簡賢福', 'camping', 24.425856, 120.919364, '苗栗縣泰安鄉大興村部落', '苗栗縣泰安鄉 — 未登記露營場', '0989183989', 'https://m.icamping.app/store/lyfc017', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天狗好地方露營區', 'camping', 24.389513, 120.976992, '苗栗縣泰安鄉梅園村4鄰天狗7之6號', '苗栗縣泰安鄉 — 未登記露營場', '0912616440', 'https://www.facebook.com/goodcamp928/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲霧灣灣', 'camping', 24.38748, 120.82796, '栗林村薑麻園9號', '苗栗縣泰安鄉 — 未登記露營場', '0900781080,0911767474', 'https://cloudybay.130.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('豐之優露營區', 'camping', 24.444507, 120.922811, '苗栗縣泰安鄉12鄰109之12號', '苗栗縣泰安鄉 — 未登記露營場', '0910922961', 'https://m.icamping.app/store/fcy256', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('二本松露營區', 'camping', 24.40277, 120.979766, '苗栗縣泰安鄉司馬限林道14K又150m處叉路右轉', '苗栗縣泰安鄉 — 未登記露營場', '0978382602', 'https://www.facebook.com/JCZNog/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('云心園', 'camping', 24.393672, 120.978799, '梅園段 357-2地號', '苗栗縣泰安鄉 — 未登記露營場', '0963586237', 'https://m.icamping.app/store/ysy646', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鑽石林2', 'camping', 24.427447, 120.919896, '大興村高熊卡4鄰61-16號', '苗栗縣泰安鄉 — 未登記露營場', '0910270025', 'https://www.facebook.com/emdfcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('遊牧民族露營區', 'camping', 24.429235, 120.914215, '苗栗縣泰安鄉大興村5鄰高熊卡47-6號', '苗栗縣泰安鄉 — 未登記露營場', '0980850330', 'https://m.icamping.app/store/ymmz011', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('洗水山露營區', 'camping', 24.442003, 120.940675, '苗栗縣泰安鄉清安村腦寮庄31-18號', '苗栗縣泰安鄉 — 未登記露營場', '0919673263', 'https://m.icamping.app/store/sss014', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美富安松林溪露營區', 'camping', 24.35402086, 120.9627855, '苗栗縣泰安鄉象鼻村永安33之6號', '苗栗縣泰安鄉 — 未登記露營場', '0985480173', 'https://m.icamping.app/store/mfa015', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老古董民宿露營區', 'camping', 24.431956, 120.930592, '苗栗縣泰安鄉清安村洗水坑141-2號', '苗栗縣泰安鄉 — 未登記露營場', '0921941055', 'https://m.icamping.app/store/lkt266', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五鄰休閒露營區', 'camping', 24.429078, 120.911296, '苗栗縣泰安鄉5鄰42號', '苗栗縣泰安鄉 — 未登記露營場', '0916060404', 'https://m.icamping.app/store/wlxj197', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一線天', 'camping', 24.389673, 120.922098, '苗栗縣泰安鄉苗栗縣泰安鄉中興村中象道路3鄰', '苗栗縣泰安鄉 — 未登記露營場', '0917288771', 'https://m.icamping.app/store/yxt199', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黃熊部落', 'camping', 24.419086, 120.909311, '苗栗縣泰安鄉大興村2鄰12-2號', '苗栗縣泰安鄉 — 未登記露營場', '0975089909', 'https://m.icamping.app/store/hxbl090', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('思穀汗 Skuhan 休閒露營區', 'camping', 24.388264, 120.924581, '苗栗縣泰安鄉中興村長橋三鄰33之5號', '苗栗縣泰安鄉 — 未登記露營場', '0934228525', 'https://m.icamping.app/store/skh096', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐嵐語 Camping 露營區', 'camping', 24.429006, 120.910023, '苗栗縣泰安鄉大興村高熊卡389-2號', '苗栗縣泰安鄉 — 未登記露營場', '0968268810', 'https://m.icamping.app/store/mly561?fs=e&s=cl', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花石間景觀露營區', 'camping', 24.420346, 120.916906, '苗栗縣泰安鄉', '苗栗縣泰安鄉 — 未登記露營場', '0933152018', 'https://www.facebook.com/hu.yu.daughter/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清安樹坪露營區', 'camping', 24.427989, 120.937439, '苗栗縣泰安鄉清安村8鄰洗水坑170號', '苗栗縣泰安鄉 — 未登記露營場', '0928185340', 'https://www.easycamp.com.tw/Store_2358.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬嘟溪露營基地', 'camping', 24.444765, 120.917892, '苗栗縣泰安鄉清安村洗水坑114之9號', '苗栗縣泰安鄉 — 未登記露營場', '0955343555', 'https://www.easycamp.com.tw/Store_974.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星野天空露營區', 'camping', 24.429228, 120.921059, '苗栗縣泰安鄉小南角3鄰66之1號', '苗栗縣泰安鄉 — 未登記露營場', '0936824777', 'https://www.camptrip.com.tw/camp/%E6%98%9F%E9%87%8E%E5%A4%A9%E7%A9%BA/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瞭望角景觀民宿露營區', 'camping', 24.429458, 120.921704, '苗栗縣泰安鄉清安村3鄰小南角66號', '苗栗縣泰安鄉 — 未登記露營場', '0963929707', 'https://www.facebook.com/gocamping520/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亞哇斯露營區', 'camping', 24.489303, 120.938472, '苗栗縣泰安鄉八卦村3鄰53號', '苗栗縣泰安鄉 — 未登記露營場', '0938263609', 'https://m.icamping.app/store/yws062', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尤巴斯露營區', 'camping', 24.42984413, 120.9110226, '苗栗縣泰安鄉大興村五鄰高熊卡45號', '苗栗縣泰安鄉 — 未登記露營場', '0988638901', 'https://m.icamping.app/store/ybs196', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山頂動人', 'camping', 24.4188011, 120.9367733, '泰安鄉清安村7鄰洗水坑163-1號', '苗栗縣泰安鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('明瓦南露營區', 'camping', 24.39194, 120.957694, '苗栗縣泰安鄉梅園村2鄰66號-31', '苗栗縣泰安鄉 — 未登記露營場', '0934267416', 'https://m.icamping.app/store/mwn461', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('烏嘎彥景觀休閒露營區', 'camping', 24.421662, 120.923586, '苗栗縣泰安鄉高熊卡3鄰63-10號', '苗栗縣泰安鄉 — 未登記露營場', '0970682603', 'https://www.u-kayan.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('咖啦灣露營區', 'camping', 24.46357982, 120.9468341, '苗栗縣泰安鄉錦水村7鄰圓墩60-9號', '苗栗縣泰安鄉 — 未登記露營場', '0988506821', 'https://m.facebook.com/profile.php?id=100054239330380', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田度550露營區', 'camping', 24.446845, 120.918887, '清安村洗水坑103-2號', '苗栗縣泰安鄉 — 未登記露營場', '0963585681', 'https://farm550.mmweb.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山林間', 'camping', 24.428094, 120.912708, '五鄰46號', '苗栗縣泰安鄉 — 未登記露營場', '0930869406', 'https://www.booking.com/hotel/tw/shan-lin-jian-bao-chang-lu-ying-qu.zh-tw.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楚留香民宿', 'camping', 24.44309, 120.919457, '苗栗縣泰安鄉洗水坑114號', '苗栗縣泰安鄉 — 未登記露營場', '037941730', 'http://www.clh.idv.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('上巴爺爺露營區', 'camping', 24.470967, 120.967172, '苗栗縣泰安鄉橫龍山9鄰44號', '苗栗縣泰安鄉 — 未登記露營場', '0985166651', 'https://m.icamping.app/store/sby488', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星露農場', 'camping', 24.501907, 120.950429, '苗栗縣泰安鄉八卦村4鄰68號', '苗栗縣泰安鄉 — 未登記露營場', '0912553259', 'https://www.facebook.com/%E6%98%9F%E9%9C%B2%E8%BE%B2%E5%A0%B4-500634636811790/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('ㄠ嶩民宿露營', 'camping', 24.388839, 120.965957, '苗栗縣泰安鄉梅園村2鄰23號', '苗栗縣泰安鄉 — 未登記露營場', '037962128', 'http://aw-naw.emiaoli.tw/?ptype=info', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楓李小棧露營區', 'camping', 24.42615, 120.918613, '苗栗縣泰安鄉大興村4鄰61-7號', '苗栗縣泰安鄉 — 未登記露營場', '0919366476', 'https://m.icamping.app/store/flxz078', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露也楓情 (羽松區)', 'camping', 24.425856, 120.919364, '苗栗縣泰安鄉大興村4鄰59-3號', '苗栗縣泰安鄉 — 未登記露營場', '0989183989', 'https://m.icamping.app/store/lyfc017', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('川林休閒露營區', 'camping', 24.345599, 120.933342, '苗栗縣泰安鄉士林村6鄰馬那邦45之1號 365', '苗栗縣泰安鄉 — 未登記露營場', '0920106604', 'https://reurl.cc/anZybQ', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('虹杉露營區', 'camping', 24.422508, 120.917883, '苗栗縣泰安鄉大興村高熊卡4鄰57-5號', '苗栗縣泰安鄉 — 未登記露營場', '0933190209', 'https://www.facebook.com/hongsan.siyat/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一片天露營區', 'camping', 24.502616, 120.953718, '苗栗縣泰安鄉八卦村4鄰69-1號', '苗栗縣泰安鄉 — 未登記露營場', '0222527966', 'https://www.easycamp.com.tw/Store_931.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('寬闊露營區(狩獵帳)', 'camping', 24.386512, 120.965315, '梅園部落梅園段1171地號', '苗栗縣泰安鄉 — 未登記露營場', '0955322383', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿水泊露營區', 'camping', 24.482718, 120.96486, '10鄰橫龍山64之36號', '苗栗縣泰安鄉 — 未登記露營場', '0937242921', 'https://www.facebook.com/asb539/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南灣蹓蹓', 'camping', 24.412225, 120.912265, '苗栗縣泰安鄉大興村南灣6鄰34號', '苗栗縣泰安鄉 — 未登記露營場', '0982285343', 'https://m.icamping.app/store/nwll501', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('土牧驛健康農莊', 'camping', 24.49309629, 120.9453562, '苗栗縣泰安鄉八卦村4鄰八卦力59-3號', '苗栗縣泰安鄉 — 未登記露營場', '0975191187', 'https://tumuyi.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藍天嶺露營區', 'camping', 24.420295, 120.923971, '苗栗縣泰安鄉大興村5鄰45號', '苗栗縣泰安鄉 — 未登記露營場', '0905084172', 'https://www.easycamp.com.tw/Store_1743.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('薆繞露營區', 'camping', 24.359936, 120.961004, '麻必浩段 802-1地號', '苗栗縣泰安鄉 — 未登記露營場', '0910586013', 'https://www.facebook.com/ar693/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('朵悠露營區', 'camping', 24.34952945, 120.9263157, '苗栗縣泰安鄉士林村33-1號', '苗栗縣泰安鄉 — 未登記露營場', '0919042744', 'https://www.easycamp.com.tw/Store_2338.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瓦浪露谷營地', 'camping', 24.39146809, 120.9803062, '苗栗縣泰安鄉梅園村天狗19號', '苗栗縣泰安鄉 — 未登記露營場', '0933550953', 'https://tw-camping.tw/hotel_info.asp?hid=223', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪都安露營區', 'camping', 24.44046066, 120.9258488, '苗栗縣泰安鄉清安村洗水坑118號', '苗栗縣泰安鄉 — 未登記露營場', '0937721836', 'https://www.easycamp.com.tw/Store_2060.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山視界露營區', 'camping', 24.430445, 120.921305, '苗栗縣泰安鄉清安村小南角5鄰40-3號', '苗栗縣泰安鄉 — 未登記露營場', '0905329633', 'https://m.icamping.app/store/ssj211', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('柏里紅', 'camping', 24.402911, 120.980594, '梅園段65號', '苗栗縣泰安鄉 — 未登記露營場', '0930305582', 'https://www.facebook.com/65.plihum', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('葳達露營區', 'camping', 24.35541423, 120.9677144, '苗栗縣泰安鄉象鼻村麻必浩部落', '苗栗縣泰安鄉 — 未登記露營場', '0965667721', 'https://www.facebook.com/pages/category/Campground/ï¼E8ï¼91ï¼B3ï¼E9ï¼81ï¼94ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-1710051359208398/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('友泰民宿溫泉館', 'camping', 24.468127, 120.94756, '苗栗縣泰安鄉錦水村6鄰圓敦46-2號', '苗栗縣泰安鄉 — 未登記露營場', '037941868', 'https://www.yotaispring.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰安仙境露營區', 'camping', 24.41987826, 120.9356278, '苗栗縣泰安鄉清安村8鄰', '苗栗縣泰安鄉 — 未登記露營場', '0953863199', 'https://zh-tw.facebook.com/%E6%B3%B0%E5%AE%89%E4%BB%99%E5%A2%83%E7%A7%81%E4%BA%BA%E5%BA%A6%E5%81%87%E6%9C%83%E6%89%80-192222061189399/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('莎酷菈露營區', 'camping', 24.403008, 120.976076, '苗栗縣泰安鄉司馬限林道苗61縣 苗栗縣泰安鄉梅園村4鄰天狗9之2號', '苗栗縣泰安鄉 — 未登記露營場', '0934485621', 'https://m.icamping.app/store/skl428', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('布耶特景觀營地', 'camping', 24.421009, 120.924102, '苗栗縣泰安鄉大興村3鄰烏嘎彥', '苗栗縣泰安鄉 — 未登記露營場', '0912007883', 'https://m.icamping.app/store/0912007883', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈撒山莊', 'camping', 24.425484, 120.915727, '苗栗縣泰安鄉大興村4鄰58號', '苗栗縣泰安鄉 — 未登記露營場', '0932321064', 'https://m.icamping.app/store/hssj021', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('KK露營區', 'camping', 24.377119, 120.957787, '9之16號', '苗栗縣泰安鄉 — 未登記露營場', '0920632570', 'https://www.facebook.com/people/KK%E9%9C%B2%E7%87%9F%E5%8D%80/100092214807232/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪亞鸞露營區', 'camping', 24.49226988, 120.9303194, '苗栗縣泰安鄉八卦村3鄰', '苗栗縣泰安鄉 — 未登記露營場', '0928617427', 'https://m.icamping.app/store/myl058', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('象之旅露營區', 'camping', 24.358176, 120.950493, '苗栗縣泰安鄉象鼻1鄰34號', '苗栗縣泰安鄉 — 未登記露營場', '0930079075', 'https://m.icamping.app/store/sjl366', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鑽石林3', 'camping', 24.427447, 120.919896, '大興村高熊卡4鄰61-16號', '苗栗縣泰安鄉 — 未登記露營場', '0910270025', 'https://www.facebook.com/emdfcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲朵朵露營區', 'camping', 24.442494, 120.926523, '苗栗縣泰安鄉清安村腦寮庄2號', '苗栗縣泰安鄉 — 未登記露營場', '0921926985', 'https://www.facebook.com/cloud2015/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈利匠民宿', 'camping', 24.34525795, 120.928616, '苗栗縣泰安鄉士林村4鄰馬那邦2-6號', '苗栗縣泰安鄉 — 未登記露營場', '0932503824', 'https://www.facebook.com/halijung.house/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石水坊露營區', 'camping', 24.417455, 120.927924, '苗栗縣泰安鄉清安村8鄰182號', '苗栗縣泰安鄉 — 未登記露營場', '0928994997', 'https://zh-tw.facebook.com/pages/category/Campground/%E7%9F%B3%E6%B0%B4%E5%9D%8A-475154232579261/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('浮岸別境', 'camping', 24.407581, 120.938598, '中興村5鄰司馬限19號', '苗栗縣泰安鄉 — 未登記露營場', '0961177839', 'https://asiayo.com/zh-tw/view/tw/miaoli-county/44639/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那那布荷露營區', 'camping', 24.424672, 120.919428, '苗栗縣泰安鄉高熊卡4鄰60-1號', '苗栗縣泰安鄉 — 未登記露營場', '0919366476,0928566393', 'https://www.facebook.com/nnbh070/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('虎山溫泉會館', 'camping', 24.46861988, 120.9404775, '苗栗縣泰安鄉錦水村圓墩73-1號', '苗栗縣泰安鄉 — 未登記露營場', '037941001', 'http://hushan-hotspring.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('的貴露營區', 'camping', 24.35353418, 120.9636468, '苗栗縣泰安鄉象鼻村3鄰永安17號', '苗栗縣泰安鄉 — 未登記露營場', '0985752547', 'https://zh-tw.facebook.com/dg535/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('想當年露營區', 'camping', 24.38734327, 120.9185867, '苗栗縣泰安鄉苗61線中興村（往馬拉邦山登山口）', '苗栗縣泰安鄉 — 未登記露營場', '0988280760', 'https://www.facebook.com/miaoli.taian.in.those.days/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('風露營', 'camping', 24.34391763, 120.931013, '苗栗縣泰安鄉馬那邦64號', '苗栗縣泰安鄉 — 未登記露營場', '0918962000', 'https://wind-camping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鷹的故鄉', 'camping', 24.421526, 120.918309, '苗栗縣泰安鄉大興村4鄰57-9號', '苗栗縣泰安鄉 — 未登記露營場', '0975829613', 'https://m.icamping.app/store/ydgx127', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('印象泰雅渡假民宿', 'camping', 24.374936, 120.938298, '象鼻村1鄰象鼻39號', '苗栗縣泰安鄉 — 未登記露營場', '0911972823', 'https://www.facebook.com/impressiontayal/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星樂親子露營', 'camping', 24.500874, 120.950393, '八卦村4鄰68號', '苗栗縣泰安鄉 — 未登記露營場', '0912553259', 'https://www.easycamp.com.tw/Store_2464.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂露營區', 'camping', 24.42636619, 120.9186795, '苗栗縣泰安鄉高熊卡4鄰60號', '苗栗縣泰安鄉 — 未登記露營場', '0906606733', 'https://m.icamping.app/store/hap489', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('放牛吃草露營區', 'camping', 24.427021, 120.916261, '苗栗縣泰安鄉大興村高熊卡4鄰61-8號', '苗栗縣泰安鄉 — 未登記露營場', '0910989895', 'https://www.facebook.com/camp0401/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小牛露營區', 'camping', 24.41863544, 120.9184816, '苗栗縣泰安鄉大興村高熊卡4鄰57-13號', '苗栗縣泰安鄉 — 未登記露營場', '0921916805', 'https://m.icamping.app/store/xn190', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('云仙谷休閒露營區', 'camping', 24.45161298, 120.9362027, '苗栗縣泰安鄉清安村10鄰腦寮庄15號', '苗栗縣泰安鄉 — 未登記露營場', '0937096333', 'https://m.icamping.app/store/yxgxj204', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司馬限 360 度景觀露營區', 'camping', 24.406734, 120.947534, '苗栗縣泰安鄉中興村5鄰18之10號', '苗栗縣泰安鄉 — 未登記露營場', '0978453730', 'https://m.icamping.app/store/smhck263', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('基哥那裡', 'camping', 24.41923933, 120.9219103, '苗栗縣泰安鄉大興村', '苗栗縣泰安鄉 — 未登記露營場', '0905250393', 'https://zh-tw.facebook.com/pages/category/Campground/ï¼E5ï¼9Fï¼BAï¼E5ï¼93ï¼A5ï¼E9ï¼82ï¼A3ï¼E8ï¼A3ï¼A1-1464283893845456/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('都瑪斯民宿', 'camping', 24.3839094, 120.9692478, '苗栗縣泰安鄉梅園村1鄰梅園12-1號', '苗栗縣泰安鄉 — 未登記露營場', '037962102', 'https://xnï¼ï¼oct14uckfgtj8i1b.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('按個讚露營場', 'camping', 24.389377, 120.980835, '苗栗縣泰安鄉天狗部落', '苗栗縣泰安鄉 — 未登記露營場', '0907689551', 'https://www.facebook.com/p/%E6%84%9B%E9%9C%B2%E7%87%9F-%E6%8C%89%E5%80%8B%E8%AE%9A%E9%9C%B2%E7%87%9F%E5%8D%80-61552140174562/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星光山岳露營驛站', 'camping', 24.38906545, 120.9717444, '苗栗縣泰安鄉梅園村2鄰38-1號', '苗栗縣泰安鄉 — 未登記露營場', '0935302658', 'https://www.facebook.com/starymountain/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山頂動人', 'camping', 24.418555, 120.937113, '清安段 778地號', '苗栗縣泰安鄉 — 未登記露營場', '0910937965', 'https://www.facebook.com/p/%E5%B1%B1%E9%A0%82-%E5%8B%95%E4%BA%BA%E5%85%8D%E8%A3%9D%E5%82%99%E9%9C%B2%E7%87%9F-61554011390816/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達度垡露營區', 'camping', 24.383924, 120.917757, '苗栗縣泰安鄉2鄰22號之5', '苗栗縣泰安鄉 — 未登記露營場', '0903122723', 'https://www.facebook.com/p/%E9%81%94%E5%BA%A6%E5%9E%A1%E9%9C%B2%E7%87%9F%E5%8D%80-100064087118085/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野雲仙露營區', 'camping', 24.432035, 120.911474, '苗栗縣泰安鄉第5鄰高熊卡47之18號', '苗栗縣泰安鄉 — 未登記露營場', '0981776158', 'https://m.icamping.app/store/lyyx075', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山居營地', 'camping', 24.418531, 120.92881, '苗栗縣泰安鄉清安村洗水坑大坪部落', '苗栗縣泰安鄉 — 未登記露營場', '0920317395', 'https://www.facebook.com/josh6273/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麥露瘋露營區', 'camping', 24.384495, 120.967787, '一鄰', '苗栗縣泰安鄉 — 未登記露營場', '0910516881', 'https://www.facebook.com/mlf5555/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原始原味露營區', 'camping', 24.4299293, 120.9105529, '苗栗縣泰安鄉大興村', '苗栗縣泰安鄉 — 未登記露營場', '0975862569', 'https://m.icamping.app/store/ysyw261', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('耀婆山露營區', 'camping', 24.435494, 120.911067, '苗栗縣泰安鄉小南角2鄰6號', '苗栗縣泰安鄉 — 未登記露營場', '0978826989', 'https://m.icamping.app/store/yps202', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('友田坊營地', 'camping', 24.443843, 120.922167, '苗栗縣泰安鄉清安村洗水坑12鄰', '苗栗縣泰安鄉 — 未登記露營場', '0910922961', 'https://m.icamping.app/store/ytf272', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('伊紹露營區', 'camping', 24.381794, 120.97543, '象鼻村大安35-1號', '苗栗縣泰安鄉 — 未登記露營場', '0980997300,0968008376', 'https://www.facebook.com/p/%E4%BC%8A%E7%B4%B9%E9%9C%B2%E7%87%9F%E5%8D%80-100081352428145/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('覓境露營區', 'camping', 24.464084, 120.943919, '苗栗縣泰安鄉錦水村圓墩34-1號', '苗栗縣泰安鄉 — 未登記露營場', '0905928156', 'https://www.facebook.com/tamj568/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂沐絲莊園', 'camping', 24.397055, 120.926678, '苗栗縣泰安鄉司馬限林道', '苗栗縣泰安鄉 — 未登記露營場', '037995421', 'https://www.facebook.com/Vacation.wuhuang/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('武嵐露營區', 'camping', 24.484086, 120.965613, '苗栗縣泰安鄉10鄰橫龍山64之36號', '苗栗縣泰安鄉 — 未登記露營場', '0926212235', 'https://m.icamping.app/store/wl138', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水云山植物景觀休閒農場', 'camping', 24.42099527, 120.9269566, '高熊卡65號（清安豆腐街-清安國小-大坪部落-山居營地過後100公尺叉路-右轉往烏嘎彥-約300米右下即達）', '苗栗縣泰安鄉 — 未登記露營場', '0935228550', 'https://www.facebook.com/p/%E6%B0%B4%E4%BA%91%E5%B1%B1%E6%A4%8D%E7%89%A9%E6%99%AF%E8%A7%80%E4%BC%91%E9%96%92%E8%BE%B2%E5%A0%B4-100064117713428/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('撒力達露營區', 'camping', 24.355065, 120.961381, '苗栗縣泰安鄉象鼻村永安部落', '苗栗縣泰安鄉 — 未登記露營場', '0928973206', 'https://www.facebook.com/salida2016/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('芬享露營區', 'camping', 24.430484, 120.909605, '苗栗縣泰安鄉5鄰47-25號', '苗栗縣泰安鄉 — 未登記露營場', '0906535556', 'https://m.icamping.app/store/fs009', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高熊卡露營區', 'camping', 24.4309, 120.913357, '苗栗縣泰安鄉大興村4鄰59-3號', '苗栗縣泰安鄉 — 未登記露營場', '0966568125', 'https://m.icamping.app/store/gsk013', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水之悅休閒露營區', 'camping', 24.385265, 120.97425, '梅園12-9號', '苗栗縣泰安鄉 — 未登記露營場', '0916169822', 'https://www.facebook.com/p/%E6%B0%B4%E4%B9%8B%E6%82%85%E4%BC%91%E9%96%92%E9%9C%B2%E7%87%9F%E5%8D%80-100066862655492/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('部落傳奇', 'camping', 24.359076, 120.949696, '象鼻村19-5號', '苗栗縣泰安鄉 — 未登記露營場', '0937705380', 'https://www.facebook.com/blcc523/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('客泊樂野奢露營', 'camping', 24.419939, 120.913363, '苗栗縣泰安鄉', '苗栗縣泰安鄉 — 未登記露營場', '0223702388', 'https://www.kamper.land/zh-TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲境露營區', 'camping', 24.426828, 120.919595, '苗栗縣泰安鄉大興村4鄰', '苗栗縣泰安鄉 — 未登記露營場', '0913309389', 'https://m.icamping.app/store/yj123', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰安哈尼', 'camping', 24.426951, 120.918664, '苗栗縣泰安鄉', '苗栗縣泰安鄉 — 未登記露營場', '0932321064', 'https://m.icamping.app/store/tahn723', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('密式旅行', 'camping', 24.41882301, 120.9137329, '苗栗縣泰安鄉大興村高熊卡6號', '苗栗縣泰安鄉 — 未登記露營場', '0905108958', 'https://traiwan.com/official/booking.php?id=misstravel', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪達法籟露營區', 'camping', 24.429262, 120.915019, '苗栗縣泰安鄉大興村5鄰48-1號', '苗栗縣泰安鄉 — 未登記露營場', '0931482558', 'https://m.icamping.app/store/mdfl041', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一定行露營區', 'camping', 24.36576788, 120.9714876, '苗栗縣泰安鄉', '苗栗縣泰安鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逸視界露營區', 'camping', 24.4273, 120.923857, '苗栗縣泰安鄉大興村3鄰63號旁', '苗栗縣泰安鄉 — 未登記露營場', '0921636063', 'https://m.icamping.app/store/ysj474', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('活林火現露營區', 'camping', 24.388993, 120.931866, '苗栗縣泰安鄉中興村長橋3鄰47 號', '苗栗縣泰安鄉 — 未登記露營場', '0972536300', 'https://www.facebook.com/lokahfire/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('五隻小豬露營區', 'camping', 24.47516, 120.96335, '苗栗縣泰安鄉橫龍山段484號', '苗栗縣泰安鄉 — 未登記露營場', '0910988184', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('漫天過海露營區', 'camping', 24.38263773, 120.937254, '苗栗縣泰安鄉中象道路', '苗栗縣泰安鄉 — 未登記露營場', '0982115054', 'https://www.facebook.com/theseaview', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嗎哪露營區', 'camping', 24.428815, 120.913723, '苗栗縣泰安鄉大興村5鄰48號', '苗栗縣泰安鄉 — 未登記露營場', '0916306394', 'https://zh-tw.facebook.com/kk781302002', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南灣蹓蹓農埸', 'camping', 24.41208, 120.91357, '高熊段 976地號', '苗栗縣泰安鄉 — 未登記露營場', '0982285343', 'https://m.icamping.app/store/nwll501', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('伊夕尚露營區', 'camping', 24.475346, 120.96474, '泰安鄉斯瓦細格部落 往橫龍古道方向', '苗栗縣泰安鄉 — 未登記露營場', '0930893156', 'https://m.icamping.app/store/yss392', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲中漫步露營區', 'camping', 24.41797, 120.91486, '大興村高熊卡二鄰6之5號', '苗栗縣泰安鄉 — 未登記露營場', '0983084587', 'https://www.facebook.com/people/%E9%9B%B2%E4%B8%AD%E6%BC%AB%E6%AD%A5/61554617978494/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('目上景露營區', 'camping', 24.427899, 120.915256, '苗栗縣泰安鄉大興村5鄰', '苗栗縣泰安鄉 — 未登記露營場', '0920464715', 'https://www.facebook.com/hpy1007/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鑽石林', 'camping', 24.427447, 120.919896, '苗栗縣泰安鄉大興村高熊卡4鄰61-16號', '苗栗縣泰安鄉 — 未登記露營場', '0910270025', 'https://www.facebook.com/emdfcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰安王子小豬仔露營區', 'camping', 24.432047, 120.911509, '苗栗縣泰安鄉大興村高熊卡3鄰381號-1', '苗栗縣泰安鄉 — 未登記露營場', '0913686666', 'https://m.icamping.app/store/wts372', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桂竹柿家', 'camping', 24.357206, 120.967238, '苗栗縣泰安鄉象鼻村永安445-13號', '苗栗縣泰安鄉 — 未登記露營場', '0910153300', 'https://m.icamping.app/store/gjsj479', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('古道秘境露營區', 'camping', 24.484341, 120.967104, '苗栗縣泰安鄉苗62線11.5公里處左轉', '苗栗縣泰安鄉 — 未登記露營場', '0936052352', 'https://m.icamping.app/store/gdmj080', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翔雲露營區', 'camping', 24.407806, 120.911806, '36542苗栗縣泰安鄉南灣路8鄰8號', '苗栗縣泰安鄉 — 未登記露營場', '0928587798', 'https://campground-803.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司馬限雲端果園露營區', 'camping', 24.40646768, 120.9484254, '苗栗縣泰安鄉司馬限5鄰20號', '苗栗縣泰安鄉 — 未登記露營場', '0930697528', 'https://www.facebook.com/smxyd110/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日光角落', 'camping', 24.45337, 120.929911, '錦水村半天寮3鄰45之5號(請地圖搜尋:清安國小 在沿途至營區)', '苗栗縣泰安鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嶺秀休閒露營區景觀民宿', 'camping', 24.39181741, 120.9556056, '梅園村2鄰66之23號', '苗栗縣泰安鄉 — 未登記露營場', '0921184718', 'https://www.facebook.com/ls536/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司馬限山嵐露營區', 'camping', 24.40564, 120.950412, '苗栗縣泰安鄉中興村5鄰司馬限部落', '苗栗縣泰安鄉 — 未登記露營場', '0919675272', 'https://m.icamping.app/store/smsl498', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達拉灣民宿', 'camping', 24.349481, 120.931199, '苗栗縣泰安鄉士林村馬那邦5鄰32之1號', '苗栗縣泰安鄉 — 未登記露營場', '0921331146', 'https://www.facebook.com/DaLaWanMinSu/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿麗露營區', 'camping', 24.42516, 120.914173, '苗栗縣泰安鄉大興村5鄰38號', '苗栗縣泰安鄉 — 未登記露營場', '0927525033', 'https://m.icamping.app/store/al198', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('UP 露營區', 'camping', 24.448718, 120.915978, '苗栗縣泰安鄉清安村洗水坑93-10號', '苗栗縣泰安鄉 — 未登記露營場', '0222527966', 'https://www.easycamp.com.tw/Store_1720.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('享露菲菲露營區', 'camping', 24.42294781, 120.9201301, '四鄰57號', '苗栗縣泰安鄉 — 未登記露營場', '0903122723', 'https://www.facebook.com/p/%E4%BA%AB%E9%9C%B2%E8%8F%B2%E8%8F%B2%E9%9C%B2%E7%87%9F%E5%8D%80-61552271443995/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天晴野舍', 'camping', 24.366567, 120.926715, '苗栗縣泰安鄉', '苗栗縣泰安鄉 — 未登記露營場', NULL, 'https://www.facebook.com/people/%E5%A4%A9%E6%99%B4%E9%87%8E%E8%88%8D/100080777703197/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雪松大砲露營區', 'camping', 24.39952062, 120.9852043, '台灣苗栗縣泰安鄉司馬限林道', '苗栗縣泰安鄉 — 未登記露營場', '0903262281', 'https://campground-1381.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翩翩泰安', 'camping', 24.470141, 120.936459, '錦水村11鄰圓墩86之6號', '苗栗縣泰安鄉 — 未登記露營場', '037941099', 'https://www.ppta.com.tw/home.php', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晨風露營區', 'camping', 24.34377, 120.931563, '365苗栗縣泰安鄉馬拉邦62號', '苗栗縣泰安鄉 — 未登記露營場', '0935138409', 'https://m.facebook.com/%E6%99%A8%E9%A2%A8%E9%9C%B2%E7%87%9F%E5%8D%80-487469331646316/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夏特義露營區', 'camping', 24.42336, 120.918903, '大興村高熊卡4鄰57-5號', '苗栗縣泰安鄉 — 未登記露營場', '0933190209', 'https://www.facebook.com/hongsan.siyat/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好自在露營區', 'camping', 24.42313, 120.918069, '苗栗縣泰安鄉大興村四鄰57號', '苗栗縣泰安鄉 — 未登記露營場', '0927506819', 'https://m.icamping.app/store/hzz108', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('騰龍山莊', 'camping', 24.466204, 120.966442, '苗栗縣泰安鄉橫龍山5號', '苗栗縣泰安鄉 — 未登記露營場', '037941002', 'https://www.teng-long.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原心小團露', 'camping', 24.42857, 120.91121, '苗栗縣泰安鄉365高熊峠45-9號', '苗栗縣泰安鄉 — 未登記露營場', '0978508351', 'https://m.icamping.app/store/ys509', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛牛牧場休閒農場', 'camping', 24.440693, 120.741934, '苗栗縣通霄鎮南和里166號', '苗栗縣通霄鎮 — 未登記露營場', '037782999', 'https://www.flyingcow.com.tw/room/ins.php?index_id=3', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('萬家燈伙', 'camping', 24.47972897, 120.7285939, '圳頭里2鄰圳頭23-6號', '苗栗縣通霄鎮 — 未登記露營場', '0989823932', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('通霄三合院農庒｜苗栗露營區、三合院民宿', 'camping', 24.532299, 120.697586, '苗栗縣通霄鎮', '苗栗縣通霄鎮 — 未登記露營場', '0921577510', 'https://www.facebook.com/Sunheryou/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山峰點伙', 'camping', 24.47958777, 120.7280798, '苗栗縣通霄鎮圳頭里2鄰圳頭23之6號', '苗栗縣通霄鎮 — 未登記露營場', '0981443382', 'https://m.icamping.app/store/sfdh172', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南窩綠丘', 'camping', 24.448475, 120.742751, '苗栗縣通霄鎮城南里5鄰城南66之5號', '苗栗縣通霄鎮 — 未登記露營場', '0918273858', 'https://www.greenhill.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('釣魚的貓地中海民宿', 'camping', 24.418692, 120.730111, '苗栗縣通霄鎮福興里13鄰148之12號', '苗栗縣通霄鎮 — 未登記露營場', '0937235922', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛螢農莊', 'camping', 24.411652, 120.743304, '苗栗縣通霄鎮福興里11鄰126號', '苗栗縣通霄鎮 — 未登記露營場', '0975783371', 'https://www.facebook.com/Firefly037783371/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山峰點伙露營區', 'camping', 24.479378, 120.728118, '苗栗縣通霄鎮圳頭里２鄰圳頭２３之６號', '苗栗縣通霄鎮 — 未登記露營場', '0981443382', 'https://www.facebook.com/mountainfirecamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山Chill', 'camping', 24.605059, 120.869007, '平興村五鄰塩菜坑2-5號 (萬緣寺往前200公尺)', '苗栗縣造橋鄉 — 未登記露營場', '0910901661', 'https://www.mountainchillglamping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('月山谷MoonShine Valley', 'camping', 24.61316, 120.90247, '大龍村石椿臼6-6號', '苗栗縣造橋鄉 — 未登記露營場', '0934007330,0926745072', 'https://www.facebook.com/people/%E6%9C%88%E5%B1%B1%E8%B0%B7MoonShine-Valley/61550697992305/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桉心園露營區', 'camping', 24.6355785, 120.8358943, '蔗廍1號', '苗栗縣造橋鄉 — 未登記露營場', '0919203622', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('木盈朵莊園', 'camping', 24.47002, 120.9098, '竹木村11份四12號', '苗栗縣獅潭鄉 — 未登記露營場', '0937789412', 'https://www.facebook.com/p/%E6%9C%A8%E7%9B%88%E6%9C%B5%E8%8E%8A%E5%9C%92-100083420616997/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('窩野鄉趣露營區', 'camping', 24.468279, 120.903621, '桂竹林段363-498、363-849地號', '苗栗縣獅潭鄉 — 未登記露營場', '0933732875', 'https://www.facebook.com/camp0001/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山田露營區', 'camping', 24.53662, 120.920493, '新店村12鄰151-7號', '苗栗縣獅潭鄉 — 未登記露營場', '0926327273', 'https://www.facebook.com/p/%E5%B1%B1%E7%94%B0%E9%9C%B2%E7%87%9F%E5%8D%80-100076816304188/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙山生態農場', 'camping', 24.538819, 120.947822, '苗栗縣獅潭鄉新店村小東勢19號', '苗栗縣獅潭鄉 — 未登記露營場', '037931661', 'https://www.hsingfram.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('17 杉境露營休閒農場', 'camping', 24.513554, 120.904771, '苗栗縣獅潭鄉和興村14鄰38-1號', '苗栗縣獅潭鄉 — 未登記露營場', '0932067690,0979016006', 'http://www.freeway3.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('聽見你的回憶-休閒雲莊', 'camping', 24.466442, 120.901219, '35443苗栗縣獅潭鄉竹木村大興窩20-7號', '苗栗縣獅潭鄉 — 未登記露營場', '0932676363', 'https://holiday-park-111.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小岔路露營區', 'camping', 24.513055, 120.903268, '苗栗縣獅潭鄉和興39-1號', '苗栗縣獅潭鄉 — 未登記露營場', '0972738095,0960524131', 'https://www.facebook.com/AMY7201/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大坪左岸露營區', 'camping', 24.571607, 120.937333, '苗栗縣獅潭鄉百壽村1鄰大坪6號', '苗栗縣獅潭鄉 — 未登記露營場', '0932150066', 'https://www.facebook.com/%E5%A4%A7%E5%9D%AA%E5%B7%A6%E5%B2%B8%E9%9C%B2%E7%87%9F%E5%8D%80-116551405595024/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹽水頭露營區', 'camping', 24.478457, 120.914241, '苗栗縣獅潭鄉塩水13鄰36之1號', '苗栗縣獅潭鄉 — 未登記露營場', '0953932858', 'https://www.facebook.com/watercamping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清泉露營區', 'camping', 24.532997, 120.927397, '苗栗縣獅潭鄉新店村大東勢3之1號', '苗栗縣獅潭鄉 — 未登記露營場', '0911792166', 'https://www.facebook.com/chingchuancamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('來去山上住一晚露營區', 'camping', 24.47474, 120.90692, '苗栗獅潭十一分四山頂', '苗栗縣獅潭鄉 — 未登記露營場', '0920486685', 'https://www.facebook.com/MountainHous/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('思情華意露營區', 'camping', 24.583, 120.963225, '354苗栗縣獅潭鄉大銑櫃18號', '苗栗縣獅潭鄉 — 未登記露營場', '0915393831', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橘園山谷', 'camping', 24.55056, 120.93431, '苗栗縣獅潭鄉永興村10鄰9號', '苗栗縣獅潭鄉 — 未登記露營場', '0936532846,0917522818', 'https://m.icamping.app/store/jysg719', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹木村(大興窩)露營區', 'camping', 24.465658, 120.901422, '苗栗縣獅潭鄉竹木村大興窩8鄰20-10號', '苗栗縣獅潭鄉 — 未登記露營場', '0986592083', 'https://m.icamping.app/store/jmc335', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('韋家莊', 'camping', 24.465242, 120.901351, '苗栗縣獅潭鄉竹木村8鄰大興窩20-2號', '苗栗縣獅潭鄉 — 未登記露營場', '0926888003', 'https://www.facebook.com/888888jack/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('獅潭清泉露營區', 'camping', 24.532932, 120.927341, '苗栗縣獅潭鄉新店村大東勢3之1號', '苗栗縣獅潭鄉 — 未登記露營場', '0982932615,0912457727', 'https://www.facebook.com/chingchuancamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹木村露營區', 'camping', 24.465008, 120.901166, '苗栗縣獅潭鄉竹木村大興窩8鄰20-10號', '苗栗縣獅潭鄉 — 未登記露營場', '0986592083', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('呼啦莊園', 'camping', 24.5612619, 120.936405, '苗栗縣獅潭鄉永興村下大窩2之1號', '苗栗縣獅潭鄉 — 未登記露營場', '037931928', 'https://www.hulagarden.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('國王的移動城堡生態露營區', 'camping', 24.515788, 120.937351, '苗栗縣獅潭鄉新店村18鄰大東勢50號', '苗栗縣獅潭鄉 — 未登記露營場', '0989790970', 'https://www.facebook.com/%E5%9C%8B%E7%8E%8B%E7%9A%84%E7%A7%BB%E5%8B%95%E5%9F%8E%E5%A0%A1-%E7%94%9F%E6%85%8B%E9%9C%B2%E7%87%9F%E5%8D%80-490379858149033/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('依杉林秘境', 'camping', 24.423506, 120.80592, '苗栗縣銅鑼鄉新隆村8鄰新隆89號', '苗栗縣銅鑼鄉 — 未登記露營場', '0911196484', 'https://www.facebook.com/K0911196484/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黃金梯田露營地', 'camping', 24.47020072, 120.7770542, '九湖村92之5號', '苗栗縣銅鑼鄉 — 未登記露營場', '0966433458', 'https://www.facebook.com/goldenterraces925/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梯田露營區', 'camping', 24.469839, 120.776262, '苗栗縣銅鑼鄉九湖村92之5號', '苗栗縣銅鑼鄉 — 未登記露營場', '0920350365', 'http://www.goldenttcamp.com.tw/paper/other_select_index.php?id=46&title_id=695&group_id=17', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('坐忘草堂', 'camping', 24.443116, 120.800392, '苗栗縣銅鑼鄉盛隆村盛隆5鄰45-20號', '苗栗縣銅鑼鄉 — 未登記露營場', '0912544797', 'https://www.easycamp.com.tw/store/store_index/2559', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('柚香露露', 'camping', 24.531086, 120.806215, '苗栗縣銅鑼鄉朝陽村朝北1號', '苗栗縣銅鑼鄉 — 未登記露營場', '0900618279', 'https://www.yioauchamp.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蝸居營地', 'camping', 24.41753, 120.79874, '苗栗縣銅鑼鄉新隆村新隆138-5號', '苗栗縣銅鑼鄉 — 未登記露營場', '0980101388', 'https://www.facebook.com/people/%E8%9D%B8%E5%B1%85%E7%87%9F%E5%9C%B0/100083559632927/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山野戀露營區', 'camping', 24.422142, 120.833429, '苗栗縣銅鑼鄉新隆村11-5', '苗栗縣銅鑼鄉 — 未登記露營場', '0933674710', 'https://www.facebook.com/people/%E5%B1%B1%E9%87%8E%E6%88%80%E9%9C%B2%E7%87%9F%E5%8D%80/100057059636678/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蓁愛露營區(大湖)', 'camping', 24.405901, 120.83588, '苗栗縣銅鑼鄉新隆村20鄰219號', '苗栗縣銅鑼鄉 — 未登記露營場', '0937715570', 'https://www.facebook.com/groups/711315065612187/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('茄李山居', 'camping', 24.417573, 120.79714, '新隆村12鄰138之1號', '苗栗縣銅鑼鄉 — 未登記露營場', '0910871897', 'https://www.facebook.com/people/%E8%8C%84%E6%9D%8E%E5%B1%B1%E5%B1%85/100094173018442/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('風山雅筑露營區', 'camping', 24.442061, 120.801798, '苗栗縣銅鑼鄉盛隆村 5 鄰盛隆 45-18號', '苗栗縣銅鑼鄉 — 未登記露營場', '0932272678', 'https://www.royalcastle.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自由休閒農場(苗栗自由農場)', 'camping', 24.44226395, 120.8359376, '苗栗縣銅鑼鄉光隆村193-1號', '苗栗縣銅鑼鄉 — 未登記露營場', '0977738733', 'https://www.easycamp.com.tw/Store_2183.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山上的家露營區', 'camping', 24.433878, 120.803713, '苗栗縣銅鑼鄉盛隆村盛隆65之1號', '苗栗縣銅鑼鄉 — 未登記露營場', '0933460613,0974188908', 'https://www.facebook.com/%E5%B1%B1%E4%B8%8A%E7%9A%84%E5%AE%B6-1488129681475953/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('李子紅休閒露營區', 'camping', 24.42112, 120.834819, '苗栗縣銅鑼鄉新隆村8鄰.', '苗栗縣銅鑼鄉 — 未登記露營場', '0935935221', 'https://m.icamping.app/store/lzh435', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山林深處', 'camping', 24.421746, 120.834006, '苗栗縣銅鑼鄉新隆村8鄰新隆89號', '苗栗縣銅鑼鄉 — 未登記露營場', '0910566442', 'https://www.facebook.com/iverson1119/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿廚坑築夢園露營區', 'camping', 24.652334, 120.890795, '廣興路380巷6鄰142之1號', '苗栗縣頭份市 — 未登記露營場', '0919695215', 'https://www.facebook.com/p/%E9%B9%BF%E5%BB%9A%E5%9D%91%E7%AF%89%E5%A4%A2%E5%9C%92%E9%9C%B2%E7%87%9F%E5%8D%80-100063918160442/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天花湖露營民宿', 'camping', 24.546183, 120.871175, '苗栗縣頭屋鄉飛鳳村3鄰飛鳳40-1號', '苗栗縣頭屋鄉 — 未登記露營場', '037253119', 'https://www.facebook.com/M0900402996/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('叢林開始懶人露營區Glamping', 'camping', 24.582386, 120.888077, '明德村仁隆87號', '苗栗縣頭屋鄉 — 未登記露營場', '037251002', 'https://167712438634.web.fullinn.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('粉樣露營區', 'camping', 24.58644753, 120.9123589, '苗栗縣頭屋鄉', '苗栗縣頭屋鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('茶書坊健康園區', 'camping', 24.557079, 120.855697, '苗栗縣頭屋鄉飛鳳村12鄰飛鳳142號', '苗栗縣頭屋鄉 — 未登記露營場', '0911783288', 'https://www.facebook.com/teabookwork/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哞哞露營地', 'camping', 24.60014, 120.89788, '苗栗縣頭屋鄉明德路32-8號', '苗栗縣頭屋鄉 — 未登記露營場', '0989239689,0903353997', 'https://www.facebook.com/p/%E6%84%9B%E9%9C%B2%E7%87%9F-%E5%93%9E%E5%93%9E%E9%9C%B2%E7%87%9F%E5%9C%B0-61558530418477/?_rdr', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('微時光露營園區', 'camping', 24.588668, 120.84959, '苗栗縣頭屋鄉4鄰46-1號', '苗栗縣頭屋鄉 — 未登記露營場', '0966052457', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛鷹堡探索基地', 'camping', 24.580654, 120.896802, '苗栗縣頭屋鄉明德村仁隆59號', '苗栗縣頭屋鄉 — 未登記露營場', '0931628539', 'https://forteagle.blogspot.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藝景渡假莊園', 'camping', 24.586442, 120.91298, '苗栗縣頭屋鄉仁隆24 鄰 22 號', '苗栗縣頭屋鄉 — 未登記露營場', '0925558959', 'http://lake.many30.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('明德窯露營區', 'camping', 24.589474, 120.916933, '苗栗縣頭屋鄉明德村1鄰5號', '苗栗縣頭屋鄉 — 未登記露營場', '0911230445', 'https://tw-camping.tw/room_info.asp?id=393', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('荒野半島露營區', 'camping', 24.583485, 120.896848, '362003苗栗縣頭屋鄉仁隆20鄰62號', '苗栗縣頭屋鄉 — 未登記露營場', '0958757806', 'https://www.travelwildtw.com/products/glamping67', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Cargo Place卡果牧場', 'camping', 25.04130358, 121.2185579, '埔心83-2號', '桃園市大園區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森森親子露營', 'camping', 24.830862, 121.263696, '桃園市大溪區', '桃園市大溪區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('5ï¼2農場', 'camping', 24.840489, 121.354018, '美和路316巷22-1號', '桃園市大溪區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水樂活親子農場', 'camping', 24.984022, 121.16617, '桃園市中壢區', '桃園市中壢區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高坡金磐石露營區', 'camping', 24.768735, 121.353575, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樹不老休閒莊園', 'camping', 24.72959641, 121.3783465, '高義里8鄰色霧鬧12-1號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天立農場', 'camping', 24.82433257, 121.3523377, '色霧段282、282-3', '桃園市復興區 — 未登記露營場', '0936402031', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夏蝶冬櫻山谷園地', 'camping', 24.701503, 121.350519, '高義蘭道路36-1號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('融奎霖休閒露營區', 'camping', 24.806878, 121.390873, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溪口台露營區', 'camping', 24.802928, 121.344206, '桃園市復興區羅馬路二段268號', '桃園市復興區 — 未登記露營場', '0936314015', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('戀戀雅渡農場', 'camping', 24.725801, 121.381082, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('享恩商店露營區', 'camping', 24.807987, 121.3455, '溪口路86號', '桃園市復興區 — 未登記露營場', '0937105053', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哇吶訕露營區', 'camping', 24.682741, 121.358043, '14之18號', '桃園市復興區 — 未登記露營場', '0925313332', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好馨勤齊露營區', 'camping', 24.802616, 121.343449, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0963081484', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達彥休閒民宿露營區', 'camping', 24.806709, 121.397091, '庫志道路32號', '桃園市復興區 — 未登記露營場', '0926195480', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('霞雲歡樂谷', 'camping', 24.813488, 121.379794, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉拉山芘雅尚露營區', 'camping', 24.685253, 121.413218, '141-9號', '桃園市復興區 — 未登記露營場', '0933337207', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('伊萬農場', 'camping', 24.724721, 121.3872726, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日青露營區', 'camping', 24.773476, 121.321654, '8鄰26號', '桃園市復興區 — 未登記露營場', '0937813265', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天恩農場', 'camping', 24.69604244, 121.4173848, '神木路193-1號193-2號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('祥緣莊', 'camping', 24.697673, 121.40267, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂野露營區', 'camping', 24.694498, 121.404405, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福田美地露營場', 'camping', 24.806728, 121.397786, '庫志道路11鄰24號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('微風山崚拉拉山露營區', 'camping', 24.692115, 121.401655, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那結山露營區', 'camping', 24.775215, 121.328455, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東眼山農場', 'camping', 24.84325327, 121.3952525, '成福路545號', '桃園市復興區 — 未登記露營場', '0926223828', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逍遙遊秘境露營區', 'camping', 24.828977, 121.392138, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0955358736', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('比該溪生態露營區', 'camping', 24.679606, 121.426116, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬莎度露營區', 'camping', 24.817634, 121.392312, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('比亞山露營區', 'camping', 24.806012, 121.343124, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0989608281', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一號地露營區', 'camping', 24.686941, 121.362643, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0976283287', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蜻蜓露營區', 'camping', 24.778501, 121.325065, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長榮露營區', 'camping', 24.696614, 121.421026, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('塔木休閒露營區', 'camping', 24.772408, 121.37638, '10鄰29之5號', '桃園市復興區 — 未登記露營場', '0925530904', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('微笑草地', 'camping', 24.688464, 121.412041, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山大王休閒農莊', 'camping', 24.8112, 121.359075, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0912455060', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃子菇菇休閒農莊', 'camping', 24.689059, 121.420396, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亞霧香草營區', 'camping', 24.784345, 121.399888, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0973685763', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蝶木窩露營休閒坊', 'camping', 24.794966, 121.366999, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('恩愛農場', 'camping', 24.696774, 121.422537, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬灣露營區', 'camping', 24.806076, 121.397563, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0919973148', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('八度野溪露營區', 'camping', 24.792131, 121.335976, '羅馬路三段238號', '桃園市復興區 — 未登記露營場', '0930828768', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉拉山得拉互露營區', 'camping', 24.683683, 121.390096, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山豬王露營區', 'camping', 24.791219, 121.392477, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鑫園馬告露營區', 'camping', 24.796431, 121.281976, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('木村的家露營區', 'camping', 24.688409, 121.411316, '中心路156-2號', '桃園市復興區 — 未登記露營場', '0933797364', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高崗原創農園(雅月の娜杉)', 'camping', 24.675041, 121.365274, '武崙路33號', '桃園市復興區 — 未登記露營場', '0960582481', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尹宿納露營區', 'camping', 24.691377, 121.336575, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('爺亨溪岸露營區', 'camping', 24.675035, 121.371664, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楓林谷露營區', 'camping', 24.802043, 121.327191, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山雲海露營農場', 'camping', 24.689861, 121.414766, '中心路156號', '桃園市復興區 — 未登記露營場', '0910262947', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('利河伯休閒農園露營區', 'camping', 24.67375, 121.379691, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高山青莊園', 'camping', 24.766565, 121.352129, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Kusu庫司景觀露營區', 'camping', 24.819971, 121.404367, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('卡拉傳奇觀光農場-阿爸的故事', 'camping', 24.695764, 121.408917, '華陵里華陵村11鄰180號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('HOLA吼辣露營區', 'camping', 24.770521, 121.355596, '高坡16號', '桃園市復興區 — 未登記露營場', '0920938227', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('米利漾', 'camping', 24.78054455, 121.3255323, '復興區2號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山水漣漪溪畔', 'camping', 24.805767, 121.37037, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野行野宿露營簡餐咖啡坊', 'camping', 24.780102, 121.358676, '高坡6鄰12號', '桃園市復興區 — 未登記露營場', '0981142263', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('歐陽莊園', 'camping', 24.704517, 121.35012, '高義蘭道路65之7號', '桃園市復興區 — 未登記露營場', '0979045586', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('遠見之星露營區', 'camping', 24.688316, 121.411601, '中心路86巷28號', '桃園市復興區 — 未登記露營場', '0925419533', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('熊老大露營區', 'camping', 24.792378, 121.390305, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0910955415', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雅緻露營區', 'camping', 24.682444, 121.357962, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0976283287', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那山‧達雅賀Ngasal Tayax', 'camping', 24.822011, 121.382279, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉拉山塔曼之光露營區', 'camping', 24.69778047, 121.4246901, '中心路315號', '桃園市復興區 — 未登記露營場', '0973882038', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松野農園露營區', 'camping', 24.72464, 121.382186, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('摩亞農場', 'camping', 24.727532, 121.377181, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('葛鹿營地', 'camping', 24.803488, 121.379459, '2鄰合流48之8號', '桃園市復興區 — 未登記露營場', '0970520220', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲河露營農場', 'camping', 24.697051, 121.424441, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲霧農場', 'camping', 24.723682, 121.37837, '色霧鬧10-21號', '桃園市復興區 — 未登記露營場', '0988699291', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露薩休閒露營區', 'camping', 24.670242, 121.38552, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('熊居露營趣', 'camping', 24.691668, 121.41948, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂悠露營', 'camping', 24.802415, 121.328154, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('順花露營區', 'camping', 24.686007, 121.348309, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('可飛鹿營區', 'camping', 24.799275, 121.32993, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沒搞頭露營區', 'camping', 24.812357, 121.394679, '6鄰21號', '桃園市復興區 — 未登記露營場', '0916202477', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('奎輝營地', 'camping', 24.787963, 121.331204, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星城露營區', 'camping', 24.696836, 121.42139, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0933797364', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('古渡園地', 'camping', 24.688981, 121.412589, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清清露營區', 'camping', 24.684282, 121.421569, '華陵里8鄰40號', '桃園市復興區 — 未登記露營場', '0920607521', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('卡普休閒農莊', 'camping', 24.794319, 121.392852, '23號', '桃園市復興區 — 未登記露營場', '0981008636', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('木河谷', 'camping', 24.791129, 121.388963, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0925380956', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亞力山大露營區', 'camping', 24.704278, 121.346603, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛督努露營區', 'camping', 24.842291, 121.401569, '20-1號', '桃園市復興區 — 未登記露營場', '0912512443', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('爺亨溫泉露營區', 'camping', 24.674988, 121.375013, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夢想家園露營區', 'camping', 24.684425, 121.307998, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大樹下露營區', 'camping', 24.80387486, 121.3670024, '32號', '桃園市復興區 — 未登記露營場', '0926897986', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲頂露營區', 'camping', 24.698969, 121.424177, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0933711363', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('庭綩小棧', 'camping', 24.810531, 121.375013, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雅比斯露營區', 'camping', 24.688851, 121.413991, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巫婆景觀農場露營區', 'camping', 24.840489, 121.354018, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('觀星露營區', 'camping', 24.697442, 121.421531, '14鄰143-7號', '桃園市復興區 — 未登記露營場', '0919019891', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達拉蓋', 'camping', 24.81117889, 121.3960305, '霞雲里11鄰庫志35之15號', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美腿山親子露營區', 'camping', 24.80053, 121.312307, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('壘薩露營區', 'camping', 24.797263, 121.399288, '23號之8', '桃園市復興區 — 未登記露營場', '0912062289', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瓦旦喜義露營農場', 'camping', 24.748824, 121.352513, '羅浮段186、187地號', '桃園市復興區 — 未登記露營場', '0913009099,0989632988', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('流霞谷親水烤肉園區', 'camping', 24.806957, 121.37189, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喜樂麻谷', 'camping', 24.825919, 121.390654, '霞雲里4鄰佳志13-1號', '桃園市復興區 — 未登記露營場', '0907460058', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('培雅境休閒露營區', 'camping', 24.798569, 121.357089, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0987072781', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('圓夢農莊', 'camping', 24.69457, 121.403507, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長興山水靜露營區', 'camping', 24.800402, 121.307998, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('俠雲山莊', 'camping', 24.694712, 121.421097, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石秀灣五葉松露營區', 'camping', 24.8028, 121.289726, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰雅秘境露營區', 'camping', 24.80014, 121.328014, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('比固花園', 'camping', 24.704178, 121.350566, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0966603936', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘋果農莊', 'camping', 24.725118, 121.378591, '色霧鬧7鄰10-20號', '桃園市復興區 — 未登記露營場', '0966505080', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東眼之星露營區', 'camping', 24.842397, 121.397286, '桃園市復興區', '桃園市復興區 — 未登記露營場', '0921167390', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('庫巴露營區', 'camping', 24.807376, 121.398793, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('河那灣民宿露營區', 'camping', 24.803732, 121.342596, '41號', '桃園市復興區 — 未登記露營場', '0937174588', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('上杉露營區', 'camping', 24.782774, 121.322088, '6鄰28之6', '桃園市復興區 — 未登記露營場', '0960770468', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清龍谷野營渡假中心', 'camping', 24.809473, 121.374254, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嘎色鬧露營區', 'camping', 24.775157, 121.324416, '桃園市復興區', '桃園市復興區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('享慢活 Double 5', 'camping', 24.97879879, 121.0179214, '港興路310號', '桃園市新屋區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('耀輝休閒牧場', 'camping', 24.917174, 121.122967, '桃園市楊梅區', '桃園市楊梅區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('驛品香生態農園', 'camping', 24.88334733, 121.1520749, '校前路1150號', '桃園市楊梅區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('牛仔星村', 'camping', 24.925415, 121.177464, '桃園市楊梅區幼獅路一段439號東南側', '桃園市楊梅區 — 未登記露營場', '0908852398', 'https://shop6726.noon360.com/mainssl/uploads/shop6726/html/home.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('朋趣', 'camping', 24.870129, 121.247792, '龍潭區悅華路100號', '桃園市龍潭區 — 未登記露營場', '034801369', 'https://bonchillglamping.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('叢林開始', 'camping', 24.87172272, 121.1876078, '龍潭區德湖街369號', '桃園市龍潭區 — 未登記露營場', '0919596696', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梧桐心境養生露營園區', 'camping', 24.801323, 121.222279, '桃園市龍潭區', '桃園市龍潭區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('茶野裡山野露營', 'camping', 25.07893955, 121.33231, '山林路三段855-1號', '桃園市蘆竹區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小希臘秘境露營區', 'camping', 22.72533579, 120.4231596, '高雄市大樹區三和路71號', '高雄市大樹區 — 未登記露營場', NULL, 'https://www.facebook.com/LittleGreece123/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野奢露營區', 'camping', 22.73132, 120.41594, '學城段680~689地號', '高雄市大樹區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('茂升山林露營區', 'camping', 23.00962504, 120.5306885, '高雄市內門區金竹村安定51-12號高117線0.2K處竹峯宮進去近月慧山觀音禪院', '高雄市內門區 — 未登記露營場', '0931832882', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('將軍山歐舍營地(歐忠賢)', 'camping', 22.91007361, 120.4580368, '高雄市內門區將軍段467地號', '高雄市內門區 — 未登記露營場', '0937317629', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露舍營家', 'camping', 23.00014834, 120.489668, '高雄市內門區溝坪里華園39-12號', '高雄市內門區 — 未登記露營場', '0908528006', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田子路貳之壹露營區', 'camping', 22.907411, 120.417619, '高雄市內門區瑞山里田子墘2-1號 (內門區脚帛寮段571-1地號)', '高雄市內門區 — 未登記露營場', '0988532208', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天闊露營區', 'camping', 23.06171247, 120.6815537, '高雄市六龜區新開路63號', '高雄市六龜區 — 未登記露營場', '076791166', 'https://skywidespa.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藏青谷渡假莊園', 'camping', 23.04130949, 120.6608812, '高雄市六龜區和平路130-66號', '高雄市六龜區 — 未登記露營場', '0932178002', 'http://www.valleystatt.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泗高露棧露營場', 'camping', 23.03936711, 120.6615552, '高雄市六龜區新發里和平路130-38號', '高雄市六龜區 — 未登記露營場', '0927199080', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('何家歡快樂露營區', 'camping', 23.04237977, 120.6675232, '高雄市六龜區', '高雄市六龜區 — 未登記露營場', '0911003780', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嚮露靈象山休閒露營區', 'camping', 22.9999275, 120.6588912, '高雄市六龜區興龍里土壠149-10號', '高雄市六龜區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('十八羅漢山星宿露營區', 'camping', 22.93377, 120.6452, '高雄市六龜區中興里29-1號', '高雄市六龜區 — 未登記露營場', '0966667089', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('寶來星野景觀驛棧', 'camping', 23.10485227, 120.7280104, '高雄市六龜區竹林63之12號', '高雄市六龜區 — 未登記露營場', '0958665117', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('草地人溫泉會館露營區', 'camping', 23.05699646, 120.6770996, '高雄市六龜區新發里新開路33-1號', '高雄市六龜區 — 未登記露營場', '076791992', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天闊溫泉 SPA 會館', 'camping', 23.06195184, 120.6815859, '高雄市六龜區新發里新開路63號', '高雄市六龜區 — 未登記露營場', '076791166', 'https://skywidespa.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溫德莊園', 'camping', 23.05716354, 120.6747339, '高雄市六龜區新發里新開路19號', '高雄市六龜區 — 未登記露營場', '0967300048', 'https://166599556631.web.fullinn.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('緣起農場露營區', 'camping', 23.03271261, 120.6632817, '高雄市六龜區新發里和平路130-3號', '高雄市六龜區 — 未登記露營場', '0911066179', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('輕風椰林露營區', 'camping', 22.88975237, 120.6090974, '高雄市六龜區三民路70號', '高雄市六龜區 — 未登記露營場', NULL, 'https://www.coconutcamping.url.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鐘耀庭(露營場未命名)', 'camping', 22.93314, 120.64517, '高雄市六龜區', '高雄市六龜區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('荖濃田營農場露營區(市招：家營農場)', 'camping', 23.07506079, 120.682899, '高雄市六龜區荖濃里裕濃路81巷25-36號', '高雄市六龜區 — 未登記露營場', '0916139709', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('何氏農場生態露營區', 'camping', 23.04235863, 120.6675249, '高雄市六龜區和平路295號', '高雄市六龜區 — 未登記露營場', '0911003780', 'https://farmhofamily.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹森林快樂農場', 'camping', 23.04030383, 120.666791, '高雄市六龜區新發里和平路290號', '高雄市六龜區 — 未登記露營場', '0931347278', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野獸休閒基地', 'camping', 23.04020578, 120.6641235, '高雄市六龜區和平路151-16號', '高雄市六龜區 — 未登記露營場', '0916179733', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('戀戀南橫 2071 露營區', 'camping', 23.07124138, 120.6602761, '高雄市六龜區荖濃里合興一號', '高雄市六龜區 — 未登記露營場', '0907693503', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福濃休閒農場露營區', 'camping', 23.0734779, 120.6769995, '高雄市六龜區荖濃里裕濃路81巷12-30號', '高雄市六龜區 — 未登記露營場', '0933163506', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山水炎親子露營區', 'camping', 22.97968428, 120.6470419, '高雄市六龜區中興里尾庄55-2號', '高雄市六龜區 — 未登記露營場', '0911880057', 'http://www.ssyfarm.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水冬瓜農場生態露營區', 'camping', 23.05964635, 120.6659153, '高雄市六龜區水冬瓜74號', '高雄市六龜區 — 未登記露營場', '0963129479', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘇菲凱文快樂農場', 'camping', 23.04307316, 120.6677428, '高雄市六龜區新發里和平路303-5號', '高雄市六龜區 — 未登記露營場', '0930622286', 'http://sophiencalvin.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('河畔秘境露營區', 'camping', 23.01708717, 120.6506976, '高雄市六龜區東溪山莊12之20號', '高雄市六龜區 — 未登記露營場', '0930939605', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大山拾光休閒莊園', 'camping', 23.03832116, 120.6618643, '高雄市六龜區和平路130-35號', '高雄市六龜區 — 未登記露營場', '0911158123', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('賴家古厝賞梅露營區', 'camping', 23.10982691, 120.7319006, '高雄市六龜區寶來里竹林60號', '高雄市六龜區 — 未登記露營場', '0937672962', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小桂林露營區', 'camping', 22.95427, 120.64219, '高雄市六龜區', '高雄市六龜區 — 未登記露營場', '076895882', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂熊民宿露營區', 'camping', 23.06832144, 120.6732951, '高雄市六龜區裕濃路1-7號', '高雄市六龜區 — 未登記露營場', '0970311577', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂熊咖啡香草露營區', 'camping', 23.06831157, 120.6733059, '高雄市六龜區裕濃路1之7號', '高雄市六龜區 — 未登記露營場', '0970311577', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('荖濃有機農場露營區', 'camping', 23.07389171, 120.6823171, '高雄市六龜區荖濃里裕濃路81巷18號', '高雄市六龜區 — 未登記露營場', '0978657772', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('道時尚悠然渡假山莊', 'camping', 23.03345763, 120.6636358, '高雄市六龜區新發里和平路130-5號', '高雄市六龜區 — 未登記露營場', '076791003', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('依山山露營區', 'camping', 23.07182931, 120.6884752, '高雄市六龜區新開路110號', '高雄市六龜區 — 未登記露營場', '0933397113', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星空幽谷休閒露營農莊', 'camping', 22.88491619, 120.6042009, '高雄市六龜區新寮村三民路107號', '高雄市六龜區 — 未登記露營場', '0955162589', 'https://starry.epo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('六龜麒麟露營區', 'camping', 23.01643133, 120.6629088, '高雄市六龜區新發里獅山15-20號', '高雄市六龜區 — 未登記露營場', '0963114332', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('六龜 童趣休憩露營區', 'camping', 22.98289075, 120.6361944, '高雄市六龜區光明巷40 號之1', '高雄市六龜區 — 未登記露營場', '0988538032', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂暢園', 'camping', 22.96325764, 120.6440895, '高雄市六龜區復興巷37之21', '高雄市六龜區 — 未登記露營場', '0911161948', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('扇平山莊十八羅漢山露營區', 'camping', 22.9707217, 120.6515121, '高雄市六龜區中興里29-1號', '高雄市六龜區 — 未登記露營場', '0966667089', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('呂家山外村露營休閒區', 'camping', 22.87812284, 120.6083822, '高雄市六龜區三民路74之27號', '高雄市六龜區 — 未登記露營場', '0933388548', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('陽光綠地水世界露營區', 'camping', 23.04416703, 120.6674544, '高雄市六龜區新發里和平路305-2號', '高雄市六龜區 — 未登記露營場', '0963639555', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('川聚休閒莊園露營區', 'camping', 22.9991, 120.65107, '中庄段332地號', '高雄市六龜區 — 未登記露營場', '09210106604', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露悠悠輕奢露營區', 'camping', 22.98033798, 120.6468097, '高雄市六龜區尾庄55之2號', '高雄市六龜區 — 未登記露營場', '063128846', 'https://loveuuglamping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('陸石五木露營區', 'camping', 23.02154516, 120.5738296, '高雄市杉林區集來里通仙巷236號', '高雄市杉林區 — 未登記露營場', '0932841255', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桂田休閒莊園露營區', 'camping', 22.95636808, 120.532894, '高雄市杉林區月美里桐竹路61-12號', '高雄市杉林區 — 未登記露營場', '073237429', 'http://5858house.com/address.aspx', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('伊咪達督露營區', 'camping', 23.2411073, 120.6944575, '高雄市那瑪夏區瑪雅里平和巷107號', '高雄市那瑪夏區 — 未登記露營場', '0988027163', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('民權大橋露營區', 'camping', 23.24596351, 120.6948268, '高雄市那瑪夏區瑪雅里平和巷25號', '高雄市那瑪夏區 — 未登記露營場', '0985400904', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('陳家茶園露營區', 'camping', 23.26029742, 120.6860634, '高雄市那瑪夏區青山巷40號8鄰', '高雄市那瑪夏區 — 未登記露營場', '0918354081', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑪那休閒露營區', 'camping', 23.2477429, 120.7047937, '高雄市那瑪夏區瑪雅里平和巷124號', '高雄市那瑪夏區 — 未登記露營場', '0937372044', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雅悠露營區', 'camping', 23.258708, 120.687185, '高雄市那瑪夏區瑪雅里6鄰平和巷209之10號', '高雄市那瑪夏區 — 未登記露營場', '0921580453', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吉巴谷露營區', 'camping', 23.26009101, 120.702853, '高雄市那瑪夏區達卡努瓦里秀嶺巷3鄰178-9號', '高雄市那瑪夏區 — 未登記露營場', '0988259099', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉比尼亞露營山莊', 'camping', 23.25687276, 120.6872596, '高雄市那瑪夏區瑪雅里平和巷209-1號', '高雄市那瑪夏區 — 未登記露營場', '0939189862,0988782870', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('呼瑪露營區', 'camping', 23.245954, 120.703222, '高雄市那瑪夏區瑪雅里平和巷105號', '高雄市那瑪夏區 — 未登記露營場', '0981985699', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達里沐露營區', 'camping', 23.2199674, 120.6985493, '高雄市那瑪夏南沙魯里', '高雄市那瑪夏區 — 未登記露營場', '0922754866', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麥的莊園露營區', 'camping', 23.249121, 120.692309, '高雄市那瑪夏區瑪雅里平和巷239號', '高雄市那瑪夏區 — 未登記露營場', '0935797102', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那邊露營區', 'camping', 23.24812907, 120.7048027, '高雄市那瑪夏區瑪雅段401號', '高雄市那瑪夏區 — 未登記露營場', '0975258555', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那次嵐露營區', 'camping', 23.24740596, 120.6962073, '高雄市那瑪夏區瑪雅里175-1號', '高雄市那瑪夏區 — 未登記露營場', '0928353643', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('發啦斯露營場', 'camping', 23.28765895, 120.7240336, '高雄市那瑪夏區達卡努瓦里大光巷201號', '高雄市那瑪夏區 — 未登記露營場', '0972966800', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美綠生態園', 'camping', 22.87336662, 120.5862906, '高雄市美濃區獅山里竹門14-2號', '高雄市美濃區 — 未登記露營場', '076851111', 'http://meilu.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('德旺渡假山莊', 'camping', 22.94286899, 120.5854038, '高雄市美濃區廣林里朝元159-12號', '高雄市美濃區 — 未登記露營場', '0955002551', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美圳露營區', 'camping', 22.89358315, 120.5374562, '高雄市美濃區中正路2段58巷39號', '高雄市美濃區 — 未登記露營場', '0983258576', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小長城露營區', 'camping', 22.91541505, 120.6939407, '多納巷43-2號', '高雄市茂林區 — 未登記露營場', '0915889732', 'https://reurl.cc/0d16xx', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('玥納露營區', 'camping', 22.90904246, 120.7226068, '茂林區多納里一鄰16-30號', '高雄市茂林區 — 未登記露營場', '0970202731', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一山沐露營區', 'camping', 22.90790964, 120.7250094, '多納巷16之39號', '高雄市茂林區 — 未登記露營場', '0932500065', 'https://booking.owlting.com/ismu?lang=zh_TW&adult=1&child=0&infant=0', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('得恩谷生態民宿', 'camping', 22.89681075, 120.6762771, '高雄市茂林區茂林里6鄰138號', '高雄市茂林區 — 未登記露營場', '0989370885', 'http://www.deengorge.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('渡露灣民宿露營區', 'camping', 22.90577623, 120.6885029, '高雄市茂林區萬山里72-36號', '高雄市茂林區 — 未登記露營場', '0989489533', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('烏巴克藝術空間', 'camping', 22.88498384, 120.6679428, '高雄市茂林區茂林巷116號', '高雄市茂林區 — 未登記露營場', '0910774687', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南橫梅山口農場露營區', 'camping', 23.26726482, 120.8238096, '南橫公路五段145號', '高雄市桃源區 — 未登記露營場', '0933532956', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('集頂山咖啡莊園露營區', 'camping', 23.05764631, 120.7284625, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', '0932990702', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藤枝櫻花原生茶園', 'camping', 23.06037791, 120.736223, '高雄市桃源區寶山里寶山巷250-5號', '高雄市桃源區 — 未登記露營場', '0912775165', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藤枝製茶露營區', 'camping', 23.07157171, 120.7125344, '高雄市桃源區寶山里寶山巷98-10號', '高雄市桃源區 — 未登記露營場', '0933376347', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大學林農場露營區', 'camping', 23.06086724, 120.7211431, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', '0963226119', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('文家果園', 'camping', 23.06271497, 120.7180969, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', '0912120153', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('玳菈露營區', 'camping', 23.10759366, 120.6889756, '高雄市桃源區建山巷15-10號', '高雄市桃源區 — 未登記露營場', '0900141019', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('海拉努休閒露營', 'camping', 23.07437344, 120.7126897, '高雄市桃源區寶山里寶山巷93號', '高雄市桃源區 — 未登記露營場', '0978329781', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('豐林農場露營區', 'camping', 23.07453612, 120.7143778, '高雄市桃源區寶山里寶山巷98-20號', '高雄市桃源區 — 未登記露營場', '0937474104', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('恬園咖啡莊園', 'camping', 23.0666953, 120.716076, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', '0978796085', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Laung石頭露營區', 'camping', 23.18081424, 120.7896508, '高雄市桃源區勤和里南橫公路三段118-1號', '高雄市桃源區 — 未登記露營場', '0925096159', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('艾莉絲森林露營區', 'camping', 23.06473361, 120.7186472, '高雄市桃源區寶山巷98之18號', '高雄市桃源區 — 未登記露營場', '0963733088', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Daluhan露營區', 'camping', 23.06426782, 120.7190291, '藤枝段148地號', '高雄市桃源區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿爾山露營區', 'camping', 23.06289851, 120.7278944, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', '0968335080', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉芙蘭櫻花農場露營區', 'camping', 23.24507911, 120.8127229, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', '0937761004', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晨月緣露營區', 'camping', 23.07098251, 120.7119219, '高雄市桃源區寶山巷98-8號', '高雄市桃源區 — 未登記露營場', '0936355434', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿桂果園露營區', 'camping', 23.0747, 120.71778, '高雄市桃源區', '高雄市桃源區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('藤枝好望角露營區', 'camping', 23.06500548, 120.7165296, '高雄市桃源區732 號', '高雄市桃源區 — 未登記露營場', '0910047240', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三桃山森林遊樂區', 'camping', 22.87852141, 120.4743512, '高雄市旗山區三桃巷9號', '高雄市旗山區 — 未登記露營場', '076612482', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麗湖探索教育園區', 'camping', 22.88481498, 120.4433733, '高雄市旗山區三協里旗亭巷500弄99號', '高雄市旗山區 — 未登記露營場', '076627407', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('川山境露營區', 'camping', 22.97511126, 120.5203388, '高雄市旗山區大勝巷9-2號', '高雄市旗山區 — 未登記露營場', '0915051226', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('九九莊園十三番農場', 'camping', 23.7433, 120.5654, '斗六市十三南路55-2號', '雲林縣斗六市 — 未登記露營場', '055518889,055514888', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('佳南美地露營區', 'camping', 23.590962, 120.606477, '雲林縣古坑鄉華山村69號', '雲林縣古坑鄉 — 未登記露營場', '0937749040', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露上樟湖', 'camping', 23.603244, 120.630371, '雲林縣古坑鄉石橋50之2號，樟湖生態國小旁的露營區', '雲林縣古坑鄉 — 未登記露營場', '0901033928', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙地休閒農場', 'camping', 23.59841, 120.619295, '雲林縣古坑鄉桂林村桃源1之30號', '雲林縣古坑鄉 — 未登記露營場', '055901989', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('逸境生態露營區', 'camping', 23.72444, 120.6177, '雲林縣林內鄉自強路1巷23-8號', '雲林縣林內鄉 — 未登記露營場', '0916941489', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('皇后鎮森林', 'camping', 24.91799892, 121.4341982, '竹崙里竹崙路95巷1號', '新北市三峽區 — 未登記露營場', '0226682591', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三峽北大清肺農場', 'camping', 24.86017771, 121.452951, '有木里有木126-1號', '新北市三峽區 — 未登記露營場', '0918804369', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('東峰烤肉露營區', 'camping', 24.8483506, 121.445913, '有木里147號', '新北市三峽區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂樂谷', 'camping', 24.84754063, 121.445787, '有木153之1號', '新北市三峽區 — 未登記露營場', '0226720505', 'https://www.facebook.com/tel0226720505/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('十分自然露營區', 'camping', 25.05212805, 121.7827808, '靜安路三段', '新北市平溪區 — 未登記露營場', '0936175963', 'https://m.icamping.app/store/sfzr218', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('平溪森林小學會館', 'camping', 25.00231317, 121.7466305, '東勢里火燒寮6號', '新北市平溪區 — 未登記露營場', '0938696209', 'http://psfa.org.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('碉堡露營區', 'camping', 25.28921319, 121.5398859, '新北市石門區富基里崁仔角28之2號前100公尺', '新北市石門區 — 未登記露營場', '0911225109', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('半島秘境', 'camping', 25.2870149, 121.5108009, '下員坑路15號', '新北市石門區 — 未登記露營場', '0226366757,0226365087', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大溪地露營區', 'camping', 24.91317717, 121.7082982, '大林里鶯子瀨2-1號', '新北市坪林區 — 未登記露營場', '0226657218', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('合歡露營山莊', 'camping', 24.94162041, 121.7157041, '水德里5-1號', '新北市坪林區 — 未登記露營場', '0226656434', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('虎寮潭山莊', 'camping', 24.94946221, 121.7401356, '虎寮潭16-1號', '新北市坪林區 — 未登記露營場', '0226656549', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鐵馬新樂園', 'camping', 24.91373027, 121.6810468, '粗窟里金瓜寮19-1號', '新北市坪林區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天山親水農場', 'camping', 24.90804845, 121.6799917, '粗窟里金瓜寮24-2號', '新北市坪林區 — 未登記露營場', '0226656199', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清泉水頭營地', 'camping', 24.95319052, 121.7503773, '魚光里粗石斛6-2號', '新北市坪林區 — 未登記露營場', '0921459536', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('林園營地', 'camping', 24.94113291, 121.7196638, '下坑子口12號', '新北市坪林區 — 未登記露營場', '0226656686', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青山農場', 'camping', 25.00645755, 121.7187917, '石槽里北宜路9段86號', '新北市坪林區 — 未登記露營場', '0226656165', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('映象之旅', 'camping', 24.95535018, 121.7441876, '上德里虎寮潭1-2號', '新北市坪林區 — 未登記露營場', '0226656146', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長青營地', 'camping', 24.94589382, 121.7237003, '壁潭2-1號', '新北市坪林區 — 未登記露營場', '0226656601', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仁里茶園露營區', 'camping', 24.92860819, 121.6864907, '粗窟村仁里13號', '新北市坪林區 — 未登記露營場', '0226656919', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠野山林', 'camping', 24.89419361, 121.7345083, '石槽里50號', '新北市坪林區 — 未登記露營場', '0226658128', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠峰渡假山莊', 'camping', 25.18821475, 121.5890971, '重和里三重橋22號', '新北市金山區 — 未登記露營場', '0224080168', 'http://www.greenpeak.fun/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金山驛境', 'camping', 25.22548909, 121.6041805, '重和里牛埔仔5之2號', '新北市金山區 — 未登記露營場', '0910052552', 'https://goldmrnr.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰雅巴萊部落村', 'camping', 24.86026281, 121.5395302, '西羅岸路132號', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('裕子商店(微笑吧露營地)', 'camping', 24.78172647, 121.5037762, '福山里福山一號橋旁', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福山緣營地', 'camping', 24.77891635, 121.5031813, '福山里卡拉模基2號', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福山大羅蘭露營區', 'camping', 24.77456052, 121.5029141, '新北市烏來區大羅蘭7號', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('來烏來露營地', 'camping', 24.89845091, 121.5607607, '金堰115巷10號之1', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大桶山泰雅藝術館(前桶壁角親子露營聖地)', 'camping', 24.88353997, 121.5560251, '忠治里金堰92號', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福山達卡露營區', 'camping', 24.77473329, 121.4976867, '大羅蘭19號之1', '新北市烏來區 — 未登記露營場', '0911836830', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('明裕山水（獵野啦卡）', 'camping', 24.85608742, 121.5653571, '新北市烏來區啦卡路70之1號', '新北市烏來區 — 未登記露營場', '0977457470', 'https://www.facebook.com/people/%E6%98%8E%E8%A3%95%E5%B1%B1%E6%B0%B4%E7%8D%B5%E9%87%8E%E5%95%A6%E5%8D%A1/100063707539757/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('頭目山水', 'camping', 24.7818544, 121.5018707, '福山里3鄰卡拉模基21號', '新北市烏來區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('甜蜜點休閒莊園', 'camping', 25.20557412, 121.4570249, '奎柔山路189號', '新北市淡水區 — 未登記露營場', '0933916911', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('長青谷營地', 'camping', 24.92627511, 121.5264778, '新潭路二段25號', '新北市新店區 — 未登記露營場', '0988104150', 'http://pa.org.tw/green/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('文山農場', 'camping', 24.93363483, 121.5410018, '湖子內路100號', '新北市新店區 — 未登記露營場', '0226667512', 'http://www.wsfa.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('確幸莊園', 'camping', 24.92516612, 121.524024, '新潭路二段27號', '新北市新店區 — 未登記露營場', '0229188769', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('皇后鎮森林', 'camping', 25.209576, 121.643294, '新北市萬里區大鵬街111號', '新北市萬里區 — 未登記露營場', '0224985060', 'https://www.queen-village.com/play_jinshan.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山間小露', 'camping', 25.01438986, 121.8247131, '三叉坑4號', '新北市雙溪區 — 未登記露營場', '0989740193', 'https://www.facebook.com/slowlife2015/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老農夫生態休閒農莊', 'camping', 25.01202566, 121.8738422, '魚行里丁子蘭坑50號', '新北市雙溪區 — 未登記露營場', '0224930266', 'https://www.facebook.com/p/%E8%80%81%E8%BE%B2%E5%A4%AB%E7%94%9F%E6%85%8B%E4%BC%91%E9%96%92%E8%BE%B2%E8%8E%8A-100063685496959/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新竹風莊園', 'camping', 24.7234956, 120.91827, '300新竹市香山區中華路六段718-8號', '新竹市香山區 — 未登記露營場', NULL, 'https://how718-8.epo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尤外農場山莊(原名)尤外露營區', 'camping', 24.57635246, 121.0844985, '新竹縣五峰鄉桃山村18鄰白蘭311之7號', '新竹縣五峰鄉 — 未登記露營場', '0933344040', 'https://www.facebook.com/yw525/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大霸雅脈露營區', 'camping', 24.623395, 121.097632, '新竹縣五峰鄉大隘村18鄰茅圃352號1樓', '新竹縣五峰鄉 — 未登記露營場', '0955236271', 'https://www.facebook.com/dabayama2017/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尤巴士露營區', 'camping', 24.58086, 121.088004, '新竹縣五峰鄉桃山村18鄰白蘭301之8號', '新竹縣五峰鄉 — 未登記露營場', '0921919851', 'https://m.icamping.app/store/ybs067', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘇珊藏美露營農場', 'camping', 24.568233, 121.108926, '五峰鄉桃山村17鄰清泉296之24號臨', '新竹縣五峰鄉 — 未登記露營場', '0905881189', 'https://www.easycamp.com.tw/Store_2342.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露露米露營區', 'camping', 24.623174, 121.143221, '新竹縣五峰鄉竹林村1鄰羅山22之5號', '新竹縣五峰鄉 — 未登記露營場', '0978056791', 'https://m.icamping.app/store/llm115', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠色奇緣露營區', 'camping', 24.624322, 121.110462, '新竹縣五峰鄉竹林村5鄰和平166之15號', '新竹縣五峰鄉 — 未登記露營場', '0936309262', 'https://17camping.ezhotel.com.tw/16', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲頂杉林景觀農場', 'camping', 24.64977221, 121.1708491, '五峰鄉花園村天湖9鄰196-6號', '新竹縣五峰鄉 — 未登記露營場', '0926114979', 'https://www.facebook.com/groups/821981094529026/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('布魯的家露營區', 'camping', 24.573135, 121.091689, '新竹縣五峰鄉桃山村11鄰清泉197之7號', '新竹縣五峰鄉 — 未登記露營場', '0937155954', 'https://www.facebook.com/Peggy.chen0057/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('和平柿外佳園', 'camping', 24.621695, 121.112416, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0985003469', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天湖露營區', 'camping', 24.66466, 121.162995, '新竹縣五峰鄉花園村10鄰天湖218之11號臨', '新竹縣五峰鄉 — 未登記露營場', '0911215732', 'https://www.facebook.com/greenstyle.fun/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迦心休閒露營區(原名)巴萬五峰露營區', 'camping', 24.659761, 121.174906, '新竹縣五峰鄉花園村10鄰天湖205之6號1樓', '新竹縣五峰鄉 — 未登記露營場', '0919377817', 'https://m.icamping.app/store/bwwf655', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('斯卡嵐慕露營區', 'camping', 24.613169, 121.091825, '新竹縣五峰鄉大隘村23鄰茅圃480之1號', '新竹縣五峰鄉 — 未登記露營場', '0975390775', 'https://m.icamping.app/store/sklm538', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉哢露營區', 'camping', 24.575265, 121.087782, '新竹縣五峰鄉桃山村18鄰白蘭311之42號', '新竹縣五峰鄉 — 未登記露營場', '0932938746', 'https://www.facebook.com/Lalum31142/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('魯娜的秘境', 'camping', 24.602847, 121.096324, '新竹縣五峰鄉大隘村23鄰茅圃463號', '新竹縣五峰鄉 — 未登記露營場', '0963305096,0932176805', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('靜觀露營區', 'camping', 24.577316, 121.086888, '新竹縣五峰鄉桃山村18鄰白蘭311之30號', '新竹縣五峰鄉 — 未登記露營場', '0953211130', 'https://m.icamping.app/store/jg150', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尤瑪山莊', 'camping', 24.596406, 121.095409, '新竹縣五峰鄉大隘村23鄰茅圃471號', '新竹縣五峰鄉 — 未登記露營場', '0921241749', 'https://www.bing.com/search?q=_%E5%B0%A4%E7%91%AA%E5%B1%B1%E8%8E%8A&qs=n&form=QBRE&sp=-1&pq=_%E5%B0%A4%E7%91%AA%E5%B1%B1%E8%8E%8A&sc=2-5&sk=&cvid=E78597C332DE4E15A00AE2D68A2564CB&ghsh=0&ghacc=0&ghpl=', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿林道營地', 'camping', 24.557379, 121.103716, '新竹縣五峰鄉桃山村17鄰清泉205之5號', '新竹縣五峰鄉 — 未登記露營場', '0988518193', 'https://www.lulin.com.tw/page/local.php', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('空軍一號民宿露營', 'camping', 24.66286, 121.16591, '新竹縣五峰鄉花園村10鄰天湖219之17號臨', '新竹縣五峰鄉 — 未登記露營場', '0920057865,0932937651', 'https://www.easycamp.com.tw/Store_2363.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈尼農園', 'camping', 24.608936, 121.124309, '新竹縣五峰鄉竹林村4鄰忠興112之4號', '新竹縣五峰鄉 — 未登記露營場', '0953015650', 'https://m.icamping.app/store/hn116', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野馬農園露營區', 'camping', 24.532017, 121.124242, '新竹縣五峰鄉桃山村20鄰民石362號', '新竹縣五峰鄉 — 未登記露營場', '0939615013', 'https://www.facebook.com/profile.php?id=100057394220675', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('B612 夕淞度日', 'camping', 24.613774, 121.134599, '新竹縣五峰鄉竹林村1鄰羅山24之22號', '新竹縣五峰鄉 — 未登記露營場', '0933793714', 'https://www.facebook.com/B612pascal/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿秋泰雅編織工坊', 'camping', 24.582263, 121.091125, '新竹縣五峰鄉桃山村18鄰白蘭309之5號', '新竹縣五峰鄉 — 未登記露營場', '0928637557', 'https://www.easycamp.com.tw/Store_763.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('艾嵐休閒露營區', 'camping', 24.630718, 121.090639, '新竹縣五峰鄉大隘村14鄰大隘271-4號', '新竹縣五峰鄉 — 未登記露營場', '0930262249', 'https://www.facebook.com/AlainCamping0330/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田秘的家露營區', 'camping', 24.653025, 121.131241, '新竹縣五峰鄉花園村河頭2鄰47之5號', '新竹縣五峰鄉 — 未登記露營場', '0930013613', 'https://campground-310.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('英桃天闊營地', 'camping', 24.613613, 121.137379, '新竹縣五峰鄉竹林村1鄰羅山24之18號', '新竹縣五峰鄉 — 未登記露營場', '0933843008', 'https://www.facebook.com/professorcamp/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈勇露營區', 'camping', 24.625084, 121.152055, '新竹縣五峰鄉竹林村1鄰羅山28號', '新竹縣五峰鄉 — 未登記露營場', '0988861494', 'https://reurl.cc/mDnX9W', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好麻吉私房景點露營區', 'camping', 24.64858, 121.169306, '新竹縣五峰鄉花園村9鄰天湖196之20號臨', '新竹縣五峰鄉 — 未登記露營場', '0930913950', 'http://www.haumaji.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天湖祕境露營區', 'camping', 24.654172, 121.170423, '新竹縣五峰鄉花園村9鄰天湖196之9號', '新竹縣五峰鄉 — 未登記露營場', '0933233680', 'https://www.facebook.com/thmj554/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍之家農場(原名)山之谷露營區', 'camping', 24.625174, 121.154257, '新竹縣五峰鄉竹林村2鄰羅山45號', '新竹縣五峰鄉 — 未登記露營場', '0972928055', 'https://m.icamping.app/store/sjg631', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楠桂坊露營區', 'camping', 24.618951, 121.117704, '新竹縣五峰鄉竹林村5鄰和平154之1號', '新竹縣五峰鄉 — 未登記露營場', '0986100050', 'https://www.easycamp.com.tw/Store_2154.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天景露營區', 'camping', 24.656845, 121.183234, '新竹縣五峰鄉花園村10鄰天湖205號', '新竹縣五峰鄉 — 未登記露營場', '0987347774', 'https://www.facebook.com/janyu681121/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小米露營區', 'camping', 24.596165, 121.123831, '新竹縣五峰鄉竹林村4鄰忠興91之5號', '新竹縣五峰鄉 — 未登記露營場', '0958310212', 'https://www.facebook.com/smd5856459/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲頂天湖露營地', 'camping', 24.66753, 121.165347, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0936139374', 'https://m.icamping.app/store/ydth508', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅后蔓露營區', 'camping', 24.653569, 121.156346, '新竹縣五峰鄉花園村8鄰花園185-11號', '新竹縣五峰鄉 — 未登記露營場', '0965030988', 'https://www.easycamp.com.tw/Store_2302.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楓櫻杉林露營區', 'camping', 24.659278, 121.171775, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0912240828', 'https://www.facebook.com/utopiacampsite/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有你真好阿嬌露營區', 'camping', 24.627953, 121.144646, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0937757076', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高山寨露營區', 'camping', 24.659052, 121.140541, '五峰鄉花園村比來４鄰７８之１號', '新竹縣五峰鄉 — 未登記露營場', '0988920916', 'https://m.icamping.app/store/gsz149', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('移動城堡露營區', 'camping', 24.583633, 121.089868, '新竹縣五峰鄉桃山村18鄰白蘭310之3號', '新竹縣五峰鄉 — 未登記露營場', '0975973266', 'http://www.breezecastle.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('浮雲杉林(原名)蟬說：霧繞露營區', 'camping', 24.577353, 121.095642, '新竹縣五峰鄉花園村010鄰天湖２１９之３１號臨', '新竹縣五峰鄉 — 未登記露營場', '0921980143', 'https://www.chanshuo.tw/woorao/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白蘭時光露營區', 'camping', 24.579844, 121.085564, '新竹縣五峰鄉桃山村18鄰白蘭311之37號', '新竹縣五峰鄉 — 未登記露營場', '0911107640', 'https://m.icamping.app/store/brsk291', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('香吉樂活露營趣', 'camping', 24.626281, 121.146319, '新竹縣五峰鄉竹林村2鄰羅山31號', '新竹縣五峰鄉 — 未登記露營場', '0921096851', 'https://yaway035851112.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('無名露營區', 'camping', 24.66621, 121.167896, '新竹縣五峰鄉花園村10鄰', '新竹縣五峰鄉 — 未登記露營場', '0978258788', 'https://www.facebook.com/p/ï¼E7ï¼84ï¼A1ï¼E5ï¼90ï¼8Dï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-100069136915671/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('愛上天湖露營區', 'camping', 24.652656, 121.159636, '新竹縣五峰鄉花園村9鄰天湖196-2號', '新竹縣五峰鄉 — 未登記露營場', '0965210580,0910116922', 'https://www.easycamp.com.tw/Store_1757.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花園營地(原名)104蓪草花園營地', 'camping', 24.644296, 121.156875, '新竹縣五峰鄉花園村6鄰花園121之2臨', '新竹縣五峰鄉 — 未登記露營場', '0978507737', 'https://m.icamping.app/store/tthy407', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('賓。狗窩露營區', 'camping', 24.653107, 121.168123, '新竹縣五峰鄉花園村9鄰天湖196-5號', '新竹縣五峰鄉 — 未登記露營場', '0911959659', 'http://www.bingohouse.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松木青露營區', 'camping', 24.632258, 121.093911, '新竹縣五峰鄉大隘村14鄰大隘266號', '新竹縣五峰鄉 — 未登記露營場', '0968268419', 'https://www.facebook.com/opasobay/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鐵露局露營區', 'camping', 24.66228, 121.165977, '新竹縣五峰鄉花園村10鄰天湖221之5號臨', '新竹縣五峰鄉 — 未登記露營場', '0928801980', 'https://m.icamping.app/store/tlj057', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大東田露營地', 'camping', 24.644741, 121.155756, '新竹縣五峰鄉花園村6鄰花園121之5號', '新竹縣五峰鄉 — 未登記露營場', '0921632597', 'https://m.icamping.app/store/ddt267', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('幸福的仙園', 'camping', 24.627939, 121.089479, '新竹縣五峰鄉大隘村14鄰291之6號臨', '新竹縣五峰鄉 — 未登記露營場', '0934222992', 'https://reurl.cc/3x34Rj', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有愛一家露營區', 'camping', 24.619889, 121.139623, '五峰鄉竹林村1鄰羅山23之5號', '新竹縣五峰鄉 — 未登記露營場', '0982824338', 'https://reurl.cc/M8j2Gn', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山的那一邊', 'camping', 24.579028, 121.08527, '新竹縣五峰鄉桃山村18鄰白蘭311之37號', '新竹縣五峰鄉 — 未登記露營場', '0989210845', 'https://m.icamping.app/store/sdny431', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂哈山營地', 'camping', 24.575235, 121.079895, '新竹縣五峰鄉桃山村18鄰白蘭311之4號', '新竹縣五峰鄉 — 未登記露營場', '0932742480', 'https://www.facebook.com/lohasancamp/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迦南山莊', 'camping', 24.585463, 121.08981, '新竹縣五峰鄉桃山村18鄰白蘭305之6號', '新竹縣五峰鄉 — 未登記露營場', '035856031', 'https://www.facebook.com/profile.php?id=100070658572485', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('比拉多露營區', 'camping', 24.643722, 121.12272, '新竹縣五峰鄉大隘村2鄰25號', '新竹縣五峰鄉 — 未登記露營場', '0933118253', 'https://m.icamping.app/store/bldd518', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('櫻之林露營區', 'camping', 24.632211, 121.092202, '新竹縣五峰鄉大隘村14鄰大隘270之1號臨', '新竹縣五峰鄉 — 未登記露營場', '0966266058', 'https://tw-camping.tw/hotel_info.asp?hid=83', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嘉揚露營區', 'camping', 24.578825, 121.087858, '新竹縣五峰鄉桃山村18鄰白蘭302之6號臨', '新竹縣五峰鄉 — 未登記露營場', '0928637557', 'https://www.facebook.com/jy296/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅山頂景觀露營區', 'camping', 24.615807, 121.140376, '新竹縣五峰鄉竹林村1鄰羅山24之10號', '新竹縣五峰鄉 — 未登記露營場', '0937030737', 'https://reurl.cc/dDy3my', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('得碇休閒山莊', 'camping', 24.57591, 121.084237, '新竹縣五峰鄉桃山村18鄰白蘭311之20號', '新竹縣五峰鄉 — 未登記露營場', '035856587', 'https://www.facebook.com/doting0625/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星空夜語露營區', 'camping', 24.541511, 121.132482, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0922010170', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野足營地', 'camping', 24.651516, 121.169196, '新竹縣五峰鄉花園村9鄰天湖196-6號', '新竹縣五峰鄉 — 未登記露營場', '0900116853', 'https://17camping.ezhotel.com.tw/37', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬雅竹軒', 'camping', 24.580204, 121.090767, '新竹縣五峰鄉桃山村18鄰白蘭305號', '新竹縣五峰鄉 — 未登記露營場', '0938866330', 'https://www.easycamp.com.tw/Store_767.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('貝德拉蔓露營區(鳥嘴山露營區)', 'camping', 24.578886, 121.078353, '新竹縣五峰鄉桃山村18鄰白蘭314號', '新竹縣五峰鄉 — 未登記露營場', '0911612634', 'https://www.easycamp.com.tw/viewpoint/viewpoint_info/C1_376440000A_001567', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹鷹露營區', 'camping', 24.561034, 121.126795, '新竹縣五峰鄉桃山村19鄰民石327之13號', '新竹縣五峰鄉 — 未登記露營場', '0925490214', 'https://www.camptrip.com.tw/camp/%E7%AB%B9%E9%B7%B9%E9%9C%B2%E7%87%9F%E5%8D%80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巴棍杉林', 'camping', 24.578127, 121.081314, '新竹縣五峰鄉桃山村18鄰白蘭311之22號', '新竹縣五峰鄉 — 未登記露營場', '0910170544', 'https://m.icamping.app/store/bgsl137', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老牛露營區', 'camping', 24.583132, 121.082083, '新竹縣五峰鄉桃山村18鄰白蘭312-3號', '新竹縣五峰鄉 — 未登記露營場', '0975776215', 'https://m.icamping.app/store/lnlyq221', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('寶之林營地', 'camping', 24.622744, 121.094149, '五峰鄉大隘村16鄰', '新竹縣五峰鄉 — 未登記露營場', '0988523416', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天景露營場', 'camping', 24.656845, 121.183234, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬瀨營地', 'camping', 24.652861, 121.15861, '新竹縣五峰鄉花園村9鄰天湖196-3號', '新竹縣五峰鄉 — 未登記露營場', '0905564976', 'https://www.easycamp.com.tw/Store_2533.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('左岸涼山營地', 'camping', 24.609536, 121.100504, '新竹縣五峰鄉大隘村23鄰458之5號', '新竹縣五峰鄉 — 未登記露營場', '0931167691', 'https://www.easycamp.com.tw/store/store_index/764', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('四季露營區', 'camping', 24.587027, 121.092564, '新竹縣五峰鄉桃山村18鄰白蘭305之2號', '新竹縣五峰鄉 — 未登記露營場', '0963063960', 'https://www.facebook.com/wewincamp/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蓉園山莊', 'camping', 24.66013, 121.170372, '新竹縣五峰鄉花園村10鄰天湖219之22號臨', '新竹縣五峰鄉 — 未登記露營場', '0932921121', 'http://products006.okgo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('戈巴侖露營區', 'camping', 24.618674, 121.113542, '五峰鄉竹林村和平156號', '新竹縣五峰鄉 — 未登記露營場', '0975595131', 'https://m.icamping.app/store/gbl141', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雅居勝櫻休閒營地(原名)窩.露營', 'camping', 24.63157, 121.143386, '新竹縣五峰鄉竹林村1鄰羅山4之9號', '新竹縣五峰鄉 — 未登記露營場', '0920970102', 'https://www.facebook.com/ntstcamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉嵐營地', 'camping', 24.620376, 121.143198, '五峰鄉竹林村1鄰羅山23之2號', '新竹縣五峰鄉 — 未登記露營場', '0966662782', 'https://m.icamping.app/store/sr348', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花湖美地露營區', 'camping', 24.651933, 121.160116, '新竹縣五峰鄉花園村9鄰天湖196號', '新竹縣五峰鄉 — 未登記露營場', '0921049446', 'https://m.icamping.app/store/hhmd290', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛鳥恰恰豪華露營X愛露營野遊體驗(原名)飛鳥恰恰 Outdoorbase Experience', 'camping', 24.657838, 121.172276, '五峰鄉花園村010鄰天湖205之12號臨', '新竹縣五峰鄉 — 未登記露營場', '0930816898,0932456726', 'https://www.facebook.com/flybirdchacha/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('漫步天湖露營區', 'camping', 24.66817817, 121.1658831, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巴棍民宿露營區', 'camping', 24.57536, 121.088963, '新竹縣五峰鄉桃山村18鄰白蘭311之22號', '新竹縣五峰鄉 — 未登記露營場', '035856351', 'https://www.facebook.com/babacamping/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喜來登露營地', 'camping', 24.639929, 121.113396, '新竹縣五峰鄉大隘村4鄰51之11號', '新竹縣五峰鄉 — 未登記露營場', '0970213255', 'https://www.easycamp.com.tw/Store_2441.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈娜露營區', 'camping', 24.621739, 121.110529, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0920071099', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿貴營地', 'camping', 24.604222, 121.089963, '新竹縣五峰鄉大隘村23鄰茅圃466號', '新竹縣五峰鄉 — 未登記露營場', '0931167691', 'https://akueicamp.blogspot.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('觀雲亭農莊(原名)觀雲露營區', 'camping', 24.608613, 121.099005, '新竹縣五峰鄉大隘村23鄰茅圃461之2號', '新竹縣五峰鄉 — 未登記露營場', '0910945792', 'https://www.easycamp.com.tw/Store_2452.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田家山莊(原名)蟬說：霧語', 'camping', 24.584638, 121.082, '新竹縣五峰鄉桃山村18鄰白蘭315之3號', '新竹縣五峰鄉 — 未登記露營場', '0988519118', 'https://www.chanshuo.tw/wooyuu-zh/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('谷亮露營區', 'camping', 24.636419, 121.144769, '新竹縣五峰鄉竹林村1鄰羅山1之1號', '新竹縣五峰鄉 — 未登記露營場', '0934306032', 'https://www.easycamp.com.tw/tvc/tvc_video/388', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瓜麗古老露營區', 'camping', 24.563351, 121.127993, '新竹縣五峰鄉桃山村19鄰民石324之20號', '新竹縣五峰鄉 — 未登記露營場', '0928011386', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('千鶴營地', 'camping', 24.617538, 121.140384, '新竹縣五峰鄉竹林村1鄰羅山23之13號臨', '新竹縣五峰鄉 — 未登記露營場', '0915578337', 'http://www.fago.com.tw/store/?useno=0915578337', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('翡翠園露營區', 'camping', 24.614508, 121.138478, '新竹縣五峰鄉竹林村1鄰羅山24之16號', '新竹縣五峰鄉 — 未登記露營場', '0905386992', 'https://hostel.url.com.tw/0905386992', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('牧羊小豆子', 'camping', 24.592857, 121.128226, '新竹縣五峰鄉竹林村4鄰忠興93之6號', '新竹縣五峰鄉 — 未登記露營場', '0910565344', 'https://m.icamping.app/store/myxdz194', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星空下露營區', 'camping', 24.579516, 121.085326, '新竹縣五峰鄉桃山村18鄰白蘭311之37號', '新竹縣五峰鄉 — 未登記露營場', '0916715682', 'https://m.icamping.app/store/sks032', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('觀瀑營地休閒區', 'camping', 24.642412, 121.155663, '新竹縣五峰鄉花園村6鄰花園121之2號', '新竹縣五峰鄉 — 未登記露營場', '035851101', 'https://www.easycamp.com.tw/Store_2080.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('輪園秘境', 'camping', 24.661607, 121.164136, '五峰鄉花園村天湖２１９－１號臨', '新竹縣五峰鄉 — 未登記露營場', '0958819385', 'https://www.easycamp.com.tw/Store_2496.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('舞蜜農園露營區', 'camping', 24.622333, 121.144131, '新竹縣五峰鄉竹林村2鄰羅山39號之1', '新竹縣五峰鄉 — 未登記露營場', '0921096802', 'https://www.facebook.com/umi0921096802/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('愛上喜翁民宿', 'camping', 24.590967, 121.129524, '新竹縣五峰鄉竹林村4鄰忠興93號', '新竹縣五峰鄉 — 未登記露營場', '0933290500,0911052872', 'https://www.xiong-glamping.com/home', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('格布霧露營區', 'camping', 24.570713, 121.081614, '新竹縣五峰鄉桃山村18鄰白蘭311號之1', '新竹縣五峰鄉 — 未登記露營場', '0933795284', 'https://www.facebook.com/ngasal.Tumaw/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙湖露營區', 'camping', 24.626137, 121.116291, '五峰鄉大隘村10鄰194號', '新竹縣五峰鄉 — 未登記露營場', '0932119772', 'https://m.icamping.app/store/sh289', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('巴斯瓜藍民宿', 'camping', 24.581567, 121.083451, '新竹縣五峰鄉桃山村18鄰白蘭312號', '新竹縣五峰鄉 — 未登記露營場', '0932119057', 'https://bas.mmweb.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲起露營區', 'camping', 24.585229, 121.085532, '新竹縣五峰鄉桃山村18鄰白蘭307之15號', '新竹縣五峰鄉 — 未登記露營場', '0988850580', 'https://www.facebook.com/YunChi.camping/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('紫色的家露營區', 'camping', 24.666761, 121.164092, '新竹縣五峰鄉大隘村3鄰五峰39之1號', '新竹縣五峰鄉 — 未登記露營場', '035851465', 'https://17camping.ezhotel.com.tw/17', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃山清泉露營區', 'camping', 24.570342, 121.106783, '新竹縣五峰鄉桃山村17鄰清泉296號', '新竹縣五峰鄉 — 未登記露營場', '0989393688', 'https://www.facebook.com/familysweet999/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('霞喀羅露營區', 'camping', 24.557104, 121.133324, '新竹縣五峰鄉桃山村19鄰民石324之20號', '新竹縣五峰鄉 — 未登記露營場', '0972731038', 'https://www.popcamps.com/product/ï¼e9ï¼9cï¼9eï¼e5ï¼96ï¼80ï¼e7ï¼beï¼85-ï¼e9ï¼9cï¼b2ï¼e7ï¼87ï¼9fï¼e5ï¼8dï¼80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬丘比丘露營區', 'camping', 24.653107, 121.168123, '新竹縣五峰鄉', '新竹縣五峰鄉 — 未登記露營場', '0937986073', 'https://m.icamping.app/store/mcpc465', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('戀戀天湖', 'camping', 24.664259, 121.166441, '新竹縣五峰鄉花園村10鄰天湖219之15號臨', '新竹縣五峰鄉 — 未登記露營場', '0910606325', 'https://www.easycamp.com.tw/Store_2444.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('賽夏有機農場露營區', 'camping', 24.612992, 121.135305, '新竹縣五峰鄉竹林村1鄰羅山24之20號', '新竹縣五峰鄉 — 未登記露營場', '0911629260', 'https://www.facebook.com/ss0911629260/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('愛上比來(原名)愛。上比來露營區', 'camping', 24.664267, 121.147552, '新竹縣五峰鄉花園村4鄰比來78之15號臨', '新竹縣五峰鄉 — 未登記露營場', NULL, 'https://m.icamping.app/store/asbr344', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('谷燕養鱒場露營區', 'camping', 24.623884, 121.127008, '新竹縣五峰鄉竹林村5鄰和平159號', '新竹縣五峰鄉 — 未登記露營場', '035851243', 'https://www.easycamp.com.tw/tvc/tvc_video/390', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('KT 露營區', 'camping', 24.660364, 121.151221, '五峰鄉花園村8鄰花園167之1號', '新竹縣五峰鄉 — 未登記露營場', '0905368534', 'https://www.easycamp.com.tw/Store_2055.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('穿山甲咖啡露營休閒莊園', 'camping', 24.702139, 120.996923, '新竹縣北埔鄉南埔村5鄰番婆坑8之22號', '新竹縣北埔鄉 — 未登記露營場', '0952303130', 'https://m.icamping.app/store/csj478', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金名柏屋休閒農莊', 'camping', 24.6773889, 121.049047, '新竹縣北埔鄉南坑村1鄰九分子2之19號', '新竹縣北埔鄉 — 未登記露營場', '0909592711,0988073011', 'https://www.camptrip.com.tw/camp/%e9%87%91%e5%90%8d%e6%9f%8f%e5%b1%8b%e4%bc%91%e9%96%92%e8%be%b2%e8%8e%8a/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星月北埔', 'camping', 24.688244, 121.0545, '新竹縣北埔鄉大林村1鄰大林街61之1號臨', '新竹縣北埔鄉 — 未登記露營場', '0981091427', 'https://www.bing.com/search?q=_星月北埔&qs=n&form=QBRE&sp=-1&pq=&sc=10-0&sk=&cvid=FDFC2B4D5819439AAE4A79DF7B57C049&ghsh=0&ghacc=0&ghpl=', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星月天空露營地', 'camping', 24.678523, 121.073948, '新竹縣北埔鄉大湖村10鄰下大湖22之30號', '新竹縣北埔鄉 — 未登記露營場', '0933791622', 'https://m.icamping.app/store/bpxytk095', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐熙山林(原名:日光山城)', 'camping', 24.679485, 121.076909, '新竹縣北埔鄉大湖村12鄰下大湖22之20號臨', '新竹縣北埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星院露營區', 'camping', 24.690791, 121.070409, '新竹縣北埔鄉大湖村10鄰下大湖10號', '新竹縣北埔鄉 — 未登記露營場', '0932939203', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('永茂森林山莊', 'camping', 24.636895, 121.060692, '新竹縣北埔鄉外坪村6鄰焿寮坪3之1號', '新竹縣北埔鄉 — 未登記露營場', '0930103227', 'https://17camping.ezhotel.com.tw/126', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大湖山林', 'camping', 24.68946, 121.087899, '新竹縣北埔鄉', '新竹縣北埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晨堡露營區(原名)熊麻吉親子露營區', 'camping', 24.67771, 121.247757, '新竹縣尖石鄉錦屏村12鄰那羅209之7號', '新竹縣尖石鄉 — 未登記露營場', '0919991616', 'https://www.easycamp.com.tw/tvc/tvc_video/2911', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅花天湖農園', 'camping', 24.660645, 121.175873, '新竹縣尖石鄉梅花村8鄰梅花227號', '新竹縣尖石鄉 — 未登記露營場', '0912442539', 'https://www.easycamp.com.tw/Store_787.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('印象尖石露營區', 'camping', 24.7236, 121.2664, '新竹縣尖石鄉新樂村8鄰煤源29之3號', '新竹縣尖石鄉 — 未登記露營場', '0972812369', 'https://www.easycamp.com.tw/Store_2226.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好馬露營區', 'camping', 24.73215758, 121.2469741, '新竹縣尖石鄉新樂村12鄰煤源174之1號', '新竹縣尖石鄉 — 未登記露營場', '0975211698', 'https://www.facebook.com/profile.php?id=2072077849690205&paipv=0&eav=AfZPE6J9h9_JRMSdeSnx1RXuw4UQsqbjL8pps_a1z9VgpeBztbCXftWE5NyiOTeurw0&_rdr', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高台山露營區', 'camping', 24.664069, 121.224911, '新竹縣尖石鄉錦屏村7鄰那羅26號', '新竹縣尖石鄉 — 未登記露營場', '0928139400', 'https://www.easycamp.com.tw/Store_837.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迎風露營廣場', 'camping', 24.722969, 121.254279, '新竹縣尖石鄉新樂村11鄰拉號部落', '新竹縣尖石鄉 — 未登記露營場', '0932379004', 'https://www.camptrip.com.tw/camp/ï¼E8ï¼BFï¼8Eï¼E9ï¼A2ï¼A8ï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那羅仙境露營區', 'camping', 24.68495, 121.251438, '新竹縣尖石鄉錦屏村11鄰那羅177之3號', '新竹縣尖石鄉 — 未登記露營場', '0975814689', 'https://www.easycamp.com.tw/tvc/tvc_video/469', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('怪獸綠境露營區', 'camping', 24.743, 121.2736, '新竹縣尖石鄉新樂村6鄰水田149號旁', '新竹縣尖石鄉 — 未登記露營場', '0937868665', 'https://www.facebook.com/people/%E5%B0%96%E7%9F%B3%E6%80%AA%E7%8D%B8%E7%B6%A0%E5%A2%83%E9%9C%B2%E7%87%9F%E5%8D%80/100054309498846/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('航道休閒露營區', 'camping', 24.73284, 121.257271, '新竹縣尖石鄉新樂村7鄰水田185號', '新竹縣尖石鄉 — 未登記露營場', '0937019412', 'https://17camping.ezhotel.com.tw/77', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('河岸營地(原名)老鷹溪107號營地', 'camping', 24.662299, 121.280588, '新竹縣尖石鄉玉峰村1鄰宇老7號', '新竹縣尖石鄉 — 未登記露營場', '0910955372', 'https://www.facebook.com/groups/1399151243660118/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('谷漢休閒露營區', 'camping', 24.724383, 121.232495, '新竹縣尖石鄉嘉樂村14鄰160之1號', '新竹縣尖石鄉 — 未登記露營場', '0978619880,0976163247', 'https://m.icamping.app/store/gh430', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('閑情園', 'camping', 24.68252, 121.205521, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', '0937062436', 'https://m.icamping.app/store/xqy091', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尖石之美露營區', 'camping', 24.724241, 121.262067, '新竹縣尖石鄉新樂村8鄰煤源1之1號', '新竹縣尖石鄉 — 未登記露營場', '0963009058', 'https://hostel.url.com.tw/home/1627', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Yutas 悠達思露營區', 'camping', 24.652933, 121.313207, '新竹縣尖石鄉玉峰村6鄰宇抬36之2號', '新竹縣尖石鄉 — 未登記露營場', '0972102007', 'https://www.easycamp.com.tw/Store_776.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('相思園', 'camping', 24.707556, 121.224098, '新竹縣尖石鄉錦屏村2鄰比麟96號臨', '新竹縣尖石鄉 — 未登記露營場', '035841989', 'https://www.camptrip.com.tw/camp/%E7%9B%B8%E6%80%9D%E5%9C%92%E6%99%AF%E8%A7%80%E9%9C%B2%E7%87%9F%E5%8D%80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('寶石蘭露營區', 'camping', 24.733044, 121.219231, '新竹縣尖石鄉嘉樂村7鄰嘉樂61之8號', '新竹縣尖石鄉 — 未登記露營場', '0975168375', 'https://www.facebook.com/Jewel.orchids.tw/about?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晴空森林露營地', 'camping', 24.685804, 121.25946, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', '0921556563', 'https://www.easycamp.com.tw/Store_2516.htm', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田野露營區', 'camping', 24.671856, 121.213189, '新竹縣尖石鄉錦屏村5鄰錦屏84號', '新竹縣尖石鄉 — 未登記露營場', '0955647080', 'https://www.facebook.com/profile.php?id=100063997751738', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雪花的露營區', 'camping', 24.667641, 121.19383, '新竹縣尖石鄉梅花村9鄰梅花236號臨', '新竹縣尖石鄉 — 未登記露營場', '0919791154', 'https://m.icamping.app/store/xhdj102', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('烏米的家露營區', 'camping', 24.682015, 121.245171, '新竹縣尖石鄉錦屏村9鄰那羅80之2號', '新竹縣尖石鄉 — 未登記露營場', '0932285992,0911280458', 'https://www.easycamp.com.tw/Store_2507.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('6 號花園', 'camping', 24.717332, 121.256009, '新竹縣尖石鄉新樂村拉號部落', '新竹縣尖石鄉 — 未登記露營場', '0988605205', 'http://www.6garden.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喜樂露營區', 'camping', 24.680122, 121.160256, '新竹縣尖石鄉義興村9鄰馬胎22之9號臨', '新竹縣尖石鄉 — 未登記露營場', '0937343965', 'https://m.icamping.app/store/xl164', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('芭芘蕾咖啡(原名)芭芘蕾露營區', 'camping', 24.749353, 121.266487, '新竹縣尖石鄉新樂村4鄰水田139之1號臨', '新竹縣尖石鄉 — 未登記露營場', '0911012845', 'https://www.easycamp.com.tw/Store_827.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('芯岳露營區', 'camping', 24.667442, 121.212893, '新竹縣尖石鄉錦屏村4鄰錦屏52之2號臨', '新竹縣尖石鄉 — 未登記露營場', '0905512918', 'https://www.facebook.com/shinyuch/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂奔露營區', 'camping', 24.73332, 121.2724, '新竹縣尖石鄉新樂村6鄰水田150之5號臨', '新竹縣尖石鄉 — 未登記露營場', '0905723767', 'https://www.facebook.com/atayalcamping/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野薑花露營區', 'camping', 24.680553, 121.237137, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', '0966528321', 'https://www.bing.com/search?q=野薑花露營區ï¼qs=nï¼form=QBREï¼sp=-1ï¼pq=野薑花露營區ï¼sc=3-6ï¼sk=ï¼cvid=69A6DE431C1D4AF7884B6980B7B24B83ï¼ghsh=0ï¼ghacc=0ï¼ghpl=', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬月台露營區', 'camping', 24.669863, 121.155071, '新竹縣尖石鄉義興村7鄰馬胎21之6號臨', '新竹縣尖石鄉 — 未登記露營場', '035842335', 'https://www.easycamp.com.tw/Store_2151.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹山嶺', 'camping', 24.678978, 121.184434, '新竹縣尖石鄉義興村9鄰馬胎93之1號臨', '新竹縣尖石鄉 — 未登記露營場', '0935076781', 'https://www.rainbowmount.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠宥子甜柿果園露營區', 'camping', 24.7082, 121.2709, '新竹縣尖石鄉新樂村10鄰煤源65之3號', '新竹縣尖石鄉 — 未登記露營場', '09125373862', 'https://www.easycamp.com.tw/Store_2015.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅花梯田露營區', 'camping', 24.683506, 121.200969, '新竹縣尖石鄉梅花村3鄰梅花79之3號臨', '新竹縣尖石鄉 — 未登記露營場', '0958987418', 'https://www.easycamp.com.tw/Store_2394.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星光閃閃(原682)露營區', 'camping', 24.663067, 121.286425, '新竹縣尖石鄉玉峰村1鄰宇老7之6號', '新竹縣尖石鄉 — 未登記露營場', '0937516940,0988525737', 'https://www.easycamp.com.tw/Store_2403.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('萬里山園', 'camping', 24.69273, 121.316339, '新竹縣尖石鄉玉峰村8鄰馬美30號', '新竹縣尖石鄉 — 未登記露營場', '035847463', 'https://www.facebook.com/wanli.0933859136/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嫻嫻＆棠棠露營區', 'camping', 24.731, 121.218, '新竹縣尖石鄉嘉樂村7鄰嘉樂60號', '新竹縣尖石鄉 — 未登記露營場', '0922169141', 'https://www.facebook.com/tung0830/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('櫻花谷露營區', 'camping', 24.7476, 121.2642, '新竹縣尖石鄉新樂村4鄰水田36之1號', '新竹縣尖石鄉 — 未登記露營場', '0919569886', 'https://www.camptrip.com.tw/camp/%e6%ab%bb%e8%8a%b1%e8%b0%b7%e9%9c%b2%e7%87%9f%e5%8d%80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露營樂3號店臻美館', 'camping', 24.7144, 121.2843, '新竹縣尖石鄉新樂村8鄰煤源36之2號', '新竹縣尖石鄉 — 未登記露營場', '0939908209,09397960532', 'https://www.easycamp.com.tw/Store_2554.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喜嵐田園露營區', 'camping', 24.6776, 121.246266, '新竹縣尖石鄉錦屏村12鄰那羅205之1號', '新竹縣尖石鄉 — 未登記露營場', '0933343004,0905455176', 'http://www.slaqsilan.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('函館露營區', 'camping', 24.679996, 121.17457, '新竹縣尖石鄉義興村9鄰馬胎107-1號臨', '新竹縣尖石鄉 — 未登記露營場', '0919445898', 'http://hanguancamping.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尖石夢田露營區', 'camping', 24.727696, 121.217483, '新竹縣尖石鄉嘉樂村5鄰麥樹仁270之5號', '新竹縣尖石鄉 — 未登記露營場', '0932343774', 'https://www.easycamp.com.tw/Store_2508.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水田營地', 'camping', 24.735227, 121.259365, '新竹縣尖石鄉新樂村7鄰水田190號', '新竹縣尖石鄉 — 未登記露營場', '035841005', 'https://www.bing.com/search?q=水田營地ï¼qs=nï¼form=QBREï¼sp=-1ï¼pq=水田營地ï¼sc=3-4ï¼sk=ï¼cvid=95D2496BFF464690B7E8841B9B027DC4ï¼ghsh=0ï¼ghacc=0ï¼ghpl=', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('遇見嵨繞', 'camping', 24.657875, 121.279654, '新竹縣尖石鄉玉峰村1鄰宇老9號', '新竹縣尖石鄉 — 未登記露營場', '0917085803,0930617141', 'https://www.easycamp.com.tw/Store_1996.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛高高露營區', 'camping', 24.72224876, 121.235477, '新竹縣尖石鄉嘉樂村14鄰嘉樂160號', '新竹縣尖石鄉 — 未登記露營場', '035842268', 'https://www.camptrip.com.tw/camp/%E9%A3%9B%E9%AB%98%E9%AB%98%E9%9C%B2%E7%87%9F%E5%8D%80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('紅薔薇景觀花園餐廳', 'camping', 24.714422, 121.255328, '新竹縣尖石鄉新樂村11鄰拉號部落', '新竹縣尖石鄉 — 未登記露營場', '0922625383', 'https://www.facebook.com/profile.php?id=100057187400669', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('回薌庭露營區', 'camping', 24.668442, 121.210182, '新竹縣尖石鄉錦屏村4鄰錦屏52之3號', '新竹縣尖石鄉 — 未登記露營場', '0937272072,0932291362', 'https://www.bing.com/search?q=%E5%9B%9E%E8%96%8C%E5%BA%AD%E9%9C%B2%E7%87%9F%E5%8D%80&qs=n&form=QBRE&sp=-1&pq=%E5%9B%9E%E8%96%8C%E5%BA%AD%E9%9C%B2%E7%87%9F%E5%8D%80&sc=1-6&sk=&cvid=4837E20C0C974DA2AC2F4D22D16BE798&ghsh=0&ghacc=0&ghpl=', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金鶯露營園地', 'camping', 24.735867, 121.25425, '新竹縣尖石鄉新樂村2鄰水田57之1號', '新竹縣尖石鄉 — 未登記露營場', '0928945678', 'https://www.facebook.com/jy481/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅花山莊', 'camping', 24.674008, 121.194969, '新竹縣尖石鄉梅花村6鄰148號', '新竹縣尖石鄉 — 未登記露營場', '035841843', 'https://www.easycamp.com.tw/Store_805.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('怡然自德露營區', 'camping', 24.668248, 121.173516, '新竹縣尖石鄉梅花村8鄰梅花227-1臨', '新竹縣尖石鄉 — 未登記露營場', '0905672095', 'https://m.easycamp.com.tw/Store_2499.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田埔露營區', 'camping', 24.639179, 121.263377, '新竹縣尖石鄉秀巒村1鄰田埔57號', '新竹縣尖石鄉 — 未登記露營場', '0905618850', 'https://m.icamping.app/store/tp365', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尖石之星二館', 'camping', 24.681977, 121.186917, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', '0922010170', 'https://www.facebook.com/piehching/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('如果露營區', 'camping', 24.731998, 121.216611, '新竹縣尖石鄉嘉樂村7鄰嘉樂61號', '新竹縣尖石鄉 — 未登記露營場', '0905659980', 'https://www.easycamp.com.tw/Store_2224.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬胎 227 露營區', 'camping', 24.676854, 121.158837, '新竹縣尖石鄉義興村7鄰馬胎22-7號', '新竹縣尖石鄉 — 未登記露營場', '035842789', 'https://www.easycamp.com.tw/Store_2473.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('溪遊記露營區', 'camping', 24.691129, 121.172063, '新竹縣尖石鄉義興村6鄰馬胎3-2號', '新竹縣尖石鄉 — 未登記露營場', '0963380835', 'https://www.easycamp.com.tw/Store_2517.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('八五森林露營地', 'camping', 24.717813, 121.280464, '新竹縣尖石鄉新樂村8鄰煤源36之6號', '新竹縣尖石鄉 — 未登記露營場', '0975977059,0988319301', 'https://85froestcampground.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('恩典露營區', 'camping', 24.682053, 121.16449, '新竹縣尖石鄉義興村7鄰馬胎21號', '新竹縣尖石鄉 — 未登記露營場', '0982986011', 'https://www.easycamp.com.tw/Store_798.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小夫妻露營區', 'camping', 24.680596, 121.223502, '新竹縣尖石鄉錦屏村6鄰吹上39之1號', '新竹縣尖石鄉 — 未登記露營場', '0983717617', 'https://www.camptrip.com.tw/camp/ï¼E5ï¼B0ï¼8Fï¼E5ï¼A4ï¼ABï¼E5ï¼A6ï¼BBï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('首嶺優號露營地', 'camping', 24.683937, 121.230862, '新竹縣尖石鄉錦屏村7鄰那羅13之1號臨', '新竹縣尖石鄉 — 未登記露營場', '0987147659', 'https://www.facebook.com/tzs399/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春文草堂', 'camping', 24.682155, 121.186321, '新竹縣尖石鄉義興村9鄰馬胎80之10號', '新竹縣尖石鄉 — 未登記露營場', '0920632269', 'https://www.camptrip.com.tw/camp/ï¼E6ï¼98ï¼A5ï¼E6ï¼96ï¼87ï¼E8ï¼8Dï¼89ï¼E5ï¼A0ï¼82/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山林涼露營區', 'camping', 24.700469, 121.205814, '新竹縣尖石鄉義興村2鄰馬胎51之1號', '新竹縣尖石鄉 — 未登記露營場', '0920770179', 'https://www.facebook.com/profile.php?id=100063530365940', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('北得拉曼休閒營地', 'camping', 24.7363, 121.2723, '新竹縣尖石鄉新樂村6鄰水田150之2號', '新竹縣尖石鄉 — 未登記露營場', '0989166690', 'https://m.icamping.app/store/bdlm027', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自然野趣營地', 'camping', 24.729816, 121.268044, '新竹縣尖石鄉新樂村6鄰水田150之3號', '新竹縣尖石鄉 — 未登記露營場', '0937000513', 'https://www.easycamp.com.tw/Store_1810.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自由大地露營區', 'camping', 24.678345, 121.199397, '新竹縣尖石鄉梅花村6鄰梅花138之1號旁', '新竹縣尖石鄉 — 未登記露營場', '0966518507', 'https://www.facebook.com/FreelandCamp2017/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('參陳山內灣旅店', 'camping', 24.683119, 121.166617, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', NULL, 'https://www.easycamp.com.tw/Store_2415.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('螢火蟲露營區', 'camping', 24.724392, 121.234216, '新竹縣尖石鄉嘉樂村160號之1', '新竹縣尖石鄉 — 未登記露營場', '0963094953', 'https://www.facebook.com/firefly122/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小熊森林露營區', 'camping', 24.7215, 121.2476, '新竹縣尖石鄉新樂村煤源160-9號', '新竹縣尖石鄉 — 未登記露營場', '0930753877', 'https://www.facebook.com/bearforest2017/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('童話森林露營區', 'camping', 24.7437, 121.2737, '新竹縣尖石鄉新樂村水田149號', '新竹縣尖石鄉 — 未登記露營場', '0932222037', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森林遇露營區', 'camping', 24.731955, 121.213875, '新竹縣尖石鄉嘉樂村5鄰麥樹仁270之11號', '新竹縣尖石鄉 — 未登記露營場', '0987756262,0935831899', 'https://m.icamping.app/store/sly504', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('起初露營區', 'camping', 24.65736, 121.192823, '新竹縣尖石鄉梅花村3鄰梅花242之6號', '新竹縣尖石鄉 — 未登記露營場', '0965383713,0910399411', 'https://www.genesiscreate0129.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雷沙達岜斯露營區', 'camping', 24.687756, 121.168982, '新竹縣尖石鄉義興村6鄰馬胎3-2號', '新竹縣尖石鄉 — 未登記露營場', '0903979159', 'https://www.easycamp.com.tw/Store_2457.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙境露營區', 'camping', 24.680003, 121.222511, '新竹縣尖石鄉錦屏村6鄰吹上39之2號', '新竹縣尖石鄉 — 未登記露營場', '0970678110', 'https://www.facebook.com/profile.php?id=100064673236765', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('明當家園', 'camping', 24.734098, 121.259956, '新竹縣尖石鄉新樂村7鄰水田190之1號', '新竹縣尖石鄉 — 未登記露營場', NULL, 'https://m.icamping.app/store/mdjy406', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尖石之星一館', 'camping', 24.679083, 121.173417, '新竹縣尖石鄉義興村9鄰馬胎80之10號臨', '新竹縣尖石鄉 — 未登記露營場', '0922010170', 'https://www.facebook.com/piehching/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('谷嘎的家', 'camping', 24.682473, 121.18738, '新竹縣尖石鄉義興村9鄰馬胎80之2號臨', '新竹縣尖石鄉 — 未登記露營場', '0936499258', 'https://www.facebook.com/profile.php?id=100063684530329', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麥樹仁露營區', 'camping', 24.71108, 121.20081, '新竹縣尖石鄉新樂村3鄰麥樹仁95之1號', '新竹縣尖石鄉 — 未登記露營場', '0920175505', 'https://www.facebook.com/o35842269/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('慢森活露營區', 'camping', 24.75133093, 121.2689447, '新竹縣尖石鄉新樂村4鄰水田139之5號', '新竹縣尖石鄉 — 未登記露營場', '0912675125', 'https://www.easycamp.com.tw/tvc/tvc_video/430', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原美露營區', 'camping', 24.7357, 121.255, '新竹縣尖石鄉新樂村2鄰水田57號', '新竹縣尖石鄉 — 未登記露營場', '0958325379,0926603132', 'https://m.icamping.app/store/ym482', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Payan 露營區', 'camping', 24.7193, 121.2481, '新竹縣尖石鄉新樂村11鄰煤源160之6號', '新竹縣尖石鄉 — 未登記露營場', '0987050391', 'https://m.icamping.app/store/payan098', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('田中露營區', 'camping', 24.740685, 121.257584, '新竹縣尖石鄉新樂村3鄰水田107號', '新竹縣尖石鄉 — 未登記露營場', '0921394445', 'https://tw-camping.tw/room_info.asp?id=218', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂森活露營區', 'camping', 24.73618109, 121.2641381, '新竹縣尖石鄉新樂村6鄰', '新竹縣尖石鄉 — 未登記露營場', '0925172299', 'https://www.facebook.com/happylife.camp.chiu/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('觀星賞月營地', 'camping', 24.675346, 121.169588, '新竹縣尖石鄉義興村9鄰馬胎168之5號', '新竹縣尖石鄉 — 未登記露營場', '0937136505', 'https://www.easycamp.com.tw/Store_2556.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司馬庫斯達宴露營區', 'camping', 24.581736, 121.346538, '新竹縣尖石鄉玉峰村14鄰斯馬庫斯24號', '新竹縣尖石鄉 — 未登記露營場', '0978980142', 'https://www.easycamp.com.tw/Store_2166.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('香杉露營區', 'camping', 24.66881, 121.211726, '新竹縣尖石鄉錦屏村4鄰錦屏49號', '新竹縣尖石鄉 — 未登記露營場', '0910157842', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬里光瀑布原來營地', 'camping', 24.64454, 121.333938, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', '0938676210', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森林海', 'camping', 24.699, 121.2768, '新竹縣尖石鄉新樂村10鄰煤源140之3號', '新竹縣尖石鄉 — 未登記露營場', '0972210215,0920925425', 'https://www.facebook.com/ForestSeaTaiwan/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小尖石露營區', 'camping', 24.7271, 121.2497, '新竹縣尖石鄉新樂村13鄰煤源211號', '新竹縣尖石鄉 — 未登記露營場', '0911125234', 'https://www.easycamp.com.tw/Store_1779.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('左岸臻美營地(原名)臻美露營場', 'camping', 24.714311, 121.284407, '新竹縣尖石鄉新樂村8鄰煤源36之2號', '新竹縣尖石鄉 — 未登記露營場', '0931167691,0939908209', 'https://www.easycamp.com.tw/Store_2504.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司馬庫斯舊部落營地', 'camping', 24.580103, 121.3464, '新竹縣尖石鄉玉峰村14鄰斯馬庫斯39之1號臨', '新竹縣尖石鄉 — 未登記露營場', '0928070786,0975344260', 'https://m.icamping.app/store/smks369', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老爹打樁露營區', 'camping', 24.690049, 121.263006, '新竹縣尖石鄉錦屏村10鄰那羅152之1號臨', '新竹縣尖石鄉 — 未登記露營場', '0978962837,0937084720', 'http://www.pilingdaddy.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰里埔露營區', 'camping', 24.67139657, 121.2955948, '新竹縣尖石鄉玉峰村3鄰玉峰24號', '新竹縣尖石鄉 — 未登記露營場', '0913897005', 'https://www.easycamp.com.tw/Store_2417.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美樹營地', 'camping', 24.654071, 121.305211, '新竹縣尖石鄉玉峰村6鄰宇抬20號', '新竹縣尖石鄉 — 未登記露營場', '0937141993', 'https://www.easycamp.com.tw/tvc/tvc_video/478', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新竹尖石_悠野âS露營區', 'camping', 24.70956758, 121.2680178, '新竹縣尖石鄉123號', '新竹縣尖石鄉 — 未登記露營場', '035842196', 'https://www.yoyesglpg.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('霧津山林', 'camping', 24.679358, 121.183883, '新竹縣尖石鄉義興村9鄰馬胎93-2號', '新竹縣尖石鄉 — 未登記露營場', '035842268', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('668 露營區', 'camping', 24.7501, 121.2678, '新竹縣尖石鄉新樂村水田4鄰139號', '新竹縣尖石鄉 — 未登記露營場', '035842585', 'https://www.668camping.com.tw/info.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('尤命的帳幕(原名)尤命築園露營區', 'camping', 24.715494, 121.275784, '新竹縣尖石鄉新樂村煤源8鄰41號', '新竹縣尖石鄉 — 未登記露營場', '0978823458', 'https://www.easycamp.com.tw/TV_426.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水茗漾民宿咖啡庭園(原名)北角森林', 'camping', 24.697498, 121.195679, '新竹縣尖石鄉義興村4鄰北角38號', '新竹縣尖石鄉 — 未登記露營場', '0975621992', 'https://035842199.web66.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('半山腰休閒農園', 'camping', 24.739815, 121.26169, '新竹縣尖石鄉新樂村2鄰水田104之2號', '新竹縣尖石鄉 — 未登記露營場', '0952600023', 'https://m.icamping.app/store/bsy038', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('南天筑露營區', 'camping', 24.682017, 121.182149, '新竹縣尖石鄉義興村9鄰馬胎108之5號臨', '新竹縣尖石鄉 — 未登記露營場', '0934038752', 'https://campground-199.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('景色天地露營區', 'camping', 24.67524, 121.154415, '新竹縣尖石鄉義興村7鄰馬胎21-7號', '新竹縣尖石鄉 — 未登記露營場', '0965397206', 'https://m.icamping.app/store/jstd143', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吹上露營區', 'camping', 24.683624, 121.220781, '新竹縣尖石鄉錦屏村6鄰吹上39號臨', '新竹縣尖石鄉 — 未登記露營場', '0922346926', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('浦楓露營區', 'camping', 24.642186, 121.277601, '新竹縣尖石鄉秀巒村1鄰田埔7之1號臨', '新竹縣尖石鄉 — 未登記露營場', '0911604144', 'https://www.facebook.com/a79k74/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('八五山甜柿森林', 'camping', 24.710604, 121.281448, '新竹縣尖石鄉新樂村8鄰煤源51之1號', '新竹縣尖石鄉 — 未登記露營場', '0978095080', 'https://www.camptrip.com.tw/camp/%e5%85%ab%e4%ba%94%e5%b1%b1%e7%94%9c%e6%9f%bf%e6%a3%ae%e6%9e%97/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('秘花園休閒露營區', 'camping', 24.677441, 121.247717, '新竹縣尖石鄉錦屏村12鄰那羅209號', '新竹縣尖石鄉 — 未登記露營場', '0932324689', 'https://mystery-garden.com.tw/information', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('富爸營地 (往營地叉路口)', 'camping', 24.688609, 121.189895, '新竹縣尖石鄉義興村馬胎108-2號臨', '新竹縣尖石鄉 — 未登記露營場', '0978053180', 'https://www.facebook.com/people/ï¼E5ï¼AFï¼8Cï¼E7ï¼88ï¼B8ï¼E7ï¼87ï¼9Fï¼E5ï¼9Cï¼B0/100063638000797/?locale=bs_BAï¼paipv=0ï¼eav=AfbmMfiYpAqxGt9YbHlXqdB4D3QGw58kXNBBMwbLr87LO8GRzY66hgcIX3EVFnStH_Eï¼_rdr', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清悠忘我露營區', 'camping', 24.736489, 121.269003, '新竹縣尖石鄉新樂村5鄰水田148之3號臨', '新竹縣尖石鄉 — 未登記露營場', '0925057300', 'https://m.icamping.app/store/cyw362', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('達茂林露營農場(原名)達茂林露營休閒農莊', 'camping', 24.7408, 121.2688, '新竹縣尖石鄉新樂村5鄰水田140之1號', '新竹縣尖石鄉 — 未登記露營場', '0913020853', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('米達樂也露營區', 'camping', 24.719984, 121.247768, '新竹縣尖石鄉新樂村11鄰煤源160之7號', '新竹縣尖石鄉 — 未登記露營場', '0987367067', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露頂季露營區', 'camping', 24.68036364, 121.1764769, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('哈用民宿', 'camping', 24.588222, 121.260222, '新竹縣尖石鄉秀巒村12鄰養老6之1號', '新竹縣尖石鄉 — 未登記露營場', '035847932', 'https://www.easycamp.com.tw/tvc/tvc_video/420', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('自在茗園露營區', 'camping', 24.7416037, 121.270159, '新竹縣尖石鄉新樂村6鄰水田179號', '新竹縣尖石鄉 — 未登記露營場', '0937828890', 'https://www.facebook.com/zizai1314/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('舒活露營區', 'camping', 24.739899, 121.254257, '新竹縣尖石鄉新樂村2鄰水田69-3號臨', '新竹縣尖石鄉 — 未登記露營場', '0918261847', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('歐莎露營區', 'camping', 24.695727, 121.230273, '新竹縣尖石鄉錦屏村2鄰比麟46之2號', '新竹縣尖石鄉 — 未登記露營場', '0919969682,0919972330', 'https://www.easycamp.com.tw/Store_2288.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅淮露營區', 'camping', 24.682936, 121.214432, '新竹縣尖石鄉梅花村1鄰梅花7之2號', '新竹縣尖石鄉 — 未登記露營場', '0915088983', 'https://www.facebook.com/A0970887187/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹喬露營區', 'camping', 24.699054, 121.205654, '新竹縣尖石鄉義興村2鄰尖石59之3號臨', '新竹縣尖石鄉 — 未登記露營場', '0933790145', 'https://m.icamping.app/store/thc494', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('趣山林露營區', 'camping', 24.659997, 121.193788, '新竹縣尖石鄉', '新竹縣尖石鄉 — 未登記露營場', '0939277994', 'https://www.facebook.com/profile.php?id=100065017088702', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬胎仙境露營區', 'camping', 24.682096, 121.181498, '新竹縣尖石鄉義興村馬胎108-2號臨', '新竹縣尖石鄉 — 未登記露營場', '0982111215', 'https://www.easycamp.com.tw/Store_835.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清心忘憂露營區', 'camping', 24.677192, 121.172289, '新竹縣尖石鄉義興村9鄰馬胎107之2號臨', '新竹縣尖石鄉 — 未登記露營場', '0932090382', 'https://m.icamping.app/store/cswy378', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水田谷露營區', 'camping', 24.743277, 121.261566, '新竹縣尖石鄉新樂村4鄰水田123-1號臨', '新竹縣尖石鄉 — 未登記露營場', '0963552896', 'http://www.stvalley.com.tw/info.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('豪祥露營區', 'camping', 24.674333, 121.227048, '新竹縣尖石鄉錦屏村7鄰那羅25之2號', '新竹縣尖石鄉 — 未登記露營場', '0906989480', 'https://m.icamping.app/store/hs240', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Hi 燥樹排露營地', 'camping', 24.672476, 121.087387, '新竹縣竹東鎮瑞峰里5鄰燥樹排段31之12號臨', '新竹縣竹東鎮 — 未登記露營場', '035949799', 'https://hi-campground.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('露營盒子', 'camping', 24.702154, 120.996902, '新竹縣峨眉鄉石井村1鄰1之9號', '新竹縣峨眉鄉 — 未登記露營場', '0921059291,0981900123', 'https://www.easycamp.com.tw/Store_2543.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('勝豐休閒農莊', 'camping', 24.677029, 120.979408, '新竹縣峨眉鄉湖光村西河排14鄰7-1號', '新竹縣峨眉鄉 — 未登記露營場', '0937222421,0905579363', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('靜月居', 'camping', 24.671549, 120.99427, '新竹縣峨眉鄉湖光村12鄰十二寮6之5號', '新竹縣峨眉鄉 — 未登記露營場', '035785364', 'https://www.camptrip.com.tw/camp/%e9%9d%9c%e6%9c%88%e5%b1%85/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吾家農場', 'camping', 24.67625, 120.982071, '新竹縣峨眉鄉湖光村環湖路14鄰8之8號', '新竹縣峨眉鄉 — 未登記露營場', '0963980138,0910042978', 'http://www.wufarms.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('湖光山戀露營區', 'camping', 24.68117266, 120.978, '新竹縣峨眉鄉湖光村15鄰西河排18號', '新竹縣峨眉鄉 — 未登記露營場', '0937683753', 'https://hgsl.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂窩露營區', 'camping', 24.673203, 120.99144, '新竹縣峨眉鄉湖光村十二寮8之10號', '新竹縣峨眉鄉 — 未登記露營場', '0900554258', 'https://www.camptrip.com.tw/camp/%e6%a8%82%e7%aa%a9%e9%9c%b2%e7%87%9f%e5%8d%80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('挪亞星舟露營農莊', 'camping', 24.854572, 121.133924, '新竹縣新埔鎮鹿鳴里4鄰黃梨園28之15號', '新竹縣新埔鎮 — 未登記露營場', '0928669286', 'https://campground-1449.business.site/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('明園星空茶園', 'camping', 24.855984, 121.135827, '新竹縣新埔鎮鹿鳴里4鄰黃梨園52之20號', '新竹縣新埔鎮 — 未登記露營場', '0910822784', 'https://www.easycamp.com.tw/Store_2440.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野漾會館露營區(原名)野漾莊園', 'camping', 24.728056, 121.189072, '新竹縣橫山鄉福興村5鄰馬福89號', '新竹縣橫山鄉 — 未登記露營場', '0958222217', 'https://yeyangg.ezhotel.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吉娜的家', 'camping', 24.709528, 121.158928, '新竹縣橫山鄉豐田村2鄰油羅48之22號臨', '新竹縣橫山鄉 — 未登記露營場', '0932502265,0922803800', 'https://m.icamping.app/store/jndj454', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠雲海露營區', 'camping', 24.681688, 121.123787, '新竹縣橫山鄉南昌村2鄰尖筆窩8之18號', '新竹縣橫山鄉 — 未登記露營場', '0989575885', 'https://www.camptrip.com.tw/camp/ï¼e7ï¼b6ï¼a0ï¼e9ï¼9bï¼b2ï¼e6ï¼b5ï¼b7ï¼e9ï¼9cï¼b2ï¼e7ï¼87ï¼9fï¼e5ï¼8dï¼80/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('北窩‧星空', 'camping', 24.696938, 121.120247, '新竹縣竹東鎮五豐村23巷39弄8號', '新竹縣橫山鄉 — 未登記露營場', '0929211960,0939311960', 'https://www.camptrip.com.tw/camp/%e5%8c%97%e7%aa%a9-%e6%98%9f%e7%a9%ba/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('楓林露營區', 'camping', 24.700371, 121.183174, '新竹縣橫山鄉內灣村15鄰內灣35號', '新竹縣橫山鄉 — 未登記露營場', '0906600025', 'https://www.facebook.com/profile.php?id=100057052586894', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福興小農庄', 'camping', 24.728857, 121.165093, '新竹縣橫山鄉福興村11鄰八十分104號', '新竹縣橫山鄉 — 未登記露營場', '0905718837', 'https://www.easycamp.com.tw/Store_2560.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水田內灣營地', 'camping', 24.706865, 121.157509, '新竹縣橫山鄉豐田村2鄰油羅49號', '新竹縣橫山鄉 — 未登記露營場', '035363526', 'http://www.stcamping.com/?id=596456', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('隱森居露營場', 'camping', 24.728822, 121.157326, '新竹縣橫山鄉', '新竹縣橫山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('內灣松林茶花露營區', 'camping', 24.715117, 121.166389, '新竹縣橫山鄉力行村中山街一段188之3號臨', '新竹縣橫山鄉 — 未登記露營場', '0972925156', 'https://m.icamping.app/store/slch546', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('威尼斯內灣溫泉會館', 'camping', 24.70034, 121.184227, '新竹縣橫山鄉內灣村15鄰內灣33號', '新竹縣橫山鄉 — 未登記露營場', '035849966', 'https://www.hotspring-camp.com.tw/paper/other_select_index.php?id=46&title_id=695&group_id=17', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星月橫山', 'camping', 24.700611, 121.1259, '新竹縣橫山鄉橫山村18鄰頭分林1之8號', '新竹縣橫山鄉 — 未登記露營場', '035933867', 'http://www.starmoonhs.com/p2.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('遊橘露營區', 'camping', 24.726191, 121.162969, '新竹縣橫山鄉福興村八十分鄰112之6號臨', '新竹縣橫山鄉 — 未登記露營場', '0935067325', 'https://www.easycamp.com.tw/Store_2225.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拾階莊園', 'camping', 24.701186, 121.18119, '新竹縣橫山鄉', '新竹縣橫山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('油羅圓石露營區', 'camping', 24.708672, 121.163734, '新竹縣橫山鄉豐田村1鄰油羅28號', '新竹縣橫山鄉 — 未登記露營場', '0988321296', 'https://www.facebook.com/OriginalStoneCamping/?locale=zh_TW(FB)', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小蜜蜂休閒咖啡屋', 'camping', 24.751542, 121.250374, '新竹縣關西鎮錦山里20鄰233-1號', '新竹縣關西鎮 — 未登記露營場', '0938718799', 'https://m.icamping.app/store/hmf293', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('羅馬之戀', 'camping', 24.78355, 121.224943, '新竹縣關西鎮金山里8鄰馬武督68號', '新竹縣關西鎮 — 未登記露營場', '0975969020', 'https://www.roman-love.idv.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('435挑水少年家', 'camping', 24.766174, 121.240913, '新竹縣關西鎮錦山里16鄰錦山182號', '新竹縣關西鎮 — 未登記露營場', '0911215436', 'https://m.icamping.app/store/tssnj174', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('La vie 露營(原名)錦仙營地', 'camping', 24.776445, 121.262169, '新竹縣關西鎮錦山里11鄰錦山123之5號', '新竹縣關西鎮 — 未登記露營場', NULL, 'https://www.twincn.com/item.aspx?no=82016297', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('萌萌噠露營窩', 'camping', 24.775585, 121.24061, '新竹縣關西鎮錦山里8鄰錦山82號', '新竹縣關西鎮 — 未登記露營場', '0989043586', 'https://www.facebook.com/wama1863/?locale=zh_TW(FB)', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('斯摩亞露營地', 'camping', 24.779873, 121.250748, '新竹縣關西鎮錦山里9鄰錦山102之2臨', '新竹縣關西鎮 — 未登記露營場', '035478608', 'https://m.icamping.app/store/smy526', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('飛鳳園農場', 'camping', 24.775543, 121.123611, '新竹縣關西鎮新力里7鄰下橫坑80號', '新竹縣關西鎮 — 未登記露營場', '035868170', 'https://www.easycamp.com.tw/viewpoint/viewpoint_info/C1_376440000A_000401', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大象露營地', 'camping', 24.814697, 121.180901, '新竹縣關西鎮仁安里10鄰拱子溝26號', '新竹縣關西鎮 — 未登記露營場', '0985018795', 'https://www.camptrip.com.tw/camp/%E5%A4%A7%E8%B1%A1%E9%9C%B2%E7%87%9F%E5%9C%B0/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('生活原鄉民宿露營區', 'camping', 24.778761, 121.248494, '新竹縣關西鎮錦山里9鄰錦山96之3號', '新竹縣關西鎮 — 未登記露營場', '0916176339', 'https://www.easycamp.com.tw/store/store_index/2003', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('萊馥健康休閒渡假村', 'camping', 24.762976, 121.206399, '新竹縣關西鎮玉山里2鄰12號', '新竹縣關西鎮 — 未登記露營場', '035476188', 'https://www.livelife.com.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('月出山澗', 'camping', 24.81196882, 121.182, '新竹縣關西鎮仁安里9鄰拱子溝22號', '新竹縣關西鎮 — 未登記露營場', '0937805742', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星野露營窩(原名)星墅露營窩', 'camping', 24.77792, 121.251293, '新竹縣關西鎮錦山里9鄰錦山99之9號', '新竹縣關西鎮 — 未登記露營場', '0905225385', 'https://m.icamping.app/store/xs151', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹田營地', 'camping', 24.808151, 121.184471, '新竹縣關西鎮仁安里8鄰拱子溝9號', '新竹縣關西鎮 — 未登記露營場', '0905368340', 'https://www.tw-camping.tw/hotel_info.asp?hid=57', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬武督露營趣', 'camping', 24.772234, 121.244691, '新竹縣關西鎮錦山里2鄰錦山16號之9', '新竹縣關西鎮 — 未登記露營場', '0989081219', 'https://m.icamping.app/store/mwd130', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青境花墅(原名)營墅風晴露營區', 'camping', 24.778279, 121.247992, '新竹縣關西鎮錦山里9鄰錦山96號', '新竹縣關西鎮 — 未登記露營場', '0981588205', 'https://m.icamping.app/store/ysfc433', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樸真園六曲窩露營區', 'camping', 24.75843, 121.241353, '新竹縣關西鎮錦山里18鄰錦山204號之9', '新竹縣關西鎮 — 未登記露營場', '0988788872', 'http://www.nature-chill.com.tw/271923049522290.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲水山露營區', 'camping', 23.25427789, 120.5743624, '嘉義縣大埔鄉', '嘉義縣大埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('青山綠水露營區', 'camping', 23.37258124, 120.5018513, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('八寶寮露營場', 'camping', 23.35409394, 120.5193944, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白石馬露營區', 'camping', 23.40879071, 120.5776771, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('桃舍露營區', 'camping', 23.42062079, 120.5760165, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('詩情花園度假村', 'camping', 23.44788828, 120.5403714, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石臥牛露營區', 'camping', 23.41111709, 120.580906, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('築夢森居露營場', 'camping', 23.383668, 120.52275, '嘉義縣中埔鄉', '嘉義縣中埔鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吉恩典山丘', 'camping', 23.42351456, 120.4768373, '嘉義縣水上鄉三界埔三界村214號', '嘉義縣水上鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('納米運動休閒園區', 'camping', 23.55982892, 120.4651551, '嘉義縣民雄鄉豐收村196-5號', '嘉義縣民雄鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('塘湖古道農場', 'camping', 23.52604435, 120.6098329, '嘉義縣竹崎鄉仁壽村福建坪5號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('光華露營區', 'camping', 23.47980551, 120.6760909, '嘉義縣竹崎鄉光華村24號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙坪露螢區', 'camping', 23.49447561, 120.6849674, '嘉義縣竹崎鄉光華村1鄰2-2號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天一露營區', 'camping', 23.48751726, 120.6548256, '嘉義縣竹崎鄉光華村11鄰茄苳仔29號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('竹崎車棧渡假村', 'camping', 23.52812674, 120.550661, '嘉義縣竹崎鄉', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('仙腳趾景觀露營區', 'camping', 23.49285386, 120.5940162, '嘉義縣竹崎鄉白杞村樟樹坪41-1號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('頂笨仔露營區(綠野仙蹤)', 'camping', 23.48003483, 120.6741143, '嘉義縣竹崎鄉光華村頂笨仔22號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('冠銘露營區', 'camping', 23.49101243, 120.684396, '嘉義縣竹崎鄉', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('景山露營區', 'camping', 23.47973298, 120.672417, '嘉義縣竹崎鄉光華村2鄰頂笨仔23號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白樹腳驛站露營場', 'camping', 23.526505, 120.5601237, '嘉義縣竹崎鄉復金村白樹腳22號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('九叔公露營區', 'camping', 23.47994973, 120.6724575, '嘉義縣竹崎鄉', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲景咖啡露營區', 'camping', 23.4587905, 120.684717, '嘉義縣竹崎鄉中和村永和5-9號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('頂笨仔民宿露營區', 'camping', 23.48324595, 120.6806567, '嘉義縣竹崎鄉光華村1鄰9號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山中曉露', 'camping', 23.49215309, 120.6844519, '嘉義縣竹崎鄉光華村1鄰3號', '嘉義縣竹崎鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿里山有機小農露營區', 'camping', 23.47144233, 120.7037669, '嘉義縣阿里山鄉樂野村22號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晨光露營區', 'camping', 23.46413, 120.705268, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿將的家獵人帳', 'camping', 23.4614384, 120.6980719, '嘉義縣阿里山鄉樂野村4鄰129-6號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('高美休閒營區', 'camping', 23.47127785, 120.7057203, '嘉義縣阿里山鄉樂野村1鄰16-3號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('迷糊露營區', 'camping', 23.47282441, 120.7134292, '嘉義縣阿里山鄉69號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亞亞竹農莊', 'camping', 23.39698828, 120.7183687, '嘉義縣阿里山鄉里佳村2鄰37號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老鼠溪咖啡莊園營區(B、C區)', 'camping', 23.45266085, 120.7353311, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('來灣哈露營區', 'camping', 23.46273599, 120.7007174, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小森林農園露營區', 'camping', 23.46770857, 120.708795, '嘉義縣阿里山鄉樂野村2鄰70-6號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('汪爸露營區', 'camping', 23.4612968, 120.6985646, '嘉義縣阿里山鄉樂野村', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有夠遠露營區', 'camping', 23.40216733, 120.7213166, '嘉義縣阿里山鄉里佳村', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瓜地亞那露營區', 'camping', 23.4581865, 120.751104, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('杉緣星空露營區', 'camping', 23.45622004, 120.7186794, '嘉義縣阿里山鄉樂野村8鄰', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山樂園露營區（一起鄒咖啡店）', 'camping', 23.47269396, 120.7048974, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('老鼠溪咖啡莊園營區(A區)', 'camping', 23.44861646, 120.7289273, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('七彩琉璃生態農園', 'camping', 23.43240958, 120.7450132, '嘉義縣阿里山鄉達邦村7鄰達德安175-3號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('伊利雅娜露營區', 'camping', 23.45732409, 120.762245, '嘉義縣阿里山鄉達邦村特富野280號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('禾田露營場', 'camping', 23.46056684, 120.7100695, '嘉義縣阿里山鄉樂野村', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('受不寮露營區', 'camping', 23.44823129, 120.756383, '嘉義縣阿里山鄉達邦村', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福山星月露營區', 'camping', 23.45361159, 120.7175518, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('羅老爸的家', 'camping', 23.46017987, 120.6976257, '嘉義縣阿里山鄉', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('倉伯露營區', 'camping', 23.46118948, 120.6982517, '嘉義縣阿里山鄉樂野村4鄰129-11號', '嘉義縣阿里山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑞里幼葉林露營區', 'camping', 23.53820911, 120.6669684, '嘉義縣梅山鄉瑞里村', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('油車寮露營區', 'camping', 23.5342581, 120.7063458, '嘉義縣梅山鄉太和村油車寮7-18號', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大巃頂觀光茶園', 'camping', 23.55332977, 120.6075179, '嘉義縣梅山鄉太平村頂橋2-6號', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('太平山露營區', 'camping', 23.56300854, 120.6029351, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日麗風合露營區', 'camping', 23.55837844, 120.6629572, '嘉義縣梅山鄉瑞峰村生毛樹25-3號', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瑞里雲淡風輕露營區', 'camping', 23.52982938, 120.6664992, '嘉義縣梅山鄉瑞里村科子林15-1號', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('初果森造露營園區', 'camping', 23.55552552, 120.6392083, '嘉義縣梅山鄉太興村', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('格瑞菈森林露營區', 'camping', 23.53861307, 120.6651618, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('良亭花岩露營區', 'camping', 23.51987091, 120.7056183, '嘉義縣梅山鄉太和村樟樹湖11-6號', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('振峯碧湖山新營區', 'camping', 23.56831466, 120.6139082, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅山古梅秘境露營區', 'camping', 23.55353738, 120.5899581, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('慢漫山林露營區', 'camping', 23.5634285, 120.648928, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('琢英露營場', 'camping', 23.54824525, 120.6279302, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('悅日松林', 'camping', 23.53695772, 120.6292954, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('太和觀光果園露營區', 'camping', 23.52545946, 120.7115868, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小瓶秘境休閒農場', 'camping', 23.56187913, 120.7308518, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('許家茶園民宿露營區', 'camping', 23.54382716, 120.6725447, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('振峯製茶所', 'camping', 23.56095926, 120.6068594, '嘉義縣梅山鄉太平村48-16號', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('太山農場露營區', 'camping', 23.53444983, 120.7075227, '嘉義縣梅山鄉', '嘉義縣梅山鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍頂山露營區', 'camping', 23.44942759, 120.6618081, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('淺山尋露', 'camping', 23.41619356, 120.6445696, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好柿抵嘉', 'camping', 23.45122407, 120.5988989, '嘉義縣番路鄉埔尾52-3號', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('半天岩10號露營區', 'camping', 23.4633568, 120.5961487, '嘉義縣番路鄉民和村半天岩10號', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('草地狀元露營區', 'camping', 23.47951839, 120.6264383, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三寶山露營區', 'camping', 23.46183068, 120.6053504, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花田小露露營區', 'camping', 23.44491014, 120.6068549, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('花舞山嵐農莊(星知心露營區)', 'camping', 23.44306259, 120.6484272, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('龍銀山露營區', 'camping', 23.44666225, 120.6724408, '嘉義縣番路鄉公田村巃頭17-19號', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水綠光露營知嘉', 'camping', 23.4546628, 120.6151904, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('岩仔腳休閒露營區(老鷹區)', 'camping', 23.46031914, 120.5864602, '嘉義縣番路鄉民和村3鄰岩仔腳16-6號', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('淳風皓月露營區', 'camping', 23.42701223, 120.6422806, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星月傳說露營區', 'camping', 23.42215564, 120.6519095, '嘉義縣番路鄉公田村隙頂75-20附8號', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('梅王露營場', 'camping', 23.46008706, 120.5894646, '嘉義縣番路鄉民和村大華公路六段', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('岩仔腳休閒露營區(兔子區)', 'camping', 23.46007303, 120.586572, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('阿里山草堂露營渡假村', 'camping', 23.48161889, 120.6270643, '嘉義縣番路鄉', '嘉義縣番路鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一星伴露營區', 'camping', 23.98932488, 120.6294875, '彰南路二段150號', '彰化縣芬園鄉 — 未登記露營場', '0968874899', 'https://www.hbo-star.com/blank-10', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐卉親子農場', 'camping', 23.94960453, 120.5123064, '崙子腳路5-22號', '彰化縣溪湖鎮 — 未登記露營場', '0928193047', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小熊寶貝麥鄉農村', 'camping', 24.217719, 120.630888, '臺中市大雅區上山路175巷15號', '臺中市大雅區 — 未登記露營場', '0932671523', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蟬說：山中靜靜', 'camping', 24.12447757, 120.8150634, '太平區東汴里山田路218號', '臺中市太平區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('有山林休閒農場', 'camping', 24.124431, 120.814902, '臺中市太平區山田路大湖巷43號', '臺中市太平區 — 未登記露營場', '0908668913', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三山來此咖啡莊園', 'camping', 24.206551, 120.78867, '東山路二段183之33號', '臺中市北屯區 — 未登記露營場', '0939599255', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('摩天輪營地', 'camping', 24.327813, 120.700299, '永豐段257-3號', '臺中市外埔區 — 未登記露營場', '0972925606', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('洪爺爺菜園丫', 'camping', 24.324052, 120.688462, '外埔區水頭二路18號', '臺中市外埔區 — 未登記露營場', '0918895928', 'https://www.facebook.com/grandpapahung/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('發現星村景觀休閒園區(星月大地)', 'camping', 24.333266, 120.70343, '眉北路486號', '臺中市外埔區 — 未登記露營場', '0925512190', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沙連墩', 'camping', 24.26798, 120.787092, '石岡區九房里萬仙街岡仙巷7-1號', '臺中市石岡區 — 未登記露營場', '0932629609', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹星光露營區', 'camping', 24.270069, 120.783274, '石岡區豐勢路山下巷11-8號', '臺中市石岡區 — 未登記露營場', '0918373400', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('九甲林露營區', 'camping', 24.26590061, 120.7859909, '石岡區龍興里萬仙街岡仙巷7-1號', '臺中市石岡區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('泰安驛站露營區', 'camping', 24.323771, 120.752949, '后里區泰安村圳頭產業道路', '臺中市后里區 — 未登記露營場', '0937282625', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('橘祥合院', 'camping', 24.313916, 120.749988, '后里區仁里里圳寮路35號', '臺中市后里區 — 未登記露營場', '0425560878', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('神農谷', 'camping', 24.171513, 120.972935, '和平區東關路一段松鶴三巷100-5號', '臺中市和平區 — 未登記露營場', '0952152040', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('邦古河那彎露營區(邦古有機雞農場)', 'camping', 24.168365, 120.962719, '和平區東關路一段松鶴三巷199-11號', '臺中市和平區 — 未登記露營場', '0938187218', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('谷關365露營區', 'camping', 24.21016, 120.966655, '和平區東關路一段20之5號', '臺中市和平區 — 未登記露營場', '0926717069', 'https://m.icamping.app/store/gk444', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山上小日子', 'camping', 24.165408, 120.950298, '東關路一段裡冷巷1-8號', '臺中市和平區 — 未登記露營場', '0975918017', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('覓靜莊園露營區', 'camping', 24.148608, 120.970705, '和平區東關路一段裡冷巷99號', '臺中市和平區 — 未登記露營場', '0932534105', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('照哥的家', 'camping', 24.148921, 120.973665, '博愛區博愛里松鶴2巷56號', '臺中市和平區 — 未登記露營場', '0919677814', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('芭蓊露營區', 'camping', 24.335478, 120.935334, '東崎路一段桃山巷73-3號', '臺中市和平區 — 未登記露營場', '0988199271', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('呆呆的家', 'camping', 24.169101, 120.95857, '東關路一段677號', '臺中市和平區 — 未登記露營場', '0978609093', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吉娃斯咖啡莊園歡喜營地', 'camping', 24.339854, 120.937357, '和平區達觀里東崎路一段桃山巷51-1號', '臺中市和平區 — 未登記露營場', '0989292375', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('晨融雅谷', 'camping', 24.173949, 120.97571, '和平區東關路一段松鶴三巷60-16號及81號', '臺中市和平區 — 未登記露營場', '0972229462', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂悠悠露營區', 'camping', 24.149467, 120.964302, '和平區東關路一段裡冷巷73號 (裡冷溪林道)', '臺中市和平區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松風谷露營區', 'camping', 24.199792, 121.013997, '和平區東關路一段台電巷122-20號', '臺中市和平區 — 未登記露營場', '0927260099', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('牛坪之春露營區', 'camping', 24.128651, 120.904982, '南勢里東關路三段和興巷58-1號', '臺中市和平區 — 未登記露營場', '0920414236', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('石壁露營區', 'camping', 24.167217, 120.94529, '和平區東關路一段428號', '臺中市和平區 — 未登記露營場', '0923873140', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('裡冷溪探索園區', 'camping', 24.156998, 120.957824, '和平區博愛里裡冷巷69號', '臺中市和平區 — 未登記露營場', '0939941142', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山暉甜園', 'camping', 24.257813, 120.800377, '中坑路北坑巷15號', '臺中市和平區 — 未登記露營場', '0975262017', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雙香露營區 (自由國小)', 'camping', 24.29201, 120.912361, '和平區自由里東崎路二段19-25號', '臺中市和平區 — 未登記露營場', '0989613657', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星星點燈露營區', 'camping', 24.160428, 120.956722, '臺中市和平區博愛里東關路一段裡冷巷三號', '臺中市和平區 — 未登記露營場', '0907245686', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('瓦浪休閒農園', 'camping', 24.19913406, 121.0191964, '和平區東關路一段台電巷124-5號', '臺中市和平區 — 未登記露營場', '0955247742', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('菘畫居露營會館', 'camping', 24.165302, 120.951341, '和平區東關路一段裡冷巷15-7號', '臺中市和平區 — 未登記露營場', '0978872825', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('久良栖露營區', 'camping', 24.178936, 120.977273, '和平區東關路一段365-5號', '臺中市和平區 — 未登記露營場', '0935781267', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('中途島露營區', 'camping', 24.166456, 120.945156, '東關路一段裡冷巷433號', '臺中市和平區 — 未登記露營場', '0955907453', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('歐賓露營區', 'camping', 24.198662, 121.018664, '和平區東關路一段台電巷124-4號', '臺中市和平區 — 未登記露營場', '0906099619', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松旺露營區', 'camping', 24.129545, 120.90299, '和平區東關路三段和興巷52-2號', '臺中市和平區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('馬告的傳奇', 'camping', 24.16583, 120.953056, '和平區博愛里東關路一段裡冷巷5-8號', '臺中市和平區 — 未登記露營場', '0980718122', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('德芙蘭農場', 'camping', 24.175593, 120.969166, '和平區東關路一段359號', '臺中市和平區 — 未登記露營場', '0955497989', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森杉露營區', 'camping', 24.323811, 120.963935, '和平區和平區達觀里東崎路一段桃山巷99號', '臺中市和平區 — 未登記露營場', '0925202492', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('岑園露營區', 'camping', 24.199431, 121.018713, '和平區東關路一段台電巷124-6號', '臺中市和平區 — 未登記露營場', '0953333935', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('何必館', 'camping', 24.176939, 120.979847, '和平區東關路一段裡冷巷1-7號', '臺中市和平區 — 未登記露營場', '0966777257', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('摩天嶺楊園露營區', 'camping', 24.314662, 120.938562, '和平區達觀里東崎路一段天嶺巷30-3號', '臺中市和平區 — 未登記露營場', '0910527921', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('千本松原露營區', 'camping', 24.199953, 121.016756, '博愛里台電巷122-1號', '臺中市和平區 — 未登記露營場', '0978981727', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('神駒谷養身場', 'camping', 24.204686, 121.012385, '和平區東關路一段溫泉巷12-1號', '臺中市和平區 — 未登記露營場', '0425951345', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('八起露營區', 'camping', 24.20716, 121.013823, '和平區博愛里東關路一段堰堤巷6-1號', '臺中市和平區 — 未登記露營場', '0963297180', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('春露茶園營區 (八仙山春露茶園)', 'camping', 24.148835, 120.963518, '和平區東關路一段裡冷巷70號', '臺中市和平區 — 未登記露營場', '0937230859', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('挹翠谷露營區', 'camping', 24.218171, 120.903878, '和平區富山巷9-1號', '臺中市和平區 — 未登記露營場', '0911314793', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('ㄡ熊熊露營園地', 'camping', 24.17292, 120.97336, '和平區東關路一段松鶴三巷103號', '臺中市和平區 — 未登記露營場', '0982212064', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('家霖農場Garin Farm-谷關露營區', 'camping', 24.199275, 121.016302, '東關路一段台電巷122-2號', '臺中市和平區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('十七哩園藝露營區 （谷關驛棧）', 'camping', 24.16897397, 120.9607078, '和平區博愛里東關路一段400-1號', '臺中市和平區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('司卡尤納露營區', 'camping', 24.327756, 120.926215, '和平區東崎路一段達觀里育英巷25號', '臺中市和平區 — 未登記露營場', '0915108380', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('熊爸營地', 'camping', 24.165337, 120.954284, '和平區東關路一段裡冷巷25號', '臺中市和平區 — 未登記露營場', '0972330422', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雪山坑咖啡露營區', 'camping', 24.336458, 120.934742, '和平區達觀里東崎路一段桃山巷73-2號', '臺中市和平區 — 未登記露營場', '0911901552', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松鶴唐麻丹', 'camping', 24.166791, 120.966708, '和平區東關路一段松鶴三巷101號', '臺中市和平區 — 未登記露營場', '0934312355', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('柏拿崗露營區', 'camping', 24.179698, 120.984508, '東關路一段松鶴一巷20之3號', '臺中市和平區 — 未登記露營場', '0958007335', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山上松亭露營區', 'camping', 24.176691, 120.97486, '和平區東關路一段', '臺中市和平區 — 未登記露營場', '0938781267', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('松嶺露營區', 'camping', 24.13015, 120.905535, '和平區東關路三段和興巷58-3號', '臺中市和平區 — 未登記露營場', '0909556869', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大雪山觀山嶺露營區', 'camping', 24.218154, 120.877394, '東勢區東坑路978-7號', '臺中市東勢區 — 未登記露營場', '0911117885', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雪山麓露', 'camping', 24.326895, 120.853038, '后里區中山路160巷17號', '臺中市東勢區 — 未登記露營場', '0912613519', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('六合繹休閒露營區', 'camping', 24.211849, 120.870379, '東坑路石麻巷46之一號', '臺中市東勢區 — 未登記露營場', '0934143788', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('出雲山雲騰露營區', 'camping', 24.226783, 120.898579, '文新街1號14F-2', '臺中市東勢區 — 未登記露營場', '0926228789', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('森林小鹿', 'camping', 24.232878, 120.878922, '東坑路967號', '臺中市東勢區 — 未登記露營場', '0919022659', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂境6.2K營地', 'camping', 24.232988, 120.876829, '東坑路964之1號', '臺中市東勢區 — 未登記露營場', '0936962189', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('酒保坪休閒農場', 'camping', 24.212753, 120.895086, '臺中市石岡區九房里豐勢路山下巷13-9號', '臺中市東勢區 — 未登記露營場', '0939103009', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('日日木木', 'camping', 24.226623, 120.761076, '東勢區石城街石山巷19號', '臺中市東勢區 — 未登記露營場', '0930378951', 'https://www.facebook.com/daydaywoooood/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('夢鄉農場露營區', 'camping', 24.301171, 120.809186, '東勢區茂興里13鄰東蘭路213號', '臺中市東勢區 — 未登記露營場', '0932673037', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('彩虹奇菁', 'camping', 24.1986, 120.8636, '東勢區慶福里慶福街26-2號', '臺中市東勢區 — 未登記露營場', '0917885960', 'https://www.facebook.com/jesse0917885960/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('丘之町營地', 'camping', 24.184193, 120.864033, '慶福街73號', '臺中市東勢區 — 未登記露營場', '0922378473', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('雲頂之丘', 'camping', 24.2234, 120.872689, '東坑路762巷36號', '臺中市東勢區 — 未登記露營場', '0972255552', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('爸娜娜露營區', 'camping', 24.259646, 120.875723, '東勢區中嵙里東崎路三段122-5號', '臺中市東勢區 — 未登記露營場', '0917684909', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('六桂園休閒農場', 'camping', 24.297086, 120.798681, '東勢區東蘭路203-8號', '臺中市東勢區 — 未登記露營場', '0975504518', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('喜樂之地', 'camping', 24.219488, 120.877045, '東勢區東坑路978-6號', '臺中市東勢區 — 未登記露營場', '0922995857', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大雪星空 Starry Night', 'camping', 24.253364, 120.869357, '東坑路795巷18號', '臺中市東勢區 — 未登記露營場', '0937731320', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('億享天開歡樂農場', 'camping', 24.241183, 120.867895, '東勢里上新里勢林街63-6號', '臺中市東勢區 — 未登記露營場', '0932622829', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天山秘境森林露營區', 'camping', 24.220642, 120.786059, '新社區中和街一段山腳巷20-9號', '臺中市新社區 — 未登記露營場', '0966029129', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吾居無束', 'camping', 24.245459, 120.798085, '新社區崑山里食水嵙28-6號', '臺中市新社區 — 未登記露營場', '0966555686', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('星空yay語露營區', 'camping', 24.10550132, 120.8912638, '新社區永豐45-1號', '臺中市新社區 — 未登記露營場', '0933519323', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('嵐山驛站', 'camping', 24.167249, 120.826662, '新社區中興街217-6號', '臺中市新社區 — 未登記露營場', '0910680708', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('綠大地露營咖啡農場', 'camping', 24.179498, 120.825255, '新社區慶西里上坪4-6號', '臺中市新社區 — 未登記露營場', '0910491136', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('櫻花鳥森林露營區', 'camping', 24.185742, 120.817151, '新社區協成里協中街6號', '臺中市新社區 — 未登記露營場', '0925959566', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('天冷吹雲山莊', 'camping', 24.327816, 120.700286, '新社區福興里美林72-2號', '臺中市新社區 — 未登記露營場', '0928311875', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('旺來山莊露營區', 'camping', 24.097023, 120.880557, '新社區永豐63-1號', '臺中市新社區 — 未登記露營場', '0939580868', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小松露露營區', 'camping', 24.211831, 120.785243, '中興嶺一街363之39號', '臺中市新社區 — 未登記露營場', '0919839877', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水聲露營區', 'camping', 24.257803, 120.800362, '臺中市新社區中正街26-3號', '臺中市新社區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('四分之三露營區', 'camping', 24.228917, 120.78828, '新社區崑山里崑南街29巷5號', '臺中市新社區 — 未登記露營場', '0955557711', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Tatami忘憂草原聖愛營地', 'camping', 24.177071, 120.826148, '慶西里湖興16-3號', '臺中市新社區 — 未登記露營場', '0975208467', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('清悠露營區', 'camping', 24.150622, 120.842842, '新社區中和里中興街57號', '臺中市新社區 — 未登記露營場', '0921778666', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('芊芊小棧露營區', 'camping', 24.143204, 120.873638, '福興村民裕路31-3號', '臺中市新社區 — 未登記露營場', '0922709658', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('富柿山星空景觀農場露營區', 'camping', 24.130988, 120.859453, '福興里永櫃18號', '臺中市新社區 — 未登記露營場', '0912062178', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('李白梵谷露露山丘', 'camping', 24.143604, 120.848514, '新社區中和里中興街55-1號', '臺中市新社區 — 未登記露營場', '0910502818', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('水雲居露營', 'camping', 24.157197, 120.870616, '福興里美林91之1號', '臺中市新社區 — 未登記露營場', '0927997845', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('舞魚休閒農場', 'camping', 24.171689, 120.829777, '臺中市西屯區文華路36號5樓之3', '臺中市新社區 — 未登記露營場', '0923923923', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('Momo 佳園民宿露營區', 'camping', 24.194524, 120.805456, '新社區協成里協中街189-2號', '臺中市新社區 — 未登記露營場', '0932629609', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('白毛台山居歲月', 'camping', 24.186288, 120.818179, '新社區福奧里福民11號', '臺中市新社區 — 未登記露營場', '0936285235', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂在(原：趣露營)', 'camping', 24.194393, 120.801885, '新社區協中街211巷27號', '臺中市新社區 — 未登記露營場', '0988165659', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('野 Fun 趣露營區', 'camping', 24.071578, 120.724644, '霧峰區民生路426巷8弄39號', '臺中市霧峰區 — 未登記露營場', '0908958199', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('那個屋露營區', 'camping', 24.05365099, 120.7533909, '霧峰區桐林里中坑巷92號', '臺中市霧峰區 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('一棵樹露營區', 'camping', 24.07387, 120.723656, '民生路426巷77號', '臺中市霧峰區 — 未登記露營場', '0939567135', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('新雨休閒農場', 'camping', 24.054568, 120.757635, '臺中市太平區富宜路191號', '臺中市霧峰區 — 未登記露營場', '0910567890', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('無憂海景秘境', 'camping', 22.613762, 120.996496, '南興村12鄰南安2號', '臺東縣大武鄉 — 未登記露營場', '0910172777', 'https://www.facebook.com/StarMSfarm/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('菲卡樂園區', 'camping', 22.660249, 121.000692, '金崙村14鄰溫泉路1之10號', '臺東縣太麻里鄉 — 未登記露營場', '0963291950', 'https://www.facebook.com/vikar99/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('陽明休閒農場', 'camping', 22.646573, 120.9597, '台東縣太麻里鄉大王村佳崙67號', '臺東縣太麻里鄉 — 未登記露營場', '089782813', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('千坪露營區', 'camping', 22.523583, 120.936962, '尚未有地址', '臺東縣太麻里鄉 — 未登記露營場', '0982025950', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('盛香源露營區', 'camping', 22.650777, 121.019982, '無地址', '臺東縣太麻里鄉 — 未登記露營場', NULL, NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金山星空野營區', 'camping', 22.63413979, 120.9714198, '台東縣太麻里鄉佳崙村17鄰189號', '臺東縣太麻里鄉 — 未登記露營場', '0952271748', 'https://www.facebook.com/p/%E9%87%91%E5%B1%B1%E6%98%9F%E7%A9%BA%E9%87%8E%E7%87%9F%E5%8D%80-100045092175216/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('美山的露營區', 'camping', 23.156607, 121.387351, '信義里20鄰都歷路264之23號', '臺東縣成功鎮 — 未登記露營場', '0928170641', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('麒麟部落', 'camping', 23.09238, 121.361028, '麒麟路52-6號', '臺東縣成功鎮 — 未登記露營場', '0958007361', 'https://www.facebook.com/Ciliksaycamp/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('昆布海灣露營區', 'camping', 23.096665, 121.363248, '台東縣成功鎮麒麟路114-5號', '臺東縣成功鎮 — 未登記露營場', '0980586213', 'https://www.facebook.com/p/%E6%98%86%E5%B8%83%E6%B5%B7%E7%81%A3%E9%9C%B2%E7%87%9F%E5%8D%80-100091378964325/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('成功天闊露營區', 'camping', 23.093396, 121.347058, '忠仁里32鄰上麒麟路5-1號', '臺東縣成功鎮 — 未登記露營場', '0987478898', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('小雄 72 號露營區', 'camping', 23.117343, 121.21415, '臺東縣池上鄉大埔村7鄰大埔72號', '臺東縣池上鄉 — 未登記露營場', '0982381311', 'https://www.facebook.com/basic823/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('余家露營區', 'camping', 23.113563, 121.235772, '慶豐村1鄰慶豐3號', '臺東縣池上鄉 — 未登記露營場', '0922067667', 'https://www.facebook.com/YuJiaTianYuanMinSu/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('敦親牧鄰民宿', 'camping', 22.856952, 121.096754, '臺東縣卑南鄉文泰路50巷6號', '臺東縣卑南鄉 — 未登記露營場', '0933750525', 'https://neighbor.ittbnb.com/index.html', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金谷農莊', 'camping', 22.855179, 121.149026, '環山路146號', '臺東縣卑南鄉 — 未登記露營場', '0966576550', 'https://www.facebook.com/JGhomestay/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('虂櫿嶇', 'camping', 22.870835, 121.10035, '明峰村6鄰龍過脈68號', '臺東縣卑南鄉 — 未登記露營場', '0912707744', 'https://www.facebook.com/Danadanaw0822/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('大王山居露營區', 'camping', 22.687798, 121.00704, '龍泉路43巷51之7號', '臺東縣卑南鄉 — 未登記露營場', '0921377245', 'https://www.facebook.com/groups/1487908122046235/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('王媽媽家常菜/露營區', 'camping', 22.710672, 121.026901, '台東縣卑南鄉溫泉村鎮樂路48號', '臺東縣卑南鄉 — 未登記露營場', '0911672375', 'https://www.facebook.com/p/%E7%8E%8B%E5%AA%BD%E5%AA%BD%E5%AE%B6%E5%B8%B8%E8%8F%9C%E9%9C%B2%E7%87%9F%E5%8D%80-100057297765968/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂山53露營區', 'camping', 22.670274, 120.98669, '台東縣卑南鄉31鄰樂山53號', '臺東縣卑南鄉 — 未登記露營場', '0921025726', 'https://www.facebook.com/p/%E6%A8%82%E5%B1%B153%E9%9C%B2%E7%87%9F%E5%8D%80-100077597872855/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('台東星夜光海露營區', 'camping', 22.740853, 121.042543, '台東縣卑南鄉民生22之2號', '臺東縣卑南鄉 — 未登記露營場', '0912215011', 'https://www.facebook.com/p/%E5%8F%B0%E6%9D%B1-%E6%98%9F%E5%A4%9C%E5%85%89%E6%B5%B7-%E5%92%96%E5%95%A1%E9%9C%B2%E7%87%9F%E8%BB%8A%E6%B3%8A-100075929377519/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('台東秘境露營', 'camping', 22.798253, 121.060979, '泰安村9鄰泰安293之1號', '臺東縣卑南鄉 — 未登記露營場', '0905367538', 'https://www.facebook.com/campfu/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('卡米莎度樹屋園區', 'camping', 22.872316, 121.056771, '台東縣延平鄉桃源村昇平路170號', '臺東縣延平鄉 — 未登記露營場', '0982771482', 'https://www.facebook.com/mureen1977/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('1080露營區', 'camping', 22.869915, 121.056133, '桃源村9鄰昇平路158號之1', '臺東縣延平鄉 — 未登記露營場', '0966709908', 'https://www.facebook.com/ozez1080', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('樂活首都茉莉民宿', 'camping', 22.912375, 121.258722, '興昌村29鄰興隆14之1號', '臺東縣東河鄉 — 未登記露營場', '0910505501', 'https://lehuo.ttbnb.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('都蘭五線-山海賞星緣露營區️', 'camping', 22.870086, 121.195053, '無地址', '臺東縣東河鄉 — 未登記露營場', '0912789969', 'https://www.facebook.com/profile.php?id=100089643231892&mibextid=LQQJ4d', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('涯口海濱小木屋', 'camping', 22.882337, 121.242351, '台東縣東河鄉都蘭村47鄰舊廍10之6號', '臺東縣東河鄉 — 未登記露營場', '0932725583', 'https://www.facebook.com/yakoucafe/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('心路旅程露營棧', 'camping', 22.883864, 121.234807, '都蘭村47鄰舊廍15-3號', '臺東縣東河鄉 — 未登記露營場', '0972162580', 'https://www.facebook.com/hearttravelcamp/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('都蘭錄托邦', 'camping', 22.871012, 121.22611, '無地址', '臺東縣東河鄉 — 未登記露營場', '0976382699', 'https://www.facebook.com/LutopiaDulan/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('safolo露營區', 'camping', 22.95600838, 121.2942138, '東河村1鄰金樽74號', '臺東縣東河鄉 — 未登記露營場', '0987754008', 'https://www.facebook.com/safolocamping/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('黑老大露營區', 'camping', 22.872919, 121.233862, '台東縣東河鄉觀海公園旁', '臺東縣東河鄉 — 未登記露營場', '0932723706', 'https://www.facebook.com/p/%E9%BB%91%E8%80%81%E5%A4%A7%E5%8F%B0%E6%9D%B1%E9%83%BD%E8%98%AD%E9%9C%B2%E7%87%9F%E5%8D%80-100063974496094/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('拉法鋼琴咖啡屋', 'camping', 22.881428, 121.241006, '台東縣東河鄉舊部路47鄰14-8號', '臺東縣東河鄉 — 未登記露營場', '0975188856', 'https://www.facebook.com/rafacafee/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金崙鄭大姐營地', 'camping', 22.53297, 120.959751, '賓茂村4鄰賓茂47之5號', '臺東縣金峰鄉 — 未登記露營場', '0927907131', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('原始角落', 'camping', 22.596829, 120.956607, '嘉蘭村8鄰嘉蘭423號', '臺東縣金峰鄉 — 未登記露營場', '0963193322', 'https://www.facebook.com/@PT0963193322/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('亞日兒山莊露營區', 'camping', 22.631161, 121.000187, '新興村4鄰新興街68-6號', '臺東縣金峰鄉 — 未登記露營場', '0925733989', 'https://www.facebook.com/ljaljegel/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('浪花蟹營地', 'camping', 23.346382, 121.466557, '三間村真柄4鄰77號', '臺東縣長濱鄉 — 未登記露營場', '0978687555', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('金剛山Surf Monkey獨木舟基地露營區', 'camping', 23.34386, 121.459277, '三間村真柄5鄰42之5號', '臺東縣長濱鄉 — 未登記露營場', '0933729063', 'https://www.facebook.com/surfmonkeyclub/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('谷泥悠露營區', 'camping', 23.345932, 121.453786, '真柄21-3號', '臺東縣長濱鄉 — 未登記露營場', '0987651391', 'https://www.facebook.com/Kuniyu.Camping/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('82遶灣 Paâalawan露營區', 'camping', 23.347779, 121.466772, '三間村3鄰50-2號', '臺東縣長濱鄉 — 未登記露營場', '0979530919', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('海邊舟舟曉晴星空露營地', 'camping', 23.241241, 121.415541, '寧埔村14鄰烏石鼻42之5號', '臺東縣長濱鄉 — 未登記露營場', '089801707', 'https://www.facebook.com/SAChenggong/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('福鹿山莊休閒農區', 'camping', 22.913452, 121.119668, '永安村高台路42巷145號', '臺東縣鹿野鄉 — 未登記露營場', '089550797', 'https://www.facebook.com/p/%E7%A6%8F%E9%B9%BF%E5%B1%B1%E4%BC%91%E9%96%92%E8%BE%B2%E8%8E%8A-100064391724130/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('鹿野高台大草原露營區', 'camping', 22.914907, 121.119037, '永安村高台路42巷133號', '臺東縣鹿野鄉 — 未登記露營場', '0910549678', 'https://www.facebook.com/luyesavanna/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('三姊快樂露營區', 'camping', 22.898332, 121.087137, '鹿野村1鄰鹿鳴路100巷5之1號', '臺東縣鹿野鄉 — 未登記露營場', '0953593090', 'https://www.facebook.com/3JHAPPY/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('射馬干農場露營區', 'camping', 22.71951, 121.043713, '建和四街91之2號', '臺東縣臺東市 — 未登記露營場', '0919610015', 'https://www.facebook.com/kasavakanFarm/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('快樂天堂露營區', 'camping', 22.73436427, 121.0436828, '無地址', '臺東縣臺東市 — 未登記露營場', '0920307460', 'https://www.facebook.com/p/%E5%BF%AB%E6%A8%82%E5%A4%A9%E5%A0%82%E9%9C%B2%E7%87%9F%E5%8D%80-100081239838027/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('沐樂草原', 'camping', 22.796527, 121.119056, '無地址', '臺東縣臺東市 — 未登記露營場', '0972049968', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('富岡海悅露營區', 'camping', 22.790283, 121.184755, '吉林路二段600號', '臺東縣臺東市 — 未登記露營場', '0921297011', 'https://www.facebook.com/people/%E6%B5%B7%E6%82%85%E9%9C%B2%E7%87%9F%E5%8D%80/100044502446379/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('滿園春舍', 'camping', 22.761241, 121.041686, '建和四街97-1號', '臺東縣臺東市 — 未登記露營場', '0919510180', 'https://www.facebook.com/p/%E6%BB%BF%E5%9C%92%E6%98%A5%E8%88%8D%E9%9C%B2%E7%87%9F%E5%8D%80-100088959111426/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('山上的海邊露營區', 'camping', 22.723005, 121.039271, '建和四街181之1號', '臺東縣臺東市 — 未登記露營場', '0912523441', 'https://www.facebook.com/savakanruyin/?locale=zh_TW', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('知本山莊', 'camping', 22.72006168, 121.0439131, '建和里建和四街97–1號', '臺東縣臺東市 — 未登記露營場', '0981481697', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('吉米探險家', 'camping', 22.01386097, 121.567581, '無地址', '臺東縣蘭嶼鄉 — 未登記露營場', '0918787600', 'https://jimmy-explorer.blogspot.com/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('好望角渡假村', 'camping', 22.020491, 121.560545, '紅頭村1鄰紅頭1之9號', '臺東縣蘭嶼鄉 — 未登記露營場', '0988310820', 'https://cape.okgo.tw/', 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('蘭嶼觀日露營區', 'camping', 22.037038, 121.568288, '東清村８鄰野銀10號', '臺東縣蘭嶼鄉 — 未登記露營場', '0966547201', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;
INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)
VALUES ('漫度漁光', 'camping', 22.985919, 120.159015, '台南市安平區安億路77號', '臺南市安平區 — 未登記露營場', '0906910889', NULL, 'published', 'new', false, false, false, 0)
ON CONFLICT (name, latitude, longitude) DO NOTHING;

-- Total: 1721 unregistered campsites imported (25 skipped)
