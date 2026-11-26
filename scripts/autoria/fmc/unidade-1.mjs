import { lesson } from "../estrutura.mjs";
export default [
	lesson({
		n: 1,
		title: "Linguagem matemática: ler antes de calcular",
		source: "Rosen, 6ª ed., §§1.1–1.4 e 2.1–2.2",
		goal: "Distinguir proposições, quantificadores, pertinência e inclusão.",
		prereq: "Operações com inteiros e leitura de conjuntos.",
		hook: "Uma inscrição exige que todos os campos estejam preenchidos. Encontrar um formulário completo confirma que todos estão completos? Traduzir “todos” e “existe” muda o que precisamos verificar.",
		concept:
			"Uma proposição é uma afirmação com valor de verdade; perguntas e expressões com variável livre não são proposições determinadas. Em p⇒q, p é hipótese e q é conclusão; a implicação só é falsa quando p é verdadeira e q é falsa. ∀ significa “para todo”; ∃, “existe”. O domínio precisa estar declarado. a∈A compara elemento e conjunto; A⊆B compara conjuntos. Adotamos ℕ={0,1,2,…}.",
		why: "Uma afirmação universal precisa valer para cada elemento do domínio. Um único contraexemplo a refuta. Já uma existência é estabelecida por uma testemunha. Negar “todos têm P” significa “existe alguém sem P”, e não “ninguém tem P”.",
		example: [
			"Considere a afirmação: para todo n∈ℕ, n²≥n. Identifique o domínio ℕ e a propriedade n²≥n.",
			"Para refutar uma universal, procuraríamos um n∈ℕ com n²<n. Testar alguns números orienta a investigação, mas não prova todos os casos.",
			"Aqui n²−n=n(n−1)≥0: para n=0 o produto é 0; para n≥1 ambos os fatores são não negativos. A afirmação foi justificada para todo o domínio.",
		],
		trap: "Trocar ∀ por ∃ enfraquece a afirmação. Além disso, a contrapositiva de p⇒q é ¬q⇒¬p; a recíproca q⇒p não é automaticamente equivalente.",
		transfer:
			"Leia requisitos de um sistema separando condição necessária, condição suficiente e domínio. Um teste que encontra um erro refuta “o programa funciona para toda entrada”; alguns testes bem-sucedidos não demonstram essa frase universal.",
		quiz: `Qual frase é uma proposição determinada? | 2+3=5. | Qual é seu nome? | x>3, sem domínio ou valor de x. | A igualdade tem valor de verdade. A pergunta não é uma afirmação, e x>3 é uma sentença aberta.
Em p⇒q, quando a implicação é falsa? | p verdadeira e q falsa. | p falsa e q verdadeira. | p e q falsas. | Uma hipótese verdadeira não pode levar a conclusão falsa numa implicação verdadeira.
Qual é a negação de “todo aluno enviou o arquivo”? | Existe aluno que não enviou o arquivo. | Nenhum aluno enviou o arquivo. | Todo aluno enviou dois arquivos. | Para negar uma universal, basta afirmar a existência de um contraexemplo.
Qual é a negação de “existe n∈ℕ com P(n)”? | Para todo n∈ℕ, não P(n). | Existe n∈ℕ com não P(n). | Para todo n∈ℕ, P(n). | Negar a existência exige que nenhum elemento tenha a propriedade.
Se A={1,2}, qual afirmação é verdadeira? | 1∈A. | {1}=1. | 3∈A. | O número 1 é um elemento de A; um conjunto unitário não é o mesmo objeto que seu elemento.
Para A={1,2} e B={1,2,3}, qual relação vale? | A⊆B. | B⊆A. | A=B. | Cada elemento de A pertence a B; 3 impede a inclusão na direção contrária.
Como refutar uma afirmação universal sobre inteiros? | Exibir um inteiro que a viole. | Exibir três inteiros que a satisfaçam. | Testar só os positivos. | Um contraexemplo no domínio declarado basta; exemplos favoráveis não cobrem todos os inteiros.
Qual é a contrapositiva de p⇒q? | ¬q⇒¬p. | q⇒p. | ¬p⇒¬q. | A contrapositiva nega e troca hipótese e conclusão, preservando a equivalência lógica.
Quantos elementos possui {∅}? | 1. | 0. | 2. | O conjunto tem um único elemento: o conjunto vazio. Ele é diferente de ∅.
Em ℕ={0,1,2,…}, qual frase é verdadeira? | Existe n∈ℕ com n²=0. | Todo n∈ℕ satisfaz n²=0. | Não existe n∈ℕ com n²=0. | n=0 é uma testemunha da existência; n=1 refuta a afirmação universal.`,
	}),
	lesson({
		n: 2,
		title: "Bases numéricas: o valor de cada posição",
		source: "Rosen, 6ª ed., §3.6",
		goal: "Converter inteiros entre bases 2, 10 e 16 e justificar o procedimento.",
		prereq: "Potências de expoente inteiro não negativo.",
		hook: "O texto 101 não identifica sozinho uma quantidade: em base dez vale cento e um; em base dois vale cinco. O computador não muda a matemática, mas a convenção de escrita.",
		concept:
			"Na base b≥2, os algarismos permitidos são 0,…,b−1 e o valor de aₖ…a₁a₀ é a soma aᵢbⁱ. Em hexadecimal, A,…,F representam 10,…,15. Para converter um inteiro não negativo da base dez, divida sucessivamente por b e leia os restos de baixo para cima. Cada grupo de quatro bits corresponde a um dígito hexadecimal.",
		why: "A divisão euclidiana escreve n=bq+r, com 0≤r<b. O resto é o algarismo das unidades; aplicar a mesma decomposição ao quociente encontra a posição seguinte. O processo termina porque os quocientes positivos diminuem.",
		example: [
			"Converter 45₁₀ para base 2: 45=2·22+1; 22=2·11+0; 11=2·5+1.",
			"Continue: 5=2·2+1; 2=2·1+0; 1=2·0+1. Os restos, na ordem inversa, formam 101101₂.",
			"Confira: 32+8+4+1=45. Agrupando 0010 1101, a mesma quantidade é 2D₁₆.",
		],
		trap: "Não leia os restos na ordem em que foram produzidos. E 102₂ é inválido, pois a base 2 não admite o algarismo 2. Zeros à esquerda não mudam o valor numérico, embora possam indicar a largura de um registro.",
		transfer:
			"Use agrupamentos de bits para ler endereços e cores em hexadecimal, sempre distinguindo valor, base e quantidade de bits do armazenamento.",
		quiz: `Quanto vale 1011₂ em decimal? | 11. | 13. | 1011. | 1·8+0·4+1·2+1=11.
Qual é a escrita binária de 13₁₀? | 1101₂. | 1011₂. | 1110₂. | 13=8+4+1, portanto os bits são 1101.
Quanto vale 2A₁₆? | 42₁₀. | 26₁₀. | 210₁₀. | 2·16+10=42, pois A representa dez.
Qual escrita é inválida na base indicada? | 102₂. | 102₃. | 102₁₀. | Na base 2, os únicos algarismos são 0 e 1.
Quanto vale 10000₂? | 16₁₀. | 8₁₀. | 32₁₀. | O único bit 1 ocupa a posição 4: 2⁴=16.
Quanto vale 17₈? | 15₁₀. | 17₁₀. | 9₁₀. | 1·8+7=15.
Na conversão por divisões sucessivas, como ler os restos? | Do último para o primeiro. | Do primeiro para o último. | Somando todos. | O primeiro resto é o algarismo menos significativo, por isso a escrita é obtida na ordem inversa.
Qual hexadecimal corresponde a 1111₂? | F₁₆. | E₁₆. | 10₁₆. | 1111₂=15₁₀, valor representado por F.
Qual é o maior inteiro sem sinal representável com quatro bits? | 15. | 16. | 8. | Os quatro bits 1 somam 8+4+2+1=15.
Ao conferir 101101₂, qual soma é correta? | 32+8+4+1. | 32+16+4+1. | 32+8+2+1. | Os bits 1 estão nas posições 5,3,2 e 0; a soma é 45.`,
	}),
	lesson({
		n: 3,
		title: "Bits, sinais e aproximações",
		source:
			"Rosen, 6ª ed., §3.6; complemento: Oracle, IEEE Arithmetic, representação e precisão",
		goal: "Distinguir valor, largura, sinal e aproximação em representações computacionais.",
		prereq: "Conversões entre base dois e base dez.",
		hook: "Uma soma pode ser correta nos inteiros e não caber no registro disponível. O padrão 1111 pode significar quinze ou menos um, dependendo da interpretação combinada.",
		concept:
			"Com n bits sem sinal, os inteiros vão de 0 a 2ⁿ−1. Em complemento de dois, vão de −2ⁿ⁻¹ a 2ⁿ⁻¹−1: o bit mais significativo tem peso negativo. Para obter o oposto, quando ele também cabe nessa faixa, inverta os bits e some 1, mantendo a largura. O menor valor negativo não possui oposto positivo representável com a mesma largura. Na parte fracionária binária, as posições pesam 1/2,1/4,1/8,…; uma fração reduzida tem expansão binária finita quando seu denominador é potência de dois. No formato binário32 normal, o valor é (−1)ˢ·(1+f)·2^(e−127), com 1 bit de sinal, 8 de expoente e 23 de fração. Expoentes extremos têm significados especiais e não usam essa fórmula normal.",
		why: "Os n bits oferecem 2ⁿ padrões. O complemento de dois atribui ao bit da esquerda o peso −2ⁿ⁻¹, distribuindo-os entre valores negativos e não negativos. Representar uma fração como inteiro dividido por 2ᵏ explica por que fatores diferentes de 2 no denominador impedem uma expansão binária finita.",
		example: [
			"Para representar −5 em complemento de dois com oito bits, comece por 5=00000101₂.",
			"Inverta: 11111010. Some 1: 11111011. Mantenha exatamente oito bits.",
			"Confira pelos pesos: −128+64+32+16+8+2+1=−5. Já 0,101₂ é a fração 1/2+1/8=0,625₁₀; valor e padrão de bits são conceitos diferentes.",
		],
		trap: "Em complemento de dois com oito bits, 127+1 não cabe como inteiro positivo: há overflow. A largura e a convenção de sinal precisam estar declaradas. Não confunda 23 bits de fração armazenados com os 24 bits de precisão dos números normais em binário32, que incluem o 1 implícito.",
		transfer:
			"Antes de interpretar um arquivo, registre largura, sinal e formato. Em cálculos aproximados, diferencie o número real desejado do valor efetivamente armazenado; arredondamentos podem se acumular.",
		quiz: `Qual é a faixa sem sinal com oito bits? | De 0 a 255. | De 0 a 256. | De −128 a 127. | Há 256 padrões, numerados de 0 a 2⁸−1=255.
Qual é a faixa em complemento de dois com oito bits? | De −128 a 127. | De −127 a 128. | De 0 a 255. | A faixa é de −2⁷ até 2⁷−1.
Quanto representa 1111 em complemento de dois com quatro bits? | −1. | 15. | −7. | Os pesos dão −8+4+2+1=−1.
Qual padrão de oito bits representa −5 em complemento de dois? | 11111011. | 10000101. | 11111010. | Inverta 00000101 e some 1: 11111011.
Quanto vale 0,101₂? | 0,625₁₀. | 0,101₁₀. | 0,75₁₀. | As posições 1 e 3 após a vírgula contribuem 1/2+1/8=5/8.
Qual fração tem expansão binária finita? | 3/8. | 1/10. | 1/3. | Em forma reduzida, o denominador 8 é potência de dois. Os outros têm fatores 5 ou 3.
O que acontece com a soma inteira 127+1 em complemento de dois de oito bits? | O resultado inteiro positivo não cabe: ocorre overflow. | O resultado 128 é representável nesse formato. | O resultado matemático é −128. | Nos inteiros a soma é 128, mas esse valor está fora da faixa. O padrão truncado não altera a soma matemática.
Quantos padrões existem com quatro bits? | 16. | 15. | 4. | Cada uma das quatro posições tem duas escolhas: 2⁴=16.
Como se distribuem os bits de um binário32 IEEE 754? | 1 de sinal, 8 de expoente e 23 de fração. | 1 de sinal, 7 de expoente e 24 de fração. | 8 de sinal, 1 de expoente e 23 de fração. | O formato possui três campos; para números normais, há ainda um 1 inicial implícito na significanda.
Em um número normal binário32, s=0, e=128 e f=0 representam qual valor? | 2. | 128. | 1. | A fórmula dá (+1)·1·2^(128−127)=2. Ela pressupõe expoente normal, diferente de 0 e 255.`,
	}),
	lesson({
		n: 4,
		title: "Demonstrações: explicar por que sempre funciona",
		source: "Rosen, 6ª ed., §§1.6–1.7",
		goal: "Escolher entre demonstração direta, contraposição, contradição e contraexemplo.",
		prereq: "Hipótese, conclusão e negação de afirmações.",
		hook: "Testar que 2², 4² e 6² são pares sugere uma regra. Para convencer alguém de que todo quadrado de par é par, precisamos usar o significado de “par”, não uma lista maior de testes.",
		concept:
			"Uma prova direta parte da hipótese e chega à conclusão usando definições e fatos justificados. Na contraposição, provamos ¬q⇒¬p para estabelecer p⇒q. Na contradição, supomos a negação do que queremos provar e deduzimos uma impossibilidade. Um contraexemplo refuta uma universal; não demonstra uma universal verdadeira. Um inteiro é par se n=2k para algum k∈ℤ, e ímpar se n=2k+1.",
		why: "As técnicas preservam a lógica da afirmação. Definições transformam palavras em expressões que podem ser manipuladas. Separar hipótese e conclusão impede a circularidade de supor justamente o resultado que se queria demonstrar.",
		example: [
			"Para provar que n² ímpar implica n ímpar, considere a contrapositiva: se n é par, então n² é par.",
			"Escreva n=2k. Então n²=4k²=2(2k²), que é par por definição.",
			"A contrapositiva foi demonstrada para todo inteiro k. Logo a implicação original também é verdadeira. Nenhuma lista finita de exemplos foi usada como prova geral.",
		],
		trap: "Provar a recíproca não prova a implicação original. Também não é válido começar uma prova de a=b afirmando a=b e apenas reorganizar a igualdade sem demonstrar a reversibilidade dos passos.",
		transfer:
			"Ao justificar um algoritmo, declare as hipóteses sobre a entrada e o resultado esperado. Distinguir um argumento geral de testes experimentais será essencial para indução e recorrências.",
		quiz: `Qual é a definição de inteiro par? | n=2k para algum k∈ℤ. | n=2k+1 para algum k∈ℤ. | n>0. | A definição usa um múltiplo inteiro de 2, incluindo 0 e os pares negativos.
Se n=2k+1, qual expressão mostra que n² é ímpar? | n²=2(2k²+2k)+1. | n²=2k²+1. | n²=4k²+1, sempre. | Expandir (2k+1)² dá 4k²+4k+1, que tem a forma 2m+1.
Qual é a contrapositiva de “se n² é ímpar, então n é ímpar”? | Se n é par, então n² é par. | Se n é ímpar, então n² é ímpar. | Se n² é par, então n é par. | Negue e troque hipótese e conclusão, usando que um inteiro não ímpar é par.
Qual número refuta “todo primo é ímpar”? | 2. | 3. | 5. | 2 é primo e é par, por isso contradiz a afirmação universal.
Por que testar mil casos não prova uma afirmação sobre todos os naturais? | Ainda podem existir naturais não testados que a violem. | Porque exemplos nunca são úteis para investigar. | Porque toda afirmação universal é falsa. | Testes ajudam a formular conjecturas, mas não substituem um argumento válido para todo o domínio.
Em uma prova por contradição de P, o que assumimos inicialmente? | A negação de P. | Que P já está demonstrada. | Uma afirmação sem relação com P. | A negação, junto às hipóteses, deve levar a uma impossibilidade lógica.
De a=2r e b=2s, qual escrita prova que a+b é par? | a+b=2(r+s). | a+b=r+s. | a+b=2rs. | Como r+s é inteiro, a soma tem a forma de um múltiplo inteiro de 2.
Qual inferência é inválida? | p⇒q e q verdadeira, portanto p verdadeira. | p⇒q e p verdadeira, portanto q verdadeira. | p⇒q e q falsa, portanto p falsa. | Afirmar o consequente confunde a implicação com sua recíproca.
Um único contraexemplo é suficiente para quê? | Refutar uma afirmação universal. | Provar uma afirmação universal. | Demonstrar qualquer existência em outro domínio. | A universal exige todos os casos; um caso contrário basta para negá-la.
Qual atitude evita uma demonstração circular? | Usar as hipóteses e definições sem assumir a conclusão. | Repetir a conclusão como primeiro argumento. | Confirmar só um exemplo favorável. | Uma prova precisa fundamentar a conclusão a partir de premissas justificadas.`,
	}),
	lesson({
		n: 5,
		title: "Indução: construir a ponte entre os casos",
		source: "Rosen, 6ª ed., §§4.1–4.2",
		goal: "Identificar caso inicial, hipótese e passo indutivo, respeitando o domínio.",
		prereq: "Demonstrações e manipulação de somas e potências.",
		hook: "Uma escada infinita não é percorrida só por saber passar de um degrau ao próximo. Também precisamos alcançar o primeiro degrau. A indução formaliza essas duas tarefas.",
		concept:
			"Para provar P(n) para todo n≥n₀, demonstramos P(n₀) e, para k arbitrário com k≥n₀, provamos P(k)⇒P(k+1). A hipótese indutiva é uma suposição local usada para construir essa implicação, não a conclusão de que todos os casos já valem. Na indução forte, podemos usar os casos de n₀ até k; precisamos estabelecer todas as bases exigidas pelo passo. O princípio da boa ordenação afirma que todo subconjunto não vazio de ℕ tem menor elemento.",
		why: "Se houvesse uma primeira falha após uma base válida, o caso anterior seria verdadeiro e o passo de indução impediria essa falha. Essa ideia do menor contraexemplo explica por que os dois componentes da prova são necessários.",
		example: [
			"Provar 1+2+⋯+n=n(n+1)/2 para n≥1. Base: em n=1, ambos os lados valem 1.",
			"Suponha 1+⋯+k=k(k+1)/2. Ao somar k+1, obtemos k(k+1)/2+(k+1)=(k+1)(k+2)/2.",
			"A expressão final é exatamente a fórmula para k+1. A base e a passagem foram justificadas; a igualdade vale para todo n≥1.",
		],
		trap: "Substituir k+1 nos dois lados da igualdade que se deseja provar não é uma demonstração. É preciso partir da hipótese P(k) e construir P(k+1). Também verifique onde o passo realmente funciona: uma passagem válida só para k≥2 não conecta, sozinha, a base n=1 ao caso n=2.",
		transfer:
			"Ao provar propriedades de laços ou de estruturas recursivas, procure o caso mínimo e a regra que leva de casos já resolvidos ao seguinte. Condições iniciais não são um detalhe dispensável.",
		quiz: `Para provar P(n) para n≥1 por indução, qual é uma base adequada? | Demonstrar P(1). | Demonstrar apenas P(100). | Supor que P(n) vale para todo n. | A base precisa iniciar a cadeia no primeiro valor do domínio considerado.
Qual é a hipótese no passo usual de indução? | P(k), para um k arbitrário no domínio. | P(k+1), que já é o objetivo. | P(1) para qualquer k. | A hipótese local permite demonstrar a implicação P(k)⇒P(k+1).
Se Sₖ=k(k+1)/2, quanto vale Sₖ+(k+1)? | (k+1)(k+2)/2. | k(k+2)/2. | (k+1)²/2. | Coloque k+1 em evidência: (k+1)(k/2+1).
Qual é a soma dos primeiros cinco inteiros positivos? | 15. | 10. | 25. | A fórmula n(n+1)/2 dá 5·6/2=15.
Qual é a soma dos primeiros quatro números ímpares positivos? | 16. | 15. | 8. | 1+3+5+7=16, exemplo da identidade cuja soma é n².
Se a passagem é válida somente para k≥2, uma base P(1) basta automaticamente? | Não; falta justificar a ligação até os casos cobertos pelo passo. | Sim; qualquer base serve. | Sim; não é necessário verificar P(2). | O passo não cobre k=1; é preciso demonstrar os casos iniciais necessários.
O que permite a hipótese da indução forte? | Usar todos os casos anteriores desde a base até k. | Usar a conclusão para k+1 sem prova. | Ignorar as bases. | A força está na hipótese mais ampla, não em dispensar o início da cadeia.
Qual afirmação corresponde à boa ordenação de ℕ? | Todo subconjunto não vazio de ℕ tem menor elemento. | Todo subconjunto de ℤ tem menor elemento. | Todo subconjunto de ℕ tem maior elemento. | O conjunto precisa ser não vazio e estar contido nos naturais.
Na prova de 2ⁿ≥n+1 para n≥0, a base n=0 é verdadeira? | Sim: 1≥1. | Não: 0≥1. | Não existe 2⁰. | A potência 2⁰ vale 1 e o lado direito também vale 1.
O que caracteriza uma prova completa por indução? | Base válida e passo válido para todo k exigido. | Muitos exemplos sem passo geral. | Apenas escrever a fórmula para k+1. | Os dois componentes conectam o primeiro caso a toda a cadeia de naturais.`,
	}),
	lesson({
		n: 6,
		title: "Recursão e missão da primeira unidade",
		source: "Rosen, 6ª ed., §§4.3–4.4",
		goal: "Calcular definições recursivas e justificar a ligação entre recursão e indução.",
		prereq: "Indução, bases numéricas e definição de função.",
		hook: "Um programa que calcula o fatorial chama uma versão menor do mesmo problema. Sem uma condição de parada, a regra “multiplique e chame de novo” nunca produz uma resposta.",
		concept:
			"Uma definição recursiva fornece casos iniciais e uma regra para reduzir novos casos a anteriores. Para n≥0, 0!=1 e (n+1)!=(n+1)n!. Em Fibonacci, F₀=0, F₁=1 e Fₙ=Fₙ₋₁+Fₙ₋₂ para n≥2: são necessários dois valores iniciais. Uma medida natural que diminui até a base pode justificar o término de um algoritmo recursivo. A correção costuma ser provada por indução. O valor de uma expressão não deve ser confundido com o número de chamadas usadas para calculá-la.",
		why: "Cada redução precisa aproximar o problema de uma base conhecida. A indução acompanha a mesma estrutura: verificamos a base e demonstramos que a regra preserva a propriedade desejada. Especificar um domínio impede chamadas indefinidas, como um fatorial recursivo que deveria aceitar somente naturais mas recebe −1.",
		example: [
			"Defina a₀=2 e aₙ₊₁=3aₙ para n≥0. Os primeiros termos são 2,6,18,54.",
			"A conjectura aₙ=2·3ⁿ vale em n=0. Se aₖ=2·3ᵏ, então aₖ₊₁=3aₖ=2·3ᵏ⁺¹.",
			"A indução confirma a fórmula. Pela mesma regra a₄=162; escrito em base dois, esse inteiro é 10100010₂. A missão combina recorrência, demonstração e representação.",
		],
		trap: "Uma recorrência de ordem dois geralmente exige dois termos iniciais. E diminuir um número não garante término se o domínio e a base não forem compatíveis: decrementar um inteiro negativo para tentar chegar a zero o afasta da base.",
		transfer:
			"Ao ler uma rotina recursiva, escreva domínio, base, redução e resultado pretendido. Depois simule uma entrada pequena e justifique por que as chamadas chegam à base.",
		quiz: `Quanto vale 0! na definição usual? | 1. | 0. | Não é definido. | A base 0!=1 permite a regra (n+1)!=(n+1)n! e é compatível com as identidades de contagem.
Quanto vale 4!? | 24. | 16. | 10. | 4·3·2·1=24.
Com F₀=0, F₁=1 e Fₙ=Fₙ₋₁+Fₙ₋₂, quanto vale F₅? | 5. | 8. | 3. | Os termos de F₀ a F₅ são 0,1,1,2,3,5.
Se a₀=2 e aₙ₊₁=3aₙ, quanto vale a₃? | 54. | 18. | 81. | A partir de 2, multiplicamos por 3 três vezes: 2,6,18,54.
Qual fórmula corresponde a a₀=2 e aₙ₊₁=3aₙ? | aₙ=2·3ⁿ. | aₙ=3·2ⁿ. | aₙ=2+3n. | A fórmula tem a base correta e cada termo é três vezes o anterior.
Por que n−1 aproxima a recursão do fatorial da base, para n>0? | Porque é um natural menor, até atingir 0. | Porque sempre é negativo. | Porque já é o resultado de n!. | No domínio natural, diminuir uma unidade conduz à base após finitíssimos passos.
Uma regra usa aₙ₋₁ e aₙ₋₂ para n≥2. Que informação inicial costuma ser necessária? | a₀ e a₁. | Apenas a₀, em qualquer caso. | Nenhum termo inicial. | O cálculo de a₂ depende dos dois termos anteriores.
Qual técnica combina naturalmente com a prova de correção de uma definição recursiva sobre ℕ? | Indução matemática. | Testar um único caso. | Supor a conclusão. | A prova segue as bases e as mesmas reduções usadas na definição.
Quanto vale 10100010₂? | 162. | 160. | 164. | As posições ativas somam 128+32+2=162.
O que falta à regra “fat(n)=n·fat(n−1)” para definir o fatorial sobre ℕ? | Uma base, como fat(0)=1. | Uma divisão por zero. | A afirmação de que n é sempre negativo. | Sem um caso inicial, a regra não determina onde o cálculo termina nem o valor a partir do qual se constrói o resultado.`,
	}),
];
