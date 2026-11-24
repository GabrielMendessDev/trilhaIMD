# FMC 1 · Conteúdo de estudo

Texto, exemplos e exercícios autorais baseados no recorte do Rosen descrito em FONTES.md. A divisão em unidades é uma proposta do Trilbit, não o calendário oficial de uma turma.

## 1. Linguagem matemática: ler antes de calcular

Uma inscrição exige que todos os campos estejam preenchidos. Encontrar um formulário completo confirma que todos estão completos? Traduzir “todos” e “existe” muda o que precisamos verificar.

Uma proposição é uma afirmação com valor de verdade; perguntas e expressões com variável livre não são proposições determinadas. Em p⇒q, p é hipótese e q é conclusão; a implicação só é falsa quando p é verdadeira e q é falsa. ∀ significa “para todo”; ∃, “existe”. O domínio precisa estar declarado. a∈A compara elemento e conjunto; A⊆B compara conjuntos. Adotamos ℕ={0,1,2,…}.

Uma afirmação universal precisa valer para cada elemento do domínio. Um único contraexemplo a refuta. Já uma existência é estabelecida por uma testemunha. Negar “todos têm P” significa “existe alguém sem P”, e não “ninguém tem P”.

### Exemplo guiado

Considere a afirmação: para todo n∈ℕ, n²≥n. Identifique o domínio ℕ e a propriedade n²≥n.

Para refutar uma universal, procuraríamos um n∈ℕ com n²<n. Testar alguns números orienta a investigação, mas não prova todos os casos.

Aqui n²−n=n(n−1)≥0: para n=0 o produto é 0; para n≥1 ambos os fatores são não negativos. A afirmação foi justificada para todo o domínio.

### Atenção

Trocar ∀ por ∃ enfraquece a afirmação. Além disso, a contrapositiva de p⇒q é ¬q⇒¬p; a recíproca q⇒p não é automaticamente equivalente.

### Aplicação

Leia requisitos de um sistema separando condição necessária, condição suficiente e domínio. Um teste que encontra um erro refuta “o programa funciona para toda entrada”; alguns testes bem-sucedidos não demonstram essa frase universal.

### Exercícios comentados

1. Qual frase é uma proposição determinada?

   a) Qual é seu nome?
   b) x>3, sem domínio ou valor de x.
   c) 2+3=5.

Resposta: 2+3=5.

A igualdade tem valor de verdade. A pergunta não é uma afirmação, e x>3 é uma sentença aberta.

2. Em p⇒q, quando a implicação é falsa?

   a) p e q falsas.
   b) p verdadeira e q falsa.
   c) p falsa e q verdadeira.

Resposta: p verdadeira e q falsa.

Uma hipótese verdadeira não pode levar a conclusão falsa numa implicação verdadeira.

3. Qual é a negação de “todo aluno enviou o arquivo”?

   a) Existe aluno que não enviou o arquivo.
   b) Nenhum aluno enviou o arquivo.
   c) Todo aluno enviou dois arquivos.

Resposta: Existe aluno que não enviou o arquivo.

Para negar uma universal, basta afirmar a existência de um contraexemplo.

4. Qual é a negação de “existe n∈ℕ com P(n)”?

   a) Existe n∈ℕ com não P(n).
   b) Para todo n∈ℕ, P(n).
   c) Para todo n∈ℕ, não P(n).

Resposta: Para todo n∈ℕ, não P(n).

Negar a existência exige que nenhum elemento tenha a propriedade.

5. Se A={1,2}, qual afirmação é verdadeira?

   a) 3∈A.
   b) 1∈A.
   c) {1}=1.

Resposta: 1∈A.

O número 1 é um elemento de A; um conjunto unitário não é o mesmo objeto que seu elemento.

6. Para A={1,2} e B={1,2,3}, qual relação vale?

   a) A⊆B.
   b) B⊆A.
   c) A=B.

Resposta: A⊆B.

Cada elemento de A pertence a B; 3 impede a inclusão na direção contrária.

7. Como refutar uma afirmação universal sobre inteiros?

   a) Exibir três inteiros que a satisfaçam.
   b) Testar só os positivos.
   c) Exibir um inteiro que a viole.

Resposta: Exibir um inteiro que a viole.

Um contraexemplo no domínio declarado basta; exemplos favoráveis não cobrem todos os inteiros.

8. Qual é a contrapositiva de p⇒q?

   a) ¬p⇒¬q.
   b) ¬q⇒¬p.
   c) q⇒p.

Resposta: ¬q⇒¬p.

A contrapositiva nega e troca hipótese e conclusão, preservando a equivalência lógica.

9. Quantos elementos possui {∅}?

   a) 1.
   b) 0.
   c) 2.

Resposta: 1.

O conjunto tem um único elemento: o conjunto vazio. Ele é diferente de ∅.

10. Em ℕ={0,1,2,…}, qual frase é verdadeira?

   a) Todo n∈ℕ satisfaz n²=0.
   b) Não existe n∈ℕ com n²=0.
   c) Existe n∈ℕ com n²=0.

Resposta: Existe n∈ℕ com n²=0.

n=0 é uma testemunha da existência; n=1 refuta a afirmação universal.

Referência: Rosen, 6ª ed., §§1.1–1.4 e 2.1–2.2

## 2. Bases numéricas: o valor de cada posição

O texto 101 não identifica sozinho uma quantidade: em base dez vale cento e um; em base dois vale cinco. O computador não muda a matemática, mas a convenção de escrita.

Na base b≥2, os algarismos permitidos são 0,…,b−1 e o valor de aₖ…a₁a₀ é a soma aᵢbⁱ. Em hexadecimal, A,…,F representam 10,…,15. Para converter um inteiro não negativo da base dez, divida sucessivamente por b e leia os restos de baixo para cima. Cada grupo de quatro bits corresponde a um dígito hexadecimal.

A divisão euclidiana escreve n=bq+r, com 0≤r<b. O resto é o algarismo das unidades; aplicar a mesma decomposição ao quociente encontra a posição seguinte. O processo termina porque os quocientes positivos diminuem.

### Exemplo guiado

Converter 45₁₀ para base 2: 45=2·22+1; 22=2·11+0; 11=2·5+1.

Continue: 5=2·2+1; 2=2·1+0; 1=2·0+1. Os restos, na ordem inversa, formam 101101₂.

Confira: 32+8+4+1=45. Agrupando 0010 1101, a mesma quantidade é 2D₁₆.

### Atenção

Não leia os restos na ordem em que foram produzidos. E 102₂ é inválido, pois a base 2 não admite o algarismo 2. Zeros à esquerda não mudam o valor numérico, embora possam indicar a largura de um registro.

### Aplicação

Use agrupamentos de bits para ler endereços e cores em hexadecimal, sempre distinguindo valor, base e quantidade de bits do armazenamento.

### Exercícios comentados

1. Quanto vale 1011₂ em decimal?

   a) 1011.
   b) 11.
   c) 13.

Resposta: 11.

1·8+0·4+1·2+1=11.

2. Qual é a escrita binária de 13₁₀?

   a) 1101₂.
   b) 1011₂.
   c) 1110₂.

Resposta: 1101₂.

13=8+4+1, portanto os bits são 1101.

3. Quanto vale 2A₁₆?

   a) 26₁₀.
   b) 210₁₀.
   c) 42₁₀.

Resposta: 42₁₀.

2·16+10=42, pois A representa dez.

4. Qual escrita é inválida na base indicada?

   a) 102₁₀.
   b) 102₂.
   c) 102₃.

Resposta: 102₂.

Na base 2, os únicos algarismos são 0 e 1.

5. Quanto vale 10000₂?

   a) 16₁₀.
   b) 8₁₀.
   c) 32₁₀.

Resposta: 16₁₀.

O único bit 1 ocupa a posição 4: 2⁴=16.

6. Quanto vale 17₈?

   a) 17₁₀.
   b) 9₁₀.
   c) 15₁₀.

Resposta: 15₁₀.

1·8+7=15.

7. Na conversão por divisões sucessivas, como ler os restos?

   a) Somando todos.
   b) Do último para o primeiro.
   c) Do primeiro para o último.

Resposta: Do último para o primeiro.

O primeiro resto é o algarismo menos significativo, por isso a escrita é obtida na ordem inversa.

8. Qual hexadecimal corresponde a 1111₂?

   a) F₁₆.
   b) E₁₆.
   c) 10₁₆.

Resposta: F₁₆.

1111₂=15₁₀, valor representado por F.

9. Qual é o maior inteiro sem sinal representável com quatro bits?

   a) 16.
   b) 8.
   c) 15.

Resposta: 15.

Os quatro bits 1 somam 8+4+2+1=15.

10. Ao conferir 101101₂, qual soma é correta?

   a) 32+8+2+1.
   b) 32+8+4+1.
   c) 32+16+4+1.

Resposta: 32+8+4+1.

Os bits 1 estão nas posições 5,3,2 e 0; a soma é 45.

Referência: Rosen, 6ª ed., §3.6

## 3. Bits, sinais e aproximações

Uma soma pode ser correta nos inteiros e não caber no registro disponível. O padrão 1111 pode significar quinze ou menos um, dependendo da interpretação combinada.

Com n bits sem sinal, os inteiros vão de 0 a 2ⁿ−1. Em complemento de dois, vão de −2ⁿ⁻¹ a 2ⁿ⁻¹−1: o bit mais significativo tem peso negativo. Para obter o oposto, quando ele também cabe nessa faixa, inverta os bits e some 1, mantendo a largura. O menor valor negativo não possui oposto positivo representável com a mesma largura. Na parte fracionária binária, as posições pesam 1/2,1/4,1/8,…; uma fração reduzida tem expansão binária finita quando seu denominador é potência de dois. No formato binário32 normal, o valor é (−1)ˢ·(1+f)·2^(e−127), com 1 bit de sinal, 8 de expoente e 23 de fração. Expoentes extremos têm significados especiais e não usam essa fórmula normal.

Os n bits oferecem 2ⁿ padrões. O complemento de dois atribui ao bit da esquerda o peso −2ⁿ⁻¹, distribuindo-os entre valores negativos e não negativos. Representar uma fração como inteiro dividido por 2ᵏ explica por que fatores diferentes de 2 no denominador impedem uma expansão binária finita.

### Exemplo guiado

Para representar −5 em complemento de dois com oito bits, comece por 5=00000101₂.

