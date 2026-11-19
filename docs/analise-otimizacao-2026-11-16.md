# Análise de otimização — trilbit

Data: 16/11/2026. Responsável: Diego.

Implementação e validações posteriores: [otimizações implementadas](otimizacoes-implementadas.md). Este documento preserva a análise inicial.

O maior ganho potencial está no acesso aos dados do estudante: separar consultas pequenas de relatórios completos, eliminar leituras por lição e encurtar as operações da carteira. A interface já tem identidade definida, recursos locais leves e tratamento explícito de respostas e navegação.

Esta análise combina o grafo existente com leitura direta do código, verificações locais e duas capturas já existentes. Não houve alteração no código da aplicação, execução de migrações, teste de carga ou consulta ao banco de produção. Prioridade representa impacto esperado; ganhos em milissegundos ou bytes precisam de medição.

## Prioridades

| Prioridade | Oportunidade | Impacto esperado | Esforço relativo |
| --- | --- | --- | --- |
| P1 | Consultar recomendações em lote e separar missões diárias | Evitar que a página fique mais cara a cada lição estudada | Médio |
| P1 | Criar leitura resumida de RPG e reduzir reconciliações da carteira | Menos consultas e bloqueios no carregamento e na resposta | Médio |
| P1 | Tornar as verificações de qualidade utilizáveis | Permitir detectar regressões do código autoral | Pequeno/médio |
| P2 | Validar índices compostos para eventos e históricos | Reduzir leituras e ordenações conforme o histórico cresce | Pequeno, após EXPLAIN |
| P2 | Retirar o provedor global de tRPC sem consumidor nas rotas | Reduzir JavaScript e inicialização no cliente | Pequeno/médio |
| P2 | Consolidar tokens, cascata e escopo do CSS | Diminuir regressões de tema e custo de manutenção | Médio |
| P2 | Cachear catálogo e metadados publicados com invalidação | Reutilizar dados comuns entre requisições | Médio |

## 1. Recomendações e missões fazem trabalho demais

Evidências:

- `src/server/study-insights.ts:43`: percorre todas as linhas de progresso, com `await getLesson(point.id)` dentro do laço.
- `src/server/lesson.ts:162`: `getLesson` faz duas consultas sequenciais e carrega blocos, enunciados, mídia, payload, gabarito e conteúdo.
- `src/app/page.tsx:23`: a Home aguarda `getStudyInsights` antes de retornar sua árvore; mostra apenas duas recomendações em `src/app/page.tsx:47`.
- `src/app/missoes/page.tsx:13`: a página de missões chama o mesmo relatório completo, embora use suas metas diárias.

Para N lições distintas presentes no progresso e no catálogo, o laço pode executar 2N consultas de lição. Com 60 lições, isso representa até 120 consultas adicionais de conteúdo, além das consultas de progresso/RPG. É uma contagem derivada do código, não uma medição de produção.

Proposta: separar `getDailyMissions`, resumo de desempenho e recomendações. Buscar os metadados necessários de todas as lições em uma consulta por lote; carregar somente chave, tipo, assunto e título quando possível. Aplicar limite e prioridade das recomendações antes de montar conteúdo completo. Usar mapas por `pointId` para os cruzamentos em memória. Paralelizar as duas consultas independentes de uma lição ajuda sua latência, mas o lote resolve a multiplicação de consultas.

Validação: registrar quantidade de consultas e tempo de Home/Missões/Progresso com 0, 20 e 60 lições estudadas; a quantidade de consultas de metadados deve ficar limitada pelo desenho do lote.

## 2. Leitura de RPG e gravação estão acopladas

Evidências:

- `src/server/rpg.ts:313`: `readRpgState` chama `ensureRpg` e depois sete consultas, incluindo inventário, conquistas, 50 transações e 30 usos de item.
- `src/server/rpg.ts:254`: `ensureRpg` sempre abre transação, bloqueia a carteira e reconcilia proteção/calendário; o replay legado é condicional à inicialização.
- `src/server/learning.ts:52`: toda consulta de progresso agrega esse estado completo de RPG.
- `src/app/_components/dashboard.tsx:51`: o shell usa esse progresso em todas as suas páginas autenticadas.
- `src/server/lesson.ts:357` e `src/app/aprender/[modulo]/[etapa]/responder/route.ts:63`: o caminho de uma resposta solicita progresso/RPG antes da gravação e estado completo de RPG novamente para montar o saldo devolvido.

