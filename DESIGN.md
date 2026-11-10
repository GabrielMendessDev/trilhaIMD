---
name: trilbit
description: "Aprenda TI. Evolua por trilhas."
colors:
  orbit: "#6558f5"
  orbit-hover: "#5143e3"
  solar: "#ffaa6b"
  solar-hover: "#ffc29a"
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
typography:
  display:
    fontFamily: 'Sora, "Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "clamp(1.75rem, 3.3vw, 2.8rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: 'Sora, "Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  title:
    fontFamily: 'Sora, "Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    lineHeight: 1.65
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
  pill: "100px"
  node: "50%"
spacing:
  xs: "0.375rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.orbit}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.625rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.orbit-hover}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.625rem 1rem"
  button-secondary-hover:
    backgroundColor: "{colors.lavender}"
  button-solar:
    backgroundColor: "{colors.solar}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.625rem 1rem"
  button-solar-hover:
    backgroundColor: "{colors.solar-hover}"
  course-card:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.card}"
    padding: "1rem"
  catalog-count:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue-gray}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.65rem"
  association-select:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.625rem"
  desktop-nav-current:
    backgroundColor: "{colors.orbit}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "2.875rem"
  checkpoint:
    backgroundColor: "{colors.dark-surface}"
    rounded: "{rounded.node}"
    size: "3.25rem"
---

# Sistema visual do trilbit

## Overview

**Creative North Star** · Mapa de estudo conectado

O trilbit usa a linguagem dos mapas para orientar a revisão universitária. O T de nós conectados aparece na assinatura e a mesma geometria organiza os pontos de cada trilha. A área de estudo usa Noite e superfícies roxas como padrão. O início reúne saudação, trilhas e a próxima meta, com Bito parcialmente visível na base da navegação lateral.

Bito acolhe quem chega. O personagem do painel de referência ganhou uma ilustração própria, otimizada em WebP com registro de proveniência ao lado do arquivo. O símbolo em SVG foi reconstruído a partir do painel raster fornecido.

**Características**

- Área de estudo escura com alternativa clara.
- Conexões e cores de disciplina que ajudam a localizar etapas.
- Tipografia de leitura e controles compartilhados entre as rotas.

## Colors

### Primária

Órbita identifica ações primárias e a página ativa na navegação lateral. Seu tom mais escuro atende links e foco no tema claro.

### Secundárias

Solar destaca recompensas, ofensiva e o contorno da próxima etapa. Menta marca conclusões registradas e seus segmentos no percurso. Cada disciplina leva sua cor ao cartão, símbolo, barra de progresso, conexão e nó atual. Elementar usa violeta, Combinatória usa coral, Cálculo usa azul, FMC usa menta e VGA usa rosa-lilás. As famílias incluem um tom de luz e outro de sombra para os gradientes.

### Neutras

Noite ancora a navegação e o tema padrão. No Início, gradientes roxos e azul-noite integram o cabeçalho à área de estudo. Nuvem e Branco organizam a versão clara. Mensagens de erro combinam texto e fundo rosados nos dois temas.

## Typography

Sora estrutura títulos e a assinatura. Plus Jakarta Sans atende leitura, navegação e controles. JetBrains Mono distingue símbolos, diagramas e código.

- O título de abertura varia de `1.75rem` a `2.8rem` e usa peso 800. Os títulos internos sobem de `2rem` para `2.5rem` a partir de 768 px.
- As descrições do cabeçalho usam entrelinha 1.65 e largura de até `65ch`. Os blocos de leitura das etapas chegam a `70ch`.
- Ações comuns usam `0.875rem` e peso 750. Os rótulos mais compactos acompanham seus componentes, como as etapas no mapa e os acessos inferiores.

## Layout

As páginas comuns ocupam até `78rem`, com margem interna lateral fluida entre `1rem` e `2.5rem`. A navegação fica na lateral a partir de 1025 px, com largura de `14.5rem`. Em larguras menores, o cabeçalho fica preso ao topo durante a rolagem e a barra inferior reserva espaço para a área segura.

O início apresenta duas trilhas a partir de 620 px. O catálogo de Disciplinas usa duas colunas a partir de 620 px e três a partir de 1350 px.

O mapa ocupa até `83rem`, com percurso central de até `37rem`. Os seletores de disciplina passam de três para cinco colunas em 768 px, quando o apoio vai para uma coluna lateral. Em telas baixas na horizontal, o mapa reduz o espaçamento vertical e mostra cinco seletores lado a lado.

## Elevation & Depth

Contornos finos e reflexos internos dão volume aos cartões, aos botões e aos símbolos. A sombra macia acompanha a cor da disciplina em cartões de trilha. O nó atual recebe um halo mais forte, e os nós concluídos usam um acabamento menta. As nuvens em camadas e os pontos de luz dão profundidade ao fundo do mapa.

## Shapes

Controles usam cantos de 12 px. Cartões usam 20 px, e o mapa usa 24 px no tema escuro. As etapas são círculos de 52 px, que passam a 56 px a partir de 481 px, com ajuste para telas baixas. A próxima etapa mede 8 px a mais. Desafios usam cantos de 14 px e ícone de estrela.

## Components

### Botões e campos

A ação primária usa gradiente Órbita, reflexo na borda superior e texto branco. A secundária usa fundo de superfície e borda. A variante Solar usa texto Noite. Os botões e campos têm altura mínima de `2.75rem`. A alternativa de exercício marcada ganha borda da disciplina e fundo tonal. O foco geral usa contorno de 2 px com afastamento de 3 px. Campos de exercício usam afastamento de 2 px.

### Cartões e contadores

Cartões de disciplina agrupam símbolo matemático, título e progresso ou disponibilidade. O Início reserva dois cartões e completa a dupla com sugestões do catálogo quando preciso. Ofensiva, XP e recompensas usam cápsulas com ícones facetados ou preenchidos.

### Navegação

Na lateral, o item atual usa um gradiente Órbita. A barra inferior repete Início, Trilhas, Disciplinas, Progresso e Conquistas. O menu da conta dá acesso a Perfil e configurações. Use `aria-current` para indicar a rota ativa.

### Mapa de etapas

Pontos numerados formam um percurso com luminosidade discreta no fundo. A próxima etapa usa o gradiente da disciplina com contorno Solar, uma conclusão usa Menta e check, e o cadeado indica um pré-requisito. Os ícones ficam no centro dos nós, com o número em uma pequena cápsula na borda. A ação da etapa abre conteúdo, revisão ou prévia conforme o estado.

## Do's and Don'ts

- **Faça** a área de estudo responder ao tema com as cores semânticas de fundo, superfície, texto e foco.
- **Faça** o estado selecionado aparecer também no texto, no ícone ou no estado semântico do controle.
- **Faça** as transições de estado respeitarem a preferência por movimento reduzido.
- **Evite** apresentar prévias como conteúdo publicado ou exibir progresso, XP e posições de ranking sem dados reais.

