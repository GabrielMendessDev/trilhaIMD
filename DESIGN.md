---
name: trilbit
description: "Aprenda TI. Evolua por trilhas."
colors:
  orbit: "#6558f5"
  orbit-hover: "#5143e3"
  solar: "#ffaa6b"
  mint: "#25c5ab"
  lavender: "#eeeafe"
  night: "#151b37"
  cloud: "#f7f8fc"
  white: "#ffffff"
  surface-soft: "#f1f2f9"
  blue-gray: "#57607b"
  soft-border: "#e5e7f0"
  on-night: "#f5f3ff"
  on-night-muted: "#d3cfee"
  dark-canvas: "#171832"
  dark-surface: "#222143"
  dark-surface-soft: "#2d2854"
  dark-ink: "#f4f3ff"
  dark-muted: "#b7bed8"
  dark-line: "#4a426e"
  dark-accent: "#bcb4ff"
  dark-accent-wash: "#2d2858"
  error-ink: "#922743"
  error-wash: "#fff0f4"
  dark-error-ink: "#ffb1c5"
  dark-error-wash: "#3e2338"
  success-ink: "#08715f"
  dark-success-ink: "#7aead8"
  rpg-uncommon-ink: "#245da8"
  dark-rpg-uncommon-ink: "#8ec5ff"
  warm-ink: "#803d10"
  reward-ink: "#69431a"
  dark-reward-ink: "#ffd28f"
  elementar-soft: "#bcb4ff"
  elementar-deep: "#493ab0"
  combinatoria: "#dd793d"
  combinatoria-soft: "#ffc697"
  combinatoria-deep: "#813d42"
  calculo: "#278ebc"
  calculo-soft: "#9cdcff"
  calculo-deep: "#254a97"
  fmc: "#168c83"
  fmc-soft: "#8bf5de"
  fmc-deep: "#18646d"
  vga: "#b049a4"
  vga-soft: "#ffc3ee"
  vga-deep: "#603c97"
typography:
  display:
    fontFamily: 'Sora, "Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "2rem"
    fontWeight: 800
    letterSpacing: "-0.035em"
  headline:
    fontFamily: 'Sora, "Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title:
    fontFamily: 'Sora, "Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "1rem"
    lineHeight: 1.85
  label:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 750
  notation:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    fontSize: "1rem"
    fontWeight: 800
rounded:
  control: "12px"
  card: "20px"
  panel: "24px"
  compact: "16px"
  module: "18px"
  completion: "22px"
  pill: "100px"
  node: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  section: "28px"
  page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.orbit}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
    height: "48px"
  desktop-nav-current:
    backgroundColor: "{colors.orbit}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "52px"
  trail-tab-current:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.orbit-hover}"
    padding: "10px 14px"
    height: "42px"
  journey-banner:
    backgroundColor: "{colors.elementar-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "24px"
  lesson-choice:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    padding: "14px 18px"
    height: "62px"
  lesson-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    rounded: "{rounded.card}"
    padding: "28px"
  inventory-slot:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    rounded: "{rounded.compact}"
    padding: "16px 12px"
    height: "180px"
  association-select:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.625rem"
  rpg-medal-uncommon:
    textColor: "{colors.rpg-uncommon-ink}"
    width: "100px"
    height: "110px"
---

# Design System: trilbit

## Overview

**Creative North Star: "Mapa de estudo conectado"**

O trilbit orienta a revisão universitária por uma jornada de nós conectados, derivada do T da marca. O conteúdo ocupa superfícies de leitura contidas; cor, relevo e símbolos indicam disciplina, disponibilidade e resposta. Bito acolhe a exploração sem disputar espaço com a questão. A ilustração existente foi otimizada em WebP com proveniência ao lado do arquivo; o símbolo SVG foi reconstruído da prancha raster fornecida.

