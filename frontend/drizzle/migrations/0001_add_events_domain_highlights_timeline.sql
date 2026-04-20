ALTER TABLE events
  ADD COLUMN IF NOT EXISTS domain text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS highlights text,
  ADD COLUMN IF NOT EXISTS timeline text;
