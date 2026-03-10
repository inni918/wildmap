-- 新增 weight 欄位
ALTER TABLE feature_votes ADD COLUMN IF NOT EXISTS weight integer NOT NULL DEFAULT 1;

-- 系統帳號現有投票全部更新為 weight = 3
UPDATE feature_votes 
SET weight = 3 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- 建立 index 加速查詢
CREATE INDEX IF NOT EXISTS idx_feature_votes_weight ON feature_votes(weight);
