-- ============================================
-- 035: 新增 tos_accepted_at 欄位（記錄使用者同意服務條款的時間）
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'tos_accepted_at'
  ) THEN
    ALTER TABLE users ADD COLUMN tos_accepted_at TIMESTAMPTZ;
  END IF;
END $$;

-- 為已有帳號的使用者設定一個預設同意時間（視為已同意舊版條款）
-- UPDATE users SET tos_accepted_at = created_at WHERE tos_accepted_at IS NULL;
