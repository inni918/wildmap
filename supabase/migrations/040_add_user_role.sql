-- users 表加 role 欄位（後台管理用）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'business', 'moderator', 'admin', 'super_admin'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
