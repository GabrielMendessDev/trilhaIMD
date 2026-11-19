---
type: "query"
date: "2026-11-16T17:41:31.718384+00:00"
question: "quero que você analise o projeto: o que podemos otimizar?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["getStudyInsights", "getLesson", "readRpgState", "getLearningProgress", "TRPCReactProvider"]
---

# Q: quero que você analise o projeto: o que podemos otimizar?

## Answer

Expanded from graph vocabulary: learning progress lesson rpg state answer published transaction content trails insights. Verified directly in source: getStudyInsights awaits getLesson for each progress row; getLesson issues two sequential queries. Home and daily missions await full insights. readRpgState calls ensureRpg with wallet lock then seven queries; answer route reads full RPG before and after mutation. Candidate composite indexes: RpgEvent(userId,createdAt), CurrencyTransaction(userId,id), ItemUsage(userId,id), subject to EXPLAIN. Global TRPCReactProvider has only an unused LatestPost example consumer. CSS tokens are repeated across globals.css and experience.css. Typecheck passed and 32 local tests passed; repo Biome failed with 602 errors, src-only has two formatting errors and 155 warnings. Report: docs/analise-otimizacao-2026-11-16.md. No application changes; runtime gains unmeasured.

## Outcome

- Signal: useful

## Source Nodes

- getStudyInsights
- getLesson
- readRpgState
- getLearningProgress
- TRPCReactProvider