A identidade oficial, Sora, Plus Jakarta Sans, símbolo e Bito permanecem vinculantes. Este registro descreve o redesign global em Operate, orientado pelo código e pela composição solicitada, como extensão do mundo existente. A dispensa de concept roll foi uma interpretação registrada dessa continuidade: não houve seed, rodada de conceitos ou comp aprovado. Este documento não representa aprovação visual nem certificação de testes.

**Key Characteristics:**

- Tema escuro padrão e alternativa clara com cores semânticas compartilhadas.
- Percurso dominante, próxima ação explícita e apoio compacto na exploração.
- Lição central em modo de concentração, leitura guiada e correção integrada.
- Símbolos matemáticos e artefatos SVG próprios; Bito raster oficial com espaço reservado.

## Colors

A paleta conserva Órbita, Solar e Menta sobre neutros Noite/Nuvem; as famílias de disciplina concentram cor no conteúdo e no percurso.

### Primary

Órbita identifica ações e navegação atual. Órbita profunda atende links e foco no claro; Órbita clara e sua superfície tonal atendem o escuro. Gradientes e estados completos ficam no sidecar, sem substituir a cor primitiva.

### Secondary

Solar sinaliza ofensiva e recompensas. Menta identifica conclusão e acerto. Elementar usa Órbita; Combinatória usa coral, Cálculo azul, FMC verde-azulado e VGA rosa-lilás. Cada família inclui cor, luz e profundidade: banner e nós usam gradientes; links de ação usam pares explícitos. O banner Elementar possui luz local mais clara que a do percurso.

### Tertiary

Erro e orientação usam pares semânticos próprios; os tons de leitura quente e recompensa variam por tema. Raridades conservam Menta, azul Incomum, roxo Rara, quente Épica e dourado Lendária.

**The Rarity Rule.** Comum é Menta, Incomum é azul, Rara é roxa, Épica é quente e Lendária é dourada. Nome da raridade, símbolo de categoria, meta e estado escrito acompanham a cor; medalhas bloqueadas ficam atenuadas, e o brilho dourado distingue Lendária.

### Neutral

Noite/Nuvem organizam fundo e leitura; superfícies, texto secundário e linhas seguem tokens semânticos. Os valores dark-* no frontmatter são definidos em tokens.css, importado por globals.css. As redefinições de tema e geometria sobrescritas de experience.css foram removidas, preservando os valores efetivos. A Home utiliza o canvas, sem o antigo campo amplo de gradientes roxos; a navegação conserva seu gradiente próprio.

**The Contextual Contrast Rule.** A ação contextual do nó usa Noite sobre a luz da disciplina no escuro e Branco sobre sua profundidade no claro. Não herdar uma tinta de outro contexto para esse controle.

## Typography

**Display Font:** Sora, com Plus Jakarta Sans e sans-serif de reserva.  
**Body Font:** Plus Jakarta Sans, com system-ui e sans-serif.  
**Label/Mono Font:** JetBrains Mono para notação, fórmulas e código.

Títulos compactos e firmes acompanham leitura espaçada. As fontes locais são carregadas por @font-face; não substituir a identidade por fonte de sistema nos títulos.

### Hierarchy

- **Display:** saudação desktop; diminui para 1.75rem até 1024px e 1.5rem até 760px. Login é exceção local de 2.5rem, reduzida a 2rem no celular.
- **Headline:** título de página; reduz para 1.75rem até 760px. A descrição usa 0.9375rem, entrelinha 1.7 e até 65ch.
- **Title:** título de painel da lição, reduzido a 1.25rem no celular. Seções e apoios usam 0.9375rem a 1.125rem conforme densidade.
- **Body:** leitura da lição; no celular usa 0.9375rem conservando entrelinha 1.85. Texto de apoio usa 0.75–0.875rem.
- **Label:** ações comuns; navegação compacta e metadados reduzem conforme o componente. Contadores e saldos usam algarismos tabulares.
- **Notation:** símbolos e código mantêm voz distinta da leitura; diagramas conservam sua geometria SVG.

