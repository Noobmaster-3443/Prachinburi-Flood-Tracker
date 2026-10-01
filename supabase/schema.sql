-- =========================================================================
-- Prachinburi Flood Tracker (ระบบรายงานสถานการณ์น้ำท่วมจังหวัดปราจีนบุรี)
-- Supabase Database Schema & Storage Configuration
-- =========================================================================

-- 1. Create enum for severity levels
CREATE TYPE flood_severity AS ENUM ('green', 'yellow', 'orange', 'red');

-- 2. Create flood_reports table
CREATE TABLE IF NOT EXISTS public.flood_reports (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
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

-- 3. Indexes for fast geospatial and filter queries
CREATE INDEX IF NOT EXISTS idx_flood_reports_district ON public.flood_reports(district);
CREATE INDEX IF NOT EXISTS idx_flood_reports_severity ON public.flood_reports(severity);
CREATE INDEX IF NOT EXISTS idx_flood_reports_created_at ON public.flood_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flood_reports_coordinates ON public.flood_reports(latitude, longitude);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.flood_reports ENABLE ROW LEVEL SECURITY;

-- 4.1 Policy: Everyone can read reports
CREATE POLICY "Public read access for flood reports"
ON public.flood_reports
FOR SELECT
TO public
USING (true);

-- 4.2 Policy: Anonymous community submissions allowed
CREATE POLICY "Anonymous community reporting allowed"
ON public.flood_reports
FOR INSERT
TO public
WITH CHECK (
  latitude IS NOT NULL 
  AND longitude IS NOT NULL 
  AND district IS NOT NULL 
  AND location_name IS NOT NULL
);

-- 4.3 Policy: Allow deletion of reports by public/admins
CREATE POLICY "Allow moderation deletion of reports"
ON public.flood_reports
FOR DELETE
TO public
USING (true);

-- 4.4 Policy: Allow updating verified status
CREATE POLICY "Allow moderation update of reports"
ON public.flood_reports
FOR UPDATE
TO public
USING (true);

-- 5. Atomic Upvote RPC Function
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
-- Create storage bucket for compressed images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('flood-images', 'flood-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can view images
CREATE POLICY "Public can view flood images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'flood-images');

-- Storage Policy: Anyone can upload compressed photos
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
  district VARCHAR(100),
  category VARCHAR(50) DEFAULT 'rescue',
  is_24h BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT false,
  submitted_by VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Public can read approved contacts
CREATE POLICY "Public read approved emergency contacts"
ON public.emergency_contacts
FOR SELECT
TO public
USING (is_approved = true);

-- Public can suggest new contact (starts as pending is_approved = false)
CREATE POLICY "Public suggest new emergency contact"
ON public.emergency_contacts
FOR INSERT
TO public
WITH CHECK (name IS NOT NULL AND phone IS NOT NULL);

-- Moderation can update and delete
CREATE POLICY "Moderation update emergency contacts"
ON public.emergency_contacts
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Moderation delete emergency contacts"
ON public.emergency_contacts
FOR DELETE
TO public
USING (true);

-- Insert default official contacts
INSERT INTO public.emergency_contacts (id, name, description, phone, category, is_24h, is_approved, is_official)
VALUES
  ('ddpm-hotline', 'สายด่วน ปภ. (กรมป้องกันและบรรเทาสาธารณภัย)', 'แจ้งเตือนสาธารณภัย อุทกภัย และขอความช่วยเหลือฉุกเฉินตลอด 24 ชั่วโมง', '1784', 'government', true, true, true),
  ('ems-hotline', 'สายด่วนกู้ชีพ-การแพทย์ฉุกเฉิน (EMS)', 'รับแจ้งเหตุเจ็บป่วยฉุกเฉิน อุบัติเหตุ และเรียกรถพยาบาลกู้ชีพตลอด 24 ชั่วโมง', '1669', 'hospital', true, true, true)
ON CONFLICT (id) DO NOTHING;