Inverta: 11111010. Some 1: 11111011. Mantenha exatamente oito bits.

Confira pelos pesos: −128+64+32+16+8+2+1=−5. Já 0,101₂ é a fração 1/2+1/8=0,625₁₀; valor e padrão de bits são conceitos diferentes.

### Atenção

Em complemento de dois com oito bits, 127+1 não cabe como inteiro positivo: há overflow. A largura e a convenção de sinal precisam estar declaradas. Não confunda 23 bits de fração armazenados com os 24 bits de precisão dos números normais em binário32, que incluem o 1 implícito.

### Aplicação

Antes de interpretar um arquivo, registre largura, sinal e formato. Em cálculos aproximados, diferencie o número real desejado do valor efetivamente armazenado; arredondamentos podem se acumular.

### Exercícios comentados

1. Qual é a faixa sem sinal com oito bits?

   a) De 0 a 255.
   b) De 0 a 256.
   c) De −128 a 127.

Resposta: De 0 a 255.

Há 256 padrões, numerados de 0 a 2⁸−1=255.

2. Qual é a faixa em complemento de dois com oito bits?

   a) De −127 a 128.
   b) De 0 a 255.
   c) De −128 a 127.

Resposta: De −128 a 127.

A faixa é de −2⁷ até 2⁷−1.

3. Quanto representa 1111 em complemento de dois com quatro bits?

   a) −7.
   b) −1.
   c) 15.

Resposta: −1.

Os pesos dão −8+4+2+1=−1.

4. Qual padrão de oito bits representa −5 em complemento de dois?

   a) 11111011.
   b) 10000101.
   c) 11111010.

Resposta: 11111011.

Inverta 00000101 e some 1: 11111011.

5. Quanto vale 0,101₂?

   a) 0,101₁₀.
   b) 0,75₁₀.
   c) 0,625₁₀.

Resposta: 0,625₁₀.

As posições 1 e 3 após a vírgula contribuem 1/2+1/8=5/8.

6. Qual fração tem expansão binária finita?

   a) 1/3.
   b) 3/8.
   c) 1/10.

Resposta: 3/8.

Em forma reduzida, o denominador 8 é potência de dois. Os outros têm fatores 5 ou 3.

7. O que acontece com a soma inteira 127+1 em complemento de dois de oito bits?

   a) O resultado inteiro positivo não cabe: ocorre overflow.
   b) O resultado 128 é representável nesse formato.
   c) O resultado matemático é −128.

Resposta: O resultado inteiro positivo não cabe: ocorre overflow.

Nos inteiros a soma é 128, mas esse valor está fora da faixa. O padrão truncado não altera a soma matemática.

8. Quantos padrões existem com quatro bits?

   a) 15.
   b) 4.
   c) 16.

Resposta: 16.

Cada uma das quatro posições tem duas escolhas: 2⁴=16.

9. Como se distribuem os bits de um binário32 IEEE 754?

   a) 8 de sinal, 1 de expoente e 23 de fração.
   b) 1 de sinal, 8 de expoente e 23 de fração.
   c) 1 de sinal, 7 de expoente e 24 de fração.

Resposta: 1 de sinal, 8 de expoente e 23 de fração.

O formato possui três campos; para números normais, há ainda um 1 inicial implícito na significanda.

10. Em um número normal binário32, s=0, e=128 e f=0 representam qual valor?

   a) 2.
   b) 128.
   c) 1.

Resposta: 2.

A fórmula dá (+1)·1·2^(128−127)=2. Ela pressupõe expoente normal, diferente de 0 e 255.

Referência: Rosen, 6ª ed., §3.6; complemento: Oracle, IEEE Arithmetic, representação e precisão

## 4. Demonstrações: explicar por que sempre funciona

Testar que 2², 4² e 6² são pares sugere uma regra. Para convencer alguém de que todo quadrado de par é par, precisamos usar o significado de “par”, não uma lista maior de testes.

Uma prova direta parte da hipótese e chega à conclusão usando definições e fatos justificados. Na contraposição, provamos ¬q⇒¬p para estabelecer p⇒q. Na contradição, supomos a negação do que queremos provar e deduzimos uma impossibilidade. Um contraexemplo refuta uma universal; não demonstra uma universal verdadeira. Um inteiro é par se n=2k para algum k∈ℤ, e ímpar se n=2k+1.

As técnicas preservam a lógica da afirmação. Definições transformam palavras em expressões que podem ser manipuladas. Separar hipótese e conclusão impede a circularidade de supor justamente o resultado que se queria demonstrar.

### Exemplo guiado

Para provar que n² ímpar implica n ímpar, considere a contrapositiva: se n é par, então n² é par.

Escreva n=2k. Então n²=4k²=2(2k²), que é par por definição.

A contrapositiva foi demonstrada para todo inteiro k. Logo a implicação original também é verdadeira. Nenhuma lista finita de exemplos foi usada como prova geral.

### Atenção

Provar a recíproca não prova a implicação original. Também não é válido começar uma prova de a=b afirmando a=b e apenas reorganizar a igualdade sem demonstrar a reversibilidade dos passos.

### Aplicação

Ao justificar um algoritmo, declare as hipóteses sobre a entrada e o resultado esperado. Distinguir um argumento geral de testes experimentais será essencial para indução e recorrências.

### Exercícios comentados

1. Qual é a definição de inteiro par?

   a) n=2k+1 para algum k∈ℤ.
   b) n>0.
   c) n=2k para algum k∈ℤ.

Resposta: n=2k para algum k∈ℤ.

A definição usa um múltiplo inteiro de 2, incluindo 0 e os pares negativos.

2. Se n=2k+1, qual expressão mostra que n² é ímpar?

   a) n²=4k²+1, sempre.
   b) n²=2(2k²+2k)+1.
   c) n²=2k²+1.

Resposta: n²=2(2k²+2k)+1.

Expandir (2k+1)² dá 4k²+4k+1, que tem a forma 2m+1.

3. Qual é a contrapositiva de “se n² é ímpar, então n é ímpar”?

   a) Se n é par, então n² é par.
   b) Se n é ímpar, então n² é ímpar.
   c) Se n² é par, então n é par.

Resposta: Se n é par, então n² é par.

Negue e troque hipótese e conclusão, usando que um inteiro não ímpar é par.

4. Qual número refuta “todo primo é ímpar”?

   a) 3.
   b) 5.
   c) 2.

Resposta: 2.

2 é primo e é par, por isso contradiz a afirmação universal.

5. Por que testar mil casos não prova uma afirmação sobre todos os naturais?

   a) Porque toda afirmação universal é falsa.
   b) Ainda podem existir naturais não testados que a violem.
   c) Porque exemplos nunca são úteis para investigar.

Resposta: Ainda podem existir naturais não testados que a violem.

Testes ajudam a formular conjecturas, mas não substituem um argumento válido para todo o domínio.

6. Em uma prova por contradição de P, o que assumimos inicialmente?

   a) A negação de P.
   b) Que P já está demonstrada.
   c) Uma afirmação sem relação com P.

Resposta: A negação de P.

A negação, junto às hipóteses, deve levar a uma impossibilidade lógica.

7. De a=2r e b=2s, qual escrita prova que a+b é par?

   a) a+b=r+s.
   b) a+b=2rs.
   c) a+b=2(r+s).

Resposta: a+b=2(r+s).

Como r+s é inteiro, a soma tem a forma de um múltiplo inteiro de 2.

8. Qual inferência é inválida?

   a) p⇒q e q falsa, portanto p falsa.
   b) p⇒q e q verdadeira, portanto p verdadeira.
   c) p⇒q e p verdadeira, portanto q verdadeira.

Resposta: p⇒q e q verdadeira, portanto p verdadeira.

Afirmar o consequente confunde a implicação com sua recíproca.

9. Um único contraexemplo é suficiente para quê?

   a) Refutar uma afirmação universal.
   b) Provar uma afirmação universal.
   c) Demonstrar qualquer existência em outro domínio.

Resposta: Refutar uma afirmação universal.

A universal exige todos os casos; um caso contrário basta para negá-la.

10. Qual atitude evita uma demonstração circular?

   a) Repetir a conclusão como primeiro argumento.
   b) Confirmar só um exemplo favorável.
   c) Usar as hipóteses e definições sem assumir a conclusão.

Resposta: Usar as hipóteses e definições sem assumir a conclusão.

Uma prova precisa fundamentar a conclusão a partir de premissas justificadas.

Referência: Rosen, 6ª ed., §§1.6–1.7

## 5. Indução: construir a ponte entre os casos

Uma escada infinita não é percorrida só por saber passar de um degrau ao próximo. Também precisamos alcançar o primeiro degrau. A indução formaliza essas duas tarefas.

Para provar P(n) para todo n≥n₀, demonstramos P(n₀) e, para k arbitrário com k≥n₀, provamos P(k)⇒P(k+1). A hipótese indutiva é uma suposição local usada para construir essa implicação, não a conclusão de que todos os casos já valem. Na indução forte, podemos usar os casos de n₀ até k; precisamos estabelecer todas as bases exigidas pelo passo. O princípio da boa ordenação afirma que todo subconjunto não vazio de ℕ tem menor elemento.

Se houvesse uma primeira falha após uma base válida, o caso anterior seria verdadeiro e o passo de indução impediria essa falha. Essa ideia do menor contraexemplo explica por que os dois componentes da prova são necessários.

### Exemplo guiado

Provar 1+2+⋯+n=n(n+1)/2 para n≥1. Base: em n=1, ambos os lados valem 1.

Suponha 1+⋯+k=k(k+1)/2. Ao somar k+1, obtemos k(k+1)/2+(k+1)=(k+1)(k+2)/2.

A expressão final é exatamente a fórmula para k+1. A base e a passagem foram justificadas; a igualdade vale para todo n≥1.

### Atenção

Substituir k+1 nos dois lados da igualdade que se deseja provar não é uma demonstração. É preciso partir da hipótese P(k) e construir P(k+1). Também verifique onde o passo realmente funciona: uma passagem válida só para k≥2 não conecta, sozinha, a base n=1 ao caso n=2.

### Aplicação

Ao provar propriedades de laços ou de estruturas recursivas, procure o caso mínimo e a regra que leva de casos já resolvidos ao seguinte. Condições iniciais não são um detalhe dispensável.

### Exercícios comentados

1. Para provar P(n) para n≥1 por indução, qual é uma base adequada?

   a) Supor que P(n) vale para todo n.
   b) Demonstrar P(1).
   c) Demonstrar apenas P(100).

