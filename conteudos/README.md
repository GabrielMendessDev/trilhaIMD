# Banco de conteúdos e atividades

Use um arquivo JSON UTF-8 por ponto, por exemplo `conteudos/elementar/01.json`. Copie o [modelo inicial](ponto.modelo.json), substitua os campos de exemplo e complete a atividade com pelo menos 10 questões. O modelo inicial contém uma única entrada para mostrar a estrutura.

## Estrutura do arquivo

- `versao` identifica o formato do arquivo. Use `1`.
- `trilha` recebe o identificador do módulo. O banco inicia com `elementar`, `combinatoria`, `calculo`, `fmc` e `vga`, cada um com os pontos de 1 a 10.
- `ponto` é o número exibido no mapa. O importador verifica se o ponto existe nessa trilha.
- `conteudo` pode ser incluído para salvar material avulso do ponto. Use `blocos` na ordem de leitura e, se necessário, `resumo`.
- `atividades` agrupa atividades identificadas por `id` e `titulo`. Cada atividade tem um array `questoes` de entradas numeradas. O número deve ser positivo e único dentro da atividade. Preserve `id` e `numero` depois de publicar, pois ambos identificam o item no banco. Use `ordem` para inserir ou mover telas sem renumerar as existentes. Quando omitida, a ordem é o próprio `numero`.

### Entradas da atividade

| `modo` | Campos | Conta para o mínimo |
| --- | --- | --- |
| `conteudo` | `numero`, `modo`, `conteudo` | Não |
| `questao` | `numero`, `modo`, `questao` | Sim |
| `mista` | `numero`, `modo`, `conteudo`, `questao` | Sim |

Cada objeto `questao` tem `tipo`, `enunciado` e um `recurso` opcional. Use `assunto` para agrupar dificuldades no resultado, `orientacao` para uma dica sem gabarito e `explicacao` para justificar a solução. Mantenha explicações e exemplos nos blocos teóricos ou no feedback, separados da resposta esperada. Os outros campos dependem do tipo.

| `tipo` | Campos adicionais |
| --- | --- |
| `multipla-escolha` | `alternativas` com ao menos dois objetos `{ "id": "a", "texto": "..." }` e `gabarito` com o ID correto. |
| `associacao` | `itens` e `alternativas` com objetos `{ "id": "...", "texto": "..." }`, mais `gabarito` com um par `{ "origem": "...", "destino": "..." }` por item. Uma alternativa pode servir a vários itens. |
| `ligacao` | Mesmos campos da associação, com cada destino usado no máximo uma vez. |
| `passo-a-passo` | `passos` com ao menos dois objetos que tenham `id`, `titulo` e `blocos`, na ordem do roteiro. |

Um objeto `conteudo` possui `blocos` e pode ter `resumo`, `titulo` e `categoria`. Nas entradas da atividade, `categoria` aceita `explicacao`, `diagrama` e `material`. Use `material` para disponibilizar a tela também na biblioteca da etapa. Um exemplo resolvido usa o tipo `passo-a-passo`. Cada bloco possui `id` e aceita um dos seguintes tipos.

- `titulo` ou `texto`, ambos com o campo `texto`.
- `imagem` com `src`, `alt`, `largura`, `altura` e `legenda` opcional. Use um caminho público como `/materiais/figura.png` ou uma URL HTTPS.
- `diagrama` com `legenda` e `dados`. O campo `dados.modelo` aceita `venn`, `reta`, `inclusao` e `quadro`.
- `formula` com `leitura` acessível e `termos`. Cada termo declara `forma` como `texto`, `fracao`, `raiz` ou `potencia`. O renderizador gera MathML.
- `referencia` com `titulo`, `fonte` e `url` HTTPS verificada. A interface identifica a referência como material externo.
- `montagem` com `componente` e `dados`. O identificador aponta para um componente que a aplicação poderá renderizar, e `dados` armazena seus parâmetros em JSON.

O `recurso` de uma questão aceita `imagem` ou `montagem` com os mesmos campos, dispensando o `id` de bloco.

Para autoria, explique a aplicação com um exemplo familiar, nomeie a notação, pratique o reconhecimento e intercale um novo conceito com uma atividade aplicada. Use [Matemática Elementar](elementar/unidade-1/README.md) como referência de sequência e exemplos de cada bloco.

O [esquema dos recursos pedagógicos](../src/app/aprender/_etapa/pedagogy.mjs) descreve os campos de cada modelo de diagrama e termo de fórmula.

## Preparação do PostgreSQL

Com a `DATABASE_URL` apontando para o banco desejado, execute em um banco vazio:

```sh
npm run db:migrate
npx prisma generate
```