## Layout

O shell usa trilho esquerdo fixo de 220px a partir de 1025px, cinco destinos e área principal até 1320px. O cabeçalho é sticky, com 78px mínimos no desktop, 72px até 1024px e 66px até 760px. O conteúdo recebe 32px de margem interna, 24px no tablet e 22px 16px no celular. Abaixo de 1025px, a barra inferior fixa repete Início, Trilhas, Disciplinas, Progresso e Conquistas, com área segura e espaço reservado no conteúdo.

Na Home, saudação e seletor horizontal antecedem o banner da unidade e o percurso dominante. A grade combina coluna flexível e apoio de 290px com intervalo de 30px; o apoio reduz a 250px em larguras intermediárias e passa para baixo até 760px. O apoio reúne missões, próxima conquista e recursos. Bito tem reserva real de 104px acima do texto de loja/mochila. Essa composição pertence à Home, sem impor três colunas a todas as rotas.

Disciplinas usam linhas com símbolo e estado; capítulos usam details, com capítulo atual aberto e lista de lições bloqueadas/concluídas. Progresso e perfil combinam resumos numéricos, seções e listas. A Loja usa duas colunas, reduzidas a uma no celular. A Mochila combina três colunas de slots e inspetor de 300px; até 1250px usa dois slots por linha e inspetor de 260px, e até 760px o inspetor deixa de ser sticky e segue a grade. Conquistas usam duas colunas e uma no celular.

A lição remove trilho e barra inferior, conserva saída no cabeçalho e centraliza a bancada em até 860px, com 28px laterais ou 16px no celular. Questão e conteúdo aparecem em uma coluna; no modo misto, a leitura contextual fica recolhida em Relembrar o conceito. A explicação de pertinência dispõe exploração interativa entre texto inicial e exemplos adicionais expansíveis. A mochila da lição permanece diálogo lateral até 460px no desktop e inferior até 85dvh no celular.

O login usa duas colunas até 1240px, uma delas para Bito, e empilha até 760px. Erro, não encontrado, ausência de dados e ranking em preparação usam bloco central contido; carregamento usa esqueletos coerentes com a superfície de destino. Intervalos recorrentes estão no frontmatter, sem pressupor uma grade matemática uniforme.

## Elevation & Depth

A base combina linha fina e camada tonal. Botões, alternativas e nós usam borda inferior mais espessa para comunicar pressão; isso não estabelece uma regra de sombra dura deslocada. Banner e nó atual usam gradiente de disciplina, conclusão usa Menta e foco continua explícito. Painéis comuns eliminam sombra por override local; o painel de lição conserva brilho discreto, e a leitura contextual remove moldura e brilho.

O vocabulário completo fica em extensions.shadows: os tokens globais estão centralizados em tokens.css, enquanto sombra da questão, halo do nó e relevo do botão são tratamentos locais.

## Shapes

Os tokens globais efetivos continuam com controle de 12px, cartão de 20px e painel de 24px. Exceções locais reutilizadas: cartões/slots RPG de 16px, módulos de 18px e conclusão de 22px. Alternativas usam 14px e letras em cápsulas de 8px; seletor horizontal usa 10px. Nós normais são circulares, o atual mede 68px e checkpoints usam cantos de 19px. Medalhas facetadas, fitas e silhuetas SVG distinguem categoria e raridade.

## Components

### Buttons

A ação primária usa o mínimo de altura do frontmatter, gradiente Órbita, texto branco e borda inferior de 3px. Hover reforça borda e brilho; pressionar desloca 2px e reduz a borda inferior a 1px. A secundária usa superfície, tinta e linha semânticas. A variante Solar existente conserva gradiente quente e tinta Noite. O botão branco do banner é variante contextual, com tinta violeta e sem sombra. O frontmatter registra a cor-base e o mínimo de altura; os snippets do sidecar registram gradientes, min-height e estados reais.

