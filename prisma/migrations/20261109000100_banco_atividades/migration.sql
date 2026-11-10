BEGIN;

-- CreateEnum
CREATE TYPE "LearningEntryMode" AS ENUM ('CONTENT', 'QUESTION', 'MIXED');

-- CreateEnum
CREATE TYPE "LearningQuestionType" AS ENUM ('MULTIPLE_CHOICE', 'ASSOCIATION', 'PAIR_LINKS', 'WALKTHROUGH');

-- CreateTable
CREATE TABLE "LearningTrail" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LearningTrail_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "TrailPoint" (
    "id" SERIAL NOT NULL,
    "trailSlug" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "TrailPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailPointContent" (
    "pointId" INTEGER NOT NULL,
    "blocks" JSONB NOT NULL,
    "summary" TEXT,

    CONSTRAINT "TrailPointContent_pkey" PRIMARY KEY ("pointId")
);

-- CreateTable
CREATE TABLE "LearningActivity" (
    "id" SERIAL NOT NULL,
    "pointId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "LearningActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningEntry" (
    "activityId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "mode" "LearningEntryMode" NOT NULL,
    "type" "LearningQuestionType",
    "prompt" TEXT,
    "media" JSONB,
    "payload" JSONB,
    "answer" JSONB,
    "content" JSONB,

    CONSTRAINT "LearningEntry_pkey" PRIMARY KEY ("activityId","number")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrailPoint_trailSlug_number_key" ON "TrailPoint"("trailSlug", "number");

-- CreateIndex
CREATE UNIQUE INDEX "LearningActivity_pointId_slug_key" ON "LearningActivity"("pointId", "slug");

-- AddForeignKey
ALTER TABLE "TrailPoint" ADD CONSTRAINT "TrailPoint_trailSlug_fkey" FOREIGN KEY ("trailSlug") REFERENCES "LearningTrail"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailPointContent" ADD CONSTRAINT "TrailPointContent_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "TrailPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivity" ADD CONSTRAINT "LearningActivity_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "TrailPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningEntry" ADD CONSTRAINT "LearningEntry_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "LearningActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TrailPoint" ADD CONSTRAINT "TrailPoint_number_positive" CHECK ("number" > 0);
ALTER TABLE "TrailPointContent" ADD CONSTRAINT "TrailPointContent_blocks_array"
    CHECK (jsonb_typeof("blocks") = 'array');

ALTER TABLE "LearningEntry"
    ADD CONSTRAINT "LearningEntry_number_positive" CHECK ("number" > 0),
    ADD CONSTRAINT "LearningEntry_matches_mode" CHECK (
        (("mode" IN ('CONTENT', 'MIXED')) = ("content" IS NOT NULL))
        AND (("mode" IN ('QUESTION', 'MIXED')) = ("type" IS NOT NULL))
        AND (("type" IS NOT NULL) = ("prompt" IS NOT NULL))
        AND (("type" IS NOT NULL) = ("payload" IS NOT NULL))
        AND ("type" IS NOT NULL OR "media" IS NULL)
        AND (("type" IS NOT NULL AND "type" <> 'WALKTHROUGH') = ("answer" IS NOT NULL))
    );

-- A verificação no commit permite inserir a atividade e suas questões juntas.
CREATE FUNCTION check_learning_activity_minimum() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
    activity_id integer;
BEGIN
    IF TG_TABLE_NAME = 'LearningActivity' THEN
        activity_id := NEW."id";
    ELSE
        IF OLD."mode" = 'CONTENT' THEN
            RETURN NULL;
        END IF;
        IF TG_OP = 'UPDATE'
            AND OLD."activityId" = NEW."activityId"
            AND NEW."mode" <> 'CONTENT' THEN
            RETURN NULL;
        END IF;
        activity_id := OLD."activityId";
    END IF;

    -- Serializa verificações concorrentes da mesma atividade. Em snapshot
    -- isolation uma escrita concorrente na linha causa erro de serialização.
    UPDATE "LearningActivity" SET "title" = "title" WHERE "id" = activity_id;
    IF FOUND AND (
        SELECT count(*) FROM "LearningEntry"
        WHERE "activityId" = activity_id AND "mode" IN ('QUESTION', 'MIXED')
    ) < 10 THEN
        RAISE EXCEPTION 'A atividade % precisa de pelo menos 10 questões respondíveis', activity_id
            USING ERRCODE = '23514', CONSTRAINT = 'LearningActivity_minimum_questions';
    END IF;
    RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "LearningActivity_minimum_on_insert"
    AFTER INSERT ON "LearningActivity"
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION check_learning_activity_minimum();

CREATE CONSTRAINT TRIGGER "LearningActivity_minimum_on_entry_change"
    AFTER DELETE OR UPDATE OF "activityId", "mode" ON "LearningEntry"
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION check_learning_activity_minimum();

INSERT INTO "LearningTrail" ("slug", "name") VALUES
    ('elementar', 'Matemática Elementar'),
    ('combinatoria', 'Análise Combinatória'),
    ('calculo', 'Cálculo 1'),
    ('fmc', 'Fundamentos de Matemática para Computação (FMC 1)'),
    ('vga', 'Vetores e Geometria Analítica 1');

INSERT INTO "TrailPoint" ("trailSlug", "number")
SELECT "slug", point_number
FROM "LearningTrail"
CROSS JOIN generate_series(1, 10) AS point_number;

COMMIT;
