BEGIN;

ALTER TABLE "LearningPointProgress"
    ADD COLUMN "attempts" JSONB NOT NULL DEFAULT '{}'::JSONB,
    ADD CONSTRAINT "LearningPointProgress_attempts_object" CHECK (jsonb_typeof("attempts") = 'object');

ALTER TABLE "LearningEntry"
    ADD COLUMN "position" INTEGER CHECK ("position" > 0);

COMMIT;
