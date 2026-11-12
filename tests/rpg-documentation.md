# Registro documental da extensão RPG

Data: 11/11/2026. Direção: Operate, extensão do mundo visual existente. Revisão final em `tests/rpg-finish-review.md`: **disposition: ship** para as três correções pontuadas — semântica de raridade, composição compacta do prêmio e continuidade da resposta assistida salva.

## Escopo registrado

- `PRODUCT.md`: correção factual da ofensiva (resposta nova válida, conclusão válida ou verificação de material) e substituição da antiga indicação de resgates em preparação pelas capacidades RPG implementadas. Ranking e missões diárias continuam em preparação.
- `DESIGN.md`: extensão aditiva nas seções canônicas existentes, sem mudar o norte Mapa de estudo conectado, o roxo/Noite oficial, Sora, Plus Jakarta Sans, Bito, os dois temas ou os cinco acessos principais. Registra a semântica de raridades, medalhas e SVGs, layouts responsivos, diálogos nativos, ajuda persistida e movimento baseado em confirmação real.
- `.impeccable/design.json`: preserva entradas incumbentes e acrescenta metadados dos sete tokens de tinta documentados, sombras e movimento RPG, os limites responsivos locais e dois exemplos autossuficientes de componentes. Os valores primitivos permanecem no frontmatter; o sidecar traz extensões e exemplos com variáveis semânticas.
- `docs/rpg-economia.md` foi conferido e preservado: já descreve regras, valores, persistência, limitações de conteúdo e migração. Nenhuma implementação, teste executável, captura ou configuração foi alterada neste passe.

## Evidência conferida

Fonte: `src/styles/rpg.css`, semânticas de tema em `src/styles/globals.css`, `rpg-icon.tsx`, `rpg-hub.tsx`, `rpg-balances.tsx`, `lesson-bag.tsx`, `lesson-form.tsx`, `question-help.tsx` e `published-lesson.tsx`.

| Decisão registrada | Evidência local aberta em `.impeccable/review/` |
| --- | --- |
| Comum Menta, Incomum azul e Rara roxa; medalhas bloqueadas atenuadas | `rpg-desktop-achievements.png`, `rpg-desktop-inventory.png`, `rpg-mobile-lesson-bag.png` |
| Tintas semânticas legíveis no tema claro | `rpg-desktop-achievements-light.png` |
| Épica quente com contorno segmentado; Lendária dourada com brilho próprio | `rpg-desktop-epic.png`, `rpg-desktop-legendary.png` |
| Prêmio compacto com medalha ao lado do texto e ações acessíveis | `rpg-desktop-award.png`, `rpg-mobile-award.png` |
| Resposta salva mantém seleção, duas alternativas, dica, exemplo e resultado, sem repetir aviso de conquista | `rpg-desktop-saved-feedback.png` |

Os nove arquivos requeridos foram abertos diretamente. O código confirma os pares de azul Incomum, o mapeamento semântico das cinco raridades, o limite do prêmio, a restauração dos efeitos e o consumo da identidade do aviso. Os diagramas, tipografia, raio e navegação gerais permanecem incumbentes. Nenhum navegador ou detector novo foi executado.

## Verificação e preservação

A validação deste passe é documental: JSON válido; correspondência dos tokens novos com as fontes CSS; referências de componentes e oito seções canônicas conferidas; linhas de frontmatter, entradas e parágrafos incumbentes preservados; 233 arquivos fora da fronteira de escrita inalterados por comparação de hash. A regra de raridade no sidecar repete literalmente a regra do Markdown. Os oito exemplos de componentes anteriores permanecem intactos; os dois novos completam dez.

Validação funcional recebida do passe de implementação e conferida em `tests/rpg-audit.md`, sem reexecução neste registro: 19 casos em sete suítes (seis de aprendizagem, quatro de feedback, cinco de domínio RPG e um em cada suíte HTTP de aprendizagem, HTTP RPG, Chrome anterior e Chrome RPG). Inclui checkpoint/trilha/disciplina/importação legada no HTTP RPG e restauração de dica/lente/exemplo e tema claro no Chrome RPG. Typecheck, Prisma Validate, Biome nos 23 arquivos TypeScript/testes selecionados e build completo de produção passaram. O veredito visual citado limita sua aprovação às três correções pontuadas.

## Drift preservado

O `rpg-detector.json` existente contém **72 advisories e zero achados primários**. São avisos de valores locais de tipografia, raio, cor e outros tratamentos fora da escala documentada; não foram apagados nem promovidos em bloco a tokens compartilhados para silenciar o detector. A nova cor azul foi registrada por ser uma decisão explícita de raridade implementada e aprovada. As demais tintas acrescentadas já são semânticas usadas nos dois temas.

O sidecar incumbente também conserva divergências anteriores nos breakpoints: `home-two-columns` registra 520 px enquanto DESIGN.md descreve 620 px; `home-three-columns` registra 1200 px enquanto o catálogo descrito usa 1350 px. São dados preexistentes fora do escopo RPG, preservados para revisão própria. Não houve reparo amplo de drift, mudança de identidade ou canonização de avisos como regra global.
