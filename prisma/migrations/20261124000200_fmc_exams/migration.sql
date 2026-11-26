ALTER TABLE "MeExamAttempt" ADD COLUMN "trail" TEXT NOT NULL DEFAULT 'elementar';
ALTER TABLE "MeExamAttempt" ADD CONSTRAINT "MeExamAttempt_trail_check" CHECK ("trail" IN ('elementar','fmc'));
CREATE INDEX "MeExamAttempt_userId_trail_unit_createdAt_idx" ON "MeExamAttempt" ("userId", "trail", "unit", "createdAt");
