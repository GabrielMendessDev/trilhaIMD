ALTER TABLE "RpgWallet" ADD COLUMN "settledDay" TEXT;

CREATE INDEX "RpgEvent_userId_createdAt_idx" ON "RpgEvent"("userId", "createdAt");
CREATE INDEX "CurrencyTransaction_userId_id_idx" ON "CurrencyTransaction"("userId", "id");
CREATE INDEX "ItemUsage_userId_id_idx" ON "ItemUsage"("userId", "id");

CREATE TABLE "LearningCatalogRevision" (
    id INTEGER PRIMARY KEY CHECK (id=1),
    version BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "LearningCatalogRevision" (id) VALUES (1);

CREATE FUNCTION bump_learning_catalog_revision() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE "LearningCatalogRevision" SET version=version+1 WHERE id=1;
    RETURN NULL;
END;
$$;

CREATE TRIGGER learning_trail_revision AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON "LearningTrail" FOR EACH STATEMENT EXECUTE FUNCTION bump_learning_catalog_revision();
CREATE TRIGGER trail_point_revision AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON "TrailPoint" FOR EACH STATEMENT EXECUTE FUNCTION bump_learning_catalog_revision();
CREATE TRIGGER point_content_revision AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON "TrailPointContent" FOR EACH STATEMENT EXECUTE FUNCTION bump_learning_catalog_revision();
CREATE TRIGGER learning_activity_revision AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON "LearningActivity" FOR EACH STATEMENT EXECUTE FUNCTION bump_learning_catalog_revision();
CREATE TRIGGER learning_entry_revision AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON "LearningEntry" FOR EACH STATEMENT EXECUTE FUNCTION bump_learning_catalog_revision();
