# Experiência de aprendizagem

O redesign global organiza a Home pelo percurso da unidade atual. Missões, próxima conquista, ofensiva, revisões e recursos apoiam a continuidade. Disciplinas têm páginas próprias e capítulos com objetivos, lições publicadas, progresso e bloqueios. Trilhas sem publicação permanecem identificadas como preparação.

Na lição, a navegação lateral cede espaço ao conteúdo central. A resposta é enviada ao selecionar uma alternativa ou completar associações/pares. O primeiro erro recebe orientação; somente as questões erradas retornam ao fim, com mais uma tentativa. A conclusão apresenta domínio, recuperação, assuntos para rever, XP e Bits e oferece retorno manual ao mapa. Nenhuma animação concede recompensa ou libera uma terceira tentativa.

As explicações preservam os blocos do catálogo e seus exemplos cotidianos/de TI. Conceitos compatíveis de conjuntos incluem exploração livre de pertinência e inclusão; essa exploração não registra tentativa nem concede pontos. Conteúdo adicional usa expansão nativa para conservar o foco sem excluir a leitura.

`src/server/study-insights.ts` deriva missões, precisão da primeira tentativa, recuperações, recomendações e histórico do progresso/eventos persistidos. O bônus diário continua pertencendo à primeira conclusão válida do dia; completar metas visuais não concede créditos adicionais. `getCompletionBits` consulta o registro de transações da conclusão, inclusive em revisitas.

A Mochila usa seleção de slots e painel de detalhes. Loja, conquistas, inventário e auxílios preservam as transações, os limites, a elegibilidade e os valores documentados em `rpg-economia.md`. Cadastro é o primeiro acesso Google; não há senha local. Ranking permanece em preparação.

## Navegação e regressões

A resposta da API distingue `destination` (feedback salvo) de `continueTo` (próximo item calculado no servidor). O formulário conserva os controles montados e atualiza o endereço com `history.replaceState(null, "", destination)`. Não passar `history.state`: ele contém marcadores internos que fazem o Next ignorar a atualização dos hooks de rota. A continuidade aparece quando os parâmetros refletirem o feedback confirmado, impedindo que um clique imediato concorra com a restauração do histórico. A confirmação da montagem das telas usa efeitos de layout para resolver a transição antes da pintura.

O teste `npm run test:experience:browser` cobre o percurso global, os temas e seis larguras; os resultados e as capturas ficam em `.impeccable/review` quando `TRILBIT_SCREENSHOTS` é definido. As suítes de aprendizagem, feedback e RPG verificam separadamente respostas, revisão, falha de rede, compras, itens e integridade. Usar apenas servidor e banco locais nos testes de integração e executá-los sequencialmente. O relatório de execução está em `tests/global-audit.md`; o sistema visual está em `DESIGN.md` e `.impeccable/design.json`.