Resposta: Demonstrar P(1).

A base precisa iniciar a cadeia no primeiro valor do domínio considerado.

2. Qual é a hipótese no passo usual de indução?

   a) P(k), para um k arbitrário no domínio.
   b) P(k+1), que já é o objetivo.
   c) P(1) para qualquer k.

Resposta: P(k), para um k arbitrário no domínio.

A hipótese local permite demonstrar a implicação P(k)⇒P(k+1).

3. Se Sₖ=k(k+1)/2, quanto vale Sₖ+(k+1)?

   a) k(k+2)/2.
   b) (k+1)²/2.
   c) (k+1)(k+2)/2.

Resposta: (k+1)(k+2)/2.

Coloque k+1 em evidência: (k+1)(k/2+1).

4. Qual é a soma dos primeiros cinco inteiros positivos?

   a) 25.
   b) 15.
   c) 10.

Resposta: 15.

A fórmula n(n+1)/2 dá 5·6/2=15.

5. Qual é a soma dos primeiros quatro números ímpares positivos?

   a) 16.
   b) 15.
   c) 8.

Resposta: 16.

1+3+5+7=16, exemplo da identidade cuja soma é n².

6. Se a passagem é válida somente para k≥2, uma base P(1) basta automaticamente?

   a) Sim; qualquer base serve.
   b) Sim; não é necessário verificar P(2).
   c) Não; falta justificar a ligação até os casos cobertos pelo passo.

Resposta: Não; falta justificar a ligação até os casos cobertos pelo passo.

O passo não cobre k=1; é preciso demonstrar os casos iniciais necessários.

7. O que permite a hipótese da indução forte?

   a) Ignorar as bases.
   b) Usar todos os casos anteriores desde a base até k.
   c) Usar a conclusão para k+1 sem prova.

Resposta: Usar todos os casos anteriores desde a base até k.

A força está na hipótese mais ampla, não em dispensar o início da cadeia.

8. Qual afirmação corresponde à boa ordenação de ℕ?

   a) Todo subconjunto não vazio de ℕ tem menor elemento.
   b) Todo subconjunto de ℤ tem menor elemento.
   c) Todo subconjunto de ℕ tem maior elemento.

Resposta: Todo subconjunto não vazio de ℕ tem menor elemento.

O conjunto precisa ser não vazio e estar contido nos naturais.

9. Na prova de 2ⁿ≥n+1 para n≥0, a base n=0 é verdadeira?

   a) Não: 0≥1.
   b) Não existe 2⁰.
   c) Sim: 1≥1.

Resposta: Sim: 1≥1.

A potência 2⁰ vale 1 e o lado direito também vale 1.

10. O que caracteriza uma prova completa por indução?

   a) Apenas escrever a fórmula para k+1.
   b) Base válida e passo válido para todo k exigido.
   c) Muitos exemplos sem passo geral.

Resposta: Base válida e passo válido para todo k exigido.

Os dois componentes conectam o primeiro caso a toda a cadeia de naturais.

Referência: Rosen, 6ª ed., §§4.1–4.2

## 6. Recursão e missão da primeira unidade

Um programa que calcula o fatorial chama uma versão menor do mesmo problema. Sem uma condição de parada, a regra “multiplique e chame de novo” nunca produz uma resposta.

Uma definição recursiva fornece casos iniciais e uma regra para reduzir novos casos a anteriores. Para n≥0, 0!=1 e (n+1)!=(n+1)n!. Em Fibonacci, F₀=0, F₁=1 e Fₙ=Fₙ₋₁+Fₙ₋₂ para n≥2: são necessários dois valores iniciais. Uma medida natural que diminui até a base pode justificar o término de um algoritmo recursivo. A correção costuma ser provada por indução. O valor de uma expressão não deve ser confundido com o número de chamadas usadas para calculá-la.

Cada redução precisa aproximar o problema de uma base conhecida. A indução acompanha a mesma estrutura: verificamos a base e demonstramos que a regra preserva a propriedade desejada. Especificar um domínio impede chamadas indefinidas, como um fatorial recursivo que deveria aceitar somente naturais mas recebe −1.

### Exemplo guiado

Defina a₀=2 e aₙ₊₁=3aₙ para n≥0. Os primeiros termos são 2,6,18,54.

A conjectura aₙ=2·3ⁿ vale em n=0. Se aₖ=2·3ᵏ, então aₖ₊₁=3aₖ=2·3ᵏ⁺¹.

A indução confirma a fórmula. Pela mesma regra a₄=162; escrito em base dois, esse inteiro é 10100010₂. A missão combina recorrência, demonstração e representação.

### Atenção

Uma recorrência de ordem dois geralmente exige dois termos iniciais. E diminuir um número não garante término se o domínio e a base não forem compatíveis: decrementar um inteiro negativo para tentar chegar a zero o afasta da base.

### Aplicação

Ao ler uma rotina recursiva, escreva domínio, base, redução e resultado pretendido. Depois simule uma entrada pequena e justifique por que as chamadas chegam à base.

### Exercícios comentados

1. Quanto vale 0! na definição usual?

   a) 1.
   b) 0.
   c) Não é definido.

Resposta: 1.

A base 0!=1 permite a regra (n+1)!=(n+1)n! e é compatível com as identidades de contagem.

2. Quanto vale 4!?

   a) 16.
   b) 10.
   c) 24.

Resposta: 24.

4·3·2·1=24.

3. Com F₀=0, F₁=1 e Fₙ=Fₙ₋₁+Fₙ₋₂, quanto vale F₅?

   a) 3.
   b) 5.
   c) 8.

Resposta: 5.

Os termos de F₀ a F₅ são 0,1,1,2,3,5.

4. Se a₀=2 e aₙ₊₁=3aₙ, quanto vale a₃?

   a) 54.
   b) 18.
   c) 81.

Resposta: 54.

A partir de 2, multiplicamos por 3 três vezes: 2,6,18,54.

5. Qual fórmula corresponde a a₀=2 e aₙ₊₁=3aₙ?

   a) aₙ=3·2ⁿ.
   b) aₙ=2+3n.
   c) aₙ=2·3ⁿ.

Resposta: aₙ=2·3ⁿ.

A fórmula tem a base correta e cada termo é três vezes o anterior.

6. Por que n−1 aproxima a recursão do fatorial da base, para n>0?

   a) Porque já é o resultado de n!.
   b) Porque é um natural menor, até atingir 0.
   c) Porque sempre é negativo.

Resposta: Porque é um natural menor, até atingir 0.

No domínio natural, diminuir uma unidade conduz à base após finitíssimos passos.

7. Uma regra usa aₙ₋₁ e aₙ₋₂ para n≥2. Que informação inicial costuma ser necessária?

   a) a₀ e a₁.
   b) Apenas a₀, em qualquer caso.
   c) Nenhum termo inicial.

Resposta: a₀ e a₁.

O cálculo de a₂ depende dos dois termos anteriores.

8. Qual técnica combina naturalmente com a prova de correção de uma definição recursiva sobre ℕ?

   a) Testar um único caso.
   b) Supor a conclusão.
   c) Indução matemática.

Resposta: Indução matemática.

A prova segue as bases e as mesmas reduções usadas na definição.

9. Quanto vale 10100010₂?

   a) 164.
   b) 162.
   c) 160.

Resposta: 162.

As posições ativas somam 128+32+2=162.

10. O que falta à regra “fat(n)=n·fat(n−1)” para definir o fatorial sobre ℕ?

   a) Uma base, como fat(0)=1.
   b) Uma divisão por zero.
   c) A afirmação de que n é sempre negativo.

Resposta: Uma base, como fat(0)=1.

Sem um caso inicial, a regra não determina onde o cálculo termina nem o valor a partir do qual se constrói o resultado.

Referência: Rosen, 6ª ed., §§4.3–4.4

## 7. Divisibilidade e divisão euclidiana

Distribuir 29 peças em caixas de cinco deixa quatro peças fora. Essa sobra tem uma regra: precisa ser não negativa e menor que a capacidade da caixa.

Para inteiros a≠0 e b, a divide b, escrito a∣b, se b=ak para algum k∈ℤ. Isso é uma afirmação, não a fração a/b. Para todo inteiro n e divisor positivo d, há únicos q,r∈ℤ tais que n=dq+r e 0≤r<d. Uma divisão exata tem resto zero. Se a divide b e c, divide também toda combinação inteira ub+vc.

Os múltiplos consecutivos de d separam os inteiros em blocos. Há um único bloco que contém n; sua posição determina q, e a distância até seu início determina r. Para combinações lineares, b=ak e c=aℓ implicam ub+vc=a(uk+vℓ), um múltiplo de a.

### Exemplo guiado

Para dividir −17 por 5 na convenção euclidiana, procure −17=5q+r com 0≤r<5.

Com q=−4, temos 5q=−20 e r=3. A alternativa q=−3 daria r=−2 e viola a condição do resto.

Confira: 5·(−4)+3=−17 e 0≤3<5. Logo o par correto é (−4,3); a convenção precisa ser explícita ao comparar com operadores de linguagens de programação.

### Atenção

Não confunda quociente truncado em direção a zero com quociente euclidiano para dividendo negativo. E a∣b não significa b∣a: 3 divide 12, mas 12 não divide 3.

### Aplicação

Use quociente e resto para endereçar posições em blocos, repartir dados e interpretar operações de módulo. Declare sempre o divisor positivo e a faixa escolhida para o resto.

### Exercícios comentados

1. A afirmação 4∣28 é verdadeira?

   a) Não, pois 4<28.
   b) Sim, pois 4=28·7.
   c) Sim, pois 28=4·7.

Resposta: Sim, pois 28=4·7.

Divisibilidade exige que o segundo número seja múltiplo inteiro do primeiro.

2. Qual par (q,r) satisfaz 29=5q+r, com 0≤r<5?

   a) (4,9).
   b) (5,4).
   c) (6,−1).

Resposta: (5,4).

5·5+4=29 e o resto 4 está na faixa exigida.

3. Qual é o resto euclidiano de −17 por 5?

   a) 3.
   b) −2.
   c) 2.

Resposta: 3.

−17=5·(−4)+3; a convenção exige resto não negativo.

4. Se a∣b e a∣c, o que sempre vale?

   a) b∣a.
   b) a=b=c.
   c) a∣(b+c).

Resposta: a∣(b+c).

