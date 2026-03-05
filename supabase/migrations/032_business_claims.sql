-- 032_business_claims.sql
-- 商家認證申請系統

-- 商家認證申請表
CREATE TABLE IF NOT EXISTS business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  proof_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_claims_spot ON business_claims(spot_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_user ON business_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_status ON business_claims(status);

-- spots 表加入商家相關欄位
ALTER TABLE spots ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id);
ALTER TABLE spots ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;
ALTER TABLE spots ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT false;

-- RLS
ALTER TABLE business_claims ENABLE ROW LEVEL SECURITY;

-- 所有人可以看已通過的認證
DO $$ BEGIN
  CREATE POLICY "claims_read_approved" ON business_claims
    FOR SELECT USING (status = 'approved');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 自己可以看自己的申請
DO $$ BEGIN
  CREATE POLICY "claims_read_own" ON business_claims
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 登入用戶可以申請
DO $$ BEGIN
  CREATE POLICY "claims_insert" ON business_claims
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 自己可以更新 pending 狀態的申請
DO $$ BEGIN
  CREATE POLICY "claims_update_own" ON business_claims
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Storage bucket for business proofs (私有)
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-proofs', 'business-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: 上傳者可以上傳到自己的路徑
DO $$ BEGIN
  CREATE POLICY "business_proofs_insert" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'business-proofs'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Storage RLS: 上傳者可以讀取自己的檔案
DO $$ BEGIN
  CREATE POLICY "business_proofs_select_own" ON storage.objects
    FOR SELECT USING (
      bucket_id = 'business-proofs'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
