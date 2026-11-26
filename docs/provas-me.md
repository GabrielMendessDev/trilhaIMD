# Provas das três unidades de ME

Cada unidade possui uma prova independente com 20 questões autorais, quatro alternativas por questão e correção comentada após a entrega. O formato da Prova 1 foi compartilhado pelas três páginas e rotas de resposta.

| Prova | Etapas exigidas | Assuntos |
| --- | --- | --- |
| 1 | 1–20 | Conjuntos, reais, intervalos, potências, radicais, logaritmos, sistemas, equações e inequações. |
| 2 | 21–40 | Polinômios, operações, produtos notáveis, fatoração, raízes e multiplicidades, divisão, resto, Ruffini, raízes racionais, relações, funções, domínio, imagem, classificação, composição, inversa, retas e parábolas. |
| 3 | 41–60 | Simetria, funções por partes, periodicidade, exponenciais e logaritmos, modelos multiplicativos, trigonometria no triângulo e no ciclo, radianos, razões recíprocas, identidades, adição de ângulos, gráficos, matrizes, determinantes e inversas 2×2 e 3×3. |

As provas ficam acessíveis no plano de unidades e na conclusão das etapas 20, 40 e 60. O servidor verifica todas as conclusões da respectiva unidade, inclusive em requisições diretas. As etapas continuam seguindo a progressão normal do mapa. O acesso não exige nota mínima em uma prova anterior, seguindo as regras da Prova 1.

As respostas são salvas ao avançar. É possível retomar, revisar respostas antes da entrega e iniciar uma nova tentativa. A entrega exige as vinte respostas. A nota é a quantidade de acertos dividida por dois, de 0 a 10. Não há cronômetro, nota mínima, consumo de vidas, uso de itens ou XP extra nas provas, conforme a implementação original.

Históricos e tentativas são filtrados por usuário **e unidade**, incluindo leituras, salvamento e entrega. O controle de revisão e a transação com bloqueio da tentativa evitam que uma aba antiga substitua uma resposta mais recente. Tentativas entregues permanecem imutáveis.

## Banco e compatibilidade

Antes de disponibilizar as novas rotas, execute `npm run db:migrate` no ambiente correspondente e publique/reinicie a aplicação com o cliente Prisma atualizado (`npm ci` executa `prisma generate`).

A migração `20261124000100_me_exam_units` acrescenta `unit` a `MeExamAttempt`, com valor padrão 1, restrição aos valores 1–3 e índice para o histórico por unidade. As tentativas existentes continuam sendo da Prova 1. Questões, gabaritos, respostas, versões, notas e datas antigas não são reescritos. O banco da Prova 1 permanece na versão 2; as Provas 2 e 3 começam na versão 1. Cada tentativa guarda seu próprio snapshot.

Não é necessário republicar o catálogo de aprendizagem para habilitar as provas em um ambiente que já possui as 60 etapas atuais. O conteúdo das lições, a economia, os níveis, a loja, as vidas e os dados de analytics não foram modificados por esta implementação.

## Conferência

- `npm run verify`: tipos, testes e validação do catálogo completo.
- `npm run test:prova`: integridade dos bancos, cobertura de assuntos, correção e cálculos independentes dos gabaritos.
- `TRILBIT_TEST_URL=<origem-local> npm run test:prova:http`: liberação das três unidades, tentativas, histórico, concorrência, propriedade e isolamento entre provas.
- `TRILBIT_TEST_URL=<origem-local> npm run test:prova:browser`: questões iniciais e finais, retomada e resultado em desktop/celular e movimento reduzido. `TRILBIT_SCREENSHOTS` pode indicar uma pasta de capturas.

Os testes de integração criam estudantes descartáveis e exigem origem e PostgreSQL locais. Use um banco de testes separado. Os gabaritos novos foram conferidos também por substituição em polinômios, reconstrução de divisões, valores trigonométricos e multiplicação das matrizes por suas inversas nos dois sentidos.

O desafio integrador opcional separado continua em preparação; a missão da etapa 60 permanece na sequência normal da trilha.