Foco geral usa contorno de 3px e afastamento de 4px. Alternativas focadas usam afastamento de 3px; campos específicos conservam seu tratamento local. Desabilitado reduz opacidade e conserva indicação textual quando há processamento.

### Chips

O seletor de disciplina é uma sequência rolável de links com aria-current, fundo tonal e borda na seleção. Contadores de XP, Bits, ofensiva, quantidade e raridade têm ícones próprios e texto; não usar apenas cor para informar estado.

### Cards / Containers

O banner une símbolo SVG, disciplina, unidade, progresso real, próxima lição e Continuar. O percurso usa ligação, nós, número, estado e ação contextual com contraste próprio. O cartão de detalhe não herda tinta do banner. Missões e apoios usam linhas e espaçamento, sem pilha de cartões decorativos.

A coleção usa medalhas facetadas e filtros de categoria/raridade/estado. O inventário usa slots com quantidade e seleção por aria-pressed; um inspetor apresenta efeito, estoque, estado e ação compatível. Selecionar o slot não compra nem equipa. Compras, equipamento e proteção refletem respostas confirmadas; confirmações e erros ficam junto à ação.

### Inputs / Fields

Alternativas são labels amplas com radio nativo, letra, texto e estado. A seleção usa borda e fundo tonal, a letra muda de tinta por tema e o foco não depende do radio visualmente oculto. Associação e entradas de exercício conservam borda visível, superfície semântica e foco. Não criar campos de senha no login: Google é o único mecanismo disponível.

### Navigation

Desktop usa item atual com gradiente Órbita e aria-current; mobile repete os cinco destinos. A conta fica em menu expansível com Perfil, Mochila, Loja e saída. Missões e recursos RPG têm acessos de apoio. A lição oferece Voltar ao mapa sem reservar espaço lateral; no celular o nome pode ficar visualmente oculto, conservando rótulo acessível.

### Guided Learning

O painel tem título com SVG neutro, texto legível, diagrama matemático e alternativas de 62px mínimos, reduzidas a 60px no celular. Explicação, prática, revisão e conclusão conservam o idioma visual. O explorador de conjuntos alterna elemento/subconjunto e apresenta relação simbólica, SVG e explicação textual atualizada, sem conceder XP por interação.

### Linguagem de movimento

O movimento acompanha antecipação, confirmação e continuidade dentro do mapa de estudo conectado. A fonte dos tokens é `src/styles/motion.css`; `.impeccable/design.json`, em `extensions.motion`, registra os valores que o esquema de frontmatter não comporta. Cores, tipografia, formas e profundidade mantêm o mundo visual existente.

