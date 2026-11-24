ALTER TABLE "MeExamAttempt" ADD COLUMN "unit" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "MeExamAttempt" ADD CONSTRAINT "MeExamAttempt_unit_check" CHECK ("unit" BETWEEN 1 AND 3);
CREATE INDEX "MeExamAttempt_userId_unit_createdAt_idx" ON "MeExamAttempt" ("userId", "unit", "createdAt");
