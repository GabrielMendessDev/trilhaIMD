# Validação do movimento do Trilbit

Verificação de 11/11/2026 em servidor local com PostgreSQL e contas descartáveis. O trabalho preserva a identidade de `DESIGN.md` e reformula o movimento conectado aos estados reais da aprendizagem.

## Comportamento implementado

- Navegações não exibem frases soltas de carregamento. O conteúdo real entra com fade de 340 ms e intervalos de 35 ms entre grupos, limitados a três intervalos; durações CSS em segundos são convertidas antes de usar Web Animations.
- A ação principal do resumo de conclusão é Voltar ao mapa, com a etapa liberada selecionada. A próxima lição depende de escolha no percurso.

- Questões enviam a resposta ao selecionar, sem botão Verificar ou Registrar. Associações e ligações só enviam ao completar a resposta. Teoria e roteiros conservam Continuar.
- Botões têm contorno visível e brilho por variante. Questão e conteúdo recebem borda em gradiente, profundidade local, título mais presente e glifo neutro.

- A seleção comprime a alternativa e produz uma onda a partir do ponto de interação. A validação conserva o mesmo elemento e a escolha marcada; somente a resposta real aplica Menta/check ou Coral/X.
- O painel integrado expande abaixo das alternativas. O primeiro erro mostra orientação sem solução; a segunda tentativa encerra a questão. Continuar permanece uma ação manual.
- SVG desenhado, anel, seis partículas locais no acerto e pulso do card formam uma sequência curta. O erro tem uma oscilação lateral de 3 px, sem flashes.
- As transições distinguem avanço, volta, explicação, exercício, revisão e resultado. O carregamento começa sem aguardar a duração visual. Navegações novas encerram a transição anterior.
- Fórmulas são reveladas como expressões completas; conjuntos, diagramas e reta numérica entram por camadas. A interação de exploração continua disponível.
- O mapa confirma o nó concluído, desenha sua conexão e destaca o próximo nó disponível. Nós bloqueados mantêm sua informação de pré-requisito.
- A conclusão revela medalha/anel, desempenho, categorias, XP persistido e ações. Recarregar conserva os valores sem repetir a celebração no mesmo navegador.
- Header distingue atualizações reais de XP e ofensiva. Sidebar compartilha um indicador de seleção e o Bito tem repouso limitado e discreto. O menu da conta usa transições progressivas quando suportadas.

## Sistema e execução

`motion.css` centraliza 110 ms para pressão, 200 ms para microinteração, 340 ms para entrada, 440 ms para etapa, 560 ms para resposta e 1100 ms para recompensa. As curvas separam entrada, saída, elevação, acomodação e uma resposta elástica pequena, pedida no briefing. A entrada das alternativas usa intervalos de 35 ms, limitados a três intervalos.

CSS, Web Animations e View Transitions nativas evitam uma dependência adicional. A barra usa escala para apresentar o avanço. A expansão do painel usa grid uma vez por resposta; efeitos de brilho permanecem locais. Pedidos em andamento são cancelados na desmontagem, assim como contadores e animações programáticas. O caminho de movimento reduzido conserva ícones, cores, textos, números e controles.

## Evidência automatizada

- `npm run test:aprendizagem`: seis testes de fluxo, duas tentativas, progresso da revisão e conteúdo dos dez pontos.
- `npm run test:feedback`: quatro testes de recompensas e consumo único de eventos.
- `npm run test:aprendizagem:http`: integração com sessão real, PostgreSQL, ordenação, gabarito protegido, concorrência e XP único.
- `npm run test:feedback:browser`: Chrome, envio direto ao selecionar, ausência de botão de registro, associação e pares sem envio parcial, envio lento, largura estável, clique repetido, falha de rede, preservação do mesmo controle, acerto/erro confirmados, teclado, painel integrado, teoria/exercício, ambos os resultados da revisão pela interface, `ViewTransition.ready`, restauração do feedback, resultado, retorno real ao mapa pelo botão final, desbloqueio e fade de rota com quadros e duração conferidos no navegador.
- `npm run typecheck`: checagem TypeScript.

As capturas cobrem 1440 × 1000 e 390 × 844. Capturas móveis adicionais após rolagem mostram Continuar e as ações do resultado livres do header e da navegação inferior. O restante da primeira rodada é preenchido por HTTP no teste de navegador; isso não representa inspeção visual de cada questão.

## Revisão e limites

O fluxo completo de navegador também passou com Next.js 15.5.25 em Turbopack. A quebra de linha no argumento de `::view-transition-new` foi reproduzida com resposta HTTP 500; após compactar o seletor, a rota retornou 200 e o Biome preservou a correção. As respostas e transições passaram novamente no Chrome contra essa instância.

Cada revisão teve uma execução do detector Impeccable. A revisão de envio automático e superfícies retornou zero achados. Na reformulação anterior de movimento, os avisos de curva elástica correspondem a uma escolha explícita do pedido, limitada a confirmações e recompensas. O título novo foi alinhado ao tamanho de 1,5 rem e o indicador usa o token de raio existente. Permanecem avisos consultivos preexistentes em módulos vizinhos e divergências anteriores do sidecar visual fora do escopo desta alteração.

A revisão independente está registrada em `tests/motion-finish-review.md`; a revisão de envio automático e superfícies fica em `tests/auto-answer-finish-review.md`, e a de navegação/retorno ao mapa em `tests/navigation-finish-review.md`. Não houve teste em celular físico, medição de FPS em hardware intermediário, inspeção com leitor de tela real ou validação em outro navegador. O fluxo móvel foi exercitado por emulação no Chrome. As APIs de animação usam detecção de suporte; a ausência delas não impede estudar ou avançar.
