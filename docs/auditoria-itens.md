# Auditoria dos itens — 12/11/2026

Foram auditados os dez itens e as 129 questões publicadas da Unidade 1 de Matemática Elementar. A compatibilidade da mochila e o uso no servidor passam pela mesma função, `itemCompatibility`, em `src/server/rpg-actions.ts`. O levantamento usa a API real, PostgreSQL local e contas temporárias, removidas ao final; nenhuma conta real recebe estoque, moedas, respostas ou mudanças de progresso.

## Problemas corrigidos

1. A condição `number % 5 === 0` bloqueava todas as questões dos pontos 5 e 10 para passe/troca. Agora apenas a última questão corrigível desses pontos é a verificação essencial. São as entradas `5-12` e `10-12` do catálogo atual. As outras 18 questões de prática desses dois pontos deixam de receber o bloqueio indevido. A autoria pode marcar outras questões com `essencial: true`; uma variante não remove essa obrigatoriedade.
2. Passe e adiamento salvavam o efeito, mas podiam manter a tela antiga. A mochila agora trata itens que avançam antes de aplicar/recarregar o modelo anterior, navega ao destino confirmado e atualiza os dados da lição. Isso também evita apresentar falha da recarga de uma mochila antiga como se o uso já confirmado tivesse falhado.

## Resultado por item

Os números abaixo são **contextos independentes de compatibilidade**: primeira rodada, questão atual, estoque positivo, sem resposta, sem pulos e sem auxílios prévios. Não representam quantas vezes se pode usar um item na mesma sessão. Os testes simulam cada posição com fixtures isoladas e consultam a mesma API da interface.

| Item | Disponibilidade atual | Critérios e bloqueios legítimos |
| --- | --- | --- |
| Passe de Questão |127/129 questões| Antes da primeira resposta; confirmação; fora das duas verificações essenciais; preservar pelo menos 50% respondido na lição. Pulo vale zero, não volta na revisão e invalida perfeição. |
| Pergaminho da Dica |129/129| Orientação contextual existente e válida, ainda não aberta. Pode ser usado antes de responder na primeira rodada ou na revisão, se não foi consumido antes. |
| Lente das Alternativas |106/129| Múltipla escolha com pelo menos três opções; remove até duas incorretas e mantém pelo menos duas. As outras 23 são associação/ligação. Uma aplicação por questão. |
| Pergaminho do Exemplo |11/129| Habilidade com exemplo adicional revisado e ainda não aberto. Não fornece resposta da questão. |
| Troca de Desafio |11/129| Variante cadastrada da mesma habilidade/dificuldade; primeira rodada; antes de dica, exemplo, lente ou outra troca; fora da verificação essencial. Não cria tentativa extra. |
| Adiamento Tático |119/129| Primeira rodada, uma vez por questão, com outra tela pendente para estudar. As dez questões finais não têm para onde adiar. Retorna antes da revisão e continua exigindo resposta. |
| Escudo da Ofensiva |Mochila da conta| Estoque, ofensiva válida e nenhuma proteção já armada. Ativação antecipada; não recupera sequência encerrada, não soma dia estudado, XP ou Bits. |
| Moldura Arcana |Mochila da conta| Cosmético comprado; equipar/desequipar sem consumo. Aparece no avatar do cabeçalho e perfil. |
| Caminho Estelar |Mochila da conta| Cosmético comprado; equipar/desequipar sem consumo. Altera nós/conexões do mapa, preservando bloqueios e progresso. |
| Companheiro do Bito |Mochila da conta| Cosmético comprado; equipar/desequipar sem consumo. Aparece fora das lições. Limitação atual de apresentação: o acompanhamento é ocultado pelo CSS em telas pequenas; o equipamento continua registrado e listado no Perfil. |

Escudo e cosméticos não são consumíveis da questão. Os seis consumíveis aparecem na mochila da lição. A questão precisa estar disponível e ainda não encerrada; releitura de uma lição concluída não reabre usos. Sem estoque, sem compatibilidade ou em falha de validação, não há consumo. A seleção de resposta envia automaticamente: abra a mochila **antes de clicar na resposta**.

## Matriz por ponto

| Ponto | Questões | Passe | Dica | Lente | Exemplo | Troca | Adiar | Máximo de pulos na lição |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
|1|26|26|26|21|1|1|25|13|
|2|17|17|17|14|1|1|16|8|
|3|11|11|11|9|1|1|10|5|
|4|11|11|11|9|1|1|10|5|
|5|10|9|10|8|1|1|9|5|
|6|10|10|10|8|2|2|9|5|
|7|12|12|12|10|1|1|11|6|
|8|11|11|11|9|1|1|10|5|
|9|11|11|11|9|1|1|10|5|
|10|10|9|10|9|1|1|9|5|
|Total|129|127|129|106|11|11|119|62|

## Limite de cobertura pedagógica

Exemplo e troca têm ao menos um contexto compatível em cada ponto, mas não são universais. O cadastro validado cobre: representação de conjuntos, interseção, contagem com potências, definição de logaritmo, união/interseção, equação linear (duas questões), raízes de quadrática, inequação linear, zeros de produto e diferença de conjuntos. Fora desses contextos, o bloqueio por ausência de exemplo/variante é correto e não consome estoque. Ampliar essa cobertura requer novos exemplos e variantes revisados; não foi substituído por ajuda genérica de outro assunto.

## Reprodução e validação

- `npm run test:items`: política de verificação essencial, marcação explícita e preservação pela validação de conteúdo.
- `npm run test:items:http`: percorre todas as 129 questões pela API; grava motivos por questão e totais em `tests/artifacts/items-availability.json`.
- `npm run test:rpg:http`: uso real de passe/troca na prática do ponto 10, bloqueio da questão final, confirmação de pulo, estoque preservado nas recusas, economia, equipamentos, escudo e demais consumíveis.
- `npm run test:items:browser`: troca e passe pelo Chrome mobile no ponto 5, avanço após o pulo e bloqueio exclusivo da verificação final; a dica continua disponível ali.

Os testes de integração exigem servidor/banco locais e devem rodar sequencialmente. Build de produção e checagem de tipos aprovados. Os 17 testes unitários passaram. As integrações HTTP de compatibilidade, economia e aprendizagem passaram. No Chrome, passaram tanto a regressão de troca/passe e avanço no ponto 5 quanto a revisão de loja, inventário e mochila em desktop e celular.