Escrever b=ak e c=aℓ dá b+c=a(k+ℓ).

5. Qual número é divisível por 7?

   a) 95.
   b) 91.
   c) 93.

Resposta: 91.

91=7·13.

6. Qual é o quociente euclidiano de −1 por 4?

   a) −1.
   b) 0.
   c) 1.

Resposta: −1.

−1=4·(−1)+3. O quociente 0 deixaria um resto negativo.

7. Na divisão por um divisor positivo d, qual condição o resto deve satisfazer?

   a) 0<r≤d.
   b) −d<r≤0.
   c) 0≤r<d.

Resposta: 0≤r<d.

Essa faixa padroniza o resto e garante a unicidade da divisão.

8. Para a≠0, qual afirmação sempre vale?

   a) a∣1.
   b) a∣0.
   c) 0∣a.

Resposta: a∣0.

O inteiro 0 é a·0; a divisibilidade de 1 só vale para a=1 ou a=−1.

9. Se 6∣a e 6∣b, qual expressão é certamente divisível por 6?

   a) 2a−3b.
   b) a+1.
   c) b−1.

Resposta: 2a−3b.

Combinações com coeficientes inteiros preservam a divisibilidade por 6.

10. Qual é o par euclidiano de 42 por 7?

   a) (5,7).
   b) (7,−7).
   c) (6,0).

Resposta: (6,0).

A divisão é exata: 42=7·6+0; um resto igual ao divisor não é permitido.

Referência: Rosen, 6ª ed., §3.4

## 8. MDC, MMC e o algoritmo de Euclides

Duas rotinas se repetem a cada 12 e 18 minutos. Descobrir quando coincidem novamente é diferente de descobrir o maior bloco que reparte ambos os intervalos sem sobra.

Para inteiros positivos a,b, mdc(a,b) é seu maior divisor comum positivo; mmc(a,b), o menor múltiplo comum positivo. Eles satisfazem mdc(a,b)·mmc(a,b)=ab. No algoritmo de Euclides, se a=bq+r, então mdc(a,b)=mdc(b,r); o último resto não nulo é o MDC. Existem inteiros u,v com mdc(a,b)=ua+vb, identidade de Bézout. Se o MDC é 1, os números são coprimos.

Um divisor comum de a e b divide r=a−bq. Um divisor comum de b e r divide a=bq+r. Portanto os conjuntos de divisores comuns coincidem, justificando cada etapa de Euclides. Reverter as substituições expressa o último resto como combinação dos números iniciais.

### Exemplo guiado

Calcule mdc(252,105): 252=2·105+42; 105=2·42+21; 42=2·21+0.

O último resto não nulo é 21. Recuando: 21=105−2·42=105−2(252−2·105)=5·105−2·252.

Confira: 525−504=21. Além disso, mmc(252,105)=252·105/21=1260. MDC e MMC respondem perguntas diferentes.

### Atenção

O último resto do algoritmo é zero; o MDC é o último resto não nulo. Para o MMC, dividir o produto pelo MDC evita contar fatores comuns duas vezes. Para casos envolvendo zero, declare a convenção: mdc(a,0)=a quando a>0.

### Aplicação

Use o MMC para sincronizar ciclos e o MDC para simplificar razões. A identidade de Bézout será usada para decidir quando existe um inverso modular.

### Exercícios comentados

1. Quanto vale mdc(48,18)?

   a) 3.
   b) 6.
   c) 12.

Resposta: 6.

48=2·18+12; 18=12+6; 12=2·6. O último resto não nulo é 6.

2. Quanto vale mmc(12,18)?

   a) 36.
   b) 216.
   c) 6.

Resposta: 36.

O MDC é 6, então o MMC é 12·18/6=36.

3. No algoritmo de Euclides, qual resto fornece o MDC?

   a) O último resto, que é zero.
   b) O primeiro resto, sempre.
   c) O último resto não nulo.

Resposta: O último resto não nulo.

As divisões preservam os divisores comuns até a divisão exata final.

4. Qual par é coprimo?

   a) 25 e 35.
   b) 14 e 25.
   c) 14 e 21.

Resposta: 14 e 25.

14=2·7 e 25=5² não têm fator primo comum.

5. Se a=bq+r, qual igualdade é válida?

   a) mdc(a,b)=mdc(b,r).
   b) mdc(a,b)=q.
   c) mdc(a,b)=a+b.

Resposta: mdc(a,b)=mdc(b,r).

Um divisor de a e b divide r, e um divisor de b e r divide a.

6. Qual identidade de Bézout para 35 e 12 produz o MDC 1?

   a) 35−2·12=1.
   b) 35+12=1.
   c) 3·12−35=1.

Resposta: 3·12−35=1.

36−35=1, logo 35 e 12 são coprimos.

7. Quanto vale mdc(21,0), na convenção para primeiro argumento positivo?

   a) 1.
   b) 21.
   c) 0.

Resposta: 21.

Os divisores comuns positivos são os divisores de 21, cujo maior é 21.

8. Se mdc(a,b)=4 e ab=240, quanto vale mmc(a,b), para a,b positivos?

   a) 60.
   b) 960.
   c) 244.

Resposta: 60.

Pela identidade, o MMC é 240/4=60.

9. Dois eventos se repetem a cada 8 e 12 minutos e coincidem agora. Em quanto tempo coincidem novamente?

   a) 4 minutos.
   b) 96 minutos.
   c) 24 minutos.

Resposta: 24 minutos.

Procuramos o menor múltiplo comum positivo, que é 24.

10. Qual escrita confere mdc(252,105)=21 por Bézout?

   a) 252−105=21.
   b) 5·105−2·252=21.
   c) 2·105−5·252=21.

Resposta: 5·105−2·252=21.

A combinação resulta em 525−504=21 e vem da substituição reversa de Euclides.

Referência: Rosen, 6ª ed., §§3.5–3.6

## 9. Primos e fatoração: as peças dos inteiros

Para verificar se 97 é primo, é preciso tentar dividi-lo por todos os inteiros menores? Um argumento sobre pares de fatores reduz muito essa investigação.

Um inteiro p>1 é primo quando seus únicos divisores positivos são 1 e p. Um inteiro maior que 1 que não é primo é composto; 1 não pertence a nenhuma dessas duas classes. Pelo teorema fundamental da aritmética, todo inteiro maior que 1 tem fatoração em primos única, a menos da ordem dos fatores. Se n é composto, tem um divisor primo não maior que √n. Se p é primo e p∣ab, então p divide a ou b.

Se n=ab, com a,b>1, não podem ambos ser maiores que √n, pois o produto excederia n. Um fator não maior que √n possui um divisor primo também nessa faixa. A primalidade é crucial no lema sobre produtos: um fator composto pode dividir um produto sem dividir nenhum fator individualmente.

### Exemplo guiado

Para testar 97, basta examinar os primos até √97<10: 2,3,5 e 7.

97 é ímpar, sua soma de algarismos é 16, não termina em 0 ou 5, e 7·13=91 deixa resto 6. Nenhum desses primos o divide.

Portanto 97 é primo. Em contraste, 84=2²·3·7 é composto, e os expoentes dessa fatoração descrevem seus divisores.

### Atenção

Ser ímpar não garante ser primo: 9 e 15 são compostos. O número 1 não é primo; incluí-lo como primo destruiria a unicidade da fatoração ao permitir acrescentar fatores 1 arbitrariamente.

### Aplicação

Fatorações ajudam a calcular MDC, MMC e a compreender denominadores e resíduos. Distinguir “parece primo” de “foi testado até um limite justificado” é parte do raciocínio matemático.

### Exercícios comentados

1. Qual número é primo?

   a) 29.
   b) 1.
   c) 27.

Resposta: 29.

29 não é divisível por 2,3 ou 5, os primos até sua raiz quadrada.

2. Como se classifica o número 1?

   a) Primo.
   b) Composto.
   c) Nem primo nem composto.

Resposta: Nem primo nem composto.

As duas definições exigem inteiro maior que 1.

3. Qual é a fatoração prima de 84?

   a) 2²·3·5.
   b) 2²·3·7.
   c) 2·3²·7.

Resposta: 2²·3·7.

4·3·7=84.

4. Para testar se 97 é primo por divisões, quais primos bastam?

   a) 2,3,5 e 7.
   b) Somente 2.
   c) Todos os primos até 97.

Resposta: 2,3,5 e 7.

Um composto possui divisor primo até sua raiz; √97 é menor que 10.

5. Se p é primo e divide ab, o que se conclui?

   a) p divide necessariamente a e b.
   b) a=b.
   c) p divide a ou p divide b.

Resposta: p divide a ou p divide b.

O lema exige primalidade e usa “ou” inclusivo.

6. Qual exemplo mostra que a conclusão anterior falha para divisor composto?

   a) 3∣9.
   b) 6∣(2·3), mas 6 não divide 2 nem 3.
   c) 2∣(2·3).

Resposta: 6∣(2·3), mas 6 não divide 2 nem 3.

O divisor composto 6 pode distribuir seus fatores primos entre os dois fatores do produto.

7. Quantos divisores positivos possui 12=2²·3?

   a) 6.
   b) 5.
   c) 12.

Resposta: 6.

Escolhemos expoente 0,1 ou 2 para 2 e 0 ou 1 para 3: 3·2=6.

8. Qual número é composto e ímpar?

   a) 13.
   b) 2.
   c) 15.

Resposta: 15.

15=3·5, mostrando que ser ímpar não basta para primalidade.

9. O que significa a unicidade da fatoração prima?

   a) Todo número tem exatamente dois fatores primos distintos.
   b) Os fatores primos e seus expoentes são determinados, ignorando a ordem.
   c) Só existe uma ordem possível para multiplicá-los.

Resposta: Os fatores primos e seus expoentes são determinados, ignorando a ordem.

Trocar a ordem dos fatores não gera uma fatoração essencialmente diferente.

10. Há um maior número primo?

   a) Não; o argumento do produto de uma lista de primos mais 1 refuta qualquer lista completa finita.
   b) Sim, mas ele é desconhecido.
   c) Sim, o maior é 97.

Resposta: Não; o argumento do produto de uma lista de primos mais 1 refuta qualquer lista completa finita.

Um divisor primo do produto mais 1 não pertence à lista, pois deixaria resto 1 em cada primo listado.

Referência: Rosen, 6ª ed., §3.5

## 10. Congruências: números com o mesmo resto

