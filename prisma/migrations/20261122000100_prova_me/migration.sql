CREATE TABLE "MeExamAttempt" (
 "id" TEXT PRIMARY KEY,
 "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
 "version" INTEGER NOT NULL DEFAULT 1,
 "questions" JSONB NOT NULL,
 "answers" JSONB NOT NULL DEFAULT '{}',
 "revision" INTEGER NOT NULL DEFAULT 0,
 "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "submittedAt" TIMESTAMPTZ(3),
 "score" INTEGER,
 CONSTRAINT "MeExamAttempt_score_check" CHECK ("score" IS NULL OR "score" BETWEEN 0 AND 20)
);
CREATE INDEX "MeExamAttempt_userId_createdAt_idx" ON "MeExamAttempt" ("userId", "createdAt");
