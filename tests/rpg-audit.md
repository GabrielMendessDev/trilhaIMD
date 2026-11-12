# Validação do sistema RPG

Executada em 11/11/2026, com PostgreSQL local e Next.js 15.5.25. Contas de testes são descartáveis e removidas no `finally`; os créditos usados para testar itens caros são fixtures identificadas, sem alterar carteiras reais.

| Verificação | Resultado |
|---|---|
| `npm run build` em diretório isolado | Passou, incluindo `/loja`, `/mochila`, `/conquistas` e `/api/rpg` |
| `npm run typecheck` | Passou |
| `npx prisma validate` | Passou |
| Biome nos 23 arquivos TS/TSX/testes do RPG | Sem erros ou avisos |
| `test:aprendizagem` | 6 testes passaram |
| `test:feedback` | 4 testes passaram |
| `test:rpg` | 5 testes passaram |
| `test:aprendizagem:http` | Passou com progressão, duas tentativas e XP original |
| `test:rpg:http` | Passou com transações reais e importação histórica |
| `test:feedback:browser` | Passou com correção automática, revisão e retorno ao mapa |
| `test:rpg:browser` | Passou em desktop e celular, com temas e feedback restaurado |

São 19 testes em sete suítes. O teste RPG HTTP verifica saldo insuficiente, compra repetida com mesmo UUID, compras simultâneas, dez itens, cosmético único, equipamentos, consumo inválido sem débito, seis efeitos pedagógicos, persistência, conclusão assistida/perfeita, revisão, material verificado, escudo, checkpoint essencial, conclusão de trilha/disciplina e importação única preservando o XP original. As 41 metas são exercitadas pelos eventos no teste de domínio.

No Chrome isolado: 1440×1000 e 390×844, compra confirmada no servidor, filtros, estoque após recarga, foco em diálogos, Escape, dica/lente/exemplo, resposta corrigida restaurada, conquista por evento real, temas claro/escuro e movimento reduzido. Capturas ficam em `.impeccable/review/rpg-*.png`. As imagens são evidência de contas de teste, não métricas de usuários reais.

O servidor de desenvolvimento reiniciou automaticamente por limite de memória durante uma execução; o teste interrompido foi repetido e passou. Uma asserção inicial usava a alternativa/nome incorretos da fixture e foi corrigida antes das execuções finais. A tecla Escape usa o código nativo de teclado no teste CDP.

## Revisão de interface

Detector Impeccable executado uma vez: zero achados primários, 72 recomendações sobre escalas de fonte, raios e duas cores em relação ao documento existente. O CSS também tem avisos de ordenação/especificidade entre componentes distintos e uso intencional de `!important` para movimento reduzido. Eles não indicam falha de compilação. Não houve segundo detector nem correção ampla de documentação anterior fora do escopo.

Revisão independente: três ajustes pedidos e resolvidos em um lote — cores de raridade, celebração compacta e persistência visual de lente/dica/exemplo no feedback salvo. Veredito `ship` para esses três itens; ver `rpg-finish-review.md`. A documentação e os limites efetivos de compatibilidade estão em `docs/rpg-economia.md`.

## Limites explícitos

Variantes e exemplos adicionais cobrem a primeira habilidade de cada um dos dez pontos. Fora dessa cobertura, o item fica indisponível, com motivo e sem consumo. Metas maiores que o catálogo atual permanecem para expansão real, sem fabricar conclusões. A relação atual entre trilha e disciplina é de uma para uma. Não foram necessários serviços pagos, bibliotecas de animação ou compras com dinheiro real.
