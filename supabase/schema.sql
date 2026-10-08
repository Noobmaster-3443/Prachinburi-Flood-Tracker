-- =========================================================================
-- Thailand Flood Tracker (ระบบรายงานสถานการณ์น้ำท่วมครอบคลุม 77 จังหวัดทั่วไทย)
-- Supabase Database Schema & Security RLS Policies
-- =========================================================================

-- 1. Create enum for severity levels
DO $$ BEGIN
  CREATE TYPE flood_severity AS ENUM ('green', 'yellow', 'orange', 'red');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create flood_reports table with nationwide province support
CREATE TABLE IF NOT EXISTS public.flood_reports (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  province_id VARCHAR(50) NOT NULL DEFAULT 'prachinburi',
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  district VARCHAR(100) NOT NULL,
  subdistrict VARCHAR(100) NOT NULL,
  location_name TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('green', 'yellow', 'orange', 'red')),
  water_depth_label VARCHAR(100) NOT NULL,
  water_depth_code VARCHAR(50),
  description TEXT,
  image_url TEXT,
  passable_for_vehicles BOOLEAN NOT NULL DEFAULT true,
  passable_trucks_only BOOLEAN DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  reporter_type VARCHAR(50) DEFAULT 'citizen',
  reporter_name VARCHAR(150),
  upvotes INTEGER DEFAULT 0
);

-- Ensure province_id column exists if table was created previously
DO $$ BEGIN
  ALTER TABLE public.flood_reports ADD COLUMN IF NOT EXISTS province_id VARCHAR(50) DEFAULT 'prachinburi';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 3. Indexes for fast geospatial, province, and filter queries
CREATE INDEX IF NOT EXISTS idx_flood_reports_province ON public.flood_reports(province_id);
CREATE INDEX IF NOT EXISTS idx_flood_reports_district ON public.flood_reports(district);
CREATE INDEX IF NOT EXISTS idx_flood_reports_severity ON public.flood_reports(severity);
CREATE INDEX IF NOT EXISTS idx_flood_reports_created_at ON public.flood_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flood_reports_coordinates ON public.flood_reports(latitude, longitude);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.flood_reports ENABLE ROW LEVEL SECURITY;

-- 4.1 Policy: Everyone can read reports
DROP POLICY IF EXISTS "Public read access for flood reports" ON public.flood_reports;
CREATE POLICY "Public read access for flood reports"
ON public.flood_reports
FOR SELECT
TO public
USING (true);

-- 4.2 Policy: Anonymous community submissions allowed with strict validation
DROP POLICY IF EXISTS "Anonymous community reporting allowed" ON public.flood_reports;
CREATE POLICY "Anonymous community reporting allowed"
ON public.flood_reports
FOR INSERT
TO public
WITH CHECK (
  latitude IS NOT NULL 
  AND longitude IS NOT NULL 
  AND district IS NOT NULL 
  AND location_name IS NOT NULL
  AND is_verified = false -- Community reports cannot self-verify!
);

-- 4.3 Policy: Disallow public deletion (Only service_role / authorized admin)
DROP POLICY IF EXISTS "Allow moderation deletion of reports" ON public.flood_reports;
DROP POLICY IF EXISTS "Service role delete reports" ON public.flood_reports;
CREATE POLICY "Service role delete reports"
ON public.flood_reports
FOR DELETE
TO service_role
USING (true);

-- 4.4 Policy: Disallow public updating (Only service_role / authorized admin)
DROP POLICY IF EXISTS "Allow moderation update of reports" ON public.flood_reports;
DROP POLICY IF EXISTS "Service role update reports" ON public.flood_reports;
CREATE POLICY "Service role update reports"
ON public.flood_reports
FOR UPDATE
TO service_role
USING (true);

-- 5. Atomic Upvote RPC Function (Safe public voting)
CREATE OR REPLACE FUNCTION increment_upvotes(report_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.flood_reports
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = report_id
  RETURNING upvotes INTO new_count;

  RETURN new_count;
END;
$$;

-- 6. Storage Bucket Configuration for User Uploaded Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('flood-images', 'flood-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can view images
DROP POLICY IF EXISTS "Public can view flood images" ON storage.objects;
CREATE POLICY "Public can view flood images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'flood-images');

-- Storage Policy: Anyone can upload photos
DROP POLICY IF EXISTS "Anyone can upload flood photos" ON storage.objects;
CREATE POLICY "Anyone can upload flood photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'flood-images');

-- =========================================================================
-- 7. Emergency Contacts & Community Suggestion Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(50) NOT NULL,
  province_id VARCHAR(50) DEFAULT 'prachinburi',
  district VARCHAR(100),
  category VARCHAR(50) DEFAULT 'rescue',
  is_24h BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT false,
  submitted_by VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

DO $$ BEGIN
  ALTER TABLE public.emergency_contacts ADD COLUMN IF NOT EXISTS province_id VARCHAR(50) DEFAULT 'prachinburi';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Public can read approved contacts
DROP POLICY IF EXISTS "Public read approved emergency contacts" ON public.emergency_contacts;
CREATE POLICY "Public read approved emergency contacts"
ON public.emergency_contacts
FOR SELECT
TO public
USING (is_approved = true);

-- Public can suggest new contact (starts as pending is_approved = false)
DROP POLICY IF EXISTS "Public suggest new emergency contact" ON public.emergency_contacts;
CREATE POLICY "Public suggest new emergency contact"
ON public.emergency_contacts
FOR INSERT
TO public
WITH CHECK (
  name IS NOT NULL 
  AND phone IS NOT NULL 
  AND is_approved = false -- Cannot self-approve!
);

-- Only service_role can update or delete emergency contacts
DROP POLICY IF EXISTS "Moderation update emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Service role update emergency contacts" ON public.emergency_contacts;
CREATE POLICY "Service role update emergency contacts"
ON public.emergency_contacts
FOR UPDATE
TO service_role
USING (true);

DROP POLICY IF EXISTS "Moderation delete emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Service role delete emergency contacts" ON public.emergency_contacts;
CREATE POLICY "Service role delete emergency contacts"
ON public.emergency_contacts
FOR DELETE
TO service_role
USING (true);

-- Insert default official contacts
INSERT INTO public.emergency_contacts (id, name, description, phone, category, is_24h, is_approved, is_official)
VALUES
  ('ddpm-hotline', 'สายด่วน ปภ. (กรมป้องกันและบรรเทาสาธารณภัย)', 'แจ้งเตือนสาธารณภัย อุทกภัย และขอความช่วยเหลือฉุกเฉินตลอด 24 ชั่วโมง ทั่วประเทศ', '1784', 'government', true, true, true),
  ('ems-hotline', 'สายด่วนกู้ชีพ-การแพทย์ฉุกเฉิน (EMS)', 'รับแจ้งเหตุเจ็บป่วยฉุกเฉิน อุบัติเหตุ และเรียกรถพยาบาลกู้ชีพตลอด 24 ชั่วโมง ทั่วประเทศ', '1669', 'hospital', true, true, true),
  ('highway-hotline', 'สายด่วนกรมทางหลวง', 'สอบถามเส้นทางน้ำท่วมและขอความช่วยเหลือบนทางหลวงทั่วประเทศ', '1586', 'government', true, true, true),
  ('rural-roads-hotline', 'สายด่วนกรมทางหลวงชนบท', 'สอบถามและแจ้งเหตุน้ำท่วมทางหลวงชนบท', '1146', 'government', true, true, true)
ON CONFLICT (id) DO NOTHING;
