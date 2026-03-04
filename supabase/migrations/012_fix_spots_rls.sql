-- 012: Fix two QA bugs
-- Bug #1 (P0): 登入後看不到任何地標
--   Root cause: spots_select policy 中 group_id IN (subquery) 當 group_id 為 NULL 時
--   回傳 NULL 而非 FALSE，在某些情況下導致整個 USING 表達式為 NULL（row 不可見）
--   Fix: 加上 COALESCE 確保 NULL 不會影響 OR 鏈
--
-- Bug #2 (P1): display_name 未正確存入 profile
--   Root cause: handle_new_user trigger 從 raw_user_meta_data 讀 'full_name' / 'name'，
--   但 signUpWithEmail 存的 key 是 'display_name'，導致 trigger 永遠 fallback 到 email prefix
--   Fix: trigger 中加入 'display_name' key 的讀取
-- ============================================

-- ==========================================
-- Bug #1 Fix: spots RLS policy
-- ==========================================
DROP POLICY IF EXISTS "spots_select" ON spots;
CREATE POLICY "spots_select" ON spots FOR SELECT USING (
  is_private = false
  OR created_by = auth.uid()
  OR managed_by = auth.uid()
  OR (group_id IS NOT NULL AND group_id IN (SELECT get_user_group_ids(auth.uid())))
  OR is_admin()
);

-- ==========================================
-- Bug #2 Fix: handle_new_user trigger 要讀 'display_name' key
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(
      EXCLUDED.display_name,
      users.display_name
    ),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
