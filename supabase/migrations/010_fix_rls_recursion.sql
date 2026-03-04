-- 010: Fix infinite recursion in group_members RLS policy
-- Problem: group_members_select queries group_members itself → infinite recursion
-- Solution: Use security_definer function to bypass RLS when checking membership

-- 建立 SECURITY DEFINER 函式，繞過 RLS 檢查 group membership
CREATE OR REPLACE FUNCTION get_user_group_ids(uid uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT group_id FROM group_members WHERE user_id = uid;
$$;

-- 修復 group_members SELECT policy
DROP POLICY IF EXISTS "group_members_select" ON group_members;
CREATE POLICY "group_members_select" ON group_members FOR SELECT USING (
  user_id = auth.uid()
  OR group_id IN (SELECT get_user_group_ids(auth.uid()))
  OR is_admin()
);

-- 修復 spots SELECT policy（也引用了 group_members）
DROP POLICY IF EXISTS "spots_select" ON spots;
CREATE POLICY "spots_select" ON spots FOR SELECT USING (
  is_private = false
  OR created_by = auth.uid()
  OR managed_by = auth.uid()
  OR group_id IN (SELECT get_user_group_ids(auth.uid()))
  OR is_admin()
);

-- 修復 groups SELECT policy（也引用了 group_members）
DROP POLICY IF EXISTS "groups_select" ON groups;
CREATE POLICY "groups_select" ON groups FOR SELECT USING (
  owner_id = auth.uid()
  OR id IN (SELECT get_user_group_ids(auth.uid()))
  OR is_admin()
);
