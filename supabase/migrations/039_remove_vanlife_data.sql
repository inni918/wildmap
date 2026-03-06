-- ============================================
-- 039: 移除所有車床天地來源的車宿資料
-- 原因：車床天地 KML 資料未取得授權，有著作權侵害風險
-- 決策者：Leon（2026-03-07）
-- 影響：刪除 ~1,290 筆 carcamp spots + 相關 feature_votes
-- 注意：CASCADE 會自動刪除 ratings, comments, spot_images, 
--       trip_reports, favorites, feature_votes, check_ins 等關聯資料
-- ============================================

-- 先刪除關聯的 feature_votes（user_id IS NULL = 系統種子資料）
DELETE FROM feature_votes
WHERE spot_id IN (SELECT id FROM spots WHERE category = 'carcamp')
  AND user_id IS NULL;

-- 刪除所有車宿地點（CASCADE 處理其他關聯表）
DELETE FROM spots WHERE category = 'carcamp';
