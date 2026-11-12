# Redesign global — verificação

Escopo autorizado: Home, trilhas/mapas, disciplinas/capítulos, lições, explicações, questões, revisão, conclusão, progresso, missões, conquistas, loja, mochila, perfil, autenticação e estados auxiliares. Direção e critérios em `.impeccable/surfaces/global-learning.md`.

## Evidência visual

Capturas do fluxo real em `.impeccable/review/global-*.png`, desktop 1440×1000 e celular 390×844. As capturas são da área visível; conteúdo abaixo da dobra permanece acessível por rolagem. O teste global verifica também larguras de 320,768,1024 e1920px nas onze rotas principais. O resultado por rota/largura fica em `global-layout-checks.json`. Temas claro/escuro, diagramas interativos, correção inicial, revisão, recuperação, conclusão, Google e404 possuem evidência própria.

A conta das capturas é temporária e explicitamente identificada como conta de teste. A primeira lição é uma fixture persistida; as recompensas são calculadas pelo motor real. A compra é uma transação real com os Bits concedidos. As respostas da segunda lição passam pela API real e a escolha errada/recuperação passam pela interface. As suítes HTTP exercitam separadamente a progressão completa da primeira lição e os casos de integridade.

## Avaliação própria em lote

Primeira avaliação: botão contextual do mapa com texto da mesma cor do fundo; barra de XP com altura zero no perfil mobile; regras antigas de fundo sobrepondo a composição; margem lógica da barra lateral ainda reservada nas lições; cabeçalho de lição transparente durante a rolagem. Correções reunidas em um lote. Conteúdo adicional do exemplo de conjuntos foi organizado em expansão nativa, preservando todos os blocos.

O primeiro ensaio de confirmação foi interrompido pelo reinício automático do servidor de desenvolvimento por limite de memória. O build de produção foi gerado em diretório isolado e passou a servir a confirmação e as regressões. Esse ensaio interrompido não é apresentado como teste aprovado.

## Detector

Executado uma vez para este redesign, alvo `src/app`; resultado bruto em `.impeccable/review/global-detector.json`. Foram86 avisos consultivos:42 cores,35 tamanhos de fonte e9 raios em cinco módulos CSS existentes. Não houve achados de severidade superior a consultivo. O resultado é apoio à revisão e não substitui verificação visual ou medição de contraste. O novo sistema global usa derivações intencionais da paleta oficial; o documentador atualizará os tokens autorizados.

## Preservação funcional

Sem mudança na autenticação Google, nas tabelas/migração RPG, nos valores das recompensas ou na correção no servidor. Permanecem seleção com envio automático, duas tentativas, revisão final dos erros, consumo transacional de itens, limites de compra, elegibilidade de auxílios, progressão sequencial e retorno manual ao mapa. Revisitas consultam o conteúdo/feedback salvo e não concedem terceira tentativa ou novas recompensas.

Missões leem eventos e crédito diário existentes. Precisão mede o primeiro envio de cada questão; uma resposta assistida correta continua correta pedagogicamente, mas as regras RPG mantêm sua elegibilidade própria. Recomendações apontam para os erros, pulos e recuperações registrados. O gráfico semanal usa conclusões salvas. Ranking continua claramente em preparação; trilhas sem lições publicadas não recebem progresso ou conteúdo fictício.

## Validação final

Concluída em12/11/2026. Build de produção e `npm run typecheck` aprovados. Foram20 testes aprovados em oito arquivos:15 unitários (aprendizagem, feedback e RPG), integração HTTP de aprendizagem, integração HTTP de RPG, Chrome de feedback, Chrome de RPG e Chrome global. As suítes de integração foram executadas sequencialmente no build isolado, com banco e contas temporárias locais. O Chrome de feedback passou sem pausas de captura entre os cliques; o Chrome global gerou as capturas finais.

A regressão de navegação foi resolvida com atualização do histórico sem marcadores internos do Next, sincronização dos parâmetros antes de exibir a continuidade, próximo item explícito calculado pelo servidor e encerramento do carregamento no commit. A ponte de snapshots que aguardava a renderização foi retirada: saída WAAPI e entrada CSS animam o conteúdo real sem segurar o avanço. O teste verifica a entrada efetivamente executada pelo navegador. O teste de navegação entre páginas usa o destino visível Progresso, e o acesso ao ranking em preparação permanece no menu da conta. A medição de alinhamento da mochila considera a largura de layout sem a barra de rolagem.

Revisão independente: `tests/global-finish-review.md`. Os quatro itens materiais foram avaliados como resolved no veredito `ship`: contraste da ação contextual, fundo neutro da Home, separação de Bito/textos e persistência documental. Esse veredito cobre a lista de correções, sem certificação independente das suítes ou das animações. A primeira revisão e seus limites permanecem no arquivo.

Medições do Chrome em `global-fix-checks.json`:8,93:1 no tema escuro e8,35:1 no claro para o CTA do mapa; nenhuma sobreposição do Bito com título, descrição ou ações nas larguras1024/1440/1920px. Os55pares rota/largura do teste global passaram sem transbordamento. Foram abertos os cinco arquivos de recaptura exigidos para o veredito; as38capturas da avaliação original também foram abertas e validadas.

Documentadores independentes atualizaram PRODUCT.md, DESIGN.md e o sidecar JSONv2, incluindo o ajuste final de navegação. A deriva anterior de cascata está registrada sem reparo amplo. O detector não foi repetido. A verificação de proveniência de `public/brand` encontrou1raster e0metadados ausentes; nenhum raster foi criado ou substituído. As seis contas temporárias remanescentes de ensaios interrompidos foram removidas, restando zero fixtures dos prefixos/UUIDs reservados aos testes. Capturas e relatórios foram preservados.
