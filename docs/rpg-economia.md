# RPG do Trilbit

Implementação de 11/11/2026. Catálogo e parâmetros em `src/domain/rpg.ts`; transações e eventos em `src/server/rpg.ts`; efeitos pedagógicos em `rpg-actions.ts` e `rpg-support.ts`. A migração `20261111000100_rpg_economy` adiciona as tabelas sem excluir progresso ou alterar o XP já creditado nas lições.

## XP, nível e Bits

XP da conta = XP das lições concluídas + XP das conquistas concedidas. Compras usam exclusivamente Bits. Nível = `floor(sqrt(XP / 100)) + 1`. Não há pagamentos ou sorteios.

Primeira conclusão válida de uma lição: 10 Bits; sem erros, pulos ou auxílio: mais 5 Bits. Primeira conclusão válida do dia: mais 10 Bits, uma vez por data em America/Sao_Paulo. Login, abertura de página, resposta repetida, recarga e releitura não geram moedas. Conclusão exige todas as telas encerradas, revisão finalizada e respostas em pelo menos metade das questões. As conquistas têm os 41 requisitos, sete categorias e valores do pedido, com IDs estáveis e concessão única.

Um iniciante pode obter mais de 35 Bits na primeira lição válida com as primeiras conquistas. Dica custa 35; escudo 140; cosméticos 160–300. Todas as etapas continuam disponíveis sem compras. Explicações, dicas normais de revisão e exemplos básicos continuam gratuitos.

## Eventos e integridade

Questão e rodada formam um evento único; lição, material e dia também têm chaves únicas. Eventos atualizam somente métricas relacionadas. `UserAchievement` e `CurrencyTransaction` têm unicidade por conta e identificação. Saldo, estoque, histórico, efeitos e progresso são gravados na mesma transação, com bloqueio da carteira antes de qualquer outro bloqueio. Operações concorrentes respeitam o mesmo saldo. Respostas e usos competem pelo mesmo bloqueio, impedindo auxílio depois da resposta salva.

O cliente apresenta valores confirmados. Cada compra, equipamento e uso tem UUID conservado durante novas tentativas da mesma operação. Reenviar o UUID retorna o resultado salvo; mudar item/contexto/equipamento com o mesmo UUID é rejeitado. Validações ou falhas de banco não consomem itens. Restrições do banco impedem saldos e quantidades negativos. O histórico guarda débitos, créditos, saldo posterior, usos e referência à questão. A interface mostra as 50 movimentações e os 30 usos mais recentes; registros antigos permanecem no banco.

Respostas certas com auxílio continuam corretas para o desempenho pedagógico, mas não contam para combo, acertos diretos elegíveis ou lição perfeita. Revisão não infla combo nem acertos diretos. Erro ou auxílio interrompe combo; lição imperfeita interrompe a sequência de lições perfeitas. Recuperação exige segunda tentativa correta em questão única; revisão perfeita exige ao menos um erro inicial e recuperação de todos os erros sem auxílio.

## Mochila e compatibilidade

| Item | Bits | Regra |
|---|---:|---|
| Escudo da Ofensiva | 140 | Até três no estoque; uma proteção antecipada ativa |
| Passe de Questão | 100 | Primeira rodada, confirmação, zero pontos; preserva mínimo de 50% respondido |
| Pergaminho da Dica | 35 | Orientação contextual existente, sem gabarito |
| Lente das Alternativas | 65 | Múltipla escolha; remove até duas incorretas, mantendo ao menos duas opções |
| Pergaminho do Exemplo | 50 | Outro exemplo da mesma habilidade, com dados diferentes |
| Troca de Desafio | 110 | Variante revisada da mesma habilidade/dificuldade, antes de outros auxílios |
| Adiamento Tático | 45 | Uma vez, antes da primeira resposta; retorna após as telas iniciais, antes da revisão |
| Moldura Arcana | 160 | Permanente; moldura do avatar |
| Caminho Estelar | 220 | Permanente; aparência das conexões e nós do mapa |
| Bito Companheiro | 300 | Permanente; companhia nas áreas de exploração, sem cobrir questões |

