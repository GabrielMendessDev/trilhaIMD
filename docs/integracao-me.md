# Integração de ME — 23/11/2026

Base: `origin/main` em `2edc811`. Integra as melhorias de `feat/revisao-me-e-ambiente-local` sem substituir a reescrita atual de 60 etapas.

- Preserva as 60 etapas, autoria, leitor, vidas, auxílio de itens, carteira, loja, mochila, missões, conquistas e telas atuais.
- A Unidade 1 corresponde às etapas 1–20 do manifesto. A prova de 20 questões foi ajustada para conjuntos, reais, intervalos, potências, radicais, logaritmos, sistemas, equações e inequações. Polinômios continuam na Unidade 2; os antigos arquivos 04 e 09 não substituem o conteúdo novo.
- A liberação da prova depende de todas as 20 etapas concluídas, inclusive nas requisições diretas. As novas tentativas usam versão 2. Tentativas existentes conservam os snapshots da versão original, sem recalcular notas antigas.
- As sessões oferecem pausas a cada seis telas na primeira rodada, sem alterar vidas, tentativas, identificadores, auxílios ou XP. A revisão e a releitura não exigem essas pausas.
- Preserva o carregamento e as transições atuais da equipe; acrescenta seleção suave nas alternativas da prova e entrada das pausas, respeitando movimento reduzido. Não adiciona uma segunda animação global sobre a implementação existente.
- Preserva as correções de dependências da branch anterior. O esquema de conteúdo usa a assinatura de `z.record` compatível com Zod 4.
- Login local de desenvolvimento é opcional (`TRILBIT_LOCAL_LOGIN=true`), exige origem e banco locais e fica desativado em produção. Não libera atividades ou provas antecipadamente.

## Preparação

Execute `npm ci` e `npm run db:migrate`. Em um banco novo, publique o catálogo com `npm run conteudo:publicar:elementar`; em bancos com dados, consulte as regras de migração do catálogo em `conteudos/elementar/README.md` antes da publicação. Nunca substitua ou restaure o banco para testar a integração.

Os testes desta integração devem usar um banco separado e uma origem local em `TRILBIT_TEST_URL`. Na entrega de 23/11, as provas das unidades 2 e 3 e o desafio final opcional estavam em preparação. Em 24/11, as Provas 2 e 3 foram implementadas, conforme [provas-me.md](provas-me.md); o desafio final opcional separado permanece em preparação.

## Verificação executada

- `npm ci`: nenhuma vulnerabilidade reportada.
- As oito migrações foram aplicadas a `trilbit_integracao`, banco separado, e as 60 etapas foram publicadas nele.
- `npm run verify`: checagem sem erros (avisos preexistentes de estilo permanecem), tipos, 37 testes e validação das 60 etapas passaram.
- Build de produção passou. O endpoint de login local retornou 404 em produção, mesmo com o sinalizador local ativo.
- Testes HTTP da prova passaram: bloqueio antes da etapa 20, liberação após as 20 conclusões, isolamento entre usuários, salvamento, revisões concorrentes, entrega e novas tentativas.
- Teste visual da prova passou em desktop/celular e movimento reduzido; as pausas entre sessões também foram verificadas.
- Teste visual atual da equipe passou para leitor, mapa, vidas, perda, recomeço, revisão e loja.
- Teste transacional da economia passou no build de produção local, incluindo preservação de XP e proteção de ofensiva. O teste foi atualizado para as variantes disponíveis, a verificação atual de material, o cache diário e o encerramento da trilha na etapa 60. As regras do produto não foram flexibilizadas para fazê-lo passar.

Validação local, em navegador emulado; não substitui revisão pedagógica das 600 questões ou teste em aparelhos físicos.
