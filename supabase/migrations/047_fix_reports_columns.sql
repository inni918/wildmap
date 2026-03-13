-- 047: 確保 reports 表有 admin 後台需要的欄位
-- reporter_id = 原始 user_id 的 alias（向後相容）
-- resolution, resolution_note = 處理結果記錄

-- 新增 reporter_id 欄位（如果不存在）
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reporter_id UUID REFERENCES users(id);

-- 把既有 user_id 資料複製到 reporter_id（只填 NULL 的）
UPDATE reports SET reporter_id = user_id WHERE reporter_id IS NULL AND user_id IS NOT NULL;

-- 新增 resolution 欄位
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolution TEXT;

-- 新增 resolution_note 欄位
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolution_note TEXT;

-- 更新 status CHECK constraint 加入 'rejected'（原本只有 pending/resolved/dismissed）
-- PostgreSQL 不支援 ALTER CHECK，需要 drop + re-add
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_status_check;
ALTER TABLE reports ADD CONSTRAINT reports_status_check 
  CHECK (status IN ('pending', 'resolved', 'dismissed', 'rejected'));