Demais consumíveis têm limite de 20 unidades. Cosméticos têm limite de uma compra, sem consumo ao equipar. Nos checkpoints 5 e 10, apenas a última questão corrigível é a verificação essencial e não aceita pulo/troca; as questões de prática anteriores continuam elegíveis. A autoria também pode marcar uma questão com `essencial: true`, em qualquer ponto. Essa marcação é lida do conteúdo original, e uma variante não pode removê-la. Cada auxílio é aplicado uma vez por questão. Escudo e cosméticos são ativados/equipados pela Mochila da conta; seis consumíveis aparecem na mochila da lição. Sem estoque ou compatibilidade, a interface explica o motivo e não cobra.

O conjunto inicial de exemplos/variantes cobre a primeira habilidade de cada ponto da Unidade 1. Outras habilidades mostram indisponibilidade até receberem conteúdo adicional revisado. Não há substituição genérica por questão de outro assunto. A identidade da variante é validada ao responder e restaurada na recarga. Alternativas retiradas também são recusadas no servidor. O gabarito não é enviado no catálogo público nem na mochila.

A auditoria do catálogo publicado está em `auditoria-itens.md`, com a matriz por ponto e o resultado reproduzível em `tests/artifacts/items-availability.json`. Passe e adiamento avançam para o destino confirmado pelo servidor e atualizam a lição; a mochila da questão anterior não é recarregada após um item que muda de tela.

Pulo registra uma entrada separada e não cria resposta nem acerto antigo. A questão pulada não retorna na revisão. Adiamento não gasta tentativa; uma resposta errada ainda tem apenas uma revisão. Requisições fora de ordem ou de terceira rodada são rejeitadas. Ao terminar, a ação principal continua sendo **Voltar ao mapa**.

## Ofensiva

Resposta nova salva, conclusão válida ou material verificado registra um dia real. Proteção exige ofensiva ainda válida e ativação antecipada. Escudo é reservado/consumido na ativação e cobre automaticamente o primeiro dia perdido elegível. Não recupera ofensiva encerrada, acrescenta dia estudado ou concede XP/Bits. Dois dias perdidos consecutivos encerram a sequência. Calendário e Mochila distinguem dias reais e protegidos.

## Exploração e materiais

Trilha concluída exige as dez etapas planejadas concluídas, incluindo checkpoints. A arquitetura atual tem uma trilha para cada disciplina; conclusão de disciplina usa essa relação real. Metas maiores permanecem disponíveis para expansão do catálogo, sem fabricar trilhas ou materiais.

Material complementar exige ao menos 15 segundos desde o início registrado no servidor e uma verificação conceitual correta. Abrir/fechar ou repetir a mesma verificação não incrementa o total. Tempo sozinho não conclui o material. A pergunta é vinculada ao conceito do ponto.

## Contas existentes e manutenção

Na primeira inicialização, o motor importa conclusões existentes uma vez, usando datas e tentativas disponíveis. Não inventa datas de estudo para respostas antigas sem timestamp, nem presume perfeição sem tentativas detalhadas. O XP original das lições é preservado; bônus de conquista são adicionais. Materiais antigos sem comprovação precisam ser verificados novamente. Eventos e recompensas únicos impedem duplicação.

Definições são centralizadas no código e registradas pela migração para integridade referencial. Novos IDs precisam de migração; preços e limites existentes são configurados no domínio. Recompensas já concedidas guardam o valor histórico. Não edite uma migração aplicada. Em outro ambiente, execute `npm run db:migrate` antes de subir esta versão.

## Verificação

- `test:rpg`: catálogo, alcance das 41 metas por eventos, sete categorias, combo, revisão, perfeição, calendário, pulo, adiamento e duas tentativas.
- `test:rpg:http`: PostgreSQL e contas temporárias; compras insuficientes, duplicadas e concorrentes; dez compras; equipamentos; invalidações sem consumo; efeitos; recarga; conclusão assistida/perfeita; revisão; material e proteção.
- `test:rpg:browser`: Chrome isolado, 1440×1000 e 390×844; compra, saldos, inventário, filtros, foco, mochila lateral/inferior, dica/lente, Escape e movimento reduzido. `TRILBIT_SCREENSHOTS` habilita capturas.
- Suítes anteriores `test:aprendizagem`, `test:feedback`, `test:aprendizagem:http` e `test:feedback:browser` verificam compatibilidade com progressão, correção automática, revisão e retorno ao mapa.

Testes HTTP/browser exigem o app local em `TRILBIT_TEST_URL` (padrão RPG 3318) e banco local configurado. Créditos artificiais existem somente em fixtures identificadas de contas descartáveis, removidas ao final.
