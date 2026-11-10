# Análise do programa, das listas e da P1

## Recorte adotado

O [programa da P1 de 2025.2](fontes/IMD1001_-_CONTEDO_-_PROVA_P1_-_2025.2.pdf) define o núcleo destes dez pontos. As duas listas ajudam a identificar procedimentos e erros frequentes, e a prova mostra como a turma foi avaliada naquele semestre. O [catálogo de fontes](referencias.md) reúne os PDFs e as leituras externas.

- **Núcleo.** Conjuntos, conjuntos numéricos, operações, intervalos e cardinalidade. Potenciação com expoentes reais e base `e`. Logaritmos e `ln`. Equações do 1º grau e sistemas com duas variáveis, equações do 2º grau e biquadradas. Inequações lineares, quadráticas, simultâneas, produto e quociente.
- **Fora do núcleo da P1.** Identidades de conjuntos como tópico separado, dízimas periódicas, método de completar quadrados, deduções de Bhaskara e de soma e produto, valor absoluto e equação modular. Igualdade de conjuntos e uso das fórmulas continuam no núcleo porque estão no programa.
- **Trechos opcionais das listas.** L1 Q1(i) usa números complexos, que ficam fora deste percurso básico em `ℝ`. L2 Q2–Q3 pedem deduções excluídas da P1. Matrizes, determinantes e o estudo de gráficos e funções como unidades próprias ficam fora dos dez pontos. As propriedades de `e` e `ln` entram apenas no nível pedido pelo programa.

## Habilidades observadas na avaliação

| P1, página 1 | Habilidade | Pontos da trilha |
| --- | --- | --- |
| O1 | Operar interseção, união e complementos em um universo explícito. | 2 e 5 |
| O2–O3 | Interpretar conjuntos definidos por equações, filtrar raízes pelo universo e verificar cardinalidade ou inclusão. | 1, 2, 7 e 10 |
| O4 | Contar subconjuntos próprios de uma união. | 2 e 5 |
| O5–O6 | Simplificar potências e compor exponencial natural com logaritmo natural. | 3, 4 e 5 |
| O7 | Distinguir um sistema com infinitas soluções de um sistema incompatível ou com solução única. | 6 |
| O8–O9 | Relacionar raízes aos coeficientes de uma quadrática e voltar da substituição de uma biquadrada às raízes reais. | 7 |
| O10 | Resolver duas desigualdades quadráticas e intersectar os resultados. | 8 |
| D1 | Identificar coeficientes que dependem de um parâmetro, impor raiz dupla e verificar as condições do problema. | 7 e 10 |
| D2 | Definir o domínio do quociente, ordenar pontos críticos, montar o quadro de sinais e escrever os intervalos. | 9 e 10 |

Para a futura autoria, O2 e O3 só devem ser usados como referência depois do ponto 7. Em D1 e D2, as soluções das páginas 3 e 4 mostram quais passos devem aparecer no retorno ao aluno. Esta prova é uma amostra de 2025.2 e o programa é a referência para a cobertura da unidade.

## Correções e ressalvas para consultar antes de reutilizar as listas

Os gabaritos abaixo estão na página 2 das listas. Os originais foram preservados em `fontes/`.

| Localizador | O que revisar | Verificação |
| --- | --- | --- |
| L1 Q2(b–c) | Em (b), a descrição deve incluir o zero. Em (c), deve excluí-lo. | (b) usa os múltiplos inteiros **não positivos** de 10. (c) usa os quadrados de inteiros **não nulos**, pois a enumeração começa em 1. |
| L1 Q12 | A expansão do gabarito precisa de hipótese adicional para que os três logaritmos separados existam. | A condição `a > \|b\|` permite a expansão publicada. Com `a = −1` e `b = 2`, o argumento original é `2/3`, mas `log₂(a)` fica indefinido em `ℝ`. |
| L2 Q1(d) | O par correto é `(9/7, 11/7)`. | De `2x − y = 1` vem `y = 2x − 1`. Na primeira equação, isso dá `7x = 9`. O par do gabarito tem `2x − y = −1`. |
| L2 Q2 | A fórmula impressa tem `b` onde deveria haver `−b`. | Com o enunciado na forma `ax² + bx + c = 0`, a fórmula é `(−b ± √(b² − 4ac))/(2a)`. A dedução é extra. |
| L2 Q4 | Duas raízes reais distintas exigem `m > −1/4` e `m ≠ 0`. | Passando tudo ao mesmo membro, os coeficientes são `m`, `2m − 1`, `m − 2`. Logo, `Δ = 4m + 1`. |
| L2 Q5 | Se a equação precisar ser quadrática, os valores são `m = −1` e `m = −1/5`. Se o caso linear for permitido, incluir `m = 0`. | Na forma padrão, `Δ = (m + 1)(5m + 1)`. Quando `m = 0`, a equação vira `x = 1`. Convém explicitar no enunciado futuro se `m ≠ 0`. |
| L2 Q10(a–b) | Em (a), usar `(-∞, −1) ∪ (3/5, ∞)`. Em (b), usar `(-∞, −5/2) ∪ (2, ∞)`. | As duas desigualdades são estritas. As extremidades onde o produto zera são abertas. |
| L2 Q10(g) | O segundo intervalo começa em `−1/4`. A solução é `(-∞, −3/5] ∪ [−1/4, 3/2]`. | O fator `4x + 1` zera em `−1/4`. A desigualdade `≥ 0` inclui os zeros do produto. |
