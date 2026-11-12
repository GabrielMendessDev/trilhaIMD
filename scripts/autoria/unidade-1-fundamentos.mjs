import { lesson } from "./estrutura.mjs";
export default [
	lesson({
		n: 1,
		title: "Coleções, pistas e linguagem matemática",
		goal: "Representar conjuntos e distinguir elementos, vazio e conjunto unitário.",
		prereq:
			"Leitura de números e comparação de listas; nenhum conteúdo de curso específico.",
		hook: "Uma comissão recolhe sugestões para uma semana cultural: música, cinema, música, debate. Para listar os temas diferentes, repetir música não ajuda — nem se o pedido vier em caixa alta. Como registrar a coleção sem confundir variedade com quantidade de votos?",
		concept:
			"Conjunto é uma coleção de elementos bem determinados. Escrevemos A={música,cinema,debate}. Ordem e repetição não mudam A. O símbolo ∈ significa ‘pertence a’; ∉ significa ‘não pertence a’. ∅ é o conjunto vazio. {∅} tem um elemento, que é um conjunto. Na descrição por propriedade, {x∈ℤ : x²=4} reúne os inteiros que satisfazem a condição.",
		why: "Dois conjuntos são iguais quando possuem exatamente os mesmos elementos: cada elemento de um precisa aparecer no outro e vice-versa. Por isso {1,2,2}={2,1}. Mas ∅≠{∅}: o primeiro não contém elementos; o segundo contém o objeto ∅. Chaves não são apenas decoração tipográfica.",
		example: [
			"Considere A={x∈ℤ : −1≤x<3}. O universo declarado é o dos inteiros; não inclua frações.",
			"Teste os extremos: −1 satisfaz ≤ e entra; 3 falha em < e fica fora. Os elementos são −1,0,1,2.",
			"Logo A={−1,0,1,2}. Temos 0∈A e 3∉A. A escrita {2,1,0,−1} representa o mesmo conjunto.",
		],
		trap: "Uma lista pode contar repetições; um conjunto não. Se a pergunta for ‘quantos votos chegaram?’, a lista original pode ter quatro entradas. Se for ‘quais temas apareceram?’, o conjunto tem três elementos. Escolha a estrutura conforme a pergunta.",
		transfer:
			"Conjuntos descrevem participantes de pesquisa, ingredientes, referências bibliográficas ou soluções de equações. Faça uma pausa: invente uma coleção com regra clara de pertencimento e uma descrição vaga. ‘Números pares’ é precisa; ‘números interessantes’ precisa de um critério antes de virar uma definição.",
		quiz: `Qual conjunto registra os temas música, cinema, música e debate? | {música,cinema,debate} | {música,cinema} | {música,música} | Os três temas distintos aparecem uma única vez.
Se A={1,3,5}, qual frase é verdadeira? | 3∈A | 2∈A | 5∉A | O número 3 está listado entre os elementos de A.
Qual conjunto é igual a {1,2,3}? | {3,2,1,1} | {1,2} | {1,2,4} | Ordem e repetição não alteram o conjunto de elementos.
Quantos elementos tem ∅? | 0 | 1 | 2 | O vazio não contém elemento algum.
Quantos elementos tem {∅}? | 1 | 0 | Infinitos | As chaves envolvem um único objeto, o conjunto vazio.
Qual é {x∈ℤ : x²=4}? | {−2,2} | {2} | {4} | Tanto −2 quanto 2 têm quadrado igual a 4.
Qual é {x∈ℤ : 0<x<3}? | {1,2} | {0,1,2,3} | {0,1,2} | A desigualdade é estrita nos dois extremos e o universo é inteiro.
Se A={0,2}, qual afirmação é falsa? | 1∈A | 0∈A | 2∈A | O elemento 1 não consta em A.
Qual informação se perde ao converter uma lista de votos em conjunto? | Quantas vezes cada opção foi marcada | Quais opções apareceram | Se uma opção apareceu | O conjunto guarda presença, mas não frequência.
Quando dois conjuntos são iguais? | Quando possuem exatamente os mesmos elementos | Quando têm o mesmo número de elementos | Quando foram escritos na mesma ordem | Mesma cardinalidade não garante mesmos elementos; {1} e {2} são diferentes.`,
	}),
	lesson({
		n: 2,
		title: "O mapa dos números",
		goal: "Classificar números em ℕ, ℤ, ℚ, irracionais e ℝ.",
		prereq: "Conjuntos e pertencimento (passo 1).",
		hook: "Uma sala tem 32 cadeiras, a temperatura de um modelo pode ser −2 e uma divisão de tarefas pede 3/2 hora. Os números trocam de roupa conforme o problema. O mapa dos conjuntos ajuda a saber quem cabe em cada descrição.",
		concept:
			"Nesta trilha, ℕ={0,1,2,…}; ℤ inclui os naturais e seus opostos; ℚ={p/q : p,q∈ℤ e q≠0}. Irracionais são os reais que não são racionais. ℝ reúne racionais e irracionais e corresponde aos pontos da reta real. As inclusões são ℕ⊂ℤ⊂ℚ⊂ℝ. Um mesmo número pode pertencer a vários conjuntos.",
		why: "Todo inteiro n pode ser escrito n/1, portanto é racional. Decimais finitos são frações com denominador potência de 10: 0,125=125/1000=1/8. Nem toda raiz é irracional: √9=3. Para √2, suponha √2=p/q em forma reduzida; p²=2q² força p par e depois q par, contrariando a forma reduzida. Logo √2 é irracional.",
		example: [
			"Classifique −3, 0,125 e √9. O número −3 é inteiro, logo também racional e real, mas não natural.",
			"0,125=1/8 é racional e real; não é inteiro. Já √9=3 é natural, inteiro, racional e real.",
			"‘Menor conjunto da cadeia’ é uma resposta diferente de ‘todos os conjuntos a que pertence’. Leia a pergunta antes de escolher apenas um nome.",
		],
		trap: "Decimal com muitas casas não é automaticamente irracional; a escrita pode ser uma aproximação de uma fração. Também não classifique √4 como irracional só por haver radical. A convenção de incluir 0 em ℕ deve ser declarada, pois livros podem adotar outra.",
		transfer:
			"Na reta, racionais e irracionais convivem sem buracos no conjunto dos reais. A medida √2 pode surgir na diagonal de um quadrado de lado 1, independentemente da área do seu curso. Explique por que ‘todo inteiro é racional’ não implica ‘todo racional é inteiro’.",
		quiz: `Nesta trilha, 0 pertence a qual conjunto? | ℕ | Apenas aos irracionais | A nenhum conjunto numérico | Adotamos explicitamente ℕ={0,1,2,…}.
Qual é o menor conjunto da cadeia ℕ⊂ℤ⊂ℚ⊂ℝ que contém −7? | ℤ | ℕ | ℚ | −7 é inteiro e não natural.
Qual número é racional e não inteiro? | 3/2 | −3 | √2 | 3/2 é uma fração de inteiros e vale 1,5.
Quanto vale √9? | 3 | ±3 | 9 | O símbolo de raiz quadrada representa a raiz principal não negativa; resolver x²=9 daria ±3.
Qual número é irracional? | √2 | 0,25 | −8/2 | √2 não admite fração de inteiros; os outros dois admitem.
Qual fração representa 0,125? | 1/8 | 1/4 | 1/125 | 125/1000 simplifica para 1/8.
Todo inteiro é racional? | Sim | Não | Apenas os positivos | Cada inteiro n é n/1.
Todo racional é inteiro? | Não | Sim | Apenas se for positivo | 1/2 é racional e não inteiro, fornecendo contraexemplo.
Quais pontos correspondem aos números reais? | Todos os pontos da reta real | Apenas marcas inteiras | Apenas pontos racionais | A reta real também contém pontos irracionais.
Qual é a condição em p/q para definir um racional? | p e q inteiros, q≠0 | p e q naturais, q=0 | p irracional e q inteiro | A definição exige inteiros e proíbe divisão por zero.`,
	}),
	lesson({
		n: 3,
		title: "Pertencer é diferente de estar contido",
		goal: "Distinguir pertinência, inclusão e subconjunto próprio.",
		prereq: "Elementos, vazio e igualdade de conjuntos.",
		hook: "Uma estudante pertence à turma. Um grupo de estudantes está contido na turma. Trocar as duas frases pode parecer um detalhe de português, mas muda os objetos que você compara. É o tipo de erro em que a notação pede documento de identidade.",
		concept:
			"A⊆B significa: para todo x, se x∈A, então x∈B. A é subconjunto de B. A⊊B acrescenta A≠B e indica subconjunto próprio. O símbolo ∈ compara um objeto com um conjunto; ⊆ compara conjuntos. Conjuntos também podem ser elementos de outros conjuntos, quando isso é explicitado.",
		why: "Todo conjunto é subconjunto de si mesmo, pois nenhum elemento seu fica de fora dele. O vazio é subconjunto de qualquer conjunto: não existe elemento do vazio que possa violar a condição. Para provar A=B, podemos mostrar A⊆B e B⊆A. Para refutar inclusão, basta exibir um elemento de A que não esteja em B.",
		example: [
			"Se A={1,2} e B={1,2,3}, então todo elemento de A está em B: A⊆B.",
			"Como 3∈B e 3∉A, os conjuntos são diferentes; portanto A⊊B. Além disso, 2∈A e {2}⊆A.",
			"Se C={{1,2},3}, então A∈C, mas 1∉C. O objeto {1,2} aparece inteiro como elemento de C.",
		],
		trap: "{2}∈{1,2,3} é falso: os elementos do conjunto da direita são números, e não o conjunto {2}. Já {2}⊆{1,2,3} é verdadeiro. Leia as chaves como parte do objeto; não as remova mentalmente.",
		transfer:
			"Arquivos dentro de pastas e grupos dentro de turmas podem ajudar a começar, mas a definição é o teste de todos os elementos. Tente refutar uma inclusão com um único contraexemplo; depois explique por que provar inclusão exige controlar todos os elementos, mesmo sem listá-los um a um.",
		quiz: `Se A={1,2,3}, qual afirmação é verdadeira? | {2}⊆A | {2}∈A | 4∈A | O único elemento de {2} está em A; A não lista conjuntos como elementos.
Qual afirmação vale para todo conjunto A? | ∅⊆A | ∅∈A | A=∅ | Não há elemento do vazio que esteja fora de A; pertinência do vazio não é automática.
Se A=B, então A⊊B? | Não | Sim | Apenas se A for vazio | Subconjunto próprio exige desigualdade entre os conjuntos.
Qual condição demonstra A=B? | A⊆B e B⊆A | Apenas A⊆B | Apenas |A|=|B| | As duas inclusões garantem exatamente os mesmos elementos.
Se A={1,2} e B={2,3}, por que A⊆B é falso? | 1∈A e 1∉B | 2 pertence aos dois | B tem dois elementos | O elemento 1 é um contraexemplo à inclusão.
Em C={{1,2},3}, qual é um elemento de C? | {1,2} | 1 | 2 | O conjunto {1,2} foi listado inteiro como um elemento.
Se A={a,b}, qual é um subconjunto próprio? | {a} | {a,b} | {a,b,c} | {a} está contido em A e é diferente dele.
Quantos elementos tem {{1,2},3}? | 2 | 3 | 1 | Seus dois elementos são {1,2} e 3.
Qual símbolo expressa ‘o número 3 pertence a A’? | ∈ | ⊆ | ∪ | Pertinência compara um objeto com o conjunto que o contém.
Se A⊆B e B⊆C, o que podemos concluir? | A⊆C | C⊆A | A=C | Cada elemento de A está em B e, por isso, em C.`,
	}),
	lesson({
		n: 4,
		title: "Operações: cruzando listas sem tropeçar",
		goal: "Calcular união, interseção, diferença e complemento com universo declarado.",
		prereq: "Pertinência e inclusão.",
		hook: "A biblioteca tem uma lista de quem pediu livros de História e outra de quem pediu livros de Biologia. ‘Pelo menos uma lista’, ‘as duas’ e ‘só a primeira’ são perguntas diferentes. Hoje o desafio é responder sem inventar uma terceira lista de confusão.",
		concept:
			"A∪B reúne elementos de A ou de B, incluindo quem está nos dois. A∩B reúne quem pertence aos dois. A∖B contém elementos de A que não estão em B. Se o universo U foi declarado, Aᶜ=U∖A. ‘Ou’ é inclusivo nesta notação; ‘apenas um dos dois’ precisa excluir a interseção.",
		why: "Para decidir a região de um elemento, faça duas perguntas: ele está em A? Está em B? As respostas possíveis são sim/sim, sim/não, não/sim e não/não. Elas particionam U em quatro regiões sem sobreposição. Esse procedimento justifica o diagrama de Venn e funciona mesmo sem desenho.",
		example: [
			"Tome U={1,2,3,4,5,6}, A={1,2,3} e B={3,4}. A união é {1,2,3,4}; a interseção é {3}.",
			"A∖B={1,2}, enquanto B∖A={4}. A diferença depende da ordem.",
			"O complemento de A em U é {4,5,6}. Quem está em apenas uma lista forma {1,2,4}, pois retiramos o elemento 3 que estava em ambas.",
		],
		trap: "A∖B não significa remover todos os elementos de B do universo, e sim remover de A aqueles que também estão em B. Sem declarar U, ‘o complemento de A’ fica incompleto: o conjunto de quem ficou de fora depende de quem poderia participar.",
		transfer:
			"Use as operações para combinar critérios de uma pesquisa ou de uma agenda. Em linguagem cotidiana, ‘ou’ pode ser exclusivo; em matemática, escreva a condição sem deixar isso implícito. Explique uma operação escolhendo um elemento de cada uma das quatro regiões.",
		quiz: `Para A={1,2,3} e B={3,4}, qual é A∪B? | {1,2,3,4} | {3} | {1,2,4} | União inclui qualquer elemento de pelo menos um dos conjuntos.
Para os mesmos A e B, qual é A∩B? | {3} | {1,2,3,4} | ∅ | O único elemento comum é 3.
Qual é A∖B no exemplo? | {1,2} | {4} | {1,2,4} | Mantemos os elementos de A que não estão em B.
Qual é B∖A no exemplo? | {4} | {1,2} | {3,4} | A diferença troca de resultado ao trocar a ordem.
Em U={1,2,3,4,5,6} e A={1,2,3}, qual é Aᶜ? | {4,5,6} | {1,2,3} | {4} | O complemento é calculado em relação a todo o universo U.
Se x∈A∩B, qual frase é verdadeira? | x está em A e em B | x está apenas em A | x está fora de ambos | Interseção exige as duas pertinências simultaneamente.
Se x∈A∪B, x pode estar nos dois conjuntos? | Sim | Não | Só se A=B | O ‘ou’ da união inclui a possibilidade de pertencer a ambos.
Qual é A∩∅? | ∅ | A | {∅} | Nenhum elemento pode pertencer ao conjunto vazio.
Qual é A∪∅? | A | ∅ | {A} | O vazio não acrescenta nenhum elemento à união.
No exemplo, quem está em apenas um dos conjuntos? | {1,2,4} | {1,2,3,4} | {3} | Reunimos a união e retiramos a interseção, excluindo 3.`,
	}),
	lesson({
		n: 7,
		title: "Potências: multiplicar sem escrever tudo",
		goal: "Interpretar expoentes inteiros, zero e negativos.",
		prereq: "Multiplicação e frações.",
		hook: "Uma sequência começa com 1 e duplica a cada rodada: 1,2,4,8. Se o processo andar uma rodada para trás, chegamos a 1/2. O expoente negativo vai nascer desse movimento, sem precisar de uma regra caída do céu.",
		concept:
			"Para n natural positivo, aⁿ é o produto de n fatores iguais a a. Base e expoente têm papéis diferentes: 3⁴ usa quatro fatores 3. Para a≠0, definimos a⁰=1 e a⁻ⁿ=1/aⁿ para manter as leis de multiplicação. 0⁻¹ não existe, pois exigiria divisão por zero; 0⁰ não será usado nesta trilha.",
		why: "A sequência de potências de base 2 é …,2⁻²=1/4,2⁻¹=1/2,2⁰=1,2¹=2,2²=4,… Cada avanço multiplica por 2 e cada retorno divide por 2. Isso torna os expoentes coerentes nos dois sentidos. O sinal do expoente não é o sinal do resultado.",
		example: [
			"Simplifique 3²·3⁻¹. Primeiro escreva 3²=9 e 3⁻¹=1/3.",
			"O produto é 9/3=3. Pela lei dos expoentes, 3²·3⁻¹=3¹=3.",
			"Compare com −3²=−9 e (−3)²=9. Os parênteses dizem se o sinal negativo integra a base.",
		],
		trap: "2³ é 2·2·2=8, não 2·3=6. E 2⁻³ é 1/8, não −8. Em frações, (2/3)⁻¹=3/2, porque o recíproco deve produzir 1 quando multiplicado pela base.",
		transfer:
			"Potências aparecem em crescimento de populações idealizadas, organização de possibilidades e medidas científicas. A notação reduz escrita, mas você deve conseguir desmontá-la em fatores para conferir exemplos pequenos. Explique por que a condição a≠0 é necessária ao usar expoente negativo.",
		quiz: `Quanto vale 2³? | 8 | 6 | 9 | São três fatores 2: 2·2·2=8.
Qual é a base em 5⁴? | 5 | 4 | 20 | A base é o número repetido como fator.
Quanto vale 7⁰? | 1 | 0 | 7 | Uma base não nula elevada a zero vale 1.
Quanto vale 2⁻³? | 1/8 | −8 | −1/8 | Expoente negativo dá o recíproco de 2³.
Quanto vale (2/3)⁻¹? | 3/2 | −2/3 | 2/3 | O recíproco de 2/3 é 3/2.
Quanto vale 10²·10³? | 10⁵ | 10⁶ | 20⁵ | Multiplicar potências da mesma base soma seus expoentes.
Quanto vale 4³/4²? | 4 | 16 | 1 | Subtrair os expoentes dá 4¹.
Qual expressão não está definida em ℝ? | 0⁻¹ | 2⁰ | (−2)³ | 0⁻¹ exigiria 1/0.
Quanto vale (−2)³? | −8 | 8 | −6 | Três fatores negativos produzem um resultado negativo.
Por que 3⁰=1 é coerente com 3²/3²? | O quociente vale 1 e também 3²⁻² | O quociente vale zero | Toda potência de 3 vale 1 | A lei de quociente liga o expoente zero ao número 1.`,
	}),
	lesson({
		n: 9,
		title: "Logaritmo nasce de uma pergunta",
		goal: "Converter entre notações exponencial e logarítmica.",
		prereq: "Potências e raízes (passos 7 e 8).",
		hook: "Uma oficina começa com 3 participantes e triplica o número em cada rodada idealizada. Quando alcançará 81? Se a pergunta procura a quantidade de rodadas, a incógnita está no expoente. É a deixa para o logaritmo entrar em cena.",
		concept:
			"logₐb é o expoente c tal que aᶜ=b. A base deve satisfazer a>0 e a≠1, e o argumento deve satisfazer b>0. Exemplo: log₃81=4 porque 3⁴=81. A notação ln b significa logaritmo de base e, com e≈2,71828. Quando o contexto usa log decimal, a base é 10, mas nesta trilha bases serão explicitadas.",
		why: "Para a>1, aˣ cresce estritamente; para 0<a<1, decresce estritamente. Assim um valor positivo b tem um único expoente real correspondente. Potências de base positiva são positivas: por isso não existe logₐ0 nem logaritmo real de argumento negativo nessa definição.",
		example: [
			"Resolva 2ˣ=1/8. Reescreva o lado direito como 2⁻³.",
			"A igualdade entre potências da mesma base admissível permite concluir x=−3.",
			"A mesma conclusão escreve-se log₂(1/8)=−3. O expoente pode ser negativo mesmo quando o argumento é positivo.",
		],
		trap: "log₂8 não é 8/2, porque o logaritmo pergunta pelo expoente. E logₐ1=0 para qualquer base admissível, pois a⁰=1. Não aceite base 1: 1ˣ=1 para todo x, deixando de haver uma resposta única.",
		transfer:
			"Antes de memorizar propriedades, treine a tradução ‘base elevada ao resultado é igual ao argumento’. Escreva exemplos com resultado positivo, zero e negativo. O sinal do logaritmo depende da base e do argumento, e não apenas de o argumento ser positivo.",
		quiz: `Qual potência traduz log₂8=3? | 2³=8 | 3²=8 | 8³=2 | Base 2 elevada ao resultado 3 produz o argumento 8.
Quanto vale log₅25? | 2 | 5 | 1/2 | 5²=25.
Quanto vale log₂(1/8)? | −3 | 3 | −4 | 2⁻³=1/8.
Quanto vale log₇1? | 0 | 1 | 7 | A potência de expoente zero de uma base admissível é 1.
Quanto vale log₃3? | 1 | 0 | 3 | O expoente procurado é 1, pois 3¹=3.
Qual base é válida? | 1/2 | 1 | −2 | A base precisa ser positiva e diferente de 1.
Qual argumento é válido para log₂b em ℝ? | 1/4 | 0 | −4 | O argumento deve ser estritamente positivo.
Quanto vale log_(1/2)4? | −2 | 2 | 4 | (1/2)⁻²=4.
Qual é a base de ln? | e | 10 | 2 | ln é a notação do logaritmo natural, cuja base é e.
Se log₄b=3, quanto vale b? | 64 | 12 | 81 | A definição fornece b=4³=64.`,
	}),
	lesson({
		n: 11,
		title: "Equações: a balança e suas condições",
		goal: "Resolver equações lineares e identificar identidades e contradições.",
		prereq: "Operações com números reais e distributividade.",
		hook: "Um grupo reserva uma sala com custo fixo fictício de 12 unidades e mais 3 por participante. O total foi 30. Quantas pessoas entraram no modelo? A letra x vai guardar a informação ausente; ela não torna o problema automaticamente misterioso.",
		concept:
			"Equação é uma igualdade que pode depender de incógnitas. Seu conjunto solução reúne os valores que a tornam verdadeira no universo declarado. Somar o mesmo número aos dois lados e multiplicar ambos por uma constante não nula preserva a equivalência. Em ax+b=0, se a≠0 então x=−b/a; se a=0, analise b=0 ou b≠0.",
		why: "O chamado ‘passar para o outro lado’ abrevia operações nos dois membros. De 3x+12=30, subtrair 12 dos dois lados produz 3x=18. Dividir por 3 é reversível porque 3≠0. Se a conta acaba em 0=0, todos os valores do domínio servem; se acaba em 0=5, nenhum serve.",
		example: [
			"Resolva 2(x−3)+4=x+5 em ℝ. A distributiva dá 2x−6+4=x+5.",
			"Simplifique: 2x−2=x+5. Subtraia x e some 2 aos dois membros: x=7.",
			"Verifique na expressão original: 2(7−3)+4=12 e 7+5=12. Portanto S={7}.",
		],
		trap: "Dividir por uma expressão com incógnita pode eliminar casos em que ela é zero. Mesmo em equações simples, escreva a operação em vez de trocar sinais por memória. E não esqueça a distributiva: 2(x−3)=2x−6, não 2x−3.",
		transfer:
			"Em orçamentos, doses de modelos fictícios ou cronogramas, declare o significado e a unidade de x. Depois confira se a solução algébrica é admissível no contexto. Aqui nenhum exemplo deve ser interpretado como orientação clínica ou financeira real.",
		quiz: `Resolva 3x+12=30. | x=6 | x=14 | x=10 | Subtraia 12 e divida por 3: x=18/3=6.
Qual é a expansão de 2(x−3)? | 2x−6 | 2x−3 | 2x+6 | A distributiva multiplica os dois termos por 2.
Resolva 2(x−3)+4=x+5. | x=7 | x=5 | x=−7 | Simplificar produz 2x−2=x+5, logo x=7.
Resolva 5x=0. | x=0 | Qualquer real | Nenhum real | Dividir por 5, que não é zero, dá x=0.
Qual é o conjunto solução de 0x=0 em ℝ? | ℝ | {0} | ∅ | A igualdade é verdadeira para todo real x.
Qual é o conjunto solução de 0x=3? | ∅ | ℝ | {3} | O lado esquerdo vale 0 para todo x e nunca é 3.
Resolva x/3+2=5. | x=9 | x=1 | x=21 | Subtraia 2 para obter x/3=3 e multiplique por 3.
Qual operação é sempre reversível numa equação real? | Somar 4 aos dois membros | Multiplicar por zero | Dividir por x sem restrição | Somar 4 é desfeito subtraindo 4.
Se ax+b=0 e a≠0, qual é a solução? | x=−b/a | x=b/a | x=−a/b | Isolamos ax=−b e dividimos pelo coeficiente não nulo a.
Uma contagem exige x inteiro não negativo e a equação dá x=−2. A conclusão é qual? | O modelo não tem solução admissível nesse contexto | Há menos duas pessoas | Podemos trocar por 2 | A condição do contexto exclui a solução negativa, sem permitir alterar o valor arbitrariamente.`,
	}),
	lesson({
		n: 13,
		title: "Quadráticas: escolher o caminho",
		goal: "Resolver quadráticas por fatoração, soma e produto e fórmula geral.",
		prereq: "Equações lineares, potências e distributividade.",
		hook: "Você procura dois números cuja soma é 5 e cujo produto é 6. Talvez os encontre antes de terminar de ler. Esse pequeno enigma resolve uma equação quadrática inteira e ajuda a escolher quando usar uma fórmula maior.",
		concept:
			"Uma quadrática tem ax²+bx+c=0, a≠0. Se puder fatorar como a(x−r)(x−s), o produto é zero exatamente em r ou s. As raízes reais, quando existem, têm soma −b/a e produto c/a, contando multiplicidade. Com Δ=b²−4ac≥0, a fórmula geral é x=(−b±√Δ)/(2a).",
		why: "Expandir a(x−r)(x−s) fornece ax²−a(r+s)x+ars. Comparar coeficientes explica a soma e o produto das raízes. Esta justificativa curta dá sentido ao método; sua dedução geral não é prioridade na P1 2025.2. A fórmula geral resolve inclusive casos em que adivinhar fatores é pouco prático.",
		example: [
			"Resolva x²−5x+6=0. Precisamos de r+s=5 e rs=6. O par 2 e 3 satisfaz ambas as condições.",
			"A fatoração é (x−2)(x−3)=0. Pela propriedade do produto nulo, x=2 ou x=3.",
			"Pela fórmula: Δ=25−24=1 e x=(5±1)/2, dando os mesmos valores. A conferência revela dois métodos para uma mesma estrutura.",
		],
		trap: "O sinal da soma é −b/a, não b/a. E a propriedade do produto nulo só vale quando o produto é igual a zero: de uv=6 não concluímos u=6 ou v=6. Equações incompletas também podem ser quadráticas se a≠0.",
		transfer:
			"Escolha o método conforme a forma: fator comum em x²−4x, diferença de quadrados em x²−9, soma e produto para pares simples e fórmula geral quando necessário. Saber justificar a escolha reduz contas e facilita revisar sinais.",
		quiz: `Quais são as raízes de x²−5x+6=0? | 2 e 3 | −2 e −3 | 1 e 6 | As raízes têm soma 5 e produto 6.
Qual é a soma das raízes de 2x²−6x+4=0? | 3 | −3 | 2 | A soma é −b/a=6/2=3.
Qual é o produto das raízes de 2x²−6x+4=0? | 2 | 3 | 4 | O produto é c/a=4/2=2.
Resolva x²−9=0 em ℝ. | {−3,3} | {3} | {−9,9} | A diferença de quadrados fatorada é (x−3)(x+3)=0.
Resolva x²−4x=0. | {0,4} | {4} | {−4,4} | x(x−4)=0 inclui x=0, que seria perdido ao dividir por x.
Qual é o discriminante de x²+2x−3=0? | 16 | −8 | 4 | Δ=2²−4·1·(−3)=4+12=16.
Quais são as raízes de x²+2x−3=0? | 1 e −3 | 3 e −1 | 1 e 3 | x=(−2±4)/2 produz 1 e −3.
O que caracteriza uma equação quadrática? | O coeficiente de x² é não nulo | Todos os coeficientes são não nulos | O termo independente é positivo | b ou c podem ser zero; a não pode.
Se uv=0 em ℝ, qual conclusão vale? | u=0 ou v=0 | u=v=0 obrigatoriamente | u+v=0 | Um produto real só é zero se pelo menos um fator for zero.
Qual é a forma fatorada de x²+x−6? | (x+3)(x−2) | (x−3)(x+2) | (x−3)(x−2) | Expandir dá x²+x−6, com raízes −3 e 2.`,
	}),
	lesson({
		n: 16,
		title: "Desigualdades: virando o sinal com motivo",
		goal: "Resolver inequações lineares e combinar condições simultâneas.",
		prereq: "Equações lineares e intervalos.",
		hook: "Uma pessoa tem no máximo 90 minutos para leitura e deslocamento. A frase ‘no máximo’ abre um conjunto de possibilidades, não uma resposta única. A desigualdade é uma ferramenta para negociar limites — sem pedir que todo mundo chegue ao mesmo minuto.",
		concept:
			"Inequações usam <,≤,> ou ≥. Somar o mesmo real aos dois lados preserva a ordem. Multiplicar por positivo preserva o sentido; por negativo inverte. Condições simultâneas são combinadas por interseção. No universo real, a resposta costuma ser um intervalo; em contagens, depois filtramos os inteiros admissíveis.",
		why: "Se a<b, então b−a>0. Multiplicando essa diferença por c<0 resulta c(b−a)<0, isto é, cb<ca. Portanto ca>cb: a ordem foi invertida. A regra não é uma penalidade por usar números negativos; ela expressa a reflexão da reta em torno de zero.",
		example: [
			"Resolva −2x+6≥0 e x<5. Na primeira, subtraia 6: −2x≥−6.",
			"Divida por −2 e inverta o sentido: x≤3. A outra condição é x<5.",
			"A interseção é (−∞,3]. Teste x=3: a primeira expressão vale 0 e a segunda condição é verdadeira.",
		],
		trap: "Nem toda movimentação de um número negativo inverte o sinal. Somar ou subtrair negativos preserva a ordem; a inversão ocorre ao multiplicar ou dividir por um número negativo. E ‘e’ não é união: precisa cumprir as condições ao mesmo tempo.",
		transfer:
			"Monte uma desigualdade a partir de um limite de tempo ou capacidade, registrando unidades. Para estudar, resolva a mesma inequação por álgebra e por alguns testes na reta. Os testes ajudam a conferir, enquanto a transformação equivalente garante o intervalo completo.",
		quiz: `Resolva −2x≥−6. | x≤3 | x≥3 | x≤−3 | Dividir por −2 inverte o sentido e produz x≤3.
Resolva 3x+1<10. | x<3 | x>3 | x≤3 | Subtraia 1 e divida por 3 positivo; a desigualdade continua estrita.
Resolva x−4≥2. | x≥6 | x≤6 | x≥−2 | Somar 4 aos dois lados preserva a ordem.
Qual é a solução de x≥2 e x<5? | [2,5) | (2,5] | (−∞,5) | A interseção inclui 2 e exclui 5.
Qual é a solução de x>4 e x≤1? | ∅ | (1,4) | ℝ | As exigências são incompatíveis.
Qual operação inverte uma desigualdade? | Multiplicar ambos os lados por −3 | Subtrair 3 dos dois lados | Somar −3 aos dois lados | A inversão depende da multiplicação por número negativo.
Resolva −x<2. | x>−2 | x<−2 | x>2 | Multiplicar por −1 troca o sentido.
Qual é a solução de 2x≤8 e x≥0? | [0,4] | (0,4) | (−∞,4] | A primeira dá x≤4; a segunda elimina os negativos.
Se x é uma contagem inteira e 0≤x<3, quais valores servem? | 0,1,2 | 0,1,2,3 | Todos os reais de [0,3) | O domínio inteiro seleciona apenas 0, 1 e 2.
Qual é a solução de 0x≤1 em ℝ? | ℝ | ∅ | {1} | O lado esquerdo sempre vale 0, e 0≤1 é sempre verdadeiro.`,
	}),
	lesson({
		n: 18,
		title: "Produtos com várias pistas",
		goal: "Estudar sinais de produtos com três fatores e raízes repetidas.",
		prereq: "Sinais de fatores e quadráticas (passo 17).",
		hook: "Agora a régua ganhou três portas e uma delas aparece duas vezes. Será que o sinal troca em todas? Antes de sair alternando + e −, vale descobrir qual porta só encosta no zero e qual atravessa para o outro lado.",
		concept:
			"Os zeros reais dos fatores dividem a reta em intervalos. Em cada intervalo, determine o sinal de cada fator. Potências pares são positivas fora do zero; potências ímpares mantêm o sinal da base. Ordene os pontos críticos e trate a inclusão dos zeros somente depois de escolher os sinais que atendem à desigualdade.",
		why: "Perto de uma raiz r, escreva o produto como (x−r)ᵐg(x), com g contínua e g(r)≠0. O fator g mantém sinal no entorno. Se m é par, (x−r)ᵐ é positivo dos dois lados; se m é ímpar, troca sinal. Para os produtos polinomiais deste passo, a fatoração identifica todas as trocas possíveis.",
		example: [
			"Resolva (x+2)(x−1)²(x−3)<0. Os zeros são −2,1,3; a raiz 1 tem multiplicidade dois.",
			"Fora de x=1, o fator quadrado é positivo. O sinal depende de (x+2)(x−3), que é negativo entre −2 e 3.",
			"Como a desigualdade é estrita, excluímos também o zero em 1. S=(−2,1)∪(1,3). Conferir x=0 e x=2 dá resultados negativos.",
		],
		trap: "Ignorar uma raiz par na troca de sinal não significa incluí-la em uma desigualdade estrita. Em x=1, o produto do exemplo é zero, portanto não serve. Multiplicidade regula a troca; o símbolo da desigualdade regula a aceitação do zero.",
		transfer:
			"Um caminho eficiente é estudar fatores pares separadamente, sem apagá-los do conjunto de zeros. Desenhe os quatro intervalos do exemplo, escreva os sinais por extenso e explique por que os dois intervalos centrais têm o mesmo sinal apesar do ponto excluído entre eles.",
		quiz: `Qual é a multiplicidade de 1 em (x+2)(x−1)²(x−3)? | 2 | 1 | 4 | O expoente do fator x−1 é dois.
Qual é o sinal de (x−1)² para x≠1? | Positivo | Negativo | Depende do lado de 1 | Um quadrado não nulo é estritamente positivo.
Qual é a solução de (x+2)(x−1)²(x−3)<0? | (−2,1)∪(1,3) | (−2,3) | [−2,3] | O produto é negativo entre −2 e 3, mas zera em 1, que deve ser excluído.
Se a desigualdade do exemplo fosse ≤0, qual seria a solução? | [−2,3] | (−2,1)∪(1,3) | ℝ | Os três zeros seriam aceitos e todo o intervalo entre −2 e 3 teria produto não positivo.
Qual é o sinal de x(x−1)(x−2) para x>2? | Positivo | Negativo | Zero | Os três fatores são positivos nesse intervalo.
Qual é o sinal de x(x−1)(x−2) para x<0? | Negativo | Positivo | Zero | Os três fatores são negativos, e três sinais negativos produzem negativo.
Qual é a solução de x(x−1)(x−2)>0? | (0,1)∪(2,∞) | (−∞,0)∪(1,2) | [0,2] | Os sinais da esquerda para a direita são −,+,−,+, com raízes excluídas.
Ao atravessar uma raiz de multiplicidade três, o sinal de um produto polinomial muda? | Sim | Não | Só se a raiz for zero | Multiplicidade ímpar provoca troca de sinal.
Em (x−1)²(x+2)≥0, qual é a solução? | [−2,∞) | (−∞,−2] | [1,∞) | O fator quadrado é positivo exceto em 1, onde o produto é zero; o sinal restante depende de x+2.
Por que testar apenas x=0 não resolve qualquer inequação polinomial? | Pode haver outros intervalos separados por zeros | Todo produto tem o mesmo sinal | O teste sempre inclui todas as raízes | É necessário localizar todos os zeros e estudar cada intervalo determinado por eles.`,
	}),
];
