import { lesson } from "./estrutura.mjs";
import functions from "./unidade-3-funcoes.mjs";
import trigonometry from "./unidade-3-trigonometria.mjs";
export default [
	...functions,
	...trigonometry,
	lesson({
		n: 55,
		title: "Matrizes: linhas e colunas com significado",
		goal: "Ler dimensões, índices, igualdade e matrizes especiais.",
		prereq: "Tabelas e operações reais.",
		hook: "Uma pesquisa registra participação por atividade e por turno. A tabela tem linhas com um significado e colunas com outro. Transformá-la em matriz não apaga esses significados: organiza os números para que possamos operar com eles sem perder quem é quem.",
		concept:
			"Uma matriz A de dimensão m×n tem m linhas e n colunas. O elemento aᵢⱼ ocupa a linha i e a coluna j, contando a partir de 1. Matrizes são iguais quando têm a mesma dimensão e entradas correspondentes iguais. Matriz quadrada tem m=n. A matriz nula tem todas as entradas zero; a identidade Iₙ tem 1 na diagonal principal e 0 fora dela.",
		why: "A dimensão define quais posições existem e quais operações fazem sentido. Em uma matriz 2×3, a₂₃ existe, mas a₃₂ não. A diagonal principal de uma matriz quadrada reúne a₁₁,a₂₂,…,aₙₙ. A identidade será importante porque preserva vetores e matrizes em multiplicações compatíveis.",
		example: [
			"Escreva A=[[2,5,1],[4,0,3]], notação em que cada par de colchetes internos é uma linha. Há duas linhas e três colunas: dimensão 2×3.",
			"O elemento a₁₂ é 5, enquanto a₂₁ é 4. O índice da linha vem primeiro.",
			"Se B=[[2,x,1],[4,0,3]] e A=B, então x=5. A igualdade compara todas as posições, e não apenas a soma dos números.",
		],
		trap: "2×3 não significa seis linhas; indica duas linhas e três colunas. Na matriz identidade, ‘diagonal’ não quer dizer qualquer linha inclinada: é a diagonal dos índices iguais. Não atribua à matriz uma ordem de grandeza pelo total de elementos quando a pergunta pede dimensão.",
		transfer:
			"Tabelas de acervos, treinos esportivos, pesquisas sociais ou medições podem virar matrizes. Declare rótulos e unidades fora da notação compacta. Os números podem ser iguais enquanto os significados das tabelas diferem; o modelo precisa guardar essa informação.",
		quiz: `Quantas linhas e colunas tem uma matriz 2×3? | 2 linhas e 3 colunas | 3 linhas e 2 colunas | 6 linhas e 1 coluna | A convenção escreve primeiro o número de linhas.
Em A=[[2,5,1],[4,0,3]], qual é a₁₂? | 5 | 4 | 1 | Linha 1, coluna 2 contém 5.
Na mesma matriz, qual é a₂₁? | 4 | 5 | 0 | Linha 2, coluna 1 contém 4.
Qual posição não existe numa matriz 2×3? | a₃₂ | a₂₃ | a₁₁ | Não há terceira linha.
Qual matriz é quadrada? | Uma de dimensão 3×3 | Uma de dimensão 2×3 | Uma de dimensão 1×4 | Matriz quadrada tem números iguais de linhas e colunas.
Qual é I₂? | [[1,0],[0,1]] | [[1,1],[1,1]] | [[0,1],[1,0]] | A identidade tem uns na diagonal principal e zeros fora dela.
Qual propriedade define a matriz nula? | Todas as entradas são zero | Só a diagonal é zero | Só a primeira linha é zero | Nenhuma posição pode ter valor não nulo.
Para matrizes serem iguais, o que é necessário? | Mesma dimensão e todas as entradas correspondentes iguais | Apenas a mesma soma de entradas | Apenas a mesma quantidade de elementos | Igualdade é posição por posição com dimensões coincidentes.
Se [[1,x],[0,2]]=[[1,3],[0,2]], qual é x? | 3 | 1 | 2 | Compare a entrada da primeira linha e segunda coluna.
Quais índices descrevem a diagonal principal? | i=j | i+j=1 | i>j sempre | Na diagonal principal, o número da linha coincide com o da coluna.`,
	}),
	lesson({
		n: 56,
		title: "Somar, escalar e transpor",
		goal: "Operar entrada a entrada e reconhecer transpostas e simétricas.",
		prereq: "Dimensões e índices de matrizes.",
		hook: "Duas equipes registraram as mesmas atividades nas mesmas linhas e turnos nas mesmas colunas. Agora é possível somar as tabelas. Se uma equipe trocou os eixos, a primeira tarefa será alinhar a organização, não sair somando posições às cegas.",
		concept:
			"A+B e A−B exigem a mesma dimensão e operam entrada a entrada. Em λA, cada entrada é multiplicada pelo real λ. A transposta Aᵀ troca linhas por colunas: (Aᵀ)ᵢⱼ=aⱼᵢ. Se A tem dimensão m×n, Aᵀ tem n×m. Uma matriz simétrica é quadrada e satisfaz Aᵀ=A.",
		why: "A transposição leva cada posição (i,j) para (j,i), portanto aplicá-la duas vezes devolve a posição original: (Aᵀ)ᵀ=A. A condição de simetria é aᵢⱼ=aⱼᵢ em todas as posições. Soma de matrizes representa soma de valores comparáveis quando os rótulos e as unidades das tabelas foram alinhados.",
		example: [
			"Tome A=[[1,2],[3,4]] e B=[[2,0],[−1,5]]. Some posição a posição: A+B=[[3,2],[2,9]].",
			"Multiplique A por 2: 2A=[[2,4],[6,8]]. A transposta é Aᵀ=[[1,3],[2,4]].",
			"A não é simétrica, pois a₁₂=2 e a₂₁=3. Já [[1,2],[2,4]] é simétrica, porque as posições espelhadas coincidem.",
		],
		trap: "A transposta não inverte a ordem dos números numa linha; ela transforma uma linha inteira em coluna. E multiplicar por escalar não é elevar cada entrada a uma potência. Matrizes com a mesma quantidade total de entradas, mas dimensões diferentes, não podem ser somadas pela regra usual.",
		transfer:
			"Antes de somar dados matriciais, confira significado, unidade e posição dos rótulos. Uma transposição pode facilitar a leitura sem mudar os valores registrados. Explique em palavras para onde vai o elemento a₂₃ ao transpor: linha 3, coluna 2.",
		quiz: `Quando A+B está definida pela soma usual? | Quando A e B têm a mesma dimensão | Quando só têm o mesmo número de linhas | Quando só têm o mesmo total de entradas | Precisamos de posições correspondentes em todas as linhas e colunas.
Se A=[[1,2],[3,4]], qual é 2A? | [[2,4],[6,8]] | [[1,4],[9,16]] | [[3,4],[5,6]] | O escalar 2 multiplica cada entrada.
Qual é Aᵀ para A=[[1,2],[3,4]]? | [[1,3],[2,4]] | [[4,3],[2,1]] | [[2,1],[4,3]] | As linhas de A tornam-se colunas na transposta.
Qual é a dimensão da transposta de uma matriz 2×3? | 3×2 | 2×3 | 6×1 | A transposição troca as contagens de linhas e colunas.
Qual é A+B no exemplo? | [[3,2],[2,9]] | [[2,0],[−3,20]] | [[−1,2],[4,−1]] | Somamos valores de posições iguais.
Qual é A−B no exemplo? | [[−1,2],[4,−1]] | [[3,2],[2,9]] | [[1,2],[3,4]] | Subtraímos cada entrada de B da correspondente em A.
Qual matriz é simétrica? | [[1,2],[2,4]] | [[1,2],[3,4]] | [[1,0,2]] | Ela é quadrada e a₁₂=a₂₁.
Quanto vale (Aᵀ)ᵀ? | A | −A | A² | Trocar os índices duas vezes devolve cada posição original.
Em que posição fica a₂₃ após transpor? | Linha 3, coluna 2 | Linha 2, coluna 3 | Linha 3, coluna 3 | A transposta troca a ordem dos dois índices.
Podemos somar usualmente matrizes 2×3 e 3×2? | Não | Sim | Só se todas as entradas forem positivas | A quantidade total de entradas é igual, mas as dimensões não coincidem.`,
	}),
	lesson({
		n: 57,
		title: "Produto matricial: linha encontra coluna",
		goal: "Calcular produtos compatíveis e refutar comutatividade geral.",
		prereq: "Matrizes, somas e multiplicações reais.",
		hook: "Uma tabela diz quantas unidades de cada recurso um projeto utiliza; outra diz o custo unitário em cada cenário fictício. Para obter o total por projeto e cenário, é preciso somar produtos de quantidades e custos. Esse encontro é linha com coluna.",
		concept:
			"Se A é m×n e B é n×p, AB existe e tem dimensão m×p. A entrada (AB)ᵢⱼ é a soma aᵢ₁b₁ⱼ+…+aᵢₙbₙⱼ. O número de colunas de A deve coincidir com o de linhas de B. Em geral AB≠BA; às vezes BA nem está definido. A identidade satisfaz AI=A e IA=A com ordens compatíveis.",
		why: "Cada linha de A fornece pesos para os termos de cada coluna de B. A soma de produtos combina todas as contribuições intermediárias. A associatividade (AB)C=A(BC) em dimensões compatíveis vem da distributividade das somas finitas. Comutatividade não é garantida porque trocar a ordem muda os papéis das linhas e colunas.",
		example: [
			"Multiplique A=[[1,2],[0,1]] por B=[[2,0],[3,1]]. Primeira linha × primeira coluna: 1·2+2·3=8. Primeira linha × segunda coluna: 1·0+2·1=2.",
			"Segunda linha × primeira coluna: 0·2+1·3=3. Segunda linha × segunda coluna: 0·0+1·1=1. Logo AB=[[8,2],[3,1]].",
			"Invertendo a ordem, BA=[[2,4],[3,7]]. As matrizes diferem, embora ambos os produtos existam. Esse é um contraexemplo explícito à comutatividade geral.",
		],
		trap: "Produto usual de matrizes não é multiplicação de entradas correspondentes. E ‘as duas são quadradas’ não garante que comutem. Antes de calcular, anote as dimensões intermediárias para detectar produtos impossíveis.",
		transfer:
			"Uma aplicação precisa explicar o que é somado em cada entrada. Nos custos fictícios, unidades de recurso vezes custo por unidade produzem custo total; conferir unidades ajuda a avaliar a ordem das matrizes. Faça a conta de uma entrada por extenso antes de usar o esquema compacto.",
		quiz: `Se A é 2×3 e B é 3×4, qual é a dimensão de AB? | 2×4 | 3×3 | 4×2 | As dimensões internas coincidem e as externas formam a dimensão do resultado.
Se A é 2×3 e B é 2×2, AB existe? | Não | Sim | Só se A tiver zeros | As três colunas de A não coincidem com as duas linhas de B.
Qual é a regra de uma entrada de AB? | Soma dos produtos de uma linha de A por uma coluna de B | Produto das entradas de mesma posição | Soma de uma coluna de A com uma linha de B | A definição combina todos os índices intermediários.
No exemplo, qual é (AB)₁₁? | 8 | 2 | 3 | 1·2+2·3=8.
No exemplo, qual é (AB)₁₂? | 2 | 0 | 4 | 1·0+2·1=2.
Qual é AB no exemplo? | [[8,2],[3,1]] | [[2,0],[0,1]] | [[2,4],[3,7]] | Cada entrada vem da respectiva combinação linha–coluna.
Qual é BA no exemplo? | [[2,4],[3,7]] | [[8,2],[3,1]] | [[2,2],[3,1]] | Inverter a ordem muda as combinações e os valores.
Em geral AB=BA? | Não | Sim | Só porque ambas são matrizes | O exemplo fornece dois produtos diferentes, refutando a regra universal.
Quanto vale AIₙ para A com n colunas? | A | Iₙ | Aᵀ | A identidade seleciona as próprias entradas de cada linha.
Uma matriz 1×3 vezes uma 3×1 produz qual tipo de resultado? | Matriz 1×1 | Matriz 3×3 | Matriz 3×1 | As dimensões externas são 1 e 1; o único elemento é uma soma de três produtos.`,
	}),
	lesson({
		n: 58,
		title: "Determinantes 2×2 e 3×3",
		goal: "Calcular determinantes por fórmulas diretas e regra de Sarrus.",
		prereq: "Matrizes quadradas e operações com sinais.",
		hook: "Uma matriz inteira pode receber um único número que ajuda a dizer se ela admite inversa. Mas esse número não é a soma das entradas. No caso 2×2, dois produtos disputam o resultado; no 3×3, uma organização de seis produtos evita perder sinais.",
		concept:
			"Para A=[[a,b],[c,d]], detA=ad−bc. Para A=[[a,b,c],[d,e,f],[g,h,i]], detA=aei+bfg+cdh−ceg−bdi−afh. A regra de Sarrus organiza esses seis produtos repetindo as duas primeiras colunas à direita. Ela é específica para 3×3; não a estenda a 4×4. Determinantes são definidos aqui para matrizes quadradas.",
		why: "Em 2×2, ad−bc mede a área orientada do paralelogramo das colunas: zero indica direções dependentes. A fórmula pode ser demonstrada decompondo a área ou usando base×altura com coordenadas. Em 3×3, os seis termos da expressão definem a regra usada; Sarrus apenas os organiza, sem criar novos produtos. Propriedades gerais e cofatores não são prioridade da P3 2025.2 conforme o acervo.",
		example: [
			"Calcule detA para A=[[1,2,0],[0,3,1],[2,0,1]]. Os produtos somados são 1·3·1=3, 2·1·2=4 e 0·0·0=0.",
			"Os produtos subtraídos são 0·3·2=0, 2·0·1=0 e 1·1·0=0.",
			"Portanto detA=3+4+0−0−0−0=7. Para B=[[2,1],[3,4]], detB=2·4−1·3=5.",
		],
		trap: "Em ad−bc, a subtração é parte da definição e não uma soma de diagonais. Na regra de Sarrus, calcule cada produto com seus sinais antes de subtrair o grupo. Uma entrada negativa pode transformar uma subtração de produto negativo em adição.",
		transfer:
			"Use a fórmula com letras como legenda permanente ao lado do cálculo. Depois confira cada entrada pela sua linha e coluna. O determinante será o teste inicial para a existência de inversa, mas não é ele próprio a matriz inversa.",
		quiz: `Qual é det[[2,1],[3,4]]? | 5 | 11 | −5 | O cálculo é 2·4−1·3=8−3=5.
Qual é det[[1,2],[2,4]]? | 0 | 8 | −4 | 1·4−2·2=0.
Qual é det[[1,−2],[3,4]]? | 10 | −2 | 2 | 1·4−(−2)·3=4+6=10.
Qual é det[[1,2,0],[0,3,1],[2,0,1]]? | 7 | 3 | −1 | Os produtos positivos somam 7 e os subtraídos somam zero.
Qual é o produto aei na matriz do exemplo? | 3 | 4 | 0 | a=1,e=3,i=1, portanto aei=3.
Qual é o produto bfg no exemplo? | 4 | 3 | 0 | b=2,f=1,g=2, portanto bfg=4.
A regra de Sarrus ensinada vale diretamente para qual ordem? | 3×3 | Qualquer ordem | Apenas 2×2 | Repetir colunas como em Sarrus não fornece o determinante de uma matriz 4×4.
Qual é detI₂? | 1 | 0 | 2 | 1·1−0·0=1.
Qual é det[[k,1],[2,1]]? | k−2 | k+2 | 2k−1 | Use ad−bc: k·1−1·2.
Para qual k a matriz anterior tem determinante zero? | 2 | −2 | 0 | A equação k−2=0 dá k=2.`,
	}),
	lesson({
		n: 59,
		title: "Inversas 2×2 e 3×3: conferir é parte da solução",
		goal: "Determinar invertibilidade e construir inversas sem cofatores.",
		prereq: "Produto matricial, determinantes e sistemas lineares.",
		hook: "Desfazer uma transformação matricial exige uma matriz de volta. Dividir cada entrada por ela mesma não resolve; a inversa deve produzir identidade pelo produto linha–coluna. A verificação é o teste que não aceita desculpas de sinal.",
		concept:
			"Uma matriz quadrada real A é invertível se, e somente se, detA≠0. Sua inversa satisfaz AA⁻¹=A⁻¹A=I. Para 2×2, A⁻¹=(1/(ad−bc))[[d,−b],[−c,a]]. Para 3×3, resolva A v₁=e₁, A v₂=e₂ e A v₃=e₃, usando as colunas da identidade como lados direitos; reúna as soluções em colunas. Isso equivale a reduzir [A | I] até [I | A⁻¹] por operações reversíveis de linhas.",
		why: "No caso 2×2, multiplicar A por [[d,−b],[−c,a]] produz (ad−bc)I, provando a fórmula quando o determinante não zera. Para o método por colunas, AX=I significa exatamente A vⱼ=eⱼ para cada coluna de X. Como operações elementares de linha são reversíveis, aplicar as mesmas operações a A e I constrói uma matriz que desfaz A. O critério geral do determinante é usado aqui como teorema; sua demonstração completa pertence ao estudo de Álgebra Linear, além do recorte de propriedades de determinantes desta unidade.",
		example: [
			"Em A=[[2,1],[1,1]], detA=1. A fórmula fornece A⁻¹=[[1,−1],[−1,2]]. Multiplicar nos dois sentidos dá I₂.",
			"Para B=[[1,1,0],[0,1,1],[0,0,1]], resolva B(x,y,z)ᵀ=(u,v,w)ᵀ: z=w; y=v−w; x=u−v+w.",
			"Para lados direitos e₁,e₂,e₃, as colunas resultantes são (1,0,0),(−1,1,0),(1,−1,1). Logo B⁻¹=[[1,−1,1],[0,1,−1],[0,0,1]]. Conferindo BB⁻¹ e B⁻¹B, cada linha×coluna fornece os uns diagonais e os zeros externos.",
		],
		trap: "A⁻¹ não é a matriz dos recíprocos das entradas. Entradas zero são permitidas em uma matriz invertível; o que não pode ser zero é seu determinante. Se o sistema para alguma coluna da identidade não tiver solução, não há inversa completa.",
		transfer:
			"Para qualquer inversa candidata, faça pelo menos o produto inteiro com A e confirme identidade; os dois sentidos ficam explícitos nos exemplos. Em uma solução discursiva, mostre determinante, método, matriz candidata e verificação. O procedimento 3×3 não depende de cofatores.",
		quiz: `Qual condição caracteriza invertibilidade de uma matriz quadrada real? | detA≠0 | Todas as entradas não nulas | detA=0 | O determinante não nulo é o critério; entradas individuais podem ser zero.
Qual é a inversa de [[2,1],[1,1]]? | [[1,−1],[−1,2]] | [[1/2,1],[1,1]] | [[2,−1],[−1,1]] | O determinante é 1; trocamos os elementos diagonais e negamos os outros.
Qual é o produto de A por A⁻¹? | I | Matriz nula | A² | Pela definição, a inversa desfaz A e produz a identidade.
[[1,2],[2,4]] tem inversa? | Não | Sim | Só porque não tem zeros | Seu determinante é 4−4=0.
Para B do exemplo, qual é a solução de B(x,y,z)ᵀ=(u,v,w)ᵀ para z? | z=w | z=u | z=v−w | A última linha da equação é z=w.
No mesmo sistema, quanto vale y? | v−w | v+w | u−v | A segunda linha diz y+z=v e z=w.
No mesmo sistema, quanto vale x? | u−v+w | u+v+w | u−v−w | A primeira linha é x+y=u; substituindo y=v−w dá x=u−v+w.
Qual é a segunda coluna de B⁻¹ no exemplo? | (−1,1,0)ᵀ | (1,−1,1)ᵀ | (0,1,1)ᵀ | Use (u,v,w)=(0,1,0) nas fórmulas de x,y,z.
Qual é a terceira coluna de B⁻¹? | (1,−1,1)ᵀ | (0,0,1)ᵀ | (−1,1,0)ᵀ | Use (u,v,w)=(0,0,1), obtendo x=1,y=−1,z=1.
O que acompanha A na matriz aumentada usada para inverter? | A identidade da mesma ordem | A matriz nula | A transposta obrigatoriamente | Aplicar operações reversíveis à matriz aumentada de A e I até obter I à esquerda produz a inversa à direita.`,
	}),
	lesson({
		n: 60,
		title: "Missão final: ligar as três unidades",
		goal: "Integrar fundamentos, funções, trigonometria e matrizes em argumentos completos.",
		prereq: "Unidades 1, 2 e 3; retome os passos indicados pelos temas.",
		hook: "A última estação mistura conjuntos, uma parábola, um ângulo e uma matriz. Parece uma reunião de departamentos, mas todos compartilham o mesmo método: entender os objetos, declarar condições, calcular e justificar. A habilidade que atravessa a trilha é saber fazer essas perguntas.",
		concept:
			"Esta revisão autoral reúne habilidades das três unidades e não se apresenta como prova oficial. Em cada solução, explicite o universo, as restrições e a conclusão. Resultados iguais podem ter significados diferentes: uma raiz é entrada que zera uma função; um determinante é um número associado a uma matriz; um intervalo é um conjunto de entradas ou saídas conforme a pergunta.",
		why: "As conexões tornam o estudo verificável. O domínio de uma função racional usa conjuntos e equações; a imagem quadrática usa desigualdades; a relação trigonométrica fundamental usa a geometria do círculo; a inversa matricial usa sistemas. A técnica muda, mas a obrigação de justificar condições permanece.",
		example: [
			"Considere A(t)=[[1,t],[2,1]]. Temos detA(t)=1−2t. A inversa existe exatamente quando t≠1/2.",
			"A condição define o conjunto (−∞,1/2)∪(1/2,∞). Para t=0, A=[[1,0],[2,1]] e A⁻¹=[[1,0],[−2,1]].",
			"O produto nos dois sentidos é I₂. O argumento conectou parâmetro, equação linear, complemento de um ponto, determinante e produto matricial, sem precisar de uma regra nova.",
		],
		trap: "Terminar a trilha não elimina a necessidade de revisão espaçada. Se você lembra a fórmula, mas não sabe dizer suas condições, o conhecimento ainda está frágil. Escolha erros que revelam uma decisão a corrigir, e não apenas questões que permitem repetir contas já confortáveis.",
		transfer:
			"Roteiro de revisão: explique um conceito sem consulta, resolva um exercício de outra unidade e depois volte ao primeiro tema. Produza uma pequena solução discursiva por unidade e confira domínio, cálculo e conclusão. A jornada termina aqui no mapa, mas a exploração matemática não precisa de créditos finais.",
		quiz: `Qual é o domínio real de 1/(x−1)? | ℝ sem 1 | ℝ | [1,∞) | A divisão exige x−1≠0; a restrição usa a linguagem de conjuntos.
Quanto vale log₂16+ln e? | 5 | 4 | 6 | log₂16=4 e ln e=1.
Qual é a solução real de x⁴−5x²+4=0? | {−2,−1,1,2} | {1,4} | {−4,−1,1,4} | Com t=x², as raízes t=1,4 retornam a x=±1,±2.
Qual é a imagem de (x−2)²−1 em ℝ? | [−1,∞) | [2,∞) | ℝ | O vértice (2,−1) fornece o mínimo −1.
Para f(x)=x² e g(x)=x+1, quanto vale f(g(2))? | 9 | 5 | 8 | Primeiro g(2)=3; depois f(3)=9.
Quanto vale sen(5π/6)? | 1/2 | −1/2 | √3/2 | O ângulo tem referência π/6 e está no segundo quadrante, com seno positivo.
Em qual entrada a tangente está indefinida? | π/2 | 0 | π/4 | O cosseno de π/2 é zero, proibindo o quociente.
Qual é det[[1,t],[2,1]]? | 1−2t | 1+2t | 2−t | Aplicar ad−bc dá 1·1−t·2.
Para quais t a matriz anterior admite inversa? | t≠1/2 | t=1/2 | Todos os reais | O determinante precisa ser não nulo: 1−2t≠0.
Qual é a inversa de [[1,0],[2,1]]? | [[1,0],[−2,1]] | [[1,0],[2,1]] | [[1,2],[0,1]] | O determinante vale 1 e a fórmula dá a matriz indicada; os produtos de ida e volta são I₂.`,
	}),
];