Num relógio de doze horas, avançar quinze horas tem o mesmo efeito que avançar três. Os inteiros não se tornam iguais: ficam equivalentes para uma pergunta específica sobre restos.

Para m≥2, a≡b (mod m) significa m∣(a−b), equivalentemente, a e b têm o mesmo resto euclidiano módulo m. Podemos somar, subtrair e multiplicar congruências com o mesmo módulo. Potências inteiras positivas também preservam a congruência. Para cancelar um fator c sem mudar o módulo, precisamos de mdc(c,m)=1. Um sistema completo de resíduos é {0,1,…,m−1}.

Se a−b=mk e c−d=mℓ, então (a+c)−(b+d)=m(k+ℓ). Para produtos, ac−bd=c(a−b)+b(c−d), também múltiplo de m. Cancelar é diferente: só podemos desfazer uma multiplicação quando o fator tem inverso modular.

### Exemplo guiado

Calcule 7²⁰ módulo 5. Primeiro reduza 7≡2 (mod 5).

Como 2⁴=16≡1 (mod 5), temos 2²⁰=(2⁴)⁵≡1⁵≡1 (mod 5).

O resto procurado é 1. Confira o padrão das potências de 2: 2,4,3,1, que se repete. A redução evita construir um inteiro enorme.

### Atenção

Em módulo 6, 2·1≡2·4, mas 1 não é congruente a 4. Não é permitido cancelar 2 nesse módulo, pois mdc(2,6)=2. A congruência original só implica uma relação com módulo reduzido.

### Aplicação

Use classes de restos para ciclos, calendários, posições circulares e verificações aritméticas. O módulo faz parte da afirmação: equivalência em módulo 5 não implica equivalência em módulo 7.

### Exercícios comentados

1. O que significa a≡b (mod m)?

   a) a=b nos inteiros.
   b) a divide m.
   c) m divide a−b.

Resposta: m divide a−b.

A diferença ser múltiplo de m equivale a ter o mesmo resto euclidiano.

2. Qual representante está em {0,1,…,6} e é congruente a −8 módulo 7?

   a) 1.
   b) 6.
   c) −1.

Resposta: 6.

−8=7·(−2)+6.

3. Quanto vale o resto de 38+27 por 5?

   a) 0.
   b) 3.
   c) 2.

Resposta: 0.

38≡3 e 27≡2; a soma é congruente a 5, ou 0.

4. Quanto vale o resto de 9·8 por 7?

   a) 1.
   b) 4.
   c) 2.

Resposta: 2.

9≡2 e 8≡1, portanto o produto é congruente a 2.

5. Qual é o resto de 2¹⁰ por 7?

   a) 1.
   b) 2.
   c) 4.

Resposta: 2.

2³≡1, então 2¹⁰=(2³)³·2≡2.

6. Qual condição permite cancelar c numa congruência módulo m sem alterar o módulo?

   a) mdc(c,m)=1.
   b) c ser positivo, apenas.
   c) c<m, apenas.

Resposta: mdc(c,m)=1.

A coprimalidade garante a existência do inverso de c no módulo.

7. É válido deduzir 1≡4 (mod 6) de 2·1≡2·4 (mod 6)?

   a) Sim; pode-se sempre dividir uma congruência por 2.
   b) Sim; 1 e 4 têm o mesmo resto por 6.
   c) Não; 2 não é invertível módulo 6.

Resposta: Não; 2 não é invertível módulo 6.

Os produtos diferem por 6, mas 1 e 4 diferem por 3, que não é múltiplo de 6.

8. Quais inteiros são congruentes a 3 módulo 5?

   a) Os da forma 5+3k, sempre.
   b) Os da forma 3+5k, k∈ℤ.
   c) Somente o inteiro 3.

Resposta: Os da forma 3+5k, k∈ℤ.

A diferença para 3 deve ser um múltiplo inteiro de 5.

9. Qual é o resto de 7²⁰ por 5?

   a) 1.
   b) 2.
   c) 4.

Resposta: 1.

7≡2 e 2⁴≡1; como 20 é múltiplo de 4, o resultado é 1.

10. De a≡b (mod m), para inteiro n≥1, o que sempre vale?

   a) a/n≡b/n em qualquer caso.
   b) a=b.
   c) aⁿ≡bⁿ (mod m).

Resposta: aⁿ≡bⁿ (mod m).

Multiplicar congruências repetidamente preserva o módulo; divisão exige condições adicionais.

Referência: Rosen, 6ª ed., §§3.4 e 3.7

## 11. Inversos e equações modulares

Na aritmética usual, dividir por 3 resolve 3x=1 nos racionais. Em módulo 7, a tarefa é outra: encontrar um inteiro cujo produto por 3 deixe resto 1.

Um inverso de a módulo m é um inteiro u com au≡1 (mod m). Ele existe exatamente quando mdc(a,m)=1. Bézout fornece u ao escrever 1=ua+vm. A congruência ax≡b (mod m) tem solução se e somente se d=mdc(a,m) divide b; quando tem, possui d classes de soluções módulo m. Se a é invertível, multiplicar por seu inverso produz a única classe de solução.

Se ax−my=b, todo divisor comum de a e m precisa dividir b, mostrando a condição necessária. Quando d divide b, uma identidade de Bézout para d pode ser multiplicada por b/d para produzir uma solução. As demais aparecem em intervalos de m/d dentro de um sistema de resíduos módulo m.

### Exemplo guiado

Resolva 6x≡8 (mod 14). Temos mdc(6,14)=2, que divide 8; há duas classes módulo 14.

Divida coeficientes e módulo por 2: 3x≡4 (mod 7). Como o inverso de 3 módulo 7 é 5, x≡20≡6 (mod 7).

Em {0,…,13}, as soluções são 6 e 13. Confira: 6·6−8=28 e 6·13−8=70, ambos múltiplos de 14.

### Atenção

Não declare uma solução única módulo 14 apenas porque a congruência reduzida tem uma classe módulo 7. Também não tente obter inverso de 2 módulo 6: nenhum produto 2u pode ter resto ímpar 1.

### Aplicação

Use inversos para desfazer multiplicações em códigos e congruências. Sempre confira o MDC antes de dividir e substitua cada solução no problema original.

### Exercícios comentados

1. Qual é um inverso de 3 módulo 7?

   a) 2.
   b) 5.
   c) 3.

Resposta: 5.

3·5=15≡1 (mod 7).

2. O número 2 possui inverso módulo 6?

   a) Não, pois mdc(2,6)=2.
   b) Sim, o inverso é 3.
   c) Sim, todo número diferente de zero tem inverso.

Resposta: Não, pois mdc(2,6)=2.

Só as classes coprimas ao módulo possuem inverso.

3. Qual classe resolve 3x≡4 (mod 7)?

   a) x≡4 (mod 7).
   b) x≡3 (mod 7).
   c) x≡6 (mod 7).

Resposta: x≡6 (mod 7).

Multiplique por 5: x≡20≡6.

4. Quantas classes módulo 14 resolvem 6x≡8?

   a) Nenhuma.
   b) Duas.
   c) Uma.

Resposta: Duas.

O MDC é 2 e divide 8; portanto há duas classes de solução.

5. Quais representantes em {0,…,13} resolvem 6x≡8 (mod 14)?

   a) 6 e 13.
   b) 4 e 11.
   c) 6 e 8.

Resposta: 6 e 13.

A redução dá x≡6 (mod 7); somar 7 fornece os dois representantes.

6. A congruência 4x≡3 (mod 6) possui solução?

   a) Sim, x≡1.
   b) Sim, x≡3.
   c) Não.

Resposta: Não.

O MDC de 4 e 6 é 2, que não divide 3.

7. Qual é um inverso de 7 módulo 26?

   a) 13.
   b) 15.
   c) 7.

Resposta: 15.

7·15=105=4·26+1.

8. Se 1=3a−2m, qual número é inverso de a módulo m?

   a) 3.
   b) −2.
   c) m.

Resposta: 3.

Reduzindo a identidade módulo m, fica 3a≡1.

9. Qual é a condição de existência de solução de ax≡b (mod m)?

   a) a é sempre primo.
   b) b é sempre menor que a.
   c) mdc(a,m) divide b.

Resposta: mdc(a,m) divide b.

A condição permite ou impede que a diferença ax−b seja múltiplo de m.

10. Quantas classes módulo 9 resolvem 3x≡0?

   a) Nove.
   b) Três: 0,3 e 6.
   c) Uma: apenas 0.

Resposta: Três: 0,3 e 6.

3x múltiplo de 9 equivale a x múltiplo de 3; há três representantes no sistema de resíduos.

Referência: Rosen, 6ª ed., §3.7

## 12. Ciclos, códigos e missão dos inteiros

Um calendário, um dígito verificador e uma cifra podem compartilhar a mesma ideia: descartar parte da informação e trabalhar com restos. É preciso saber o que cada modelo realmente garante.

Uma posição circular é calculada reduzindo deslocamentos módulo o tamanho do ciclo. Um dígito verificador simples pode ser escolhido para que uma soma ponderada seja congruente a zero; essa regra detecta certos erros, mas não todos. Para primo p e a não múltiplo de p, o pequeno teorema de Fermat dá a^(p−1)≡1 (mod p). Em um exemplo didático RSA, dois primos distintos p,q dão n=pq e φ(n)=(p−1)(q−1); escolhemos e coprimo a φ(n) e d inverso de e nesse módulo. Mensagens são resíduos módulo n e a operação envolve exponenciação modular. Os números pequenos usados aqui servem apenas para estudo.

Ciclos descartam voltas completas, que são múltiplos do tamanho do ciclo. A condição de coprimalidade permite desfazer uma multiplicação no anel de resíduos. No exemplo RSA, a relação ed≡1 (mod φ(n)) é o vínculo entre os expoentes; a justificativa completa também considera separadamente os fatores primos do módulo.

### Exemplo guiado

Use p=5 e q=11: n=55 e φ(n)=4·10=40. Escolha e=3.

O inverso é d=27, pois 3·27=81≡1 (mod 40). Para a mensagem 7, calcule c=7³ mod 55=13.

A decodificação calcula 13²⁷ mod 55=7. Faça as potências por quadrados sucessivos e reduza a cada multiplicação; não confunda φ(n)=40 com o módulo das mensagens, n=55.

### Atenção

