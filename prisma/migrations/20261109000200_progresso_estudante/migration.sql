BEGIN;

ALTER TABLE "TrailPoint" ADD COLUMN "xpReward" INTEGER NOT NULL DEFAULT 10
    CHECK ("xpReward" >= 0);

CREATE TABLE "LearningPointProgress" (
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "pointId" INTEGER NOT NULL REFERENCES "TrailPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "completedEntries" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "completedAt" TIMESTAMPTZ(3),
    "xp" INTEGER NOT NULL DEFAULT 0 CHECK ("xp" >= 0),
    "correctAnswers" INTEGER NOT NULL DEFAULT 0 CHECK ("correctAnswers" >= 0),
    PRIMARY KEY ("userId", "pointId")
);
CREATE INDEX "LearningPointProgress_pointId_idx" ON "LearningPointProgress"("pointId");

COMMIT;
