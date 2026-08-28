-- Run this in Supabase SQL editor to fix referral points

-- 1. Allow updates (if missing)
DROP POLICY IF EXISTS "Allow referral point updates" ON whitelist_entries;
CREATE POLICY "Allow referral point updates" ON whitelist_entries
  FOR UPDATE USING (true) WITH CHECK (true);

-- 2. Auto-add +50 points when someone signs up with a referral code
CREATE OR REPLACE FUNCTION add_referral_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by <> '' THEN
    UPDATE whitelist_entries
    SET points = points + 50
    WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_referral_signup ON whitelist_entries;
CREATE TRIGGER on_referral_signup
  AFTER INSERT ON whitelist_entries
  FOR EACH ROW
  EXECUTE FUNCTION add_referral_points();

-- 3. Fix @oshi_sol — already referred bonaapitite but points weren't awarded
UPDATE whitelist_entries
SET points = points + 50
WHERE referral_code = 'LUXORA-OSHI_S-D5UK'
  AND EXISTS (
    SELECT 1 FROM whitelist_entries
    WHERE referred_by = 'LUXORA-OSHI_S-D5UK'
  );