Se o banco já contém as tabelas originais de login e posts criadas com `db:push`, confira se correspondem à [migração inicial](../prisma/migrations/0_init/migration.sql). Nesse caso, registre `0_init` como aplicada uma única vez com `npx prisma migrate resolve --applied 0_init` antes de rodar os comandos acima. As migrações seguintes adicionam o catálogo de aprendizagem e o progresso por estudante às tabelas existentes. [Documentação do Prisma sobre baselines](https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/baselining)

## Validação e importação

```sh
npm run conteudo:validar -- conteudos/elementar/01.json
npm run conteudo:importar -- conteudos/elementar/01.json
```

A validação funciona sem banco e informa o caminho dos campos inválidos. Ela verifica o formato, números e IDs duplicados, referências do gabarito e o mínimo de 10 entradas `questao` ou `mista` por atividade.

A importação valida o arquivo inteiro antes de abrir uma transação. Ela localiza o ponto, atualiza seu conteúdo quando fornecido e grava cada atividade pelo seu ID e suas entradas pelo número. Ao reimportar uma atividade, sua lista de questões é substituída pela lista do arquivo. Atividades omitidas e conteúdo avulso omitido permanecem no banco.

No PostgreSQL, cada trilha possui pontos, cada ponto pode ter conteúdo avulso e várias atividades, e cada atividade possui entradas. Alternativas, recursos e blocos ficam em colunas `JSONB`. O gabarito fica em uma coluna separada dos dados de apresentação. A migração também verifica o mínimo de 10 questões ao confirmar a transação.

## Progresso de estudo

Pontos com conteúdo ou atividades importadas entram no percurso de estudo. As etapas publicadas de uma disciplina são abertas em ordem. Materiais podem ser consultados pela biblioteca da etapa. Aberturas, leituras e exemplos guiados fazem parte da sequência e ficam fora da contagem de questões respondidas.

O servidor grava a primeira tentativa e avança após o feedback. Quando a primeira rodada termina, somente as questões erradas voltam, na ordem da lição. Na segunda tentativa incorreta, a interface mostra a resposta e sua explicação. O bloqueio da linha de progresso no PostgreSQL impede que envios concorrentes alterem uma tentativa ou repitam a conclusão.

O desempenho vale 1 ponto por acerto direto, 0,5 por recuperação e 0 por erro definitivo. Os acertos anteriores à migração mantêm seu registro sem receber uma rodada retroativa. A primeira conclusão credita `TrailPoint.xpReward`, que começa em 10 XP e é independente do percentual de desempenho. Para a ofensiva, cada dia com pelo menos uma etapa concluída vale um dia no fuso `America/Sao_Paulo`.

Execute `npm run test:aprendizagem` para verificar a lógica e os arquivos da Unidade 1. Para o teste de integração, aplique as migrações, importe a unidade e inicie o servidor local. `npm run test:aprendizagem:http` usa `http://127.0.0.1:3317` por padrão e a `DATABASE_URL` do ambiente local. `TRILBIT_TEST_URL` e `TRILBIT_TEST_DATABASE_URL` permitem apontar para outro app e banco locais. O teste usa contas descartáveis e remove os próprios registros ao terminar.

## Feedback e microinterações

O `FeedbackProvider` mantém os avisos e o estado de navegação entre telas. `ActionLink` liga a navegação ao retorno de carregamento do Next e `ActionButton` compartilha os estados de envio, erro e desabilitado. Os avisos aparecem na área de conteúdo, abaixo do cabeçalho, com fechamento manual e anúncios para leitores de tela. Uma falha de envio mantém a escolha e libera o botão para tentar novamente. O resultado registrado continua acessível depois que o aviso temporário termina.

As celebrações usam o registro de conclusão do servidor. XP, nova etapa e conquistas são agrupados em um aviso. A celebração de conclusão é lembrada no navegador para evitar repetição ao recarregar. Os efeitos das respostas são lembrados durante a sessão. Quando o armazenamento do navegador está bloqueado, o resultado e os valores continuam disponíveis. A animação opcional é dispensada.

`npm run test:feedback` verifica conquistas e repetição de eventos. `npm run test:feedback:browser` exercita o app no Chrome com lentidão e erro de rede simulados, teclado, tela móvel e movimento reduzido. A URL padrão desse teste é `http://127.0.0.1:3318`. `TRILBIT_TEST_CHROME` define o executável do Chrome e `TRILBIT_SCREENSHOTS` pode apontar para uma pasta existente para guardar capturas. Todos os registros criados pelo teste usam contas descartáveis removidas no encerramento.

Para executar uma instância de teste ao lado do servidor de desenvolvimento, configure `TRILBIT_NEXT_DIST_DIR=.next-feedback-check` antes de iniciar `next dev --hostname 127.0.0.1 --port 3318`. Isso separa os arquivos de compilação. As regras de conquistas são compartilhadas entre a tela de resultado e a página de Conquistas em `src/server/learning-metrics.ts`.
