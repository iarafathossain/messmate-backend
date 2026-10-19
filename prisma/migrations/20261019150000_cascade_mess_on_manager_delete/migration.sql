ALTER TABLE "messes"
DROP CONSTRAINT "messes_managerId_fkey";

ALTER TABLE "messes"
ADD CONSTRAINT "messes_managerId_fkey"
FOREIGN KEY ("managerId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
