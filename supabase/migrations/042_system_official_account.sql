-- ============================================
-- 042: 建立 Wildmap 官方系統帳號
-- 用途：作為種子資料的建立者，統一顯示格式
-- 注意：需要先用 Supabase Auth Admin API 建立 auth.users
--       再跑此 migration 建立 public.users + 更新種子資料
-- ============================================

-- Step 1: 在 auth.users 建立系統帳號（密碼設為不可登入的隨機值）
INSERT INTO auth.users (
  id, 
  instance_id,
  email, 
  encrypted_password, 
  email_confirmed_at, 
  role,
  aud,
  created_at, 
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'official@wildmap.tw',
  '$2a$10$SYSTEM.ACCOUNT.NO.LOGIN.ALLOWED.000000000000000000000',
  now(),
  'authenticated',
  'authenticated',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Step 2: 在 public.users 建立對應資料（trigger 可能已自動建立）
INSERT INTO users (id, email, display_name, avatar_url, auth_provider, level, points, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'official@wildmap.tw',
  'Wildmap 團隊',
  NULL,
  'system',
  5,
  9999,
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  level = EXCLUDED.level,
  role = EXCLUDED.role;

-- Step 3: 更新所有種子地標的 created_by
UPDATE spots
SET created_by = '00000000-0000-0000-0000-000000000001'
WHERE created_by IS NULL;

-- Step 4: 更新所有種子特性投票的 user_id
UPDATE feature_votes
SET user_id = '00000000-0000-0000-0000-000000000001'
WHERE user_id IS NULL;
