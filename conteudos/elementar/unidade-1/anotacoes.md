# Anotações para os pontos 1 a 10

As letras `L1`, `L2` e `P1` remetem aos PDFs do [catálogo de fontes](referencias.md). Os localizadores servem para consultar os materiais na futura autoria. A [análise da P1](analise-p1.md) registra as correções que devem ser consideradas ao reutilizar as listas.

## 1 · Linguagem dos conjuntos e conjuntos numéricos

- Um conjunto pode ser descrito por enumeração ou por uma condição, como `{x ∈ ℤ | 0 ≤ x < 3} = {0, 1, 2}`. A ordem e a repetição dos elementos são irrelevantes. `∅` tem zero elementos, enquanto `{∅}` tem um.
- `x ∈ A` relaciona um elemento ao conjunto. `A ⊆ B` exige que todo elemento de `A` pertença a `B`. A inclusão é própria (`A ⊊ B`) quando os conjuntos também são diferentes. Igualdade pode ser verificada por inclusão nos dois sentidos.
- Usar a convenção da disciplina `ℕ = {0, 1, 2, …}` e `ℕ* = ℕ ∖ {0}`. Vale `ℕ ⊊ ℤ ⊊ ℚ ⊊ ℝ`. Racionais têm a forma `p/q`, com `p, q ∈ ℤ` e `q ≠ 0`. Os irracionais pertencem a `ℝ ∖ ℚ`.
- **Atenção na autoria.** Fixar o universo antes de interpretar a condição. A mesma equação pode selecionar conjuntos diferentes em `ℕ`, `ℤ` ou `ℝ`. Evitar `⊂` sem definir a convenção.
- **Referências nos PDFs.** L1 Q1–Q4, com preferência inicial pelos itens que dispensam equações quadráticas e complexos. P1 O2–O3 integram este tema com o ponto 7.

## 2 · Operações, intervalos e cardinalidade

- União (`A ∪ B`) reúne quem está em pelo menos um dos conjuntos. Interseção (`A ∩ B`) exige presença nos dois. Diferença (`A ∖ B`) retém quem está em `A` e fora de `B`. O complementar de `A` em `U` é `U ∖ A`. Diagramas de Venn ajudam a conferir expressões com parênteses.
- Relacionar desigualdade, descrição por propriedade e reta numérica. Em `[a,b)`, `a` entra e `b` fica de fora. Infinito sempre recebe extremidade aberta. Ao calcular diferença ou interseção de intervalos, conferir cada extremidade separadamente.
- A cardinalidade `|A|` conta os elementos de `A`. O conjunto das partes `𝒫(A)` contém todos os subconjuntos. Se `A` é finito e `|A| = n`, então `|𝒫(A)| = 2ⁿ`, pois há duas escolhas para cada elemento. Existem `2ⁿ − 1` subconjuntos próprios, excluindo o próprio `A`.
- **Atenção na autoria.** Em união de conjuntos finitos, contar os elementos compartilhados uma vez. Separar `|A|`, `𝒫(A)` e `|𝒫(A)|`.
- **Referências nos PDFs.** Programa itens 1 e 7, L1 Q5, P1 O1 e O4. A prova volta a exigir notação de intervalo em O10 e D2.

## 3 · Potenciação e raízes

- Retomar sinais, parênteses e frações. `(-2)² = 4` e `−2² = −4`. Para `a ≠ 0`, `a⁰ = 1` e `a⁻ⁿ = 1/aⁿ` quando a potência está definida. Em `ℝ`, uma raiz de índice par exige radicando não negativo. Uma raiz de índice ímpar admite radicando negativo.
- Para bases positivas, usar as propriedades com expoentes reais. Multiplicar potências de mesma base soma os expoentes, dividir subtrai os expoentes e elevar uma potência a outra multiplica os expoentes. Para `a > 0`, `a^(m/n) = ⁿ√(a^m)`, com `m` inteiro e `n` inteiro positivo.
- Introduzir `e ≈ 2,71828` como base positiva irracional e reconhecer potências `eˣ`. A identidade `aˣ = e^(x ln a)` para `a > 0` faz a ponte para o ponto 4.
- **Atenção na autoria.** `√9 = 3`, enquanto a equação `x² = 9` tem duas soluções. A regra de soma dos expoentes é para produto de potências com a mesma base. Ao usar potências com expoente real arbitrário, trabalhar com base positiva.
- **Referências nos PDFs.** L1 Q6–Q10, P1 O5. L1 Q11 e P1 O6 conectam ao ponto 4.

## 4 · Logaritmos e número de Euler

- `log_b(x) = y` equivale a `bʸ = x` quando `b > 0`, `b ≠ 1` e `x > 0`. Da definição seguem `log_b(1) = 0` e `log_b(b) = 1`.
- Com argumentos positivos e base válida, logaritmo de produto vira soma, logaritmo de quociente vira diferença e o expoente de uma potência pode multiplicar o logaritmo da base dessa potência. Para mudar de base, `log_b(x) = ln(x)/ln(b)`.
- `ln(x) = log_e(x)`, `ln(eˣ) = x` para `x ∈ ℝ` e `e^(ln x) = x` para `x > 0`.
- **Atenção na autoria.** Conferir o domínio antes e depois de expandir. Um produto positivo pode ter fatores negativos, caso em que os logaritmos separados desses fatores não existem em `ℝ`.
- **Referências nos PDFs.** L1 Q11–Q14 e P1 O6. Consultar a ressalva sobre Q12 na análise.

## 5 · Desafio de revisão

