-- ============================================
-- 001: 升級 spots 表（加欄位，不刪除現有資料）
-- ============================================

-- 加入新欄位（全部用 IF NOT EXISTS 或安全檢查）
DO $$
BEGIN
  -- name_en
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='name_en') THEN
    ALTER TABLE spots ADD COLUMN name_en TEXT;
  END IF;
  -- description_en
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='description_en') THEN
    ALTER TABLE spots ADD COLUMN description_en TEXT;
  END IF;
  -- address
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='address') THEN
    ALTER TABLE spots ADD COLUMN address TEXT;
  END IF;
  -- status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='status') THEN
    ALTER TABLE spots ADD COLUMN status TEXT DEFAULT 'published';
    ALTER TABLE spots ADD CONSTRAINT spots_status_check CHECK (status IN ('draft', 'published', 'hidden', 'closed', 'needs_verification'));
  END IF;
  -- quality
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='quality') THEN
    ALTER TABLE spots ADD COLUMN quality TEXT DEFAULT 'new';
    ALTER TABLE spots ADD CONSTRAINT spots_quality_check CHECK (quality IN ('new', 'community_verified', 'featured', 'official'));
  END IF;
  -- is_free
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='is_free') THEN
    ALTER TABLE spots ADD COLUMN is_free BOOLEAN;
  END IF;
  -- is_private
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='is_private') THEN
    ALTER TABLE spots ADD COLUMN is_private BOOLEAN DEFAULT false;
  END IF;
  -- group_id（FK 在 007_social.sql groups 表建好後加）
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='group_id') THEN
    ALTER TABLE spots ADD COLUMN group_id UUID;
  END IF;
  -- created_by（FK 在 002 users 表建好後加）
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='created_by') THEN
    ALTER TABLE spots ADD COLUMN created_by UUID;
  END IF;
  -- managed_by
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='managed_by') THEN
    ALTER TABLE spots ADD COLUMN managed_by UUID;
  END IF;
  -- claimed_by
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='claimed_by') THEN
    ALTER TABLE spots ADD COLUMN claimed_by UUID;
  END IF;
  -- last_verified_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='last_verified_at') THEN
    ALTER TABLE spots ADD COLUMN last_verified_at TIMESTAMPTZ;
  END IF;
  -- view_count
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='view_count') THEN
    ALTER TABLE spots ADD COLUMN view_count INT DEFAULT 0;
  END IF;
  -- updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='spots' AND column_name='updated_at') THEN
    ALTER TABLE spots ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 索引
CREATE INDEX IF NOT EXISTS idx_spots_category ON spots(category);
CREATE INDEX IF NOT EXISTS idx_spots_status ON spots(status);
CREATE INDEX IF NOT EXISTS idx_spots_created_by ON spots(created_by);
CREATE INDEX IF NOT EXISTS idx_spots_location ON spots USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