Uma soma verificadora igual não prova que dois arquivos são iguais. E as hipóteses de Fermat importam: a^(p−1)≡1 requer p primo e a não divisível por p. O exemplo de criptografia com números pequenos não é uma receita de segurança para sistemas reais.

### Aplicação

Modele ciclos de horários e checagens aritméticas declarando exatamente o módulo. Ao explicar um algoritmo, separe a propriedade matemática demonstrada das garantias adicionais exigidas por uma aplicação real.

### Exercícios comentados

1. No ciclo das horas 0,…,23, que hora vem 17 horas após as 19?

   a) 12.
   b) 36.
   c) 2.

Resposta: 12.

19+17=36 e 36≡12 (mod 24).

2. Qual d∈{0,…,9} torna 7+8+d congruente a 0 módulo 10?

   a) 3.
   b) 0.
   c) 5.

Resposta: 5.

A soma inicial é 15; somar 5 leva a 20, múltiplo de 10.

3. Duas mensagens têm a mesma soma módulo 10. O que podemos concluir?

   a) A checagem detecta todo erro possível.
   b) A checagem sozinha não garante que as mensagens sejam iguais.
   c) As mensagens são necessariamente iguais.

Resposta: A checagem sozinha não garante que as mensagens sejam iguais.

Mensagens diferentes podem produzir o mesmo resto; isso é uma colisão da checagem.

4. Quais hipóteses permitem usar a^(p−1)≡1 (mod p)?

   a) p primo e p não divide a.
   b) p positivo, sem outras condições.
   c) a=p.

Resposta: p primo e p não divide a.

A primalidade do módulo e a não divisibilidade são as condições do pequeno teorema de Fermat.

5. Qual é o resto de 3¹⁰⁰ por 7?

   a) 1.
   b) 3.
   c) 4.

Resposta: 4.

3⁶≡1 e 100 deixa resto 4 na divisão por 6. Assim 3¹⁰⁰≡3⁴=81≡4.

6. No exemplo p=5 e q=11, quanto valem n e φ(n)?

   a) n=16 e φ(n)=10.
   b) n=55 e φ(n)=40.
   c) n=40 e φ(n)=55.

Resposta: n=55 e φ(n)=40.

n é o produto dos primos; φ(n) é (5−1)(11−1)=40.

7. Por que e=3 admite inverso módulo 40?

   a) Porque mdc(3,40)=1.
   b) Porque 3 divide 40.
   c) Porque 40 é primo.

Resposta: Porque mdc(3,40)=1.

A coprimalidade é exatamente a condição de existência do inverso.

8. Qual d resolve 3d≡1 (mod 40)?

   a) 13.
   b) 3.
   c) 27.

Resposta: 27.

3·27=81=2·40+1.

9. Quanto vale 7³ mod 55?

   a) 18.
   b) 13.
   c) 7.

Resposta: 13.

7³=343=6·55+13.

10. Na missão RSA didática, quais módulos têm papéis diferentes?

   a) 55 para as mensagens e 40 para relacionar os expoentes.
   b) 40 para as mensagens e 55 para os expoentes.
   c) Apenas o módulo 3 é utilizado.

Resposta: 55 para as mensagens e 40 para relacionar os expoentes.

O produto n=pq é o módulo da exponenciação; φ(n) orienta a escolha dos expoentes inversos.

Referência: Rosen, 6ª ed., §3.7

## 13. Contar sem listar: soma e produto

Um sistema oferece três perfis e quatro temas de tela. É diferente escolher um perfil e um tema de escolher apenas um item de duas listas alternativas.

Se uma tarefa possui etapas sucessivas com n₁,n₂,… possibilidades em cada ramo, o princípio multiplicativo conta o produto dessas quantidades quando a quantidade de opções de cada etapa é a mesma em todos os ramos anteriores. Para alternativas disjuntas, o princípio aditivo soma as quantidades. Se as alternativas se sobrepõem, a soma simples conta repetições. Uma sequência de n bits tem 2ⁿ possibilidades; uma posição fixa reduz o número de escolhas livres.

Organizar resultados como pares ou caminhos de uma árvore faz cada resultado corresponder a uma escolha em cada etapa. Para alternativas disjuntas, cada resultado pertence a exatamente uma categoria, por isso somar não cria duplicatas. A correspondência entre o modelo e o que se deseja contar deve ser justificada.

### Exemplo guiado

Uma identificação possui duas letras de um alfabeto de 4 letras, seguidas por um dígito decimal. Repetições são permitidas.

Há 4 escolhas na primeira posição, 4 na segunda e 10 na terceira: 4·4·10=160 identificações.

Se as letras precisassem ser distintas, a segunda posição teria 3 escolhas, dando 4·3·10=120. A regra mudou porque a restrição mudou.

### Atenção

Multiplicar não exige probabilidades independentes; exige uma contagem correta de opções por ramo. Se o número varia entre ramos, separe casos e some os produtos correspondentes.

### Aplicação

Modele senhas, rotas e configurações descrevendo primeiro posições, opções e restrições. Não faça uma conta antes de decidir se a ordem ou a repetição gera resultados diferentes.

### Exercícios comentados

1. Há 3 perfis e 4 temas. Quantos pares perfil-tema existem?

   a) 7.
   b) 16.
   c) 12.

Resposta: 12.

Para cada perfil há quatro temas: 3·4=12.

2. Escolhe-se um único item entre 5 livros e 3 revistas, todos distintos. Quantas opções há?

   a) 2.
   b) 8.
   c) 15.

Resposta: 8.

As categorias são disjuntas e a escolha é de um único item, então somamos 5+3.

3. Quantas sequências de quatro bits existem?

   a) 16.
   b) 8.
   c) 4.

Resposta: 16.

Cada posição tem duas opções: 2⁴=16.

4. Quantas sequências de quatro bits começam por 1?

   a) 16.
   b) 4.
   c) 8.

Resposta: 8.

A primeira posição está fixa e três ficam livres: 2³=8.

5. Um código de duas letras usa um alfabeto de 5 letras, com repetição. Quantos códigos existem?

   a) 10.
   b) 25.
   c) 20.

Resposta: 25.

São 5 opções em cada posição: 5²=25.

6. E se as duas letras do código anterior precisarem ser distintas?

   a) 20.
   b) 25.
   c) 10.

Resposta: 20.

Depois da primeira escolha, restam quatro letras: 5·4=20.

7. Por que somar tamanhos de categorias que se sobrepõem pode dar errado?

   a) Porque o princípio aditivo nunca funciona.
   b) Porque toda sobreposição é vazia.
   c) Um resultado pode ser contado mais de uma vez.

Resposta: Um resultado pode ser contado mais de uma vez.

A soma simples pressupõe categorias disjuntas; a interseção exige correção.

8. Quantos códigos têm duas letras de um alfabeto de 4 letras e um dígito, com repetições?

   a) 18.
   b) 160.
   c) 120.

Resposta: 160.

O produto é 4·4·10.

9. Se as duas letras desse código forem distintas, quantos códigos restam?

   a) 120.
   b) 160.
   c) 80.

Resposta: 120.

A segunda letra tem três opções, portanto 4·3·10=120.

10. Quando as quantidades de opções variam entre ramos, qual estratégia é segura?

   a) Multiplicar sempre os maiores números encontrados.
   b) Ignorar as restrições.
   c) Separar casos disjuntos e somar os produtos corretos de cada caso.

Resposta: Separar casos disjuntos e somar os produtos corretos de cada caso.

Uma árvore de escolhas ou uma separação de casos evita contar caminhos inexistentes.

Referência: Rosen, 6ª ed., §5.1

## 14. Permutações e arranjos: quando a ordem importa

Escolher três pessoas para uma equipe não é a mesma tarefa que escolher presidente, secretário e tesoureiro. Na segunda, trocar pessoas de cargo altera o resultado.

Para n objetos distintos, uma permutação dos n objetos tem n! possibilidades. Uma escolha ordenada de r objetos distintos, sem reposição, tem P(n,r)=n!/(n−r)!, para 0≤r≤n. Se há grupos de objetos indistinguíveis com tamanhos n₁,…,nₖ e soma n, as ordenações distintas são n!/(n₁!⋯nₖ!). Já uma sequência de r posições com n opções em cada uma, permitindo repetição, possui nʳ possibilidades. A fórmula depende do modelo, não do nome usado pelo enunciado.

Sem reposição, as opções diminuem: n na primeira posição, n−1 na segunda e assim por diante. Para objetos repetidos, marcar artificialmente objetos iguais conta cada arranjo várias vezes; dividir pelas permutações internas de cada grupo remove essa multiplicidade.

### Exemplo guiado

Quantas palavras distintas podem ser feitas com todas as letras de ARARA? São cinco letras, com A repetido três vezes e R duas.

Se cada cópia fosse rotulada, teríamos 5! ordenações. Cada palavra sem rótulos aparece 3!·2! vezes nessa contagem.

O total é 5!/(3!·2!)=10. Não exigimos que a palavra exista no dicionário; contamos sequências de letras.

### Atenção

Não use n! para uma escolha ordenada que ocupa apenas r posições. E dividir por r! só faz sentido quando as r! ordens contadas representam o mesmo resultado não ordenado.

### Aplicação

Distinga cargos, pódios, posições em fila e conjuntos de pessoas. Declare se objetos repetidos são realmente indistinguíveis ou apenas têm características iguais.

### Exercícios comentados

1. Quantas filas existem com quatro pessoas distintas?

   a) 4.
   b) 24.
   c) 16.

Resposta: 24.

São 4!=4·3·2·1=24 ordenações.

2. Quantos pódios de três posições podem ser formados com seis pessoas distintas, sem empates?

   a) 120.
   b) 20.
   c) 216.

Resposta: 120.

As posições têm 6,5 e 4 opções: 6·5·4=120.

3. Quanto vale P(5,2)?

   a) 10.
   b) 25.
   c) 20.

Resposta: 20.

Escolhemos dois objetos em ordem, sem reposição: 5·4=20.

4. Quantas sequências de três posições usam quatro símbolos com repetição permitida?

   a) 12.
   b) 64.
   c) 24.

Resposta: 64.

Cada posição tem quatro opções: 4³=64.

5. Quantas ordenações distintas possuem as letras de ARARA?

   a) 10.
   b) 120.
   c) 20.

Resposta: 10.

Divida 5! por 3! para os A e 2! para os R.

6. Quantas ordenações distintas possuem as letras de CASA?

   a) 24.
   b) 6.
   c) 12.

Resposta: 12.

