-- 新增海拔欄位（公尺）
ALTER TABLE spots ADD COLUMN IF NOT EXISTS elevation INTEGER;
