-- Run this in Supabase SQL editor if you already created the table

ALTER TABLE whitelist_entries
ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';