- Revisar os pontos 1 a 4. O aluno deve conseguir trocar de representação, contar subconjuntos de uma união, reorganizar potências e reconhecer onde a exponencial natural e o logaritmo natural se cancelam.
- Para a futura atividade, separar os erros de leitura dos erros de cálculo. Em conjuntos, pedir que o aluno identifique a operação interna e o universo. Em potências e logs, registrar domínio e a propriedade aplicada.
- **Referências nos PDFs.** L1 Q3–Q11 e Q13–Q14, P1 O1 e O4–O6. Os itens P1 O2–O3 exigem quadráticas e cabem no ponto 10.

## 6 · Equações e sistemas do 1º grau

- Isolar `x` em `ax + b = 0`, com `a ≠ 0`, usando transformações equivalentes. Uma igualdade simplificada para `0 = 0` é válida no domínio adotado. Uma igualdade do tipo `0 = k`, com `k ≠ 0`, não tem solução.
- Em sistemas `2 × 2`, usar substituição ou eliminação e verificar o par ordenado nas duas equações. No caso de infinitas soluções, escrever o conjunto de pares com uma variável livre. Equações proporcionais dão infinitas soluções quando os termos independentes seguem a mesma proporção e nenhuma quando são incompatíveis.
- **Atenção na autoria.** A solução de uma equação linear em duas variáveis geralmente é um conjunto de pares. O sistema pede os pares que atendem a todas as equações.
- **Referências nos PDFs.** L2 Q1 e P1 O7. Consultar a correção de L2 Q1(d).

## 7 · Equações quadráticas e biquadradas

- Em `ax² + bx + c = 0`, confirmar `a ≠ 0` e calcular `Δ = b² − 4ac`. Para `Δ > 0` há duas raízes reais distintas, para `Δ = 0` há uma raiz real dupla e para `Δ < 0` não há raiz real. A fórmula é `x = (−b ± √Δ)/(2a)` quando `Δ ≥ 0`.
- Quando há raízes reais `x₁` e `x₂` (contando uma raiz dupla duas vezes), `x₁ + x₂ = −b/a` e `x₁x₂ = c/a`. Usar essas relações para reconhecer raízes simples ou conectar um parâmetro aos coeficientes. Se o parâmetro puder zerar `a`, examinar esse caso à parte.
- Em `ax⁴ + bx² + c = 0`, com `a ≠ 0`, fazer `t = x²` e resolver a quadrática em `t`. Descartar `t < 0`, recuperar `x = 0` se `t = 0` e `x = ±√t` se `t > 0`.
- **Atenção na autoria.** Ensinar primeiro a reconhecer o tipo de equação e a contar raízes. Trabalhar parâmetros simples depois da fórmula e deixar as deduções fora do núcleo básico da P1.
- **Referências nos PDFs.** L2 Q4–Q6 e P1 O8, O9 e D1. L1 Q1(e), (f), (j) e (k) e P1 O2–O3 conectam raízes e conjuntos numéricos.

## 8 · Inequações lineares, quadráticas e simultâneas

- Somar a mesma quantidade aos dois membros preserva a desigualdade. Multiplicar ou dividir por um número positivo também preserva. Com fator negativo, inverter o sentido. Quando o sinal de uma expressão depende de `x`, separar casos ou estudar seu sinal.
- Na quadrática com duas raízes reais distintas, o sinal é o de `a` fora das raízes e o oposto entre elas. Com raiz dupla, o sinal é o de `a` nos dois lados, zerando na raiz. Sem raiz real, o sinal é o de `a` em toda a reta. Incluir zeros quando a desigualdade permite igualdade.
- Uma desigualdade encadeada representa duas condições simultâneas. Resolver cada condição e tomar a interseção, que pode ser vazia. Escrever o resultado como intervalo ou união de intervalos.
- **Atenção na autoria.** Usar a reta para validar as extremidades e distinguir a interseção exigida por um sistema da união usada para reunir pedaços da resposta.
- **Referências nos PDFs.** L2 Q7 e Q8(a–e), P1 O10.

## 9 · Inequações-produto e inequações-quociente

- Organizar a desigualdade com zero de um lado e fatorar a expressão quando possível. Registrar o domínio da expressão original, ordenar os zeros dos fatores e dividir a reta em intervalos.
- Testar um ponto de cada intervalo ou combinar os sinais dos fatores. Um zero de multiplicidade par de um fator pode preservar o sinal nos dois lados. Incluir zeros da expressão apenas se `≤` ou `≥` permitir e o ponto pertencer ao domínio.
- Em quocientes, zeros do denominador são excluídos mesmo quando um fator é cancelado. Evitar multiplicar por denominador de sinal desconhecido sem separar casos.
- **Atenção na autoria.** No quadro de sinais, usar marcações distintas para zero aceito e ponto fora do domínio. Dar peso à tradução do quadro para a união de intervalos.
- **Referências nos PDFs.** L2 Q8(f), Q9(a–c) e Q10, P1 D2. L2 Q9(d) tem denominadores constantes e funciona como ponte com o ponto 8.

## 10 · Desafio final da Unidade 1

- Retomar as duas metades da unidade. Priorizar a seleção das raízes que pertencem ao conjunto indicado, a escrita de soluções como conjuntos e a justificativa das extremidades em desigualdades.
- A P1 oferece modelos de habilidade para a futura autoria. O2–O3 cruzam conjuntos e equações. D1 pede organizar coeficientes, impor uma condição ao discriminante e conferir o parâmetro. D2 pede declarar domínio, estudar sinais e registrar o conjunto-solução.
- **Critério de fechamento.** O aluno consegue justificar o método, explicitar o domínio e conferir a resposta nas condições originais, além de obter o resultado.
