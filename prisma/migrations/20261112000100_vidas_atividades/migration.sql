ALTER TABLE "LearningTrail" ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "LearningPointProgress"
    ADD COLUMN "lives" INTEGER NOT NULL DEFAULT 5,
    ADD COLUMN "run" INTEGER NOT NULL DEFAULT 1,
    ADD CONSTRAINT "LearningPointProgress_lives_range" CHECK ("lives" BETWEEN 0 AND 5),
    ADD CONSTRAINT "LearningPointProgress_run_positive" CHECK ("run" > 0);

-- Progressos anteriores começam com cinco vidas, sem perda retroativa.
-- Histórico de uma rodada perdida fica em RpgEvent antes de um recomeço.

INSERT INTO "ShopItem" (id, definition) VALUES
('life-drop','{"id":"life-drop","name":"Gota de Vida","price":25,"rarity":"common","category":"consumiveis","kind":"consumable","max":20,"description":"Repõe 1 vida durante a rodada normal de uma atividade em andamento. Limite de 5 vidas; não revive uma atividade perdida."}'::jsonb),
('life-potion','{"id":"life-potion","name":"Poção de Vida","price":65,"rarity":"uncommon","category":"consumiveis","kind":"consumable","max":20,"description":"Repõe até 3 vidas na rodada normal, sem ultrapassar 5. Use antes de as vidas acabarem; não é necessária na revisão."}'::jsonb),
('life-elixir','{"id":"life-elixir","name":"Elixir de Fôlego","price":95,"rarity":"rare","category":"consumiveis","kind":"consumable","max":20,"description":"Completa as vidas de uma atividade em andamento até 5. Não apaga erros ou dá acertos e não revive atividade perdida."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET definition=EXCLUDED.definition;
