-- Remove email column and constraint
ALTER TABLE guests DROP CONSTRAINT guests_email_key;
ALTER TABLE guests DROP COLUMN email;

-- Add companions column
ALTER TABLE guests ADD COLUMN companions INTEGER NOT NULL DEFAULT 0;

-- Update status column to use new values
ALTER TABLE guests 
  ALTER COLUMN status TYPE VARCHAR(20),
  ALTER COLUMN status SET DEFAULT 'pending',
  ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'attending', 'not_attending')); 