Há quatro letras com A repetido duas vezes: 4!/2!=12.

7. Quanto vale 0!?

   a) Não existe.
   b) 1.
   c) 0.

Resposta: 1.

Há uma única ordenação vazia, compatível com a definição recursiva do fatorial.

8. Escolher presidente e secretário entre cinco pessoas exige qual contagem?

   a) 5·4.
   b) 5+4.
   c) 5·5, sem restrição.

Resposta: 5·4.

Os cargos distinguem as posições e a mesma pessoa não ocupa ambos nessa escolha.

9. Por que dividimos por 3!·2! em ARARA?

   a) Porque a ordem nunca importa em palavras.
   b) Porque há somente duas letras.
   c) Porque trocar cópias dos A e dos R não altera a palavra sem rótulos.

Resposta: Porque trocar cópias dos A e dos R não altera a palavra sem rótulos.

A divisão corrige as múltiplas rotulações artificiais de um mesmo resultado.

10. Quantas ordenações de ABCDE começam por A?

   a) 5.
   b) 24.
   c) 120.

Resposta: 24.

A primeira posição está fixa; as quatro restantes podem ser permutadas de 4! formas.

Referência: Rosen, 6ª ed., §§5.3 e 5.5

## 15. Combinações e coeficientes binomiais

A equipe {Ana,Bia,Caio} é a mesma se os nomes forem listados em outra ordem. Uma contagem que distingue essas listas precisa ser corrigida antes de contar equipes.

Uma seleção de r objetos entre n distintos, sem ordem e sem reposição, tem C(n,r)=n!/[r!(n−r)!] possibilidades. Vale C(n,r)=C(n,n−r), pois escolher quem entra determina quem fica fora. A identidade de Pascal é C(n,r)=C(n−1,r−1)+C(n−1,r), nos índices aplicáveis. No desenvolvimento de (x+y)ⁿ, o coeficiente de xⁿ⁻ʳyʳ é C(n,r). Quando são escolhidos r objetos indistinguíveis de n tipos, com repetição permitida e sem limites por tipo, a contagem é C(n+r−1,r).

Uma escolha ordenada de r objetos conta cada subconjunto r! vezes, uma por ordem interna; dividir corrige a multiplicidade. Na identidade de Pascal, separe as seleções que incluem um objeto fixado das que não incluem. As categorias são disjuntas e cobrem todas as possibilidades.

### Exemplo guiado

Escolher três pessoas entre oito, sem cargos, é uma seleção sem ordem.

A contagem ordenada 8·7·6 conta a mesma equipe de 3!=6 maneiras. Dividindo: C(8,3)=56.

Confira pela divisão de casos sobre uma pessoa fixa: C(7,2)+C(7,3)=21+35=56. As duas justificativas descrevem a mesma família de equipes.

### Atenção

C(n,r) não serve automaticamente para posições distintas ou para escolhas com repetição. Antes da fórmula, escreva se a ordem importa, se objetos podem se repetir e se há limites por tipo.

### Aplicação

Use combinações para comissões, amostras sem ordem e coeficientes. Para misturas de tipos com repetição, estabeleça explicitamente se as cópias de cada tipo são indistinguíveis.

### Exercícios comentados

1. Quanto vale C(8,3)?

   a) 56.
   b) 336.
   c) 24.

Resposta: 56.

8·7·6 dividido por 3·2·1 resulta em 56.

2. Quantos pares sem ordem podem ser escolhidos entre cinco pessoas?

   a) 20.
   b) 25.
   c) 10.

Resposta: 10.

C(5,2)=5·4/2=10.

3. Quanto vale C(6,0)?

   a) 6.
   b) 1.
   c) 0.

Resposta: 1.

Há um único subconjunto vazio.

4. Quanto vale C(6,6)?

   a) 1.
   b) 6.
   c) 720.

Resposta: 1.

Existe uma única seleção que inclui todos os seis objetos.

5. Qual igualdade expressa a simetria das combinações?

   a) C(n,r)=nʳ, sempre.
   b) C(n,r)=r!.
   c) C(n,r)=C(n,n−r).

Resposta: C(n,r)=C(n,n−r).

A escolha de quem entra equivale à escolha do complemento.

6. Qual é o coeficiente de x³y² em (x+y)⁵?

   a) 5.
   b) 10.
   c) 20.

Resposta: 10.

É C(5,2)=10, escolhendo em quais dois fatores aparece y.

7. Quanto vale C(5,2)+C(5,3)?

   a) 20.
   b) 10.
   c) 30.

Resposta: 20.

Ambos valem 10; pela identidade de Pascal a soma é C(6,3)=20.

8. Quantas soluções inteiras não negativas tem a+b+c=4?

   a) 12.
   b) 81.
   c) 15.

Resposta: 15.

Distribuir quatro unidades indistinguíveis entre três variáveis dá C(4+3−1,3−1)=C(6,2)=15.

9. Escolher três sabores distintos entre sete, sem importar a ordem, exige qual expressão?

   a) 7³.
   b) C(7,3).
   c) P(7,3).

Resposta: C(7,3).

É uma seleção de três elementos distintos sem ordem nem repetição.

10. Em uma prova de Pascal, por que os casos “inclui o objeto fixado” e “não inclui” podem ser somados?

   a) São disjuntos e cobrem todas as seleções.
   b) Porque a ordem dos objetos passou a importar.
   c) Porque têm sempre o mesmo tamanho.

Resposta: São disjuntos e cobrem todas as seleções.

O princípio aditivo é válido porque nenhuma seleção pertence aos dois casos.

Referência: Rosen, 6ª ed., §§5.3–5.5

## 16. Restrições, sobreposições e princípio das gavetas

Vinte alunos usam uma ferramenta e quinze usam outra. A soma 35 não informa quantos alunos distintos usam alguma delas: pessoas podem estar nas duas listas.

Para conjuntos finitos, a cardinalidade da união de dois conjuntos é a soma de suas cardinalidades menos a da interseção. Para três conjuntos, somamos os tamanhos individuais, subtraímos as três interseções de pares e adicionamos a interseção tripla. No princípio das gavetas, distribuir N objetos em k≥1 caixas garante uma caixa com pelo menos ⌈N/k⌉ objetos. São garantias de existência, não uma indicação de qual caixa atingirá o limite.

Na soma de dois tamanhos, um elemento da interseção aparece duas vezes e deve ficar uma. Com três conjuntos, um elemento da interseção tripla é contado três vezes, subtraído três vezes e, por isso, precisa ser adicionado uma vez. Para as gavetas, se todas as caixas tivessem menos que o limite necessário, a capacidade total não comportaria os N objetos.

### Exemplo guiado

Entre os inteiros de 1 a 30, quantos são divisíveis por 2 ou por 3? Há 15 múltiplos de 2 e 10 de 3.

Os múltiplos comuns são os múltiplos de 6: existem 5. Subtraia a contagem repetida: 15+10−5=20.

O “ou” é inclusivo: 6 e 12 entram uma vez. Como há 30 inteiros no universo, 10 não são divisíveis por nenhum dos dois.

### Atenção

Não use inclusão-exclusão sem identificar o universo e as interseções. No princípio das gavetas, a garantia depende da pior distribuição possível; uma distribuição particular mais concentrada não muda esse limite garantido.

### Aplicação

Aplique essas ideias a listas sobrepostas, restrições de senhas e colisões em categorias. Distinguir “há uma repetição garantida” de “todos os grupos têm repetição” evita conclusões excessivas.

### Exercícios comentados

1. Se A tem 20 elementos, B tem 15 e A∩B tem 6, quantos elementos tem A∪B?

   a) 35.
   b) 41.
   c) 29.

Resposta: 29.

20+15−6=29, corrigindo a dupla contagem dos elementos comuns.

2. Entre 1 e 30, quantos inteiros são divisíveis por 2 ou por 3?

   a) 15.
   b) 20.
   c) 25.

Resposta: 20.

Há 15 múltiplos de 2, 10 de 3 e 5 de 6: 15+10−5=20.

3. Em um universo de 30 elementos, a união tem 20. Quantos estão fora dela?

   a) 10.
   b) 20.
   c) 50.

Resposta: 10.

O complemento tem 30−20=10 elementos.

4. Treze pessoas são agrupadas por mês de nascimento. O que é garantido?

   a) Todas nasceram no mesmo mês.
   b) Cada mês tem ao menos uma pessoa.
   c) Pelo menos duas nasceram no mesmo mês.

Resposta: Pelo menos duas nasceram no mesmo mês.

Há 13 pessoas para 12 categorias, então alguma categoria contém ao menos duas.

5. Dez objetos são distribuídos em três caixas. Qual ocupação mínima é garantida em alguma caixa?

   a) Pelo menos 5 objetos.
   b) Pelo menos 4 objetos.
   c) Pelo menos 3 objetos.

Resposta: Pelo menos 4 objetos.

O teto de 10/3 é 4. A distribuição 4,3,3 mostra que não se garante 5.

6. Para garantir três objetos em alguma de cinco caixas, quantos objetos bastam e são necessários no pior caso?

   a) 11.
   b) 10.
   c) 15.

Resposta: 11.

Com dez, é possível colocar dois por caixa. O décimo primeiro força uma caixa a chegar a três.

7. Na inclusão-exclusão de três conjuntos, o que fazemos com a interseção tripla após subtrair as interseções de pares?

   a) Subtraímos mais uma vez.
   b) Ignoramos sempre.
   c) Adicionamos uma vez.

Resposta: Adicionamos uma vez.

O elemento triplo teve saldo zero após as duas etapas anteriores; precisa aparecer uma vez.

8. Quantas sequências de quatro bits possuem ao menos um bit 1?

   a) 14.
   b) 15.
   c) 16.

Resposta: 15.

Do total 2⁴=16, retire apenas 0000.

9. Se A e B são disjuntos, quanto vale a cardinalidade de A∪B?

   a) A soma das cardinalidades de A e B.
   b) A soma mais 1.
   c) O produto das cardinalidades.

Resposta: A soma das cardinalidades de A e B.

A interseção tem tamanho zero, então não há dupla contagem a corrigir.

10. Se um cadastro associa 101 pessoas a apenas 100 códigos possíveis, o que é garantido?

   a) Todas recebem códigos distintos.
   b) Exatamente duas pessoas recebem o mesmo código, necessariamente.
   c) Duas pessoas recebem o mesmo código.

Resposta: Duas pessoas recebem o mesmo código.

