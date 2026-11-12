import { lesson } from "./estrutura.mjs";
export default [
	lesson({
		n: 21,
		title: "Polinômios: uma expressão com estrutura",
		goal: "Identificar coeficientes, termos e grau de um polinômio.",
		prereq: "Potências inteiras e expressões algébricas da Unidade 1.",
		hook: "Uma equipe descreve o custo fictício de um projeto por 2x²+3x+5. Outra escreve 5+3x+2x². As duas planilhas estão discutindo a mesma coisa com a mobília em outra ordem. Vamos descobrir a estrutura que permanece.",
		concept:
			"Um polinômio real em x é uma soma finita aₙxⁿ+…+a₁x+a₀, com expoentes inteiros não negativos e coeficientes reais. Se aₙ≠0, seu grau é n e aₙ é o coeficiente líder. Termos ausentes têm coeficiente zero. O polinômio nulo tem todos os coeficientes zero; seu grau fica indefinido nesta trilha.",
		why: "Coeficientes são organizados pelas potências de x, não pela posição em que foram escritos. Dois polinômios são idênticos quando todos os coeficientes correspondentes coincidem. Igualdade em apenas um valor de x não garante identidade: x e x² coincidem em x=0 e x=1, mas diferem em x=2.",
		example: [
			"Em P(x)=4−2x³+x, ordene por grau: −2x³+0x²+x+4.",
			"O grau é 3; os coeficientes, do maior grau ao constante, são −2,0,1,4.",
			"Para avaliar P(−1), substitua com parênteses: 4−2(−1)³+(−1)=4+2−1=5.",
		],
		trap: "1/x=x⁻¹ e √x=x^(1/2) não são termos polinomiais em x. Já √2·x² é permitido: √2 é um coeficiente real. Se o coeficiente aparentemente líder zera por causa de um parâmetro, determine o grau olhando os termos restantes.",
		transfer:
			"Polinômios podem modelar áreas, tendências idealizadas e relações entre grandezas. O modelo não vale automaticamente para qualquer x: uma área exige medidas admissíveis. Descreva separadamente o grau algébrico e o domínio que o contexto permite.",
		quiz: `Qual é o grau de 5−2x³+x? | 3 | 5 | 1 | O maior expoente com coeficiente não nulo é 3.
Qual é o coeficiente de x² em −2x³+x+4? | 0 | 1 | −2 | O termo x² está ausente, portanto seu coeficiente é zero.
Qual expressão é polinomial em x? | √2·x²+1 | 1/x+1 | √x+1 | Coeficientes podem ser irracionais; expoentes precisam ser inteiros não negativos.
Qual é o grau de 7? | 0 | 1 | 7 | Uma constante não nula é 7x⁰.
Qual é o grau do polinômio nulo nesta trilha? | Indefinido | 0 | 1 | Não há maior expoente com coeficiente não nulo.
Se P(x)=x²−3x+2, quanto vale P(−1)? | 6 | 0 | −2 | Substituindo: 1+3+2=6.
Se (a−2)x³+4x tem a=2, qual é o grau? | 1 | 3 | 0 | O termo cúbico desaparece e resta 4x.
Se ax²+bx+1 é idêntico a 3x²−2x+1, qual é (a,b)? | (3,−2) | (−2,3) | (3,2) | Compare coeficientes das mesmas potências.
P(0)=Q(0) garante P=Q como polinômios? | Não | Sim | Só se os coeficientes forem inteiros | Polinômios diferentes podem coincidir num ponto; x e x² são um exemplo.
Qual é o termo constante de 2x⁴−x+8? | 8 | 2 | −1 | O termo constante multiplica x⁰ e não varia com x.`,
	}),
	lesson({
		n: 22,
		title: "Operações: organizar antes de calcular",
		goal: "Somar, subtrair e multiplicar polinômios pela distributiva.",
		prereq: "Termos e coeficientes (passo 21).",
		hook: "Dois grupos somam recursos para uma feira. Um registra x²+2x; outro, 3x²−x+4. Somar por colunas funciona, desde que as colunas representem a mesma potência. Misturar x com x² é como somar horas com metros e esperar diplomacia.",
		concept:
			"Termos semelhantes têm a mesma potência de x. Na soma, somamos seus coeficientes. Na subtração, distribuímos o sinal negativo por todos os termos do segundo polinômio. No produto, multiplicamos cada termo de um fator por cada termo do outro e reunimos os semelhantes.",
		why: "A distributividade explica as operações: axᵏ+bxᵏ=(a+b)xᵏ e axʳ·bxˢ=abxʳ⁺ˢ. Para polinômios não nulos, o grau do produto é a soma dos graus, porque o produto dos coeficientes líderes é não nulo. Na soma, os termos líderes podem se cancelar e reduzir o grau.",
		example: [
			"Calcule (x+2)(2x−3). Distribua x: 2x²−3x. Distribua 2: 4x−6.",
			"Some os resultados: 2x²−3x+4x−6=2x²+x−6.",
			"Confira em x=1: o produto original é 3·(−1)=−3 e o polinômio obtido é 2+1−6=−3. A distributiva garante a identidade; o teste apenas ajuda a conferir.",
		],
		trap: "O sinal de menos antes de parênteses atinge todos os termos: −(x²−2x+3)=−x²+2x−3. E (P+Q) pode ter grau menor que ambos: (x²+x)+(−x²+1)=x+1.",
		transfer:
			"Use o teste numérico como detector de erros, sem confundi-lo com demonstração. Escolha x=0 para conferir constantes e x=1 para conferir somas de coeficientes. Se falhar em um desses testes, há erro; se passar, ainda é preciso confiar na expansão correta.",
		quiz: `Qual é (x²+2x)+(3x²−x+4)? | 4x²+x+4 | 4x³+x+4 | 4x²+3x+4 | Somamos apenas coeficientes de termos semelhantes.
Qual é (x²+1)−(x²−2x+3)? | 2x−2 | −2x+4 | 2x+4 | Distribuir o sinal dá x²+1−x²+2x−3.
Qual é x²·x³? | x⁵ | x⁶ | 2x⁵ | No produto de potências da mesma base, somamos expoentes.
Qual é 2x(3x²−1)? | 6x³−2x | 6x²−1 | 6x³−1 | O fator 2x multiplica os dois termos.
Qual é (x+2)(2x−3)? | 2x²+x−6 | 2x²−6 | 2x²+7x−6 | Os termos centrais são −3x e 4x, cuja soma é x.
Qual é o grau do produto de dois polinômios não nulos de graus 2 e 3? | 5 | 6 | 3 | Os termos líderes se multiplicam e os graus se somam.
Qual é (x²+x)+(−x²+1)? | x+1 | 2x²+x+1 | 0 | Os termos x² se cancelam, reduzindo o grau.
Qual é −(x²−2x+3)? | −x²+2x−3 | −x²−2x+3 | −x²+2x+3 | O fator −1 troca o sinal de todos os termos.
Se uma expansão falha em x=1, o que se conclui? | A identidade proposta está errada | Apenas x=1 é proibido | Os polinômios são iguais | Uma identidade precisa valer em todos os reais; um contraexemplo basta para refutá-la.
Qual é (x−1)(x+1)? | x²−1 | x²+1 | x²−2x+1 | Os termos +x e −x se cancelam.`,
	}),
	lesson({
		n: 23,
		title: "Produtos notáveis sem feitiçaria",
		goal: "Demonstrar quadrados de binômios e diferença de quadrados.",
		prereq: "Distributividade e multiplicação de polinômios.",
		hook: "Um quadrado de lado a+b pode ser dividido em quatro peças. Duas delas são retângulos iguais. É justamente uma dessas peças que costuma desaparecer quando alguém escreve (a+b)²=a²+b². A geometria pode chamar a peça de volta.",
		concept:
			"As identidades são (a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b² e (a+b)(a−b)=a²−b². Valem para reais a,b e também para expressões polinomiais substituídas em seus lugares. O sinal do termo central depende do produto dos dois termos do binômio.",
		why: "Expanda (a+b)(a+b): aparecem a², ab, ba e b². Como ab=ba em ℝ, os dois termos centrais somam 2ab. Na diferença de quadrados, −ab e +ab se cancelam. O desenho por áreas é intuitivo para medidas positivas; a distributiva demonstra as identidades para todos os reais.",
		example: [
			"Expanda (2x−3)². Identifique a=2x e b=3.",
			"Calcule a²=4x², −2ab=−12x e b²=9.",
			"Logo (2x−3)²=4x²−12x+9. Em x=0, ambos os lados valem 9; em x=1, ambos valem 1.",
		],
		trap: "(a−b)² não é a²−b²: o primeiro é quadrado de uma diferença; o segundo é produto de conjugados. Use a=b=1 para ver a diferença: os dois podem coincidir nesse caso, mas a=2,b=1 produz 1 contra 3. Um teste mal escolhido pode esconder o erro.",
		transfer:
			"Produtos notáveis ajudam no cálculo mental e na fatoração. 99²=(100−1)²=10000−200+1=9801. Reconstrua uma identidade pela distributiva quando esquecer o sinal; a memória vira consequência do raciocínio.",
		quiz: `Qual é (x+3)²? | x²+6x+9 | x²+9 | x²+3x+9 | O termo central é 2·x·3=6x.
Qual é (x−4)²? | x²−8x+16 | x²−16 | x²−4x+16 | O termo central é −2·x·4.
Qual é (2x−3)²? | 4x²−12x+9 | 4x²−9 | 4x²−6x+9 | É preciso elevar 2x ao quadrado e calcular o termo central.
Qual é (x+5)(x−5)? | x²−25 | x²+25 | x²−10x+25 | Os termos cruzados se cancelam.
Quanto vale 99²? | 9801 | 9999 | 9601 | (100−1)²=10000−200+1=9801.
Qual termo falta em (a+b)²=a²+___+b²? | 2ab | ab | a+b | A expansão tem dois produtos iguais ab.
Qual expressão é sempre não negativa para x real? | (x−2)² | x²−4 | x−2 | Todo quadrado real é não negativo.
Qual é (3x+1)²? | 9x²+6x+1 | 9x²+1 | 3x²+6x+1 | O quadrado de 3x é 9x² e o termo cruzado é 6x.
Qual fatoração corresponde a a²−b²? | (a−b)(a+b) | (a−b)² | (a+b)² | O produto de conjugados cancela os termos cruzados.
Qual exemplo refuta (a+b)²=a²+b²? | a=1,b=1 | a=0,b=1 | a=1,b=0 | Com a=b=1, o lado esquerdo é 4 e o direito é 2.`,
	}),
	lesson({
		n: 24,
		title: "Fatorar é enxergar as peças",
		goal: "Escolher entre fator comum, agrupamento e identidades.",
		prereq: "Produtos notáveis e propriedade do produto nulo.",
		hook: "Você recebe x³+2x²+3x+6 e a missão de achar um padrão. Os quatro termos não parecem combinar até você formar duas duplas. Fatorar é esse trabalho de edição: a expressão é a mesma, mas sua organização revela outra informação.",
		concept:
			"Fatorar significa escrever uma soma como produto. Procure primeiro fator comum; depois identidades ou agrupamentos. Exemplos: ax+ay=a(x+y), x²−9=(x−3)(x+3) e x²+6x+9=(x+3)². A fatoração pode depender do universo: x²+1 não tem fatores lineares reais.",
		why: "A fatoração usa a distributiva ao contrário. No agrupamento, x³+2x²+3x+6=x²(x+2)+3(x+2)=(x+2)(x²+3). O fator repetido x+2 funciona como uma única peça. Expandir o resultado sempre recupera a expressão original e é uma verificação completa por identidade.",
		example: [
			"Fatore 2x³−8x. Todos os termos têm 2x: 2x(x²−4).",
			"O fator x²−4 é uma diferença de quadrados: (x−2)(x+2).",
			"Assim 2x³−8x=2x(x−2)(x+2). Se a expressão for igual a zero, as raízes reais serão 0,2,−2.",
		],
		trap: "Fatorar não autoriza cancelar termos de uma soma. Em (x+2)/x, o x do denominador não cancela ‘com o x de cima’. Cancelamento é de fatores multiplicativos, sempre respeitando o domínio da fração original.",
		transfer:
			"Compare forma expandida e fatorada: a primeira facilita ler coeficientes; a segunda facilita ler zeros e sinais. A melhor escrita depende da pergunta. Crie uma expressão fatorada, expanda e peça a si mesmo para reconstruir as peças.",
		quiz: `Qual é a fatoração de 3x²+6x? | 3x(x+2) | 3x(x+6) | 3(x²+6x) | O fator comum máximo é 3x.
Qual é a fatoração de x²−16? | (x−4)(x+4) | (x−4)² | (x−8)(x+2) | É uma diferença de quadrados.
Qual é a fatoração de x²+6x+9? | (x+3)² | (x−3)² | (x+9)(x+1) | O termo central 6x é 2·x·3.
Qual é a fatoração de x³+2x²+3x+6? | (x+2)(x²+3) | (x+3)(x²+2) | (x+2)(x²+6) | Agrupamos x²(x+2)+3(x+2).
Quais são as raízes de 2x³−8x? | −2,0,2 | −4,4 | 0,4 | A fatoração é 2x(x−2)(x+2).
Qual polinômio não tem raízes reais? | x²+1 | x²−1 | x²−4 | x²+1 é estritamente positivo em ℝ.
É válido cancelar x em (x+2)/x e obter 2? | Não | Sim | Só quando x>0 | x não é fator do numerador inteiro; por exemplo, em x=2 o quociente é 2, mas em x=1 é 3.
Qual é a fatoração de x²−5x+6? | (x−2)(x−3) | (x+2)(x+3) | (x−1)(x−6) | As raízes 2 e 3 têm soma 5 e produto 6.
Como verificar uma fatoração algebricamente? | Expandindo os fatores | Testando apenas x=0 | Comparando apenas o grau | Expandir e comparar todos os coeficientes demonstra a identidade.
Na expressão ax+ay, qual peça pode ser colocada em evidência? | a | x+y como coeficiente de x | x | Ambos os termos têm o fator multiplicativo a.`,
	}),
	lesson({
		n: 25,
		title: "Raízes e multiplicidades",
		goal: "Relacionar zeros, fatores e multiplicidade sem prometer raízes reais inexistentes.",
		prereq: "Fatoração e avaliação polinomial.",
		hook: "Dois polinômios zeram em x=1. Um atravessa o eixo; outro apenas encosta e volta. A raiz tem o mesmo endereço, mas uma história diferente. A multiplicidade registra quantas vezes aquele fator aparece.",
		concept:
			"r é raiz de P quando P(r)=0. Pelo teorema do fator, isso equivale a x−r dividir P. A multiplicidade m de r é o maior expoente tal que (x−r)ᵐ divide P. Um polinômio não nulo de grau n tem no máximo n raízes reais distintas. Sobre ℂ, o teorema fundamental da álgebra garante n raízes contando multiplicidades; algumas podem não ser reais.",
		why: "Se P=(x−r)ᵐQ e Q(r)≠0, nenhuma cópia adicional de x−r pode ser extraída. Em torno de r, o fator Q mantém sinal; a paridade de m decide se P muda de sinal. O limite no número de raízes vem de extrair um fator linear para cada raiz distinta: o grau não pode diminuir mais de n vezes.",
		example: [
			"Em P(x)=2(x−1)²(x+3), as raízes são 1 e −3.",
			"O fator x−1 aparece duas vezes: 1 tem multiplicidade 2. O fator x+3 aparece uma vez: −3 tem multiplicidade 1.",
			"O grau é 3 e o coeficiente líder é 2. A raiz 1 não muda o sinal no entorno; a raiz −3 muda. P(0)=2·1·3=6.",
		],
		trap: "Um polinômio de grau 4 não precisa ter quatro raízes reais distintas: x⁴+1 não tem nenhuma real. E listar raízes não determina sozinho o coeficiente líder: x²−1 e 7x²−7 têm os mesmos zeros.",
		transfer:
			"A forma fatorada fornece uma biografia dos zeros. Para reconstruir um polinômio, você precisa das raízes, multiplicidades e de uma escala, como o coeficiente líder ou um valor P(t) não nulo. Separe ‘distintas’ de ‘contadas com multiplicidade’ em toda resposta.",
		quiz: `Quais são as raízes de 2(x−1)²(x+3)? | 1 e −3 | −1 e 3 | 1 e 3 | Cada fator linear zera quando x é 1 ou −3.
Qual é a multiplicidade da raiz 1 no exemplo? | 2 | 1 | 3 | O expoente do fator x−1 é 2.
Qual é o grau de 2(x−1)²(x+3)? | 3 | 2 | 4 | Somamos os graus dos fatores: 2+1=3.
Qual é o coeficiente líder do exemplo? | 2 | 1 | −3 | Multiplicar os termos líderes produz 2x³.
Um polinômio não nulo de grau 3 pode ter quatro raízes reais distintas? | Não | Sim | Apenas se uma for zero | Cada raiz distinta fornece um fator linear; quatro excederiam o grau.
Se P(4)=0, qual fator divide P? | x−4 | x+4 | 4x+1 | O teorema do fator liga a raiz 4 ao divisor x−4.
Se uma raiz tem multiplicidade par, o sinal muda no entorno dela? | Não | Sim | Sempre zera em um intervalo inteiro | O fator com expoente par tem o mesmo sinal dos dois lados da raiz.
Qual é o polinômio mônico de grau 2 com raízes 1 e 2? | (x−1)(x−2) | 2(x−1)(x−2) | (x+1)(x+2) | Mônico significa coeficiente líder 1.
Qual é P(0) para P=2(x−1)²(x+3)? | 6 | −6 | 0 | Substituindo x=0: 2·(−1)²·3=6.
Qual afirmação sobre x⁴+1 é verdadeira? | Não possui raízes reais | Possui quatro raízes reais distintas | Tem raiz 0 | Para todo real x, x⁴≥0 e x⁴+1≥1.`,
	}),
	lesson({
		n: 26,
		title: "Divisão polinomial, passo a passo",
		goal: "Aplicar o algoritmo da divisão e conferir P=DQ+R.",
		prereq: "Operações e grau de polinômios.",
		hook: "Dividir um polinômio parece uma conta de escola que mudou de figurino. O truque continua sendo retirar a maior peça possível e acompanhar o que sobra. O resto tem uma regra de tamanho: seu grau precisa ficar abaixo do divisor.",
		concept:
			"Para D≠0, existem únicos Q e R tais que P=DQ+R, com R=0 ou grau R<grau D. P é dividendo, D divisor, Q quociente e R resto. Na divisão longa, ordene os termos e preencha potências ausentes com coeficiente zero antes de dividir os termos líderes.",
		why: "A cada rodada, subtraímos de P um múltiplo de D que cancela seu termo de maior grau. O grau do restante diminui até ficar menor que o de D. Se duas respostas existissem, teríamos D(Q₁−Q₂)=R₂−R₁; um lado não nulo teria grau ao menos o de D e o outro teria grau menor, uma contradição.",
		example: [
			"Divida x³−2x+4 por x−2. Escreva x³+0x²−2x+4. O primeiro termo do quociente é x²; subtraia x³−2x² e obtenha 2x²−2x+4.",
			"O próximo termo é 2x; subtraia 2x²−4x e obtenha 2x+4. O próximo é 2; subtraia 2x−4 e obtenha 8.",
			"Logo Q=x²+2x+2 e R=8. Confira: (x−2)(x²+2x+2)+8=x³−2x+4.",
		],
		trap: "Ao subtrair o múltiplo do divisor, troque o sinal de todos os seus termos. E a divisão não terminou se o restante ainda tem grau igual ao do divisor. Uma lacuna de coeficiente muda as colunas e pode arruinar uma conta correta até ali.",
		transfer:
			"A identidade P=DQ+R é seu contrato de conferência. Faça a multiplicação de volta em vez de apenas olhar o formato da resposta. Essa estrutura vai tornar os teoremas do resto e de Ruffini consequências naturais, e não mais duas regras soltas.",
		quiz: `Na divisão de P por D≠0, qual identidade deve valer? | P=DQ+R | P=Q+DR | P=D+Q+R | O dividendo é divisor vezes quociente mais resto.
Se D tem grau 2 e R≠0, quais graus R pode ter? | 0 ou 1 | 2 ou 3 | Apenas 2 | O resto precisa ter grau estritamente menor que o divisor.
Qual é o quociente de x³−2x+4 por x−2? | x²+2x+2 | x²−2 | x²+2x+4 | A divisão longa produz os coeficientes 1,2,2.
Qual é o resto da divisão anterior? | 8 | 4 | 0 | A conferência P=(x−2)(x²+2x+2)+8 confirma o resto.
Qual coeficiente precisa ser inserido em x³−2x+4? | 0 para x² | 1 para x² | 0 para x | O termo de grau 2 está ausente, mas sua posição precisa ser mantida.
Ao dividir 3x³ por x, qual primeiro termo aparece? | 3x² | 3x³ | 2x² | Dividimos coeficientes e subtraímos expoentes.
Qual é (2x²−2x+4)−(2x²−4x)? | 2x+4 | −6x+4 | 4x²−6x+4 | Distribua o sinal negativo: −2x²+4x.
Qual é o resto de (x²+1) dividido por x? | 1 | x | 0 | x²+1=x·x+1, com resto constante.
É permitido dividir por polinômio nulo? | Não | Sim | Só se o dividendo também for nulo | O algoritmo exige D≠0; divisão por zero não é definida.
Como conferir Q e R obtidos? | Expandir DQ+R e comparar com P | Comparar só o grau de Q | Substituir sempre x=0 e encerrar | A identidade inteira confirma todos os coeficientes.`,
	}),
	lesson({
		n: 27,
		title: "O resto pode ser descoberto sem dividir",
		goal: "Demonstrar e aplicar o teorema do resto e o teorema do fator.",
		prereq: "Divisão polinomial e avaliação.",
		hook: "Alguém oferece uma divisão longa de grau alto. A pergunta, porém, só quer o resto ao dividir por x−2. Você pode fazer a conta inteira… ou descobrir que um único valor do polinômio contém exatamente a informação pedida.",
		concept:
			"Ao dividir P(x) por x−a, o resto é a constante P(a). Se P(a)=0, o divisor x−a é fator de P. Para um divisor linear ux−v, com u≠0, seu zero é a=v/u; o resto também é P(v/u), mas o quociente muda em relação à divisão pelo fator mônico x−v/u.",
		why: "Como o divisor tem grau 1, o resto é constante r. Na identidade P(x)=(x−a)Q(x)+r, faça x=a. O produto zera e resta P(a)=r. Se r=0, a identidade passa a ser P=(x−a)Q, demonstrando o teorema do fator.",
		example: [
			"Ache o resto de P(x)=x³−2x+4 por x−2. O zero do divisor é 2, não −2.",
			"Avalie P(2)=8−4+4=8.",
			"O resto é 8, como na divisão longa do passo anterior. Não precisamos do quociente para responder à pergunta sobre o resto.",
		],
		trap: "Para divisor x+3, usamos a=−3. Para divisor de grau 2, o resto pode ser linear: uma avaliação isolada não determina todos os seus coeficientes. O teorema com resto constante depende de o divisor ser linear.",
		transfer:
			"Procure a pergunta antes de escolher a técnica. Para resto por fator linear, avalie; para obter quociente, divida. Para encontrar um parâmetro que torna a divisão exata, imponha P(a)=0 e resolva a equação resultante.",
		quiz: `Qual é o resto de x³−2x+4 por x−2? | 8 | 4 | −8 | O teorema do resto fornece P(2)=8−4+4=8.
Qual valor se usa para divisor x+3? | −3 | 3 | 0 | x+3=x−(−3), cujo zero é −3.
Se P(5)=0, qual divisor tem resto zero? | x−5 | x+5 | x²−5 | O teorema do fator usa o zero 5 no fator x−5.
Qual é o resto de x²+2x+1 por x+1? | 0 | 1 | 4 | Avaliamos P(−1)=1−2+1=0.
Qual k faz x²+kx+2 ser divisível por x−1? | −3 | 3 | −2 | P(1)=1+k+2=0 implica k=−3.
Qual é o resto de x⁴+1 por x? | 1 | 0 | 2 | O divisor zera em 0, e P(0)=1.
Ao dividir por 2x−4, em que ponto avaliar para achar o resto? | 2 | 4 | −2 | O zero de 2x−4 é x=2.
O resto da divisão por x²+1 precisa ser constante? | Não | Sim | Precisa ter grau 2 | O resto pode ter grau 1 ou ser constante ou nulo.
Qual etapa demonstra o teorema do resto? | Substituir x=a em P=(x−a)Q+r | Igualar Q a zero | Dividir r por a | A substituição anula o termo com divisor e deixa P(a)=r.
Qual é o resto de 3x²−x+2 por x−1? | 4 | 6 | 0 | P(1)=3−1+2=4.`,
	}),
	lesson({
		n: 28,
		title: "Ruffini: a divisão em modo compacto",
		goal: "Executar Briot–Ruffini com zeros de coeficientes e sinal correto.",
		prereq: "Divisão por x−a e teorema do resto.",
		hook: "A divisão longa do passo 26 repete uma rotina. Ruffini guarda só os coeficientes e transforma a rotina numa sequência: baixar, multiplicar, somar. É uma compactação de trabalho, sem eliminar a necessidade de saber o que cada número representa.",
		concept:
			"Para dividir por x−a, escreva os coeficientes de P em ordem decrescente, inclusive os zeros. Baixe o primeiro; multiplique-o por a; some ao coeficiente seguinte; repita. O último resultado é o resto; os anteriores são os coeficientes do quociente, cujo grau é uma unidade menor.",
		why: "Comparar coeficientes em P=(x−a)Q+r gera exatamente a recorrência do algoritmo. Se P começa por cₙxⁿ, o primeiro coeficiente de Q é cₙ; o seguinte é cₙ₋₁+a·cₙ. Cada nova soma cancela o próximo termo da divisão longa. O último valor coincide com P(a), como exige o teorema do resto.",
		example: [
			"Divida x³−2x+4 por x−2. Coeficientes: 1,0,−2,4; usamos a=2. Baixe 1.",
			"Multiplique 1·2=2 e some a 0, obtendo 2. Multiplique 2·2=4 e some a −2, obtendo 2.",
			"Multiplique 2·2=4 e some a 4, obtendo 8. A linha final é 1,2,2,8: Q=x²+2x+2 e R=8.",
		],
		trap: "O zero do divisor x+2 é −2. Use esse valor, não o coeficiente +2. Ruffini nesta forma dá o quociente para x−a; para 2x−4, divida o quociente obtido com a=2 por 2, conservando o resto.",
		transfer:
			"Faça uma execução com a tabela e outra pela identidade P=DQ+R. O objetivo não é apenas decorar o movimento da mão: é conseguir dizer onde começa o quociente e por que o último número é diferente dos anteriores.",
		quiz: `Quais coeficientes representam x³−2x+4? | 1,0,−2,4 | 1,−2,4 | 1,2,4 | O coeficiente zero de x² mantém as posições corretas.
Qual a é usado para divisor x+2? | −2 | 2 | 1/2 | O divisor é x−(−2).
Qual é a primeira ação de Ruffini? | Baixar o coeficiente líder | Somar todos os coeficientes | Trocar todos os sinais | O coeficiente líder inicia os coeficientes do quociente.
Qual é a linha final para x³−2x+4 dividido por x−2? | 1,2,2,8 | 1,0,−2,4 | 1,−2,2,0 | A recorrência baixar, multiplicar por 2 e somar produz esses valores.
Na linha 1,2,2,8, qual é o resto? | 8 | 1 | 2 | O último resultado da sequência é o resto.
Qual quociente corresponde à linha 1,2,2,8? | x²+2x+2 | x³+2x²+2x+8 | x²+2x+8 | Os três primeiros valores são coeficientes do quociente de grau 2.
Se o último resultado é zero, o que se conclui? | O divisor divide P exatamente | O quociente é zero | P é o polinômio nulo | Resto zero significa divisibilidade, não ausência de quociente.
Qual é o quociente de x²−1 por x−1? | x+1 | x−1 | x²+1 | Ruffini com a=1 e coeficientes 1,0,−1 dá linha 1,1,0.
Qual é o resto de x²−1 por x+1? | 0 | 2 | −2 | P(−1)=1−1=0.
Após usar Ruffini com a=2 para divisor 2x−4, o que fazer com o quociente encontrado? | Dividi-lo por 2 | Multiplicá-lo por 2 | Dividir o resto por 2 | Como 2x−4=2(x−2), o quociente precisa compensar o fator 2; o resto permanece.`,
	}),
	lesson({
		n: 29,
		title: "Raízes racionais: candidatos não são garantias",
		goal: "Gerar candidatos racionais, testar e fatorar um polinômio.",
		prereq: "Divisibilidade inteira, avaliação e Ruffini.",
		hook: "Procurar raízes tentando números ao acaso é uma investigação com orçamento infinito. O teorema das raízes racionais reduz a lista de suspeitos. Ele não promete que alguém da lista será culpado; promete que uma raiz racional não escapará dela.",
		concept:
			"Para um polinômio com coeficientes inteiros, uma raiz racional p/q em forma reduzida, q>0, satisfaz: p divide o termo constante e q divide o coeficiente líder. Se o termo constante é zero, extraia primeiro a potência de x. Depois teste candidatos por P(p/q) ou Ruffini; uma lista de candidatos não é uma lista de raízes.",
		why: "Substituir p/q e multiplicar por qⁿ dá aₙpⁿ+…+a₀qⁿ=0. Como p e q são coprimos, a igualdade força q a dividir aₙ e p a dividir a₀. Para polinômios mônicos inteiros, q=1: toda raiz racional é inteira. Isso não exclui raízes irracionais.",
		example: [
			"Fatore P=x³−2x²−x+2. Os candidatos racionais são ±1 e ±2.",
			"P(1)=1−2−1+2=0. Ruffini por x−1 produz Q=x²−x−2.",
			"Q=(x−2)(x+1). Assim P=(x−1)(x−2)(x+1), com raízes 1,2,−1. O candidato −2 foi só candidato: P(−2)=−12.",
		],
		trap: "O teorema não diz que todas as raízes são racionais. x²−2 é mônico inteiro e só tem raízes irracionais ±√2. Também não use divisores de coeficientes decimais sem antes obter uma forma com coeficientes inteiros equivalente.",
		transfer:
			"Este é um treino de investigação controlada: gerar possibilidades por uma condição necessária, testar, reduzir o problema e concluir. Uma boa solução discursiva deixa clara essa diferença entre condição necessária e suficiente.",
		quiz: `Para x³−2x²−x+2, quais são os candidatos racionais? | ±1 e ±2 | Todos os inteiros | Apenas 1 e 2 | O coeficiente líder é 1 e os divisores do termo constante 2 são ±1,±2.
Quanto vale P(1) no exemplo? | 0 | 2 | −2 | Substituir 1 dá 1−2−1+2=0.
Qual quociente resulta da divisão do exemplo por x−1? | x²−x−2 | x²+x+2 | x²−2x+2 | Ruffini com 1 dá coeficientes 1,−1,−2 e resto 0.
Qual é a fatoração completa do exemplo? | (x−1)(x−2)(x+1) | (x+1)(x+2)(x−1) | (x−1)²(x+2) | As raízes obtidas são 1,2,−1.
Todos os candidatos racionais precisam ser raízes? | Não | Sim | Apenas nos polinômios mônicos | O teorema dá uma condição necessária, e cada candidato precisa ser testado.
Uma raiz racional de 2x²−3x+1 pode ter qual denominador positivo reduzido? | 1 ou 2 | Apenas 3 | Qualquer natural | O denominador precisa dividir o coeficiente líder 2.
Qual número não é candidato racional para 2x²−3x+1? | 3 | 1/2 | −1 | Numeradores reduzidos dividem 1; 3 não divide 1.
Se o polinômio é mônico com coeficientes inteiros, uma raiz racional precisa ser qual tipo? | Inteira | Positiva | Natural diferente de zero | O denominador reduzido divide 1, portanto vale 1.
Qual exemplo mostra que nem toda raiz de polinômio inteiro é racional? | x²−2 | x²−1 | x−2 | Suas raízes são ±√2, ambas irracionais.
Se o termo constante é zero, qual é uma boa primeira ação? | Extrair um fator x | Dividir por zero | Declarar que não há raízes | x=0 já é raiz; extrair a potência de x reduz o problema sem perder esse caso.`,
	}),
	lesson({
		n: 30,
		title: "Oficina de prova: remontar um polinômio",
		goal: "Integrar operações, fatoração, resto e raízes racionais.",
		prereq: "Passos 21 a 29.",
		hook: "Uma expressão chega desmontada: raízes numa anotação, coeficiente líder em outra e um valor calculado numa terceira. Você vai verificar se as pistas contam a mesma história. É uma auditoria algébrica com direito a desconfiar do próprio rascunho.",
		concept:
			"Para reconstruir um polinômio a partir de raízes e multiplicidades, use P(x)=a∏(x−rᵢ)ᵐⁱ e determine a escala a. Quando só algumas raízes são conhecidas, pode restar um fator sem raízes reais. Esta revisão é autoral e prepara habilidades associadas à P2, sem reproduzir enunciados oficiais.",
		why: "Os fatores lineares garantem os zeros informados, mas multiplicar por uma constante não nula preserva esses zeros. Um valor adicional P(t), com t diferente das raízes, determina essa constante quando a estrutura de fatores já está fixada. A soma das multiplicidades precisa ser compatível com o grau.",
		example: [
			"Ache o polinômio de grau 3, com raiz 1 dupla e raiz −2 simples, cujo coeficiente líder é 3. Escreva P=3(x−1)²(x+2).",
			"Expanda: (x−1)²=x²−2x+1 e o produto por x+2 é x³−3x+2.",
			"Logo P=3x³−9x+6. Confira P(1)=0, P(−2)=0 e o termo líder 3x³. Há duas raízes distintas e três contadas com multiplicidade.",
		],
		trap: "Se você sabe apenas duas raízes de um polinômio de grau 4, faltam informações. Não complete com zeros imaginados. E escrever a expressão fatorada já é uma resposta válida quando ela mostra claramente o objeto solicitado.",
		transfer:
			"Faça as primeiras questões sem consultar fórmulas e depois explique cada escolha. Classifique os erros: coeficiente, sinal, hipótese ou método. Essa classificação torna a volta aos passos anteriores mais útil do que repetir tudo no piloto automático.",
		quiz: `Qual polinômio de grau 2 tem raízes 1 e 3 e coeficiente líder 2? | 2(x−1)(x−3) | (x−1)(x−3) | 2(x+1)(x+3) | As raízes determinam os fatores; o coeficiente líder fixa a escala 2.
Qual é o termo constante de 2(x−1)(x−3)? | 6 | −6 | 2 | Avaliar em zero dá 2·(−1)·(−3)=6.
Qual é o resto de 3x³−9x+6 por x−1? | 0 | 6 | 3 | P(1)=3−9+6=0.
Qual é a multiplicidade de 1 em 3(x−1)²(x+2)? | 2 | 1 | 3 | O fator x−1 aparece elevado ao quadrado.
Qual é a expansão de 3(x−1)²(x+2)? | 3x³−9x+6 | 3x³−3x+6 | 3x³+9x+6 | Primeiro (x−1)²(x+2)=x³−3x+2; depois multiplique por 3.
Se P=a(x−1)(x+2) e P(0)=−8, qual é a? | 4 | −4 | 8 | Em x=0, P(0)=−2a=−8, logo a=4.
Qual é o grau de (x−1)³(x+1)²? | 5 | 6 | 2 | Os graus dos fatores se somam: 3+2.
Qual é o resto de x³+1 por x+1? | 0 | 2 | −2 | Avaliamos em −1: −1+1=0.
Raízes 1 e 2, sem outras informações, determinam um único polinômio? | Não | Sim | Apenas se forem inteiras | Há diferentes escalas e graus possíveis; faltam condições.
Qual justifica que uma fatoração está correta? | A expansão coincide em todos os coeficientes | Os graus são iguais | Uma única raiz coincide | Igualdade de coeficientes demonstra a identidade inteira.`,
	}),
];
