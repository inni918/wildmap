-- ============================================
-- 009: 所有表的 RLS policies
-- ============================================

-- ==========================================
-- Helper: is_admin function
-- ==========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 1. spots
-- ==========================================
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
-- 移除舊 policies（安全起見）
DROP POLICY IF EXISTS "Anyone can read spots" ON spots;
DROP POLICY IF EXISTS "Anyone can insert spots" ON spots;
DROP POLICY IF EXISTS "spots_insert_auth" ON spots;
DROP POLICY IF EXISTS "spots_update_own" ON spots;

-- SELECT: 公開地標所有人可看，私房地標只有群組成員可看
CREATE POLICY "spots_select" ON spots FOR SELECT USING (
  is_private = false
  OR created_by = auth.uid()
  OR managed_by = auth.uid()
  OR group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  OR is_admin()
);

-- INSERT: 登入用戶可新增
CREATE POLICY "spots_insert" ON spots FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- UPDATE: 創建者、管理員、認證商家、admin
CREATE POLICY "spots_update" ON spots FOR UPDATE USING (
  auth.uid() = created_by
  OR auth.uid() = managed_by
  OR auth.uid() = claimed_by
  OR is_admin()
);

-- DELETE: 只有 admin
CREATE POLICY "spots_delete" ON spots FOR DELETE USING (
  is_admin()
);

-- ==========================================
-- 2. users
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

-- SELECT: 所有人可看基本資料
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
-- INSERT: 只能建自己的 profile（trigger 處理）
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);
-- UPDATE: 只能改自己的，admin 可改所有人
CREATE POLICY "users_update" ON users FOR UPDATE USING (
  auth.uid() = id OR is_admin()
);

-- ==========================================
-- 3. feature_definitions
-- ==========================================
ALTER TABLE feature_definitions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feature_defs_select_all" ON feature_definitions;

-- SELECT: 所有人可讀
CREATE POLICY "feature_defs_select" ON feature_definitions FOR SELECT USING (true);
-- INSERT/UPDATE/DELETE: 只有 admin
CREATE POLICY "feature_defs_admin_insert" ON feature_definitions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "feature_defs_admin_update" ON feature_definitions FOR UPDATE USING (is_admin());
CREATE POLICY "feature_defs_admin_delete" ON feature_definitions FOR DELETE USING (is_admin());

-- ==========================================
-- 4. feature_votes
-- ==========================================
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feature_votes_select_all" ON feature_votes;
DROP POLICY IF EXISTS "feature_votes_insert_auth" ON feature_votes;
DROP POLICY IF EXISTS "feature_votes_update_own" ON feature_votes;
DROP POLICY IF EXISTS "feature_votes_delete_own" ON feature_votes;

-- SELECT: 所有人可讀
CREATE POLICY "feature_votes_select" ON feature_votes FOR SELECT USING (true);
-- INSERT: 登入用戶只能以自己的 user_id 投票
CREATE POLICY "feature_votes_insert" ON feature_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: 只能改自己的投票
CREATE POLICY "feature_votes_update" ON feature_votes FOR UPDATE USING (auth.uid() = user_id);
-- DELETE: 只能刪自己的投票
CREATE POLICY "feature_votes_delete" ON feature_votes FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 5. ratings
-- ==========================================
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ratings_select" ON ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update" ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ratings_delete" ON ratings FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 6. comments
-- ==========================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- 7. spot_images
-- ==========================================
ALTER TABLE spot_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spot_images_select" ON spot_images FOR SELECT USING (true);
CREATE POLICY "spot_images_insert" ON spot_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spot_images_delete" ON spot_images FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- 8. trip_reports
-- ==========================================
ALTER TABLE trip_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trip_reports_select" ON trip_reports FOR SELECT USING (true);
CREATE POLICY "trip_reports_insert" ON trip_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trip_reports_update" ON trip_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trip_reports_delete" ON trip_reports FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- 9. favorites
-- ==========================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
-- SELECT: 只能看自己的收藏
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 10. spot_edits
-- ==========================================
ALTER TABLE spot_edits ENABLE ROW LEVEL SECURITY;
-- SELECT: 所有人可看（透明度）
CREATE POLICY "spot_edits_select" ON spot_edits FOR SELECT USING (true);
CREATE POLICY "spot_edits_insert" ON spot_edits FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: admin 或地標管理員可審核
CREATE POLICY "spot_edits_update" ON spot_edits FOR UPDATE USING (
  is_admin()
  OR EXISTS (
    SELECT 1 FROM spots WHERE spots.id = spot_edits.spot_id
    AND (spots.managed_by = auth.uid() OR spots.claimed_by = auth.uid())
  )
);

