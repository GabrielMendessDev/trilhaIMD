disposition: fix

Entradas/limites: sem comp aprovado ou QUALITY BAR externo (extensão local); revisão por todas as capturas obrigatórias e amostra dos arquivos primários, sem navegador, novo detector ou reexecução dos testes. Corpus integral e código transacional completo não auditados; resultados de testes informados pelo agente principal.

## persistence

Pass: PRODUCT.md, DESIGN.md e contrato da superfície existem. A identidade preexistente e a extensão sem comp/seed estão expressamente registradas em FORM; não há obrigação de inventar uma rodada de conceitos para esta alteração local. DESIGN.md corresponde ao mapa, bancada e loja capturados. As capturas desktop/móvel do mapa, vidas, perda, revisão, loja, leitor/questão/diagrama e a mochila desktop existem, mostram o conteúdo nomeado e têm topo e dimensões coerentes. O indicador Next é ambiente de desenvolvimento; a faixa fixa nas capturas longas não representa conteúdo ausente.

## fidelity

| Elemento/promessa | Estado | Evidência |
| --- | --- | --- |
| Mapa único contínuo 1–60 | match | desktop.png/mobile.png mostram os sessenta nós em uma ligação contínua, inclusive 20→21 e 40→41; não há troca de mapa por unidade. |
| TYPE — aplicativo | match | Sora/Plus Jakarta Sans e hierarquia compacta conservadas nas capturas de mapa, lição e loja; correspondem a OWN-WORLD e DESIGN.md. |
| TYPE — leitor | contradicted | scripts/autoria/leitor.mjs:6 herda system-ui para h1/h2; as capturas do leitor mostram outra voz de títulos. O craft floor recusa fonte de sistema como display, e DESIGN.md fornece Sora local. |
| MATERIAL | match | Diagrama matemático vetorial é geometria legítima, não substituto de uma imagem prometida; os novos itens usam SVG coerente. Bito existente não disputa a questão. Nenhum raster novo foi exigido pelo contrato. |
| GROUND | match | Campo escuro do aplicativo mantém a identidade existente; leitor usa papel claro e tinta escura conforme OWN-WORLD, sem aquecimento arbitrário. Não há comp para comparação de pixels. |
| THESIS e FIRST VIEWPORT do leitor | match | Título, explicação, seletores, posição e primeira tela aparecem na ordem prometida. Avanço/retorno seguem o conteúdo; no móvel os seletores empilham. |
| STORY e correção posterior de vidas | adaptation | A consulta sem penalidade permanece no leitor; as capturas lives/failed/review tornam explícita a alteração pedida: cinco vidas na atividade normal, derrota em zero, revisão sem perda. A correção posterior do usuário é a autoridade da adaptação. |
| Reposição e recuperação | match | Loja e mochila mostram os três consumíveis, preços, teto e restrição de não reviver derrota; tela de perda oferece recomeço com cinco vidas e explica preservação do histórico. |
| Figura didática no móvel | contradicted | reader-diagram-mobile.png reduz a figura inteira e seus rótulos a aproximadamente 6–8 px. A legenda textual é útil, mas a relação entre eixos, ângulos e coordenadas fica visualmente ilegível. |
| Verdade do leitor | match | Explica ausência de XP/notas, persistência local e natureza autoral/não oficial; não apresenta pontuação fabricada. As questões matemáticas visíveis estão corretas. |

## ceiling

O mundo existente já fornece os dispositivos necessários: percurso conectado, nó atual destacado, bancada concentrada, símbolos matemáticos e itens vetoriais. Não há justificativa para acrescentar ornamento ou motion nesta extensão. O acabamento fica abaixo do próprio sistema apenas nos títulos genéricos do leitor e na figura móvel reduzida sem adaptação de rótulos. Movimento, teclado e estados de rede não são certificáveis por capturas estáticas.

## material_fixes

1. [Floor / TYPE] Em scripts/autoria/leitor.mjs, carregar a Sora local já existente e aplicá-la aos títulos do leitor; regenerar o HTML, preservando funcionamento independente/offline. Manter os 18 px do corpo, que são adequados à leitura. Recapturar reader-desktop.png e reader-quiz-mobile.png.
2. [Floor / legibilidade didática] Adaptar a figura do ciclo unitário para o móvel: reduzir o espaço interno do SVG e reacomodar seus rótulos ou oferecer ampliação acessível da figura, de modo que ângulos e coordenadas possam ser lidos e associados à geometria. Preservar a legenda/alternativa textual. Recapturar reader-diagram-mobile.png e reader-diagram-desktop.png.

## keep

Preservar mapa contínuo 1–60, ação contextual do nó, indicação textual das vidas, recuperação explícita, revisão sem penalidade e leitura com autocorreção independente do aplicativo.
