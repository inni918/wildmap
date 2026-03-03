# Wildmap 資料庫 Migration

## 檔案清單

| 檔案 | 說明 | 表數 |
|------|------|------|
| 001_upgrade_spots.sql | 升級現有 spots 表（加 14 個欄位） | 0 (修改) |
| 002_users_and_auth.sql | users 表 + auth trigger | 1 |
| 003_features.sql | feature_definitions + feature_votes + 87 項特性 | 2 + seed |
| 004_interactions.sql | ratings, comments, spot_images, trip_reports, favorites | 5 |
| 005_governance.sql | spot_edits, reports, check_ins | 3 |
| 006_business.sql | business_claims, business_subscriptions | 2 |
| 007_social.sql | groups, group_members, follows, user_activities, user_category_stats, notifications | 6 |
| 008_achievements.sql | achievements, user_achievements + 10 個基礎成就 | 2 + seed |
| 009_rls.sql | 所有表的 RLS policies | 0 (policies) |

## 執行方式

### 方法 1: Supabase CLI
```bash
npx supabase login
npx supabase link --project-ref gwopbfqgtwrqgrhgpepx
npx supabase db push
```

### 方法 2: Supabase Dashboard
1. 到 https://supabase.com/dashboard/project/gwopbfqgtwrqgrhgpepx/sql/new
2. 依序複製貼上每個 migration 檔案執行
3. 或直接複製 `supabase-init.sql`（合併版）一次執行

### 方法 3: psql 直連
```bash
psql "postgresql://postgres.gwopbfqgtwrqgrhgpepx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" -f supabase-init.sql
```

## 注意事項
- 所有 migration 都使用 `IF NOT EXISTS` / `DO $$ ... END $$` 確保冪等性
- 不會刪除現有 spots 資料
- 特性 seed data 使用 `ON CONFLICT (key) DO NOTHING`
- 001 的 PostGIS 索引需要 PostGIS 擴展（Supabase 預設有）
