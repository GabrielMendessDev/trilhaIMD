# Otimizações implementadas

Diego — 16/11/2026.

## Dados e consultas

- Recomendações buscam somente identidade e assunto das questões, em lote. Foram removidas as duas consultas de conteúdo por lição estudada. Um teste com 60 lições confirma uma consulta de metadados; o snapshot publicado também pode ser reutilizado entre requisições.
- Missões diárias têm uma consulta própria de eventos e a verificação de inicialização da carteira, sem carregar progresso ou conteúdo das lições.
- O progresso básico foi separado do resumo de RPG. O envio de respostas usa o progresso básico e devolve apenas saldo e novas conquistas.
- A leitura resumida de RPG usa cinco consultas para uma conta já reconciliada, sem históricos. O saldo de uma resposta sem novas conquistas usa duas consultas. São contagens verificadas na fronteira do banco pelos testes locais, não medições de latência em produção.
- `settledDay` evita repetir o bloqueio/reconciliação da carteira no mesmo dia. Inicialização e virada do dia continuam transacionais; compras, respostas e recompensas preservam bloqueio e idempotência.

## Cache e publicação

O cache compartilhado contém apenas catálogo público e metadados de questões. A chave inclui um hash da conexão do banco e a revisão do catálogo. Progresso, saldo, tentativas e gabaritos de correção permanecem fora desse cache.

Triggers incrementam a revisão na mesma transação das alterações em trilhas, pontos, conteúdos, atividades e entradas. Isso cobre os importadores CLI existentes e evita publicar uma invalidação caso a transação seja desfeita. Cada requisição confere a revisão; nenhuma chave de API ou chamada HTTP de invalidação é necessária.

## Frontend e manutenção

- Removido `TRPCReactProvider` do layout global. O endpoint de exemplo e seus arquivos foram preservados; as rotas do produto usam suas APIs existentes.
- Cores, temas, raios e sombras globais centralizados em `src/styles/tokens.css`. Valores já sobrescritos em `experience.css` foram removidos. Os valores efetivos e a identidade do produto foram preservados.
- Biome verifica código, scripts, testes e configurações autorais. O JSON de verificações gerado pelo conteúdo, clientes Prisma, caches e relatórios ficam fora da verificação de formatação.
- Adicionados `npm test` e `npm run verify`. A checagem de tipos gera as definições do Next antes de executar TypeScript, permitindo um checkout limpo no CI.
- Workflow de qualidade verifica código, conteúdo, testes e build com Node 24. As versões das ações seguem as referências oficiais de [checkout](https://github.com/actions/checkout) e [setup-node](https://github.com/actions/setup-node).

## Banco e ativação

Aplicar a migração antes de iniciar o app atualizado sobre um banco existente:

```sh
npm run db:migrate
```

`20261116000100_read_models` adiciona a revisão do catálogo, `RpgWallet.settledDay` e três índices: eventos por usuário/data, transações e usos de item por usuário/ID. A migração não apaga dados de estudantes.

O teste de integração usa `EXPLAIN (ANALYZE, BUFFERS)` em dados descartáveis. O filtro diário de eventos usou o índice novo. As consultas de históricos também são examinadas com 40 usuários e 20.000 registros por tabela; a escolha de índice permanece a cargo do planejador e depende de distribuição e custos. Nenhum percentual de ganho em produção é afirmado.

## Verificação reproduzível

```sh
npm run verify
npm run build
npm run test:vidas:local
```

O último comando requer PostgreSQL 16 e Chrome locais no Windows e cria banco/servidor descartáveis. `-- --read-models` executa a rodada focada de modelos de leitura e navegador. Artefatos ficam em `tests/artifacts/optimization/`, ignorado pelo Git. O ambiente e o banco do `.env` do estudante não são alterados.

O lint ainda informa avisos anteriores de especificidade CSS, `!important` e cookie do seletor de tema; eles não foram ocultados nem transformados em alegações de falhas visuais. Não houve reordenação ampla de seletores apenas para silenciar o detector.

## Resultados desta entrega

- `npm run verify` passou: lint sem erros, tipos, testes e validação dos 60 passos. Permanecem 155 avisos e 26 informações já descritos acima.
- 36 testes locais passaram, incluindo quatro regressões dos modelos de leitura e cache.
- Schema Prisma válido e build de produção concluído. O build informa 103 KB de JavaScript compartilhado e 125 KB no primeiro carregamento da Home; não há um build anterior equivalente para afirmar uma redução percentual.
- PostgreSQL descartável: migrações, preservação do histórico na publicação, vidas, requisições concorrentes/idempotentes, reconciliação diária, leitura durante bloqueio da carteira e invalidação após commit/rollback conferidos.
- Os três índices foram criados. O índice de eventos foi escolhido pelo planejador; nos históricos sintéticos, foram escolhidas `CurrencyTransaction_pkey` e `ItemUsage_pkey`. Nenhuma escolha de plano foi forçada no teste.
- Navegador: mapa, leitor completo, mochila, perda e reposição de vidas, recomeço, revisão e loja passaram. Conferidos os temas e raios após centralização de tokens, ausência de overflow e erros de JavaScript. São Chrome headless e viewport móvel emulado de 390 px; não constituem teste em aparelho físico.
- Foi corrigida uma sincronização do teste: ele agora aguarda a hidratação do formulário antes do clique que esgota a última vida.
- Logs e capturas da rodada ficam em `tests/artifacts/optimization/`. A migração foi aplicada somente ao banco descartável; o banco configurado pelo estudante permanece inalterado.
