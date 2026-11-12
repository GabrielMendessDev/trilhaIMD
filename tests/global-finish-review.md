disposition: fix

Limites: revisão por Diego dos arquivos e das 38 capturas obrigatórias, sem browser, execução de testes ou novo detector. Não foi fornecido comp aprovado, por decisão code-led. O contrato Operate não possui FORM/seed nem concept roll: a dispensa decorre da interpretação de extensão de mundo já fixado pelo pedido, corroborada pelo principal, e não de uma aprovação visual inventada. Código foi amostrado; conteúdo abaixo da dobra, arquivos funcionais não amostrados e logs completos não foram certificados nesta revisão.

## persistence

Pass na existência de PRODUCT.md e DESIGN.md e na continuidade da identidade registrada. Não se aplicam arquivos de reprodução de comp nem aprovação de comp. Pendente a atualização documental já prevista: PRODUCT.md ainda descreve missões diárias em preparação, enquanto as capturas mostram missões reais, e DESIGN.md ainda descreve uma Home de dois cartões de disciplina. Os tokens e padrões finais devem refletir a implementação, sem reabrir a marca. A evidência obrigatória passa: 32 capturas de dezesseis estados em desktop/mobile e as seis complementares foram abertas pessoalmente; conteúdo, enquadramentos e dimensões correspondem ao pacote. Wrong/recovered são capturas legitimamente roladas para o feedback. Não há região vazia ou preta invalidante.

## fidelity

Sem comp aprovado, a matriz abaixo compara as promessas explícitas do pedido e do contrato, não uma composição imaginada pelo revisor.

| Elemento/promessa | Estado | Evidência e critério |
| --- | --- | --- |
| TYPE | match | Sora de títulos e Plus Jakarta Sans de leitura; fontes locais declaradas em globals.css, hierarquia consistente nas capturas de rotas e lição. |
| MATERIAL | match | Bito raster oficial está efetivamente presente em login, loja e navegação; diagramas matemáticos e artefatos são vetoriais explícitos, conforme a autoridade do pedido. O troféu da conclusão é SVG próprio de icon.tsx, não emoji. Não há obrigação de produzir um novo raster nem promessa de material físico. |
| GROUND | contradicted | O Quality bar pede fundos neutros, com cor concentrada no conteúdo e estado. Em global-home-desktop.png, o campo amplo assume roxo saturado, distinto das demais rotas; pixels de fundo em (270,90), (450,550) e (1050,650) são #442580, #392471 e #272052. shell.module.css mantém a regra específica de Home com camadas roxas sobre o canvas. |
| Home: topologia, próximo passo e percurso | match | Saudação, seletor, unidade, Continuar, nós alternados e coluna compacta à direita estão presentes; mobile usa a largura disponível e cinco destinos inferiores. O primeiro viewport mostra o estado atual e a continuidade. |
| Ação contextual do percurso | contradicted | Abrir etapa tem texto #f5f3ff sobre #bcb4ff no escuro, cerca de 1,72:1; no claro tem #151b37 sobre #493ab0, cerca de 2,02:1. Cores dominantes extraídas dos pixels das capturas global-home-desktop.png e global-home-light-desktop.png. Em 12px, ambas ficam abaixo de 4,5:1. |
| Apoio da Home: loja e mochila | contradicted | Em global-home-desktop.png e global-home-light-desktop.png, Bito cobre a parte final de Prepare a próxima aventura e da descrição do saldo. A regra .journey-support > section impõe padding superior zero e vence o espaço reservado de .bito-outpost; o mascote é absoluto. |
| Trilhas, disciplinas e capítulos | match | Símbolos próprios, progresso real/estado em preparação, banner e capítulos expansíveis substituem a listagem administrativa; estados sem publicação permanecem declarados. |
| Lições e questões | match | Área central sem reserva lateral, saída legível, progresso, mochila, alternativas grandes e estado confirmado integrados. O mobile possui leitura em uma coluna, sem compressão do desktop. |
| Explicação guiada | match | Exemplo cotidiano e exploração de pertinência aparecem no mesmo conteúdo; diagrama preserva conjuntos e seleção. Material complementar tem estado próprio. |
| Erro, revisão e recuperação | match | Capturas wrong, review e recovered mostram coral, orientação sem gabarito inicial, segunda tentativa e resultado recuperado em menta. Esta constatação visual não certifica a falha de avanço rápido ainda investigada pelo principal. |
| Conclusão e recompensas | match | Categorias de domínio/revisão/reforço, XP, Bits, desempenho e ações manuais estão presentes; SVG de troféu, Bito e conquistas mantêm o vocabulário de recompensa. |
| RPG, progresso e perfil | match | Loja distingue Bits de dinheiro real; mochila mostra quantidade, raridade e detalhe; progresso apresenta nível e estudo registrado; perfil concentra conta e cosméticos. |
| Login e estados auxiliares | adaptation | Google como entrada/cadastro e exploração sem login seguem a arquitetura e a restrição explícita do contrato de não criar senha local fictícia; ranking em preparação e 404 declaram honestamente seu estado. |

