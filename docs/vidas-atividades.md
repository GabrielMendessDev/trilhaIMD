# Vidas nas atividades

Cada atividade de um ponto começa com **5 vidas**. Uma resposta incorreta na primeira rodada desconta exatamente uma vida. Acertos, leitura e exemplos guiados não descontam vidas. A revisão mantém as vidas restantes, mesmo quando uma resposta está errada.

Ao chegar a zero, a atividade fica perdida: o servidor bloqueia novas respostas e itens naquele percurso, não registra conclusão, não credita a recompensa da etapa e não libera o próximo ponto. O estudante pode consultar os materiais e **recomeçar do início com 5 vidas**. As outras etapas, o inventário e o saldo da conta permanecem. O histórico da rodada perdida é guardado em `RpgEvent` antes de limpar o progresso da execução atual.

O mapa de Matemática Elementar é único e contínuo, do passo **1 ao 60**. As três unidades continuam organizando o conteúdo pedagógico e seus arquivos, sem separar o mapa em telas.

## Itens de reposição

| Item | Preço em Bits | Efeito |
| --- | ---: | --- |
| Gota de Vida | 25 | Repõe 1 vida. |
| Poção de Vida | 65 | Repõe até 3 vidas. |
| Elixir de Fôlego | 95 | Completa as vidas até 5. |

Os três itens são consumíveis, têm estoque máximo de 20 e são usados pela Mochila durante uma questão da rodada normal. O servidor recusa usar com vidas cheias, em revisão, em resposta já encerrada, fora da questão atual, sem estoque ou em atividade perdida. Valores excedentes não passam do limite de cinco. Repor vida não altera acertos, não apaga erros e não marca a resposta como assistida. A atividade perdida exige recomeço; os consumíveis não a revivem.

## Persistência e concorrência

A migração `20261112000100_vidas_atividades` adiciona `lives` e `run` a `LearningPointProgress`, com limites no PostgreSQL. Registros anteriores recebem cinco vidas sem penalidade retroativa. Resposta, perda de vida, estoque e recompensa usam transações e o bloqueio da carteira já existente. Uma resposta repetida é devolvida a partir do registro anterior e não perde outra vida. Compra, uso e recomeço têm identificadores de operação para suportar repetição sem consumir duas vezes. O número da execução impede aceitar um envio antigo depois do recomeço.

A mesma migração adiciona o estado de arquivo às trilhas. Ao publicar a nova distribuição em um banco com progresso antigo, o publicador arquiva os pontos anteriores como `elementar-v1-20261112`, preservando os registros e seu XP. Os 60 passos recebem IDs novos. O catálogo, os bloqueios e os itens consideram apenas trilhas ativas; o histórico de conclusões continua mostrando a versão anterior. O arquivamento não concede recompensas nem altera as carteiras.

Recomeçar não repete eventos de recompensa das mesmas questões, e a conclusão de um ponto continua sendo premiada uma única vez. Em cada execução, o desempenho vem das respostas daquela execução; o histórico de uma rodada perdida continua no evento de auditoria.

## Verificação

- `npm run test:vidas`: regras de perda, revisão, repetição e limites de reposição.
- `npm run test:elementar`: 60 passos, 1.020 telas, 600 questões, recursos locais e verificações matemáticas independentes.
- `npm run test:vidas:local`: inicia PostgreSQL e aplicação descartáveis, aplica as migrações SQL, importa os 60 passos e testa HTTP e navegador. Requer PostgreSQL 16 local e Chrome. `TRILBIT_PG_BIN` pode indicar outra instalação.

O teste local usa portas livres e uma pasta temporária própria; não edita `.env` nem o banco configurado do estudante. O script encerra seus próprios processos e remove a pasta temporária ao terminar. As capturas ficam em `tests/artifacts/elementar-60`.