As gavetas garantem pelo menos uma colisão, mas não determinam a quantidade exata de colisões.

Referência: Rosen, 6ª ed., §5.2 e §§7.5–7.6

## 17. Construir recorrências e escolher as bases

Quantas sequências binárias de comprimento n não têm dois bits 1 consecutivos? Listar todas cresce rapidamente; classificar pelo começo da sequência conecta o problema a comprimentos menores.

Uma relação de recorrência determina termos a partir de anteriores; condições iniciais selecionam uma sequência específica. Para contar sequências de bits sem 11, use a₀=1 para a sequência vazia e a₁=2 para 0 e 1. Para n≥2, aₙ=aₙ₋₁+aₙ₋₂: as sequências que começam por 0 correspondem a problemas de tamanho n−1; as que começam por 1 precisam começar por 10 e correspondem ao tamanho n−2. Uma recorrência precisa declarar domínio, índices e bases.

Os dois casos do modelo são disjuntos e cobrem todas as sequências válidas. Remover o prefixo fixado produz uma bijeção com a família menor correspondente. As bases tratam os tamanhos nos quais a classificação por dois caracteres ainda não pode ser aplicada diretamente.

### Exemplo guiado

Para sequências sem 11: a₀=1 e a₁=2. Calcule a₂=a₁+a₀=3.

Depois a₃=3+2=5 e a₄=5+3=8. As três sequências válidas de comprimento 2 são 00,01 e 10.

O valor a₄=8 depende das bases 1 e 2. A mesma regra com bases diferentes produziria outra sequência; ela é relacionada a Fibonacci, mas os índices precisam ser ajustados.

### Atenção

A sequência vazia conta como uma possibilidade quando contamos todas as sequências de comprimento zero. Usar a₀=0 neste problema altera todos os termos seguintes. Não reutilize bases de outro problema só porque a fórmula recursiva parece igual.

### Aplicação

Para modelar um processo, desenhe um caso pequeno, separe casos disjuntos e explique como cada um reduz o tamanho. Só depois escreva a recorrência e determine as bases.

### Exercícios comentados

1. Com a₀=1, a₁=2 e aₙ=aₙ₋₁+aₙ₋₂, quanto vale a₂?

   a) 4.
   b) 3.
   c) 2.

Resposta: 3.

a₂=a₁+a₀=2+1.

2. Na mesma sequência, quanto vale a₄?

   a) 8.
   b) 5.
   c) 13.

Resposta: 8.

Os termos iniciais são 1,2,3,5,8.

3. Quantas sequências de bits de comprimento zero existem?

   a) Nenhuma.
   b) Duas.
   c) Uma, a sequência vazia.

Resposta: Uma, a sequência vazia.

Há uma única maneira de não escolher posições; essa convenção é a base combinatória adequada.

4. Quantas sequências de três bits não contêm 11?

   a) 8.
   b) 5.
   c) 6.

Resposta: 5.

São 000,001,010,100 e 101.

5. Por que os casos “começa por 0” e “começa por 10” podem ser somados para n≥2?

   a) São disjuntos e cobrem todas as sequências válidas.
   b) Porque têm necessariamente a mesma quantidade.
   c) Porque toda sequência contém 10.

Resposta: São disjuntos e cobrem todas as sequências válidas.

Toda sequência válida começa por 0 ou, se começa por 1, precisa ter 0 na segunda posição.

6. Uma recorrência sem condições iniciais normalmente determina uma única sequência?

   a) Sim, sempre.
   b) Sim, se houver uma soma.
   c) Não; as bases selecionam uma sequência entre várias.

Resposta: Não; as bases selecionam uma sequência entre várias.

A mesma regra pode gerar sequências diferentes a partir de valores iniciais distintos.

7. Com b₀=3 e bₙ=bₙ₋₁+2 para n≥1, quanto vale b₃?

   a) 11.
   b) 9.
   c) 6.

Resposta: 9.

A sequência começa 3,5,7,9.

8. Se T₀=0 e Tₙ=2Tₙ₋₁+1, quanto vale T₃?

   a) 7.
   b) 8.
   c) 6.

Resposta: 7.

Os termos são 0,1,3,7.

9. Se a recorrência usa n−2, qual cuidado é necessário?

   a) Substituir sempre termos negativos por zero, sem aviso.
   b) Ignorar o caso n=0.
   c) Declarar um início no qual esses índices façam sentido e fornecer as bases correspondentes.

Resposta: Declarar um início no qual esses índices façam sentido e fornecer as bases correspondentes.

O domínio dos índices faz parte da definição matemática.

10. Qual etapa deve vir antes de aplicar uma fórmula pronta de recorrência?

   a) Supor que todas as recorrências são Fibonacci.
   b) Definir o que o termo conta e justificar a decomposição do problema.
   c) Escolher bases por aparência.

Resposta: Definir o que o termo conta e justificar a decomposição do problema.

Modelos semelhantes podem ter regras ou bases diferentes; o significado do termo orienta a conta.

Referência: Rosen, 6ª ed., §7.1

## 18. Resolver recorrências e missão integradora

Conhecer uma regra que gera o próximo termo é útil, mas calcular o milésimo termo repetindo mil passos pode ser desnecessário. Uma fórmula explícita permite ver o padrão e precisa ser conferida nas bases e na regra.

Para aₙ=raₙ₋₁, com a₀ dado, aₙ=a₀rⁿ. Para T₀=0 e Tₙ=2Tₙ₋₁+1, a fórmula é Tₙ=2ⁿ−1. Ela pode ser conjecturada por expansão e verificada por indução. Na recorrência linear homogênea aₙ=c₁aₙ₋₁+c₂aₙ₋₂, raízes características distintas e não nulas r₁,r₂ da equação r²−c₁r−c₂=0 levam à forma aₙ=A r₁ⁿ+B r₂ⁿ, com A,B determinados pelas bases. Raiz repetida exige outra forma e não é coberta por essa fórmula de raízes distintas.

Substituir aₙ=rⁿ na regra homogênea conduz à equação característica. Cada raiz fornece uma solução, e combinações lineares também satisfazem a regra. As bases definem os coeficientes. Para regras com termo adicional, como +1, é preciso incluir uma solução particular ou encontrar outra transformação; não se pode aplicar cegamente a fórmula homogênea.

### Exemplo guiado

Considere a₀=1, a₁=3 e aₙ=3aₙ₋₁−2aₙ₋₂. A equação característica é r²−3r+2=0, com raízes 1 e 2.

Escreva aₙ=A+B·2ⁿ. As bases dão A+B=1 e A+2B=3, portanto B=2 e A=−1.

Logo aₙ=2ⁿ⁺¹−1, que produz 1,3,7,15. Substituir na recorrência e nas duas bases confere a solução. A representação binária desses valores contém n+1 bits 1, conectando contagem, recorrência e bases numéricas.

### Atenção

Ajustar uma fórmula aos três primeiros termos não demonstra que ela vale sempre. Verifique as condições iniciais e prove que a fórmula satisfaz a regra no domínio inteiro. Também separe raízes distintas de repetidas na equação característica.

### Aplicação

Na missão final, modele uma contagem, obtenha uma recorrência, resolva um caso simples e justifique a resposta por indução. Use restos e bases numéricas como verificações adicionais, sempre explicando por que cada teste é pertinente.

### Exercícios comentados

1. Se a₀=5 e aₙ=2aₙ₋₁, qual fórmula é correta?

   a) aₙ=5·2ⁿ.
   b) aₙ=2·5ⁿ.
   c) aₙ=5+2n.

Resposta: aₙ=5·2ⁿ.

A base é 5 e cada passo multiplica por 2.

2. Para T₀=0 e Tₙ=2Tₙ₋₁+1, qual fórmula é correta?

   a) Tₙ=2ⁿ.
   b) Tₙ=n².
   c) Tₙ=2ⁿ−1.

Resposta: Tₙ=2ⁿ−1.

A base dá 0 e 2(2ⁿ⁻¹−1)+1=2ⁿ−1.

3. Na recorrência aₙ=3aₙ₋₁−2aₙ₋₂, qual equação característica aparece?

   a) r−3=0.
   b) r²−3r+2=0.
   c) r²+3r−2=0.

Resposta: r²−3r+2=0.

Substitua aₙ=rⁿ e reúna os termos da regra homogênea.

4. Quais são as raízes de r²−3r+2=0?

   a) 1 e 2.
   b) −1 e −2.
   c) 2 e 3.

Resposta: 1 e 2.

A fatoração é (r−1)(r−2).

5. Com a₀=1 e a₁=3, quais coeficientes satisfazem aₙ=A+B·2ⁿ?

   a) A=1 e B=2.
   b) A=2 e B=−1.
   c) A=−1 e B=2.

Resposta: A=−1 e B=2.

A+B=1 e A+2B=3 dão B=2 e A=−1.

6. Na sequência anterior, quanto vale a₄?

   a) 63.
   b) 31.
   c) 15.

Resposta: 31.

A fórmula 2ⁿ⁺¹−1 dá 2⁵−1=31.

7. Qual é a escrita binária de 31?

   a) 11111₂.
   b) 10000₂.
   c) 11110₂.

Resposta: 11111₂.

31=16+8+4+2+1, somando cinco potências consecutivas de 2.

8. Por que a fórmula homogênea não pode ser aplicada diretamente a Tₙ=2Tₙ₋₁+1?

   a) Porque nenhuma recorrência possui fórmula explícita.
   b) Porque T₀=0 é proibido.
   c) Há um termo adicional independente dos termos anteriores.

Resposta: Há um termo adicional independente dos termos anteriores.

O +1 torna a recorrência não homogênea e precisa ser tratado.

9. Qual verificação é necessária para aceitar uma fórmula explícita proposta?

   a) Observar que seus valores são positivos.
   b) Conferir as bases e demonstrar que satisfaz a recorrência no domínio.
   c) Conferir apenas o termo n=1.

Resposta: Conferir as bases e demonstrar que satisfaz a recorrência no domínio.

Bases e regra determinam a sequência; poucos exemplos não substituem a demonstração.

10. Quantas sequências binárias não vazias têm comprimento no máximo 4?

   a) 30.
   b) 16.
   c) 31.

Resposta: 30.

Somamos 2¹+2²+2³+2⁴=30. Incluir o comprimento zero acrescentaria uma sequência e daria 31.

Referência: Rosen, 6ª ed., §§7.1–7.2
