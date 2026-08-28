-- Run this in the Supabase SQL editor

CREATE TABLE whitelist_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  twitter VARCHAR(100) NOT NULL UNIQUE,
  wallet VARCHAR(100) NOT NULL UNIQUE,
  reply_link TEXT NOT NULL,
  points INTEGER DEFAULT 100,
  referral_code VARCHAR(20) UNIQUE,
  referred_by VARCHAR(20),
  password_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE whitelist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON whitelist_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON whitelist_entries
  FOR SELECT USING (true);

-- Required for client-side referral point updates
CREATE POLICY "Allow referral point updates" ON whitelist_entries
  FOR UPDATE USING (true) WITH CHECK (true);