As promessas de identidade, história de aprendizagem, primeiro viewport e forma geral são reconhecíveis. O teste de memória da Home retém a unidade roxa e o percurso conectado; a lição retém o conteúdo central e sua resposta. Os desvios materiais são locais, não exigem reconstrução de composição. A ausência de seed/FORM foi registrada acima como limitação de protocolo para esta extensão, sem impor novo sorteio sobre identidade já vinculante.

## ceiling

O patamar tecnológico e lúdico está representado por Bito, trilhas conectadas, controles com profundidade, símbolos de disciplina e medalhas. A cor de fundo excessiva da Home reduz a separação entre mundo e conteúdo, e a sobreposição de Bito quebra o acabamento da coluna de recursos. Corrigir esses pontos utiliza os dispositivos já existentes; não há motivo para acrescentar ornamentação ou gerar novos assets. Movimento não pode ser julgado integralmente em capturas estáticas; o relatório de testes e o código não substituem uma certificação independente de animação. Nenhuma conclusão funcional é atribuída ao teste Chrome antigo ainda falho.

## material_fixes

1. **P1 — Contraste da ação do mapa:** definir explicitamente foreground/background de .journey-node-detail a, sem depender de --on-discipline incompatível com --accent; validar pelo menos 4,5:1 no tema claro e escuro e recapturar os mesmos arquivos global-home-desktop.png, global-home-mobile.png, global-trails-desktop.png, global-trails-mobile.png e global-home-light-desktop.png, com Abrir etapa visível.
2. **P2 — GROUND/Quality bar:** retirar ou reduzir a regra específica de fundo da Home em shell.module.css para o canvas neutro do sistema, mantendo os gradientes da unidade e estados dos nós; recapturar global-home-desktop.png e global-home-mobile.png e verificar que o campo amplo deixou de ser a camada roxa dominante.
3. **P2 — Coluna de recursos da Home:** reservar espaço real para Bito ou reposicioná-lo para não cobrir título, descrição nem ações de .bito-outpost; verificar ausência de interseção entre imagem e texto em 1024, 1440 e 1920px e recapturar global-home-desktop.png e global-home-light-desktop.png nos mesmos enquadramentos.
4. **P2 — Persistência:** atualizar PRODUCT.md e DESIGN.md para missões implementadas, Home de percurso central, padrões e tokens finais; critério: nenhuma instrução que ainda descreva missões em preparação ou a antiga Home de dois cartões. Registrar expressamente a interpretação de dispensa do concept roll para a extensão de identidade existente.

## keep

Preservar identidade oficial, tipografia, Bito, percurso como organização da jornada, foco da lição, distinção coral/menta, duas tentativas e revisão, Google, dados e validação real de progressão e RPG; corrigir apenas os quatro pontos materiais acima, sem novo ciclo de marca ou polimento aberto.

---

## verdict

Veredito pós-correções por Diego, limitado aos quatro itens da revisão original preservada acima. Foram reabertos os cinco arquivos autoritativos global-home-desktop.png, global-home-mobile.png, global-trails-desktop.png, global-trails-mobile.png e global-home-light-desktop.png. Todos são capturas válidas das rotas e enquadramentos declarados. Esta aprovação cobre as correções pontuadas, não uma nova certificação integral da plataforma, das animações ou das suítes funcionais relatadas pelo principal. A captura de Trilhas mobile permanece no topo, com a ação contextual abaixo da dobra; a evidência mobile da ação é a Home com o mesmo componente e a mesma regra compartilhada, conferidos junto ao código.

| Item original | Resultado | Evidência pós-correção |
| --- | --- | --- |
| 1. Contraste de Abrir etapa | resolved | As recapturas mostram texto escuro sobre lavanda no escuro e branco sobre violeta no claro, legíveis na ação. experience.css define os pares explicitamente. O recálculo independente dos pares #151b37/#bcb4ff e #ffffff/#493ab0 resulta em 8,93:1 e 8,35:1, acima de 4,5:1; global-fix-checks.json registra os mesmos resultados, incluindo 1024/1920px no escuro. |
| 2. Fundo neutro da Home | resolved | Home desktop e mobile deixaram de exibir o campo roxo amplo; banner, nós e estado atual conservam a cor da trilha. A regra específica usa var(--canvas). O relatório de medição registra rgb(23,24,50) sem gradiente no fundo escuro. |
| 3. Sobreposição de Bito | resolved | Home desktop escura e clara mostram Bito acima do título, sem cobrir título, descrição, saldo ou ações. A regra específica reserva 104px reais. global-fix-checks.json registra overlapping=false em 1024, 1440 e 1920px; as capturas confirmam o resultado visual em 1440px. |
| 4. Persistência | resolved | PRODUCT.md descreve missões reais e a Home com percurso; DESIGN.md documenta composição, reserva de Bito, pares de ação, canvas e cascata efetiva. Os textos antigos indicados não permanecem. Ambos registram a dispensa de concept roll como interpretação de extensão, sem inventar seed ou comp aprovado. |

## remaining

clear. Nenhuma regressão material introduzida pelo lote foi observada nas cinco recapturas e nos quatro pontos pontuados. A implementação da navegação e os resultados de testes fornecidos permanecem fora desta certificação independente. A revisão original é histórica: seus quatro achados estão resolvidos pelo veredito acima.

disposition: ship