| Token | Valor | Uso |
| --- | --- | --- |
| `--motion-press` | `110ms` | Compressão imediata de controles habilitados. |
| `--motion-micro` | `200ms` | Estados interativos, menu e saída de páginas ou fallback de etapas. |
| `--motion-enter` | `340ms` | Entrada de alternativas, títulos, checks e indicador lateral. |
| `--motion-step` | `440ms` | Troca de etapa, expansão do resultado e avanço de progresso. |
| `--motion-answer` | `560ms` | Confirmação ou orientação de resposta, anel, partículas e fórmulas. |
| `--motion-reward` | `1100ms` | Luz de conclusão e preenchimento do desempenho. |
| `--motion-stagger` | `35ms` | Alternativas em sequência, limitadas a três intervalos (`105ms`). |
| `--ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrada com desaceleração. |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Saída acelerada. |
| `--ease-spring` | `cubic-bezier(0.22, 1.3, 0.36, 1)` | Pequena expansão de emblemas, medalhas e desbloqueio. |
| `--ease-settle` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Acomodação de progresso, brilho e resposta. |
| `--ease-elevate` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Elevação e compressão dos controles. |

Os botões habilitados sobem 2 px no hover e comprimem para escala `0.975` ao pressionar. Alternativas comprimem para `0.985`, apresentam uma onda a partir do ponto de interação, com fallback central ao teclado, e reduzem a opacidade das demais para `0.72` após a seleção. Nas questões corrigidas, selecionar a alternativa envia a resposta automaticamente; associações aguardam todos os campos válidos e ligações aguardam todos os pares. O processamento aparece na alternativa e em uma mensagem de estado, bloqueando novos envios enquanto aguarda o servidor. Apenas falhas técnicas oferecem Tentar novamente, conservando a seleção. Teoria e roteiros mantêm Continuar; botões de processamento preservam sua largura. A transição legada `--motion-ui` (`180ms ease`) continua nos controles que já a utilizavam.

**The Confirmed Response Rule.** A seleção permanece montada no mesmo cartão durante a validação. Só o resultado confirmado pelo servidor aplica o estado de acerto ou erro, desabilita as alternativas e revela o painel integrado. O acerto combina borda e fundo Menta, check desenhado, anel, pulso e seis partículas locais; o erro usa o tom quente semântico, X e deslocamento lateral curto de até 3 px. O primeiro erro orienta para a revisão sem revelar a solução. A continuidade depende de uma ação manual em Continuar ou Ver meu resultado; a coreografia não avança a atividade sozinha.

O painel se expande em `--motion-step`; emblema e anel usam `--motion-answer`, e Continuar entra em `--motion-enter` com início deslocado em 100 ms. O foco vai para o título do resultado, preservando texto, ícone e estado semântico além da cor. O resultado consome uma identidade de evento em `sessionStorage`, para não repetir a celebração ao restaurar a mesma resposta.

### Transições de aprendizagem e conteúdo

A navegação começa sem esperar a animação terminar. Entre páginas, o conteúdo real de saída reduz a opacidade de 1 para `0.65`; os grupos reais de chegada entram de `0.2` para 1, com deslocamento vertical de 8 px para zero, em `--motion-enter`. O escalonamento usa `--motion-stagger`, limitado a três intervalos. A revelação aguarda a montagem do conteúdo principal. A transição aparece nos textos e itens; avisos flutuantes ficam reservados a problemas técnicos, sem narrar Abrindo ou Voltando. O esqueleto de carregamento usa rótulo acessível, e Continuar conserva seu texto durante a navegação.

Dentro da mesma lição, a navegação atualiza a rota imediatamente, acompanhada de uma saída curta pela Web Animations API em `--motion-micro`: o conteúdo real perde opacidade e desloca 16 px à esquerda ao avançar ou à direita ao voltar. Não há snapshot nativo aguardando o commit. A entrada CSS atua no conteúdo montado: questão usa deslocamento horizontal, explicação entra verticalmente e revisão combina deslocamento vertical e escala discreta; a conclusão conserva sua coreografia própria. Efeitos de layout encerram o carregamento no commit e focam o título sem rolagem forçada; a confirmação também remove o aviso anterior de navegação. A ponte entre CSS e Web Animations API normaliza segundos para milissegundos: `.34s` equivale a `340ms`.

O feedback salvo atualiza o endereço preservando os controles e a seleção. Resultado e continuidade aparecem quando os parâmetros de rota refletem a resposta confirmada; o próximo destino vem de `continueTo`, calculado pelo servidor. Essa sincronização conserva a continuidade manual inclusive sob cliques rápidos, sem depender da duração da animação.

Diagramas de inclusão, Venn, reta e quadros revelam seus grupos ou linhas em camadas (`440ms`), com inícios em 0, 100, 180 e no máximo 260 ms. Traços da reta são desenhados em `560ms`; fórmulas inteiras usam revelação por recorte e opacidade em `--motion-answer`. A leitura permanece em blocos, sem animação palavra por palavra. Durante a lição, barras de progresso usam escala horizontal apenas quando o valor observado aumenta; a representação semântica conserva o valor real.

### Conclusão, recompensas e repouso

A conclusão reúne luz de fundo (`--motion-reward`), medalha e anel (`800ms`), categorias de desempenho coordenadas e ações disponíveis durante a sequência. O contador de XP confirmado interpola o valor em `600ms`; a animação não concede recompensa. A identidade da conclusão em `localStorage` limita sua celebração a um evento. No cabeçalho, XP e ofensiva só pulsam quando um saldo já observado aumenta para a mesma conta e métrica; a primeira leitura não simula ganho.

A ação principal da conclusão é Voltar ao mapa, selecionando a etapa desbloqueada quando houver. Reler a lição continua como ação manual. O retorno ao percurso comunica o desbloqueio pelo nó e pela conexão, sem aviso flutuante.

**The Bounded Motion Rule.** O conteúdo principal conduz a atenção; movimento de repouso termina. O nó atual pulsa duas vezes em ciclos de `3200ms`. Bito respira duas vezes em ciclos de `6s`, após `2s`, deslocando-se no máximo 2 px com rotação de 0,4 grau. O menu da conta entra e sai em `--motion-micro`, e o indicador lateral desliza em `--motion-enter` quando a posição ativa muda.

Com movimento reduzido, a coreografia de respostas, conteúdo, diagramas, trilha, Bito e conclusão é removida; a navegação e os valores finais continuam disponíveis imediatamente. Contagens e animações por JavaScript também verificam essa preferência. Ao desmontar ou substituir a navegação, requisições pendentes são abortadas, temporizadores e quadros são cancelados e animações da Web Animations API são encerradas. Não vincule avanço, foco ou confirmação a um tempo de animação.

### RPG Feedback

A mochila da lição apresenta quantidade, compatibilidade e confirmação de pulo no próprio diálogo. Dica do Bito e Outro exemplo, mesma ideia ficam integrados à questão; seleção, ajuda e alternativas removidas são restauradas com o estado salvo. A nova conquista usa medalha, nome, recompensa e ações disponíveis durante a entrada; celebração não concede moedas.

A compra confirmada ilumina o artefato por 1000ms e pode mover seu SVG ao acesso da Mochila em 850ms. A entrada da mochila usa 300ms, ajuda 400ms e escudo 650ms. A conquista revela bloco em 650ms, medalha em 800ms, nome/recompensa em 550ms com início de 180/300ms; a identidade por conta evita repetir o aviso no mesmo navegador. Movimento reduzido remove a coreografia e mantém os estados finais e ações.

## Do's and Don'ts

### Do:

- **Do** usar cores semânticas de fundo, superfície, texto e foco conforme o tema.
- **Do** mostrar seleção, conclusão, bloqueio e raridade também em texto, ícone ou estado semântico.
- **Do** manter próxima ação explícita e leitura da questão em uma coluna no modo de concentração.
- **Do** aguardar confirmação do servidor, conservar seleção e oferecer continuidade manual.
- **Do** limitar pulsos de repouso e consumir a identidade dos eventos de celebração.
- **Do** respeitar movimento reduzido e cancelar requisições, temporizadores, quadros e animações ao desmontar.

### Don't:

- **Don't** apresentar prévias como lições publicadas ou inventar progresso, recompensas e posições de ranking.
- **Don't** vincular avanço, foco ou disponibilidade de ações ao fim de uma animação.
- **Don't** deixar Bito cobrir texto, ação ou questão.
- **Don't** substituir SVG matemático ou de interface por emoji ou glifo decorativo de fonte.

Deriva não canonizada: declarações globais concorrentes em experience.css são vencidas pela ordem de globals.css; as exceções locais acima descrevem o sistema observado, sem autorizar ampliar a inconsistência. Este passe documental não altera a cascata, não executa detector/testes e não certifica capturas nem aprovação visual. Os comportamentos de navegação e confirmação acima foram lidos no código; a aprovação do fluxo Chrome completo, incluindo falha de rede, resposta automática, revisão, associação, pares, conclusão e retorno ao mapa, foi informada pelo agente principal.
