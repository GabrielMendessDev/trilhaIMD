CREATE TABLE "AnalyticsSession" (
    "id" UUID NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMPTZ(3) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "activeMs" INTEGER NOT NULL,
    "screen" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "viewport" TEXT NOT NULL,
    CONSTRAINT "AnalyticsSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AnalyticsSession_startedAt_idx" ON "AnalyticsSession" ("startedAt");

CREATE TABLE "AnalyticsDaily" (
    "day" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "total" BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT "AnalyticsDaily_pkey" PRIMARY KEY ("day", "kind", "label")
);
