import { lesson } from "./estrutura.mjs";
import algebra from "./unidade-2-algebra.mjs";
export default [
	...algebra,
	lesson({
		n: 31,
		title: "Pares ordenados: a ordem conta",
		goal: "Construir produtos cartesianos e interpretar pares e coordenadas.",
		prereq: "Conjuntos e contagem finita.",
		hook: "Um encontro universitário oferece duas oficinas e três horários. ‘Oficina, horário’ forma uma escolha; inverter para ‘horário, oficina’ muda a leitura. Conjuntos ignoram ordem dos elementos, mas pares ordenados fazem questão dela.",
		concept:
			"O par (a,b) tem primeira e segunda coordenadas. (a,b)=(c,d) exatamente quando a=c e b=d. A×B={(a,b):a∈A e b∈B}. Para conjuntos finitos, |A×B|=|A|·|B|. No plano ℝ², a primeira coordenada é horizontal e a segunda vertical.",
		why: "Para cada elemento de A há |B| escolhas na segunda posição. Como há |A| escolhas na primeira, o princípio multiplicativo fornece a cardinalidade. A×B e B×A geralmente não são iguais, embora suas cardinalidades finitas coincidam. Se algum fator é vazio, não existe par possível.",
		example: [
			"Se A={cinema,música} e B={manhã,tarde}, comece com cinema: (cinema,manhã) e (cinema,tarde).",
			"Depois música: (música,manhã) e (música,tarde). Reúna os quatro pares em A×B.",
			"No caso numérico (−2,3), ande duas unidades para a esquerda no eixo horizontal e três para cima no vertical. A ordem define o ponto.",
		],
		trap: "O conjunto {1,2} e o par (1,2) não são a mesma estrutura. Também não troque ℝ² por ‘o quadrado de cada real’: ℝ² é o conjunto dos pares de reais. O expoente em uma notação de conjunto tem significado próprio.",
		transfer:
			"Pares podem descrever locais e horários, participantes e respostas ou medidas e instantes. Declare o significado de cada posição antes de construir a tabela; assim a notação serve estudantes de qualquer área sem exigir conhecimento técnico adicional.",
		quiz: `Se A={1,2} e B={a,b,c}, quantos pares há em A×B? | 6 | 5 | 9 | Cada um dos dois elementos de A combina com três de B: 2·3=6.
Qual par pertence a {1,2}×{3,4}? | (2,3) | (3,2) | (1,2) | A primeira coordenada deve estar em {1,2} e a segunda em {3,4}.
Os pares (1,2) e (2,1) são iguais? | Não | Sim | Só se estiverem no plano | Pares ordenados são comparados posição a posição.
Se (x,3)=(2,y), qual é (x,y)? | (2,3) | (3,2) | (2,2) | As primeiras coordenadas dão x=2 e as segundas dão y=3.
Qual é A×∅? | ∅ | A | {∅} | Não existe segunda coordenada disponível para formar um par.
Em (−2,3), qual é a coordenada horizontal? | −2 | 3 | 2 | A primeira coordenada indica a posição horizontal.
O que é ℝ²? | O conjunto dos pares ordenados de reais | O conjunto dos quadrados reais | O conjunto dos reais positivos | O produto ℝ×ℝ é o plano cartesiano.
Se A={1} e B={2}, A×B é igual a B×A? | Não | Sim | São ambos vazios | O primeiro contém (1,2); o segundo contém (2,1).
Qual é {1,2}×{0}? | {(1,0),(2,0)} | {(0,1),(0,2)} | {0,1,2} | O único elemento de B é a segunda coordenada em cada par.
Se |A|=4 e |A×B|=12, com conjuntos finitos, quanto vale |B|? | 3 | 8 | 48 | A igualdade 4·|B|=12 fornece |B|=3.`,
	}),
	lesson({
		n: 32,
		title: "Relações e a regra de uma única saída",
		goal: "Distinguir relações binárias de funções com domínio declarado.",
		prereq: "Produto cartesiano e pares ordenados.",
		hook: "Uma pessoa pode participar de várias atividades culturais: essa relação é perfeitamente legítima. Mas se a regra pedida for ‘a sala reservada para cada atividade num mesmo horário’, duas salas indicadas para uma única reserva podem violar a função definida. O contexto não decide sozinho; a regra formal decide.",
		concept:
			"Uma relação de A em B é um subconjunto de A×B. Uma função f:A→B é uma relação em que cada elemento de A possui exatamente uma imagem em B. Pode haver elementos diferentes de A com a mesma imagem. No gráfico de uma função real, qualquer reta vertical corta o gráfico em no máximo um ponto, e cada x do domínio deve aparecer.",
		why: "‘Exatamente uma’ combina existência e unicidade: nenhuma entrada do domínio pode ficar sem saída e nenhuma pode ter duas saídas distintas. No teste vertical, dois pontos diferentes na mesma vertical teriam o mesmo x e diferentes y, violando a unicidade. O teste não determina sozinho um domínio declarado maior que a projeção do gráfico.",
		example: [
			"Considere A={1,2,3}, B={a,b} e R={(1,a),(2,a),(3,b)}. Cada elemento de A aparece uma vez na primeira coordenada.",
			"Logo R define uma função A→B. A repetição da saída a é permitida.",
			"Se acrescentarmos (1,b), a entrada 1 terá duas saídas distintas e a relação deixará de ser função. Se retirarmos (3,b), a entrada 3 ficará sem saída e também falhará.",
		],
		trap: "Não confunda ‘uma imagem para cada entrada’ com ‘uma entrada para cada imagem’. A segunda frase se relaciona à injetividade, um conceito adicional. Uma função não precisa usar todos os elementos do contradomínio.",
		transfer:
			"Construa duas relações com os mesmos conjuntos: uma função e uma que falha por ausência de saída. Depois construa outra que falha por duplicidade. Explicar o motivo exato é melhor do que apenas marcar ‘não é função’.",
		quiz: `Qual condição define uma função A→B? | Cada elemento de A tem exatamente uma imagem em B | Cada elemento de B recebe exatamente uma seta | Cada entrada tem pelo menos duas saídas | A definição exige existência e unicidade de saída para as entradas do domínio.
A={1,2}, B={a,b}. R={(1,a),(2,a)} é função? | Sim | Não, porque a se repete | Não, porque b não é usado | Repetir saída e deixar elementos de B sem uso são permitidos.
No mesmo A e B, {(1,a),(1,b),(2,a)} é função? | Não | Sim | Só se a=b no conjunto dado | A entrada 1 tem duas saídas distintas a e b.
No mesmo A e B, {(1,a)} é função A→B? | Não | Sim | Só se B tiver dois elementos | A entrada 2 do domínio não recebeu saída.
Uma relação de A em B é um subconjunto de qual conjunto? | A×B | A∩B | A∪B | A relação é formada por pares com primeira coordenada em A e segunda em B.
O gráfico de x²+y²=1 representa y como função de x em [−1,1]? | Não | Sim | Apenas por ser um círculo | Para x=0 aparecem y=1 e y=−1, violando a unicidade.
O gráfico y=x² representa uma função ℝ→ℝ? | Sim | Não | Só para x≥0 | Cada real x determina um único quadrado.
O teste da reta vertical verifica qual parte da definição? | Unicidade da saída para cada x representado | Sobrejetividade | Existência de inversa | Duas interseções na mesma vertical representam duas saídas para a mesma entrada.
Uma função precisa usar todo o contradomínio? | Não | Sim | Só quando é constante | Essa exigência adicional caracteriza sobrejetividade.
Se a mesma relação é escrita com um par repetido, surge outra saída? | Não | Sim | Sempre deixa de ser função | Relações são conjuntos; repetir o mesmo par não cria um elemento diferente.`,
	}),
	lesson({
		n: 33,
		title: "Domínio, contradomínio e imagem",
		goal: "Separar conjuntos de entrada e saída e calcular domínios algébricos básicos.",
		prereq: "Funções, raízes e restrições de divisão.",
		hook: "Uma função tem uma lista de entradas permitidas, uma lista de saídas anunciadas e as saídas que ela realmente alcança. É como o programa de uma mostra e as sessões efetivamente realizadas: comparar as duas listas pode revelar informação importante.",
		concept:
			"Em f:A→B, A é domínio, B é contradomínio e Im(f)={f(x):x∈A}⊆B é imagem. Quando o enunciado pede domínio real máximo de uma expressão, excluímos divisões por zero e exigimos radicando não negativo em raízes de índice par. O domínio de uma função também pode ser restringido pelo próprio enunciado.",
		why: "Para f:ℝ→ℝ, f(x)=x², o domínio e contradomínio são ℝ, mas a imagem é [0,∞). Cada saída é não negativa e todo y≥0 é atingido por x=√y. A dupla verificação demonstra a imagem: mostrar que nenhum valor externo aparece e que todos os valores propostos aparecem.",
		example: [
			"Determine o domínio real máximo de f(x)=√(x−1)/(x−3). A raiz exige x−1≥0, isto é, x≥1.",
			"O denominador exige x≠3. Combine por interseção.",
			"D=[1,3)∪(3,∞). x=1 entra porque raiz zero é permitida e o denominador não zera; x=3 fica fora.",
		],
		trap: "A expressão sozinha não informa necessariamente o contradomínio. E cancelar fatores em uma fração não autoriza recuperar entradas proibidas. Para imagem em domínio finito, avalie todas as entradas e retire saídas repetidas.",
		transfer:
			"Ao ler um problema, procure a declaração f:A→B antes de calcular. Registre as restrições de cada parte da expressão e cruze os conjuntos. Essa disciplina será útil em composições, inversas e aplicações contextualizadas.",
		quiz: `Em f:{1,2,3}→{a,b,c}, com saídas a,a,b, qual é a imagem? | {a,b} | {a,b,c} | {1,2,3} | A imagem contém apenas saídas efetivamente atingidas, sem repetições.
Qual é o domínio real máximo de 1/(x−2)? | ℝ sem 2 | ℝ | [2,∞) | O denominador não pode zerar.
Qual é o domínio real máximo de √(x−1)? | [1,∞) | (1,∞) | ℝ sem 1 | A raiz quadrada permite radicando zero, exigindo x−1≥0.
Qual é o domínio real máximo de √(x−1)/(x−3)? | [1,3)∪(3,∞) | [1,∞) | (−∞,3) | É necessário x≥1 e x≠3 simultaneamente.
Qual é a imagem de x² com domínio ℝ? | [0,∞) | ℝ | (0,∞) | Os quadrados são não negativos e zero é atingido.
Qual é a imagem de x² com domínio {−2,0,1}? | {0,1,4} | {−2,0,1} | [0,4] | Avaliar as três entradas dá 4,0,1; o domínio finito não preenche o intervalo.
Em f:A→B, qual inclusão sempre vale? | Im(f)⊆B | B⊆Im(f) | A⊆B | Todas as saídas de uma função precisam estar no contradomínio.
Qual é o domínio original de (x²−1)/(x−1)? | ℝ sem 1 | ℝ | ℝ sem −1 | O fator cancelável não remove a restrição original x≠1.
Pode haver dois contradomínios diferentes para a mesma fórmula e domínio? | Sim, se ambos contiverem a imagem | Não | Só se a função for vazia | O contradomínio faz parte da especificação e pode ser maior que a imagem.
Qual procedimento demonstra uma imagem proposta I? | Mostrar que só há saídas em I e que cada valor de I é atingido | Testar apenas x=0 | Declarar que I é o contradomínio | As duas inclusões estabelecem a igualdade entre a imagem e I.`,
	}),
	lesson({
		n: 34,
		title: "Injetora, sobrejetora e bijetora",
		goal: "Classificar funções com atenção aos conjuntos declarados.",
		prereq: "Domínio, contradomínio e imagem.",
		hook: "Uma distribuição de mesas pode deixar mesas vazias e pode colocar duas pessoas na mesma mesa. São duas perguntas independentes: houve compartilhamento? Sobrou mesa? Injeção e sobrejeção separam exatamente essas duas dimensões.",
		concept:
			"f:A→B é injetora se f(x₁)=f(x₂) implica x₁=x₂; sobrejetora se Im(f)=B; bijetora se satisfaz ambas. A identidade id_A(x)=x é bijetora A→A. Uma função constante em domínio com ao menos dois elementos não é injetora, pois entradas distintas têm a mesma saída.",
		why: "Em f:ℝ→ℝ, x² não é injetora porque f(1)=f(−1), nem sobrejetora porque não atinge −1. Ao mudar para f:[0,∞)→[0,∞), a mesma fórmula é bijetora: quadrados preservam a ordem nesse domínio e todo y≥0 tem preimagem √y. A classificação pertence à função completa, não só à fórmula.",
		example: [
			"Considere f:{1,2,3}→{a,b,c}, com f(1)=a, f(2)=b, f(3)=c. Cada saída recebe uma única entrada.",
			"Não há repetição de saídas: é injetora. Todas as saídas anunciadas aparecem: é sobrejetora.",
			"Logo é bijetora. Se acrescentarmos d ao contradomínio sem mudar as saídas, continua injetora, mas perde a sobrejetividade.",
		],
		trap: "Ver saídas diferentes em dois exemplos não prova injetividade no domínio inteiro. Para refutar basta um par de entradas distintas com mesma saída. Para provar, use um argumento válido para quaisquer x₁ e x₂ ou analise todas as entradas quando o domínio for finito.",
		transfer:
			"Pergunte separadamente ‘há colisões?’ e ‘há saídas sem preimagem?’. Não use o número de elementos sem olhar a regra: dois conjuntos finitos de mesmo tamanho podem receber uma função que não seja nem injetora nem sobrejetora.",
		quiz: `Uma função é injetora quando qual situação não ocorre? | Entradas distintas com a mesma saída | Uma saída do contradomínio ficar sem uso | Uma entrada ter saída | Injetividade impede colisões de imagens.
Uma função é sobrejetora quando qual igualdade vale? | Im(f)=B | A=B | Im(f)=A | Todas as saídas do contradomínio B precisam ser alcançadas.
Uma bijeção é qual tipo de função? | Injetora e sobrejetora | Apenas constante | Apenas sobrejetora | Bijeção combina as duas propriedades.
f:ℝ→ℝ, f(x)=x², é injetora? | Não | Sim | Só porque é quadrática | f(1)=f(−1)=1 fornece um contraexemplo.
f:ℝ→[0,∞), f(x)=x², é sobrejetora? | Sim | Não | Apenas se x>0 | Todo y≥0 é imagem de x=√y, incluindo y=0.
f:[0,∞)→[0,∞), f(x)=x², é bijetora? | Sim | Não | Só se excluir zero | No domínio não negativo não há colisões e todo valor do contradomínio é atingido.
Uma constante f:ℝ→ℝ é injetora? | Não | Sim | Depende do valor constante | Qualquer par de entradas distintas tem a mesma imagem.
A identidade id_A:A→A é qual tipo? | Bijetora | Nunca sobrejetora | Sempre constante | Cada elemento é enviado a si mesmo, sem colisões e sem omissões.
Se ampliamos só o contradomínio com valores não atingidos, qual propriedade se perde? | Sobrejetividade | Injetividade | Ser função | A imagem fica menor que o novo contradomínio.
Para refutar injetividade, o que basta? | Duas entradas distintas com igual imagem | Duas entradas com imagens diferentes | Uma saída positiva | Um único par que viole a definição é um contraexemplo suficiente.`,
	}),
	lesson({
		n: 35,
		title: "Composição: a ordem muda o resultado",
		goal: "Calcular composições e determinar entradas compatíveis.",
		prereq: "Funções e restrições de domínio.",
		hook: "Primeiro descontar uma quantidade fixa e depois dobrar não costuma dar o mesmo que dobrar e depois descontar. A composição registra processos em sequência. A notação lê da direita para a esquerda, o que é um bom motivo para respirar antes de calcular.",
		concept:
			"(f∘g)(x)=f(g(x)): aplique g primeiro e f depois. Para a composição estar definida, x precisa pertencer ao domínio de g e g(x) ao domínio de f. Em geral f∘g≠g∘f. A composição é associativa quando todas as funções e domínios são compatíveis.",
		why: "Se f(x)=2x e g(x)=x+3, então f(g(x))=2(x+3)=2x+6, enquanto g(f(x))=2x+3. O intermediário inteiro entra como argumento da função seguinte. As restrições também são herdadas: f=1/x e g=x−2 dão f∘g=1/(x−2), exigindo x≠2.",
		example: [
			"Se f(x)=x² e g(x)=x−1 em ℝ, calcule f∘g: substitua o argumento de f por x−1.",
			"O resultado é (x−1)². Já g∘f substitui o argumento de g por x² e produz x²−1.",
			"Em x=2, os resultados são 1 e 3. Esse contraexemplo mostra que a ordem não pode ser trocada livremente.",
		],
		trap: "f(g(x)) não é f(x)·g(x). E uma simplificação da expressão composta pode esconder restrições intermediárias. Para f(x)=1/x e g(x)=1/x, a composição vale x somente para x≠0, pois a primeira aplicação já proíbe zero.",
		transfer:
			"Descreva a composição como um percurso com três posições: entrada, resultado intermediário e saída final. Esse esquema vale para conversões de medidas e etapas de processamento de dados, sem exigir nenhum software específico.",
		quiz: `Em (f∘g)(x), qual função é aplicada primeiro? | g | f | As duas simultaneamente | A expressão é f(g(x)); o argumento interno é calculado primeiro.
Se f(x)=2x e g(x)=x+3, qual é (f∘g)(x)? | 2x+6 | 2x+3 | 2x²+6x | Substituímos g(x) em f: 2(x+3).
Com as mesmas funções, qual é (g∘f)(x)? | 2x+3 | 2x+6 | x+6 | Aplicamos g ao número 2x, somando 3.
Se f(x)=x² e g(x)=x−1, qual é (f∘g)(2)? | 1 | 3 | 4 | g(2)=1 e depois f(1)=1.
Com essas funções, qual é (g∘f)(2)? | 3 | 1 | 4 | f(2)=4 e depois g(4)=3.
Se f(x)=1/x e g(x)=x−2, qual é o domínio real da composição f∘g? | ℝ sem 2 | ℝ sem 0 | ℝ | Precisamos de g(x)≠0, portanto x−2≠0.
Qual condição adicional é necessária além de x∈Dom(g)? | g(x)∈Dom(f) | x∈Im(f) | f(x)=g(x) | O resultado da primeira função precisa ser entrada válida da segunda.
Se f(x)=1/x e g(x)=1/x, qual é o domínio original de f∘g? | ℝ sem 0 | ℝ | Apenas {0} | A expressão reduzida é x, mas a primeira aplicação não aceita zero.
A composição é sempre comutativa? | Não | Sim | Só porque funções têm uma saída | Os exemplos 2x+6 e 2x+3 diferem, refutando a comutatividade geral.
Se id(x)=x, qual é f∘id no domínio de f? | f | id | Uma constante | A identidade não altera a entrada, de modo que f(id(x))=f(x).`,
	}),
	lesson({
		n: 36,
		title: "Inversa: voltar pelo mesmo caminho",
		goal: "Construir inversas de bijeções e distinguir inversa de recíproco.",
		prereq: "Bijeção, composição e equações.",
		hook: "Uma máquina multiplica por 3 e soma 2. Para desfazer o trabalho, você subtrai 2 e divide por 3. O caminho de volta inverte também a ordem das ações. Nem toda máquina permite voltar de modo único, e é aí que entra a bijeção.",
		concept:
			"Se f:A→B é bijetora, existe f⁻¹:B→A tal que f⁻¹∘f=id_A e f∘f⁻¹=id_B. Para encontrar uma expressão, escreva y=f(x), isole x em termos de y e renomeie a variável. A inversa f⁻¹ não é o recíproco 1/f. Uma função injetora possui inversa da imagem para o domínio, ainda que não seja sobrejetora no contradomínio original.",
		why: "Sobrejetividade garante pelo menos uma preimagem para cada y∈B; injetividade garante no máximo uma. Juntas, garantem exatamente uma, permitindo a função de volta. Graficamente, trocar x e y reflete os pares em torno da reta y=x.",
		example: [
			"Para f:ℝ→ℝ, f(x)=3x+2, comece com y=3x+2. Subtraia 2 e divida por 3: x=(y−2)/3.",
			"Logo f⁻¹(x)=(x−2)/3. É diferente de 1/(3x+2).",
			"Confira as duas composições: ((3x+2)−2)/3=x e 3((x−2)/3)+2=x. Ambas valem para todo real.",
		],
		trap: "x² em ℝ não tem inversa funcional para sua imagem porque 1 e −1 viram a mesma saída. Restrinja o domínio a [0,∞) e a inversa será √x. Escrever ±√x como uma única saída destruiria a definição de função.",
		transfer:
			"Pense em perda de informação. Se duas entradas diferentes geram a mesma saída, o retorno não sabe qual escolher. Para conferir uma inversa, registre os conjuntos e teste as duas composições; uma manipulação de símbolos isolada não substitui essas condições.",
		quiz: `Qual é a inversa de f(x)=3x+2 em ℝ? | (x−2)/3 | 1/(3x+2) | 3x−2 | Isole x em y=3x+2 para obter x=(y−2)/3.
f⁻¹ significa necessariamente 1/f? | Não | Sim | Apenas para funções afins | Inversa desfaz a função; recíproco divide 1 pelo seu valor.
Qual condição garante inversa B→A para f:A→B? | Bijeção | Apenas sobrejeção | Ser constante | Precisamos de existência e unicidade de preimagem para cada elemento de B.
f:ℝ→[0,∞), f(x)=x², tem inversa funcional nesse domínio? | Não | Sim | Só em zero | A função não é injetora: x e −x podem ter a mesma saída.
Qual é a inversa de x² quando domínio e contradomínio são [0,∞)? | √x | ±√x | −√x | A raiz principal retorna o único número não negativo com aquele quadrado.
Qual é o gráfico da inversa em relação ao original? | Reflexo em y=x | Reflexo no eixo x sempre | Uma translação de uma unidade | Cada par (a,b) vira (b,a).
Se f(x)=x−5 em ℝ, qual é f⁻¹(x)? | x+5 | x−5 | 1/(x−5) | Somar 5 desfaz subtrair 5.
Qual é f⁻¹(f(x)) para uma bijeção? | x | f(x)² | 1 | A composição de ida e volta é a identidade no domínio.
Uma função injetora f:A→B não sobrejetora tem inversa em qual conjunto de partida? | Im(f) | Todo B obrigatoriamente | Apenas A∩B | Sobre a imagem, cada saída possui uma única preimagem.
Se f(x)=2x−1, quanto vale f⁻¹(7)? | 4 | 13 | 3 | Resolva 2x−1=7, obtendo x=4.`,
	}),
	lesson({
		n: 37,
		title: "Função afim: duas informações desenham uma reta",
		goal: "Interpretar coeficientes, monotonia, zero e equação por dois pontos.",
		prereq: "Funções, coordenadas e equações lineares.",
		hook: "Um transporte fictício cobra 4 unidades fixas e 2 por trecho. A conta cresce sempre pelo mesmo incremento. Você consegue prever o desenho sem calcular todos os valores: uma reta está se formando, com um começo e uma inclinação.",
		concept:
			"A função afim é f(x)=ax+b. O coeficiente a é a variação de f por unidade de x; b=f(0) é o intercepto vertical. Para a>0 é estritamente crescente; a<0, estritamente decrescente; a=0, constante. Se a≠0, o zero é −b/a. Por dois pontos de abscissas distintas, a=(y₂−y₁)/(x₂−x₁) e b=y₁−ax₁.",
		why: "A diferença f(x₂)−f(x₁)=a(x₂−x₁) demonstra a monotonia e a taxa constante. Se x₂>x₁, o sinal da variação é o sinal de a. Para esboçar o gráfico, marque dois pontos e trace a reta no domínio indicado; num contexto discreto, a reta é apenas uma extensão do conjunto de pontos admissíveis.",
		example: [
			"Uma reta passa por (1,5) e (3,9). A inclinação é (9−5)/(3−1)=4/2=2.",
			"Substitua o primeiro ponto em y=2x+b: 5=2+b, logo b=3.",
			"A função é f(x)=2x+3. Em ℝ, seu zero é −3/2 e sua imagem é ℝ; num domínio x≥0, a imagem passa a ser [3,∞).",
		],
		trap: "O intercepto b não é a inclinação. E uma reta vertical não é o gráfico de y como função de x: a fórmula por dois pontos exige x₂≠x₁. Não estenda um modelo de custo para quantidades negativas sem justificativa do contexto.",
		transfer:
			"Taxas constantes podem modelar trajetos, escalas de pontuação e consumo idealizado. Para desenhar, registre os eixos e as unidades. Para argumentar crescimento, use a diferença entre duas imagens em vez de confiar só no desenho.",
		quiz: `Em f(x)=2x+4, qual é a taxa por unidade de x? | 2 | 4 | 6 | O coeficiente de x é a inclinação da reta.
Em f(x)=2x+4, quanto vale f(0)? | 4 | 2 | 0 | O termo independente é o intercepto vertical.
Qual é o zero de f(x)=2x+4? | −2 | 2 | −4 | Resolva 2x+4=0.
f(x)=−3x+1 é qual tipo em ℝ? | Estritamente decrescente | Estritamente crescente | Constante | A inclinação −3 é negativa.
Qual é a inclinação da reta pelos pontos (1,5) e (3,9)? | 2 | 4 | 1/2 | A razão entre as variações é 4/2=2.
Qual é a equação dessa reta? | y=2x+3 | y=3x+2 | y=2x+5 | Usando (1,5), obtemos b=3.
Qual é a imagem de f(x)=2x+3 no domínio [0,∞)? | [3,∞) | ℝ | (3,∞) | A função é crescente e atinge o mínimo 3 em x=0.
Qual função é constante? | f(x)=5 | f(x)=5x | f(x)=x+5 | O coeficiente angular é zero na função constante.
Por que dois pontos com mesma abscissa e ordenadas distintas não definem y=f(x)? | A mesma entrada teria duas saídas | A inclinação seria zero | Faltaria intercepto vertical | A reta vertical viola a unicidade da imagem.
Se f(x)=ax+b, qual é f(x+h)−f(x)? | ah | a+h | bh | Substituir e cancelar os termos comuns deixa ah.`,
	}),
	lesson({
		n: 38,
		title: "Parábolas: raízes, concavidade e esboço",
		goal: "Relacionar coeficientes e discriminante ao gráfico quadrático.",
		prereq: "Quadráticas da Unidade 1 e leitura de gráficos.",
		hook: "Uma bola num modelo idealizado sobe e desce, enquanto outra expressão mede um custo com mínimo. Ambas podem produzir parábolas, mas a abertura e o domínio contam histórias diferentes. O gráfico deve seguir a fórmula e as condições, não a nossa expectativa.",
		concept:
			"f(x)=ax²+bx+c, a≠0, tem gráfico parabólico: concavidade para cima se a>0, para baixo se a<0. O intercepto vertical é (0,c). Os zeros reais são as interseções com o eixo horizontal e dependem de Δ=b²−4ac. O eixo de simetria é x=−b/(2a).",
		why: "Completar quadrados dá f(x)=a(x−h)²+k, com h=−b/(2a) e k=f(h). Pontos h−t e h+t têm a mesma imagem porque (−t)²=t². Quando há duas raízes, o eixo fica no ponto médio delas. O sinal de a indica para onde os valores crescem ao se afastar do eixo.",
		example: [
			"Para f(x)=x²−4x+3, fatore: (x−1)(x−3). Marque (1,0) e (3,0), além de (0,3).",
			"O eixo está em x=2; f(2)=−1. O vértice é (2,−1) e a concavidade é para cima.",
			"Esboce uma curva simétrica passando pelos pontos. Entre 1 e 3, f é negativa; fora, positiva. O esboço e a tabela de sinais descrevem a mesma função.",
		],
		trap: "Concavidade para cima não significa que f é crescente em toda a reta: ela decresce até o vértice e cresce depois. E Δ<0 não significa ausência de gráfico; significa ausência de interseções reais com o eixo x.",
		transfer:
			"Antes de desenhar uma parábola, procure quatro informações: concavidade, intercepto, zeros e vértice. Não é necessário inventar dezenas de pontos. Descreva os pontos por coordenadas para que o entendimento não dependa apenas da imagem.",
		quiz: `Qual é a concavidade de f(x)=−2x²+3? | Para baixo | Para cima | É uma reta | O coeficiente de x² é negativo.
Qual é o intercepto vertical de x²−4x+3? | (0,3) | (3,0) | (0,−4) | Em x=0, a imagem é 3.
Quais são os zeros de x²−4x+3? | 1 e 3 | −1 e −3 | 0 e 3 | A fatoração é (x−1)(x−3).
Qual é o eixo de simetria dessa parábola? | x=2 | y=2 | x=−2 | O eixo vertical passa por −b/(2a)=2.
Qual é o vértice dessa função? | (2,−1) | (−1,2) | (2,1) | Substituir x=2 resulta 4−8+3=−1.
Se Δ<0, qual afirmação é correta? | O gráfico não cruza o eixo x | O gráfico não existe | A função é constante | Não existem zeros reais, mas a parábola continua definida em ℝ.
Se Δ=0, quantos pontos distintos do gráfico estão no eixo x? | 1 | 2 | 0 | A raiz dupla corresponde ao vértice tocando o eixo.
Uma parábola com a>0 é crescente em toda ℝ? | Não | Sim | Só se c>0 | Ela decresce antes do vértice e cresce depois.
Quanto vale f(1+t) em comparação com f(1−t), se o eixo é x=1? | São iguais | São sempre opostos | Um deles é sempre zero | A simetria da forma canônica garante igualdade para deslocamentos opostos.
Qual é o sinal de (x−1)(x−3) para 1<x<3? | Negativo | Positivo | Zero | O primeiro fator é positivo e o segundo negativo.`,
	}),
	lesson({
		n: 39,
		title: "Vértice: encontrar o melhor valor possível",
		goal: "Obter forma canônica, extremos e imagem inclusive com domínio restrito.",
		prereq: "Parábolas e completar quadrados.",
		hook: "Um projeto fictício usa R(x)=−x²+6x+7 para comparar resultados. A equipe quer o maior valor, não uma longa tabela de tentativas. O vértice oferece uma resposta exata e ainda explica por que nenhuma outra escolha supera aquela.",
		concept:
			"Na forma f(x)=a(x−h)²+k, o vértice é (h,k). Como (x−h)²≥0, k é mínimo se a>0 e máximo se a<0, quando h pertence ao domínio. Em ℝ, a imagem é [k,∞) para a>0 e (−∞,k] para a<0. Em domínio restrito, verifique o vértice e as extremidades permitidas.",
		why: "Para f(x)=ax²+bx+c, h=−b/(2a) e k=−Δ/(4a). Completar quadrados demonstra ambos. Em um intervalo fechado, se o vértice fica fora dele, a função é monótona naquele intervalo e o extremo ocorre em uma extremidade. A imagem pode mudar mesmo sem alterar a fórmula.",
		example: [
			"Complete quadrados em R(x)=−x²+6x+7: R(x)=−(x²−6x+9)+16=−(x−3)²+16.",
			"Como o quadrado é não negativo, R(x)≤16, com igualdade em x=3. No domínio ℝ, a imagem é (−∞,16].",
			"Se o domínio for [0,2], x=3 não é permitido. R cresce ali, com R(0)=7 e R(2)=15; a imagem restrita é [7,15].",
		],
		trap: "As coordenadas do vértice são (entrada,saída), não o contrário. E o valor máximo k da fórmula canônica só é atingido se h for uma entrada permitida. Em domínios abertos, um limite de valores pode não ser alcançado.",
		transfer:
			"Modelos quadráticos aparecem em geometria, planejamento e análise de resultados hipotéticos. Declare o domínio do modelo antes de otimizar. Se x é uma contagem inteira, compare os inteiros próximos do vértice em vez de aceitar uma quantidade fracionária automaticamente.",
		quiz: `Qual é a forma canônica de x²−4x+1? | (x−2)²−3 | (x−4)²+1 | (x+2)²−3 | Expandir (x−2)²−3 dá x²−4x+1.
Qual é o mínimo de x²−4x+1 em ℝ? | −3 | 2 | 1 | O quadrado é mínimo em x=2 e vale zero ali.
Qual é a imagem dessa função em ℝ? | [−3,∞) | (−∞,−3] | ℝ | A concavidade é para cima e o mínimo −3 é atingido.
Qual é o vértice de −(x−3)²+16? | (3,16) | (−3,16) | (16,3) | O quadrado zera na entrada 3, cuja imagem é 16.
Qual é o máximo de −x²+6x+7 em ℝ? | 16 | 7 | 3 | A forma canônica é −(x−3)²+16.
Qual é a imagem de −x²+6x+7 em [0,2]? | [7,15] | (−∞,16] | [7,16] | A função cresce no intervalo e vai de R(0)=7 a R(2)=15.
Qual é a imagem de x² em (0,1)? | (0,1) | [0,1] | [0,∞) | Nenhum extremo é atingido e os quadrados preenchem o intervalo aberto.
Qual é o mínimo de (x−5)² em [0,2]? | 9 | 0 | 25 | O vértice 5 está fora; o ponto permitido mais próximo é 2, com valor 9.
Para contagem inteira x, se o vértice está em 2,4, o que é adequado? | Comparar os inteiros admissíveis próximos | Declarar 2,4 pessoas | Arredondar sem avaliar a função | Os valores em 2 e 3 precisam ser comparados, respeitando outras restrições.
Qual fórmula dá a abscissa do vértice? | −b/(2a) | −Δ/(4a) | c/a | −b/(2a) fornece a entrada; −Δ/(4a) fornece a imagem correspondente.`,
	}),
	lesson({
		n: 40,
		title: "Missão P2: da regra ao gráfico",
		goal: "Integrar polinômios, classificações, composições e funções afim e quadrática.",
		prereq: "Passos 21 a 39.",
		hook: "Você recebe um conjunto de pares, uma expressão fatorada e um gráfico descrito por coordenadas. A missão é mostrar que sabe mudar de representação sem perder informações. Uma função tem várias maneiras de se apresentar; a matemática não deve mudar de personalidade a cada uma.",
		concept:
			"Nesta revisão autoral, conecte entradas e saídas, raízes e fatores, forma canônica e imagem. Para classificar uma função, declare domínio e contradomínio; para inverter, comprove bijeção; para dividir um polinômio, confira P=DQ+R. As tarefas retomam habilidades mapeadas no acervo para a P2 2025.2.",
		why: "A precisão vem de combinar representações que se conferem mutuamente. O zero de um polinômio aparece como fator linear, ponto no eixo x e resto nulo de uma divisão. A imagem de uma quadrática aparece como desigualdade na forma canônica e como alcance vertical de seu gráfico.",
		example: [
			"Considere f:[1,∞)→[0,∞), f(x)=(x−1)². A forma canônica dá vértice (1,0).",
			"No domínio x≥1, a função é estritamente crescente e atinge todo y≥0; portanto é bijetora.",
			"De y=(x−1)² e x−1≥0, obtemos x=1+√y. Logo f⁻¹(x)=1+√x, com domínio [0,∞) e imagem [1,∞).",
		],
		trap: "No exemplo, usar 1−√x como ramo da inversa devolveria valores fora do domínio [1,∞), exceto em zero. Os conjuntos não são detalhes de cabeçalho: eles escolhem qual volta é válida.",
		transfer:
			"Depois de responder, escreva uma solução discursiva para o exemplo e outra para uma fatoração cúbica. Cada uma deve conter hipóteses, desenvolvimento e conferência. Se uma conta acertada foi baseada numa regra falsa, trate-a como lacuna a revisar.",
		quiz: `Quanto vale |{1,2}×{a,b,c}|? | 6 | 5 | 3 | Multiplicamos as duas cardinalidades: 2·3=6.
R={(1,a),(2,a)}, com domínio {1,2} e contradomínio {a,b}, é qual tipo? | Função não injetora nem sobrejetora | Bijeção | Não é função | Cada entrada tem uma saída, mas há colisão em a e b não é atingido.
Qual é o domínio de 1/(x²−4)? | ℝ sem −2 e 2 | ℝ sem 4 | [−2,2] | O denominador (x−2)(x+2) zera em ±2.
Se f(x)=x+1 e g(x)=2x, qual é f(g(3))? | 7 | 8 | 9 | Primeiro g(3)=6; depois f(6)=7.
Qual é a inversa de f(x)=2x+3 em ℝ? | (x−3)/2 | (x+3)/2 | 1/(2x+3) | Isolar x em y=2x+3 dá x=(y−3)/2.
Qual é o resto de x³−4x por x−2? | 0 | 2 | −2 | Avaliar em 2 dá 8−8=0.
Qual é a forma fatorada de x³−4x? | x(x−2)(x+2) | (x−4)(x+4) | x(x−4)² | Extraímos x e depois usamos diferença de quadrados.
Qual é a inclinação da reta por (0,1) e (2,5)? | 2 | 4 | 1/2 | A variação vertical 4 dividida pela horizontal 2 dá 2.
Qual é a imagem de (x−1)²−2 em ℝ? | [−2,∞) | [1,∞) | ℝ | O mínimo é −2, atingido no vértice de abscissa 1.
Qual é a inversa de (x−1)² com domínio [1,∞) e contradomínio [0,∞)? | 1+√x | 1−√x | ±√x | O domínio exige o ramo com x−1 não negativo, dando 1+√x.`,
	}),
];