Proposta: criar uma projeção pequena de saldo/cosméticos/ofensiva para cabeçalho e resposta. Consultar inventário, histórico e conquistas detalhadas nas telas que usam esses dados. Separar inicialização de leitura e estabelecer uma reconciliação por mudança de dia/estado, preservando o comportamento de proteção de ofensiva. Manter bloqueio e idempotência nas mutações financeiras; devolver o resumo atualizado da operação quando viável.

O `cache` de React já ajuda a compartilhar leituras durante a renderização de Server Components. Ele é invalidado a cada requisição e não fornece cache compartilhado entre usuários ou requisições. Assim, várias chamadas vistas nos componentes não significam automaticamente consultas duplicadas na mesma renderização. Referência: [React cache](https://react.dev/reference/react/cache).

Validação: medir consultas por resposta e tempo com a carteira bloqueada. Conferir repetição de requisições, duas abas, compra concorrente, conclusão com XP único e virada do dia em São Paulo.

## 3. O comando de qualidade mistura produto e artefatos

Resultados executados nesta análise:

- `npm run typecheck`: passou.
- Seis arquivos de testes locais: 32 testes passaram, zero falhas.
- `npm run check -- --max-diagnostics=5`: falhou; 440 arquivos, 602 erros, 354 avisos e 37 informações. A saída inclui relatórios de `.impeccable/review` e arquivos Prisma gerados.
- `biome check src --reporter=summary`: falhou; 107 arquivos, dois erros de formatação e 155 avisos. Os dois arquivos são `src/app/_components/sidebar-motion.tsx` e `src/server/elementar-material-checks.json`.
- Em `src`, 151 avisos são de especificidade CSS, três de `!important` e um de cookie no seletor de tema. O cookie deve ser avaliado pelo seu uso legítimo, sem classificar automaticamente como falha de segurança.

Não foi encontrado workflow em `.github` neste checkout. Isso não permite concluir que inexista um pipeline externo.

Proposta: configurar exclusões explícitas por ferramenta para clientes gerados, caches e relatórios; manter código, scripts e testes autorais sob verificação. Corrigir a pequena base de erros reais, criar um comando agregador e integrar typecheck, lint, testes e build ao pipeline usado pela equipe. Testes HTTP/browser precisam de banco e servidor de teste isolados.

O grafo também está dominado por código gerado: 6.661 dos 7.859 nós, aproximadamente 84,8%, vêm de `generated/`; 405 vêm de `src/`. Um perfil de análise focado em código autoral tornaria as perguntas de arquitetura mais úteis. O tamanho do Prisma no disco mede custo de repositório/ferramentas; o ganho no navegador deve ser medido no bundle.

## 4. Índices devem acompanhar os filtros reais

Evidências:

- `src/server/study-insights.ts:20` filtra `RpgEvent` por usuário e intervalo de `createdAt`.
- `src/server/rpg.ts:346` e `src/server/rpg.ts:356` filtram históricos por usuário e ordenam por `id DESC` com limite.
- `prisma/schema.prisma:209`, `:219` e `:246`, e as migrações disponíveis, definem unicidade por usuário/chave ou usuário/requestId; não definem os índices compostos correspondentes a esses filtros/ordenações.

Candidatos: `RpgEvent(userId, createdAt)`, `CurrencyTransaction(userId, id)` e `ItemUsage(userId, id)`. Os índices existentes já permitem alguns acessos por usuário; o ganho do novo índice depende do plano e do volume. Confirmar com `EXPLAIN (ANALYZE, BUFFERS)` em base representativa antes de criar migração. Considerar também o custo adicional de escrita.

Referência técnica: [índices multicoluna no PostgreSQL](https://www.postgresql.org/docs/current/indexes-multicolumn.html).

## 5. Há infraestrutura de exemplo no caminho global do cliente

Evidências:

- `src/app/layout.tsx:25` monta `TRPCReactProvider` para todas as rotas.
- `src/trpc/react.tsx:3` importa React Query, cliente tRPC e SuperJSON e inicializa seus providers.
- O único consumidor de `api.post` encontrado é `src/app/_components/post.tsx:8`, que exporta `LatestPost`; não foi encontrada importação desse componente nas rotas.
- `src/server/api/root.ts:9` contém apenas o router de exemplo `post`.

Proposta: retirar o provider global se o inventário de consumidores continuar vazio, ou limitá-lo ao segmento que realmente use tRPC. Avaliar a remoção do scaffold de posts separadamente; nenhuma exclusão de tabela é necessária para reduzir o cliente global.

Validação: comparar JavaScript transferido e hidratação de uma rota real em build de produção; repetir login, navegação e respostas. Não foi medido um ganho em KB nesta análise.

## 6. CSS precisa de uma fonte clara para tokens e responsabilidades

Evidências:

- `src/styles/globals.css:1` importa globalmente os estilos de feedback, movimento, aprendizagem, RPG e experiência.
- `src/styles/experience.css:1` e `src/styles/globals.css:38` redefinem os mesmos tokens de raio/sombra; o mesmo ocorre no tema escuro em `:9` e `:77`.
- `experience.css` tem aproximadamente 53,7 KB e concentra 131 dos avisos de especificidade do lint. O tamanho é sem compressão.
- `DESIGN.md` já documenta os valores efetivos da cascata, portanto o resultado visual atual deve orientar uma consolidação.

Proposta: centralizar tokens e temas, remover declarações sobrescritas após conferir equivalência e dividir estilos de telas por responsabilidade. Avaliar escopo por rota para estilos específicos de loja, inventário e lição. Fazer uma comparação visual limitada em desktop/celular e temas claro/escuro após as mudanças.

O detector Impeccable retornou 348 sinalizações: 338 são sugestões de alinhamento com o design system; as dez restantes se referem a fonte, bordas e easing. Não representam 348 defeitos confirmados. Plus Jakarta Sans e o relevo das ações pertencem à identidade documentada; não justificam troca automática. O ponto verificável é a duplicação/cascata e a manutenção de tokens.

Não foi atribuída nota de acessibilidade ou responsividade: foram vistas duas capturas existentes, não um teste interativo atual. As capturas mostram identidade coerente e leitor adaptado ao celular; o diagrama móvel merece avaliação de ampliação para facilitar a leitura das marcações.

## 7. Catálogo publicado pode ter cache entre requisições

`getPublishedPoints` e `getLesson` usam memoização de React. O catálogo comum muda bem menos que respostas e saldo, mas é relido em novas requisições.

Proposta: guardar catálogo e metadados publicados com chave/versionamento e invalidação explícita após importação/publicação. Aplicar primeiro ao catálogo de publicação e aos metadados de recomendação. Manter correção de respostas e conteúdo versionados de maneira consistente com a transação de publicação e com a rodada salva.

Para o Next 15 declarado pelo projeto, avaliar o mecanismo de cache de dados compatível com essa versão. A [documentação de unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) descreve reutilização de consultas entre requisições, mas a documentação atual também cobre Next 16; não copiar automaticamente uma migração de versão para este projeto.

## O que preservar

- Domínio de progresso e vidas separado de componentes, com testes de regras.
- Correção no servidor, gabarito fora dos modelos públicos e validação do conteúdo.
- Idempotência, unicidade de recompensa e bloqueio financeiro nas mutações.
- Feedback de resposta já montado no cliente e preservação da escolha em falhas.
- Fontes locais com `font-display: swap`, Bito em WebP de cerca de 40 KB e preferência por movimento reduzido.
- Leitor independente e conteúdo gerados da mesma base. Seu HTML de aproximadamente 682 KB contém o curso completo e atende ao uso offline; particionar esse arquivo exigiria preservar essa capacidade.

## Sequência de execução proposta

1. Limpar escopo das verificações e registrar uma linha de base de consultas/latência.
2. Separar missões diárias e buscar recomendações/metadados em lote.
3. Introduzir resumo de RPG e reduzir reconciliação/bloqueios nas leituras.
4. Confirmar índices com planos reais e medir cache do catálogo.
5. Retirar provider de exemplo e comparar bundle de produção.
6. Consolidar CSS; usar `impeccable optimize` na rodada de desempenho e `impeccable polish` ao finalizar as mudanças visuais.

Métricas de aceite: consultas por rota/ação, p50/p95 do servidor, duração de bloqueio de carteira, JavaScript transferido, LCP/INP/CLS e preservação das regras de XP, vidas e itens. Evitar estimativas percentuais de ganho antes dessas medições.