-- ==========================================
-- 11. reports
-- ==========================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
-- SELECT: 只能看自己的檢舉 + admin 看全部
CREATE POLICY "reports_select" ON reports FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: 只有 admin 可處理檢舉
CREATE POLICY "reports_update" ON reports FOR UPDATE USING (is_admin());

-- ==========================================
-- 12. check_ins
-- ==========================================
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
-- SELECT: 所有人可看（顯示「已到訪」標記）
CREATE POLICY "check_ins_select" ON check_ins FOR SELECT USING (true);
CREATE POLICY "check_ins_insert" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 13. business_claims
-- ==========================================
ALTER TABLE business_claims ENABLE ROW LEVEL SECURITY;
-- SELECT: 自己的 + admin
CREATE POLICY "business_claims_select" ON business_claims FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
CREATE POLICY "business_claims_insert" ON business_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
-- UPDATE: admin 審核
CREATE POLICY "business_claims_update" ON business_claims FOR UPDATE USING (is_admin());

-- ==========================================
-- 14. business_subscriptions
-- ==========================================
ALTER TABLE business_subscriptions ENABLE ROW LEVEL SECURITY;
-- SELECT: 自己的 + admin
CREATE POLICY "business_subs_select" ON business_subscriptions FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
-- INSERT/UPDATE: 透過 server 函式處理（payment webhook）
CREATE POLICY "business_subs_admin_insert" ON business_subscriptions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "business_subs_admin_update" ON business_subscriptions FOR UPDATE USING (is_admin());

-- ==========================================
-- 15. groups
-- ==========================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
-- SELECT: 群組成員 + admin
CREATE POLICY "groups_select" ON groups FOR SELECT USING (
  owner_id = auth.uid()
  OR id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "groups_insert" ON groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "groups_update" ON groups FOR UPDATE USING (auth.uid() = owner_id OR is_admin());
CREATE POLICY "groups_delete" ON groups FOR DELETE USING (auth.uid() = owner_id OR is_admin());

-- ==========================================
-- 16. group_members
-- ==========================================
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
-- SELECT: 同群組成員可看
CREATE POLICY "group_members_select" ON group_members FOR SELECT USING (
  user_id = auth.uid()
  OR group_id IN (SELECT group_id FROM group_members gm WHERE gm.user_id = auth.uid())
  OR is_admin()
);
-- INSERT: 群組 owner 可邀請
CREATE POLICY "group_members_insert" ON group_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM groups WHERE id = group_members.group_id AND owner_id = auth.uid())
  OR is_admin()
);
-- DELETE: 群組 owner 或自己退出
CREATE POLICY "group_members_delete" ON group_members FOR DELETE USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM groups WHERE id = group_members.group_id AND owner_id = auth.uid())
  OR is_admin()
);

-- ==========================================
-- 17. follows
-- ==========================================
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ==========================================
-- 18. user_activities
-- ==========================================
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
-- SELECT: 所有人可看（個人頁面動態牆）
CREATE POLICY "user_activities_select" ON user_activities FOR SELECT USING (true);
-- INSERT: 系統或本人
CREATE POLICY "user_activities_insert" ON user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 19. user_category_stats
-- ==========================================
ALTER TABLE user_category_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_category_stats_select" ON user_category_stats FOR SELECT USING (true);
CREATE POLICY "user_category_stats_insert" ON user_category_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_category_stats_update" ON user_category_stats FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 20. notifications
-- ==========================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- SELECT: 只能看自己的通知
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
-- INSERT: 系統建立（透過 server 函式）
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (is_admin());
-- UPDATE: 本人可標已讀
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 21. achievements
-- ==========================================
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "achievements_select_all" ON achievements;
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_insert" ON achievements FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "achievements_admin_update" ON achievements FOR UPDATE USING (is_admin());

-- ==========================================
-- 22. user_achievements
-- ==========================================
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_achievements_select_all" ON user_achievements;
DROP POLICY IF EXISTS "user_achievements_insert_system" ON user_achievements;
CREATE POLICY "user_achievements_select" ON user_achievements FOR SELECT USING (true);
-- INSERT: 系統自動解鎖（透過 server 函式或 trigger）
CREATE POLICY "user_achievements_insert" ON user_achievements FOR INSERT WITH CHECK (
  auth.uid() = user_id OR is_admin()
);
