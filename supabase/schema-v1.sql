-- ============================================================
-- Wildmap v1.0 Database Schema
-- 一次性建立，乾淨架構
-- 執行前請確認已備份舊資料
-- ============================================================

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE spot_category AS ENUM ('camping', 'carcamp', 'fishing', 'diving', 'surfing', 'hiking');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE spot_type AS ENUM ('paid', 'free', 'wild');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE spot_status AS ENUM ('active', 'hidden', 'closed', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE spot_quality AS ENUM ('new', 'verified', 'featured');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE feature_category AS ENUM ('campsite', 'facilities', 'environment', 'activities', 'zones', 'notes');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE achievement_category AS ENUM ('exploration', 'contribution', 'social', 'special');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE achievement_tier AS ENUM ('none', 'bronze', 'silver', 'gold');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE report_target_type AS ENUM ('spot', 'comment', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- ----------------------------------------
-- 2.1 users（擴充 Supabase Auth）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text UNIQUE,
  display_name text,
  avatar_url  text,
  bio         text,
  level       int NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  total_score int NOT NULL DEFAULT 0,
  permissions_cache jsonb NOT NULL DEFAULT '[]'::jsonb,
  expert_scores     jsonb NOT NULL DEFAULT '{}'::jsonb,
  role        user_role NOT NULL DEFAULT 'user',
  is_active   bool NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ----------------------------------------
-- 2.2 spots（地標）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.spots (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text,
  lat            float8 NOT NULL,
  lng            float8 NOT NULL,
  address        text,
  city           text,
  district       text,
  category       spot_category NOT NULL DEFAULT 'camping',
  spot_type      spot_type NOT NULL DEFAULT 'paid',
  status         spot_status NOT NULL DEFAULT 'active',
  altitude       int,
  website        text,
  facebook       text,
  instagram      text,
  line_id        text,
  email          text,
  google_maps_url text,
  gov_certified  bool NOT NULL DEFAULT false,
  created_by     uuid REFERENCES public.users(id) ON DELETE SET NULL,
  quality_level  spot_quality NOT NULL DEFAULT 'new',
  view_count     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spots_category ON public.spots(category);
CREATE INDEX IF NOT EXISTS idx_spots_status ON public.spots(status);
CREATE INDEX IF NOT EXISTS idx_spots_city ON public.spots(city);
CREATE INDEX IF NOT EXISTS idx_spots_spot_type ON public.spots(spot_type);
CREATE INDEX IF NOT EXISTS idx_spots_created_by ON public.spots(created_by);
CREATE INDEX IF NOT EXISTS idx_spots_lat_lng ON public.spots(lat, lng);
CREATE INDEX IF NOT EXISTS idx_spots_quality_level ON public.spots(quality_level);

-- ----------------------------------------
-- 2.3 feature_definitions（特性定義）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.feature_definitions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  description      text,
  category         feature_category NOT NULL,
  icon_name        text,
  color            text,
  sort_order       int NOT NULL DEFAULT 0,
  applicable_types text[] NOT NULL DEFAULT '{}',
  is_active        bool NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_feature_definitions_category ON public.feature_definitions(category);

-- ----------------------------------------
-- 2.4 feature_votes（特性投票）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.feature_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id     uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  feature_id  uuid NOT NULL REFERENCES public.feature_definitions(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vote        bool NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(spot_id, feature_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_feature_votes_spot ON public.feature_votes(spot_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature ON public.feature_votes(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user ON public.feature_votes(user_id);

-- ----------------------------------------
-- 2.5 ratings（評分）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.ratings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id     uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score       int NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(spot_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_spot ON public.ratings(spot_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON public.ratings(user_id);

-- ----------------------------------------
-- 2.6 comments（留言）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id     uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id   uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  content     text NOT NULL,
  is_hidden   bool NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_spot ON public.comments(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);

-- ----------------------------------------
-- 2.7 check_ins（GPS 打卡）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.check_ins (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id     uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lat         float8 NOT NULL,
  lng         float8 NOT NULL,
  accuracy    float8,
  verified    bool NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_check_ins_spot ON public.check_ins(spot_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON public.check_ins(user_id);

-- ----------------------------------------
-- 2.8 favorites（收藏）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id     uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(spot_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_spot ON public.favorites(spot_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- ----------------------------------------
-- 2.9 spot_images（照片）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.spot_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id       uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  storage_path  text NOT NULL,
  is_cover      bool NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spot_images_spot ON public.spot_images(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_images_user ON public.spot_images(user_id);

-- ----------------------------------------
-- 2.10 achievements（成就定義）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code               text UNIQUE NOT NULL,
  name               text NOT NULL,
  description        text,
  category           achievement_category NOT NULL,
  category_scope     text,
  tiers              jsonb NOT NULL DEFAULT '[]'::jsonb,
  unlock_permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  hint_text          text,
  icon_name          text,
  is_active          bool NOT NULL DEFAULT true,
  sort_order         int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_code ON public.achievements(code);

-- ----------------------------------------
-- 2.11 user_achievements（用戶成就進度）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id  uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  tier_unlocked   achievement_tier NOT NULL DEFAULT 'none',
  progress        int NOT NULL DEFAULT 0,
  progress_max    int NOT NULL DEFAULT 0,
  unlocked_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON public.user_achievements(achievement_id);

-- ----------------------------------------
-- 2.12 user_stats（用戶統計計數器）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id              uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  comments_count       int NOT NULL DEFAULT 0,
  ratings_count        int NOT NULL DEFAULT 0,
  photos_count         int NOT NULL DEFAULT 0,
  votes_count          int NOT NULL DEFAULT 0,
  spots_created        int NOT NULL DEFAULT 0,
  checkins_count       int NOT NULL DEFAULT 0,
  checkins_unique_spots int NOT NULL DEFAULT 0,
  favorites_count      int NOT NULL DEFAULT 0,
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- 2.13 reports（舉報）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id   uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type   report_target_type NOT NULL,
  target_id     uuid NOT NULL,
  reason        text NOT NULL,
  status        report_status NOT NULL DEFAULT 'pending',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ----------------------------------------
-- 2.14 business_claims（商家認領）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.business_claims (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id     uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,  -- 不用 FK，auth.users 非 public schema
  status      claim_status NOT NULL DEFAULT 'pending',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_claims_spot ON public.business_claims(spot_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_user ON public.business_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_status ON public.business_claims(status);

-- ----------------------------------------
-- 2.15 notifications（通知）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  body        text,
  is_read     bool NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spot_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3.1 RLS Policies
-- SELECT: 公開讀取（大部分表）
-- INSERT/UPDATE/DELETE: 需要 auth
-- ============================================================

-- ----- users -----
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ----- spots -----
CREATE POLICY "spots_select_all" ON public.spots
  FOR SELECT USING (true);

CREATE POLICY "spots_insert_auth" ON public.spots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "spots_update_auth" ON public.spots
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ----- feature_definitions -----
CREATE POLICY "feature_definitions_select_all" ON public.feature_definitions
  FOR SELECT USING (true);

-- Admin only insert/update (via service role key, bypasses RLS)

-- ----- feature_votes -----
CREATE POLICY "feature_votes_select_all" ON public.feature_votes
  FOR SELECT USING (true);

CREATE POLICY "feature_votes_insert_own" ON public.feature_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "feature_votes_update_own" ON public.feature_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "feature_votes_delete_own" ON public.feature_votes
  FOR DELETE USING (auth.uid() = user_id);

-- ----- ratings -----
CREATE POLICY "ratings_select_all" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "ratings_insert_own" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ratings_update_own" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ratings_delete_own" ON public.ratings
  FOR DELETE USING (auth.uid() = user_id);

-- ----- comments -----
CREATE POLICY "comments_select_all" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_own" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_own" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- check_ins -----
CREATE POLICY "check_ins_select_all" ON public.check_ins
  FOR SELECT USING (true);

CREATE POLICY "check_ins_insert_own" ON public.check_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ----- favorites -----
CREATE POLICY "favorites_select_all" ON public.favorites
  FOR SELECT USING (true);

CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ----- spot_images -----
CREATE POLICY "spot_images_select_all" ON public.spot_images
  FOR SELECT USING (true);

CREATE POLICY "spot_images_insert_own" ON public.spot_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "spot_images_delete_own" ON public.spot_images
  FOR DELETE USING (auth.uid() = user_id);

-- ----- achievements -----
CREATE POLICY "achievements_select_all" ON public.achievements
  FOR SELECT USING (true);

-- Admin only insert/update (via service role key)

-- ----- user_achievements -----
CREATE POLICY "user_achievements_select_all" ON public.user_achievements
  FOR SELECT USING (true);

CREATE POLICY "user_achievements_insert_auth" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "user_achievements_update_own" ON public.user_achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- user_stats -----
CREATE POLICY "user_stats_select_all" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "user_stats_insert_own" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_stats_update_own" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- reports -----
CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "reports_insert_auth" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ----- business_claims -----
CREATE POLICY "business_claims_select_own" ON public.business_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "business_claims_insert_auth" ON public.business_claims
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ----- notifications -----
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- 4. updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE OR REPLACE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_spots
  BEFORE UPDATE ON public.spots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_ratings
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_user_achievements
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_user_stats
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_business_claims
  BEFORE UPDATE ON public.business_claims
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Done. Schema v1.0 ready.
-- ============================================================
