-- 新增 suspended 狀態（暫停營業）
-- 先更新 CHECK constraint 允許 suspended 狀態
-- 再把名稱裡有「暫停營業」字樣的地標 status 改為 suspended 並清理名稱

-- 步驟零：更新 CHECK constraint 加入 suspended
ALTER TABLE spots DROP CONSTRAINT IF EXISTS spots_status_check;
ALTER TABLE spots ADD CONSTRAINT spots_status_check 
  CHECK (status IN ('draft', 'published', 'hidden', 'closed', 'needs_verification', 'suspended'));

-- 步驟一：先把這些地標 status 改為 suspended
UPDATE spots
SET status = 'suspended'
WHERE name ILIKE '%暫停營業%'
   OR name ILIKE '%停業%';

-- 步驟二：清理名稱（移除括號內的暫停營業字樣，各種括號組合）
UPDATE spots
SET name = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(name, '\(暫停營業\)', '', 'g'),
        '（暫停營業）', '', 'g'
      ),
      '\(停業\)', '', 'g'
    ),
    '（停業）', '', 'g'
  )
)
WHERE status = 'suspended';

-- 步驟三：再次 TRIM 確保沒有多餘空白
UPDATE spots
SET name = TRIM(name)
WHERE status = 'suspended';
