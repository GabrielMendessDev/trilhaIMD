# Trilha de Matemática Elementar · extensão de conteúdo

Escopo concluído: reescrita integral, incluindo os antigos passos 1–10, em três unidades curriculares de 20 passos. São 60 passos com 17 telas cada (1.020 telas, 600 questões e 60 exemplos resolvidos), acima do mínimo solicitado de dez telas. Público universitário de diversas áreas; material adulto, leve, lúdico, inclusivo e matematicamente rigoroso. Modo Read no leitor independente e Operate no mapa existente. O leitor não depende de autenticação; o aplicativo mantém progresso e correção no servidor.

## Direction contract

THESIS: organizar uma sequência extensa em passos curtos, com uma ação clara para avançar e voltar. As unidades organizam currículo, arquivos e consulta no leitor; o mapa é um único percurso contínuo 1–60, inclusive nas ligações 20→21 e 40→41, sem seletor ou divisão por unidade.

OWN-WORLD: mapa, bancada, loja e mochila mantêm componentes, cores e tipografia existentes do trilbit (Sora/Plus Jakarta Sans). O leitor independente usa superfície clara, texto escuro, roxo das ações e controles nativos; seus títulos usam a Sora local incorporada ao HTML como data URI WOFF2, sem dependência de rede. Corpo de leitura de 18px/1.7 e system-ui é decisão local explícita desse leitor, sem alterar a escala global. Nenhuma identidade global é substituída.

STORY: no leitor, o estudante escolhe unidade e passo, investiga uma ideia, percorre exemplo e prática e consulta autocorreção sem cronômetro ou penalidade. No aplicativo, cada atividade começa com cinco vidas; cada erro na rodada normal perde uma, revisão não perde vidas e zero encerra a atividade sem conclusão ou recompensa da etapa. Recomeçar abre nova execução com cinco vidas. Esta adaptação decorre da correção explícita do pedido.

FIRST VIEWPORT: título, explicação do leitor independente, seletores de unidade e passo, posição na sequência e primeira tela. Navegação anterior/próxima abaixo do conteúdo. No móvel, os seletores empilham. O mapa mostra os sessenta nós numa única tela contínua, sem seletor de unidade. Na lição autenticada, vidas e regra escrita aparecem antes da questão, com estado de revisão explícito. Mochila e loja incluem Gota de Vida (1 vida/25 Bits), Poção de Vida (até 3/65 Bits) e Elixir de Fôlego (completa até 5/95 Bits); o teto é cinco e nenhum item revive uma atividade perdida.

FORM: extensão local determinada pelo pedido; sem sorteio de conceitos ou comp, porque composição e identidade do aplicativo permanecem. Leitor derivado da ordem didática, com seletores e foco de teclado.

FINISH: revisão inicial em `.impeccable/review/elementar-60/finish-review.md`, correções julgadas em `verdict.md` e documentação final em `documentation.md`. Os dois ajustes exigidos (Sora nos títulos e legibilidade do ciclo no móvel) estão `resolved`, com `disposition: ship` restrita a esses ajustes. Não representa nova aprovação geral. DESIGN.md, PRODUCT.md e `.impeccable/design.json` são preservados: extensão local sem mudança autorizada de sistema global. Nenhum raster de produto novo; diagramas e itens novos são SVG autorais.

## Estado final e evidências

- Fontes editoriais: `conteudos/elementar/README.md`, `COBERTURA.md` e `scripts/autoria/`. Regras de vidas e preservação: `docs/vidas-atividades.md`.
- Capturas em `.impeccable/review/elementar-60/`: mapa desktop/móvel completo e topo, vidas, atividade perdida, revisão, loja, leitor/questão/ciclo nos dois tamanhos, mais mochila desktop. As quatro recapturas citadas no verdict resolvem os achados iniciais. Ciclo SVG conserva legenda textual e rótulos de 32 unidades no viewBox, sem transformar esse tamanho em token global.
- Publicação informada pelo agente principal no banco principal: 60 passos/1.020 telas/600 questões ativos; distribuição anterior arquivada como `elementar-v1-20261112`, com seis registros de progresso, IDs, respostas, conclusões, XP e Bits preservados. Os passos novos têm progresso independente. Arquivar não altera identidade visual. Implementação/verificação: `scripts/publicar-elementar.mjs` e `scripts/verificar-publicacao-elementar.mjs`.
- Validação informada pelo agente principal e registrada em `validation.md`: 32 testes unitários, PostgreSQL/HTTP e navegador em 1440/390 passaram; arquivo e carteiras verificados em banco descartável e por assinatura no banco principal. Build final de produção passou após arquivamento e ajustes de fonte/figura: compilação em 10,4s, tipos, 15 páginas geradas e traces completos. Biome nos 37 arquivos finais passou. O passe documental registra essas evidências sem reexecutar os testes.
- O detector anterior é evidência histórica, não nova varredura. Seu aviso de 18px é uma decisão local de leitura; o aviso de 0.8rem refere-se ao código anterior (a regra lida agora usa 0.875rem). A tinta de apoio atual do leitor é `#57607b`, já presente no sistema. Não se promovem exceções locais ou deriva preexistente a regras globais.
