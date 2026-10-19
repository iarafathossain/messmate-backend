-- Existing deposits were backfilled from their creation date before this migration.
ALTER TABLE "deposits" ALTER COLUMN "depositDate" SET NOT NULL;
