// Leitura verbal das fórmulas e dicas de método, sem indicar uma alternativa.
const rows = [
	[
		"a∈A",
		"O objeto a pertence ao conjunto A.",
		"Leia as chaves e identifique os objetos distintos antes de contar ou comparar.",
	],
	[
		"ℕ⊂ℤ⊂ℚ⊂ℝ",
		"Naturais estão contidos nos inteiros, nos racionais e nos reais.",
		"Simplifique o número e tente escrevê-lo como fração de inteiros antes de classificá-lo.",
	],
	[
		"A⊆B ⇔ ∀x∈A, x∈B",
		"A está contido em B se todo elemento de A também pertence a B.",
		"Verifique se a comparação envolve um elemento ou um conjunto; um contraexemplo basta para refutar inclusão.",
	],
	[
		"Aᶜ=U∖A",
		"O complemento de A no universo U contém os elementos de U que não estão em A.",
		"Teste separadamente a presença de cada elemento nos dois conjuntos e confira qual operação foi pedida.",
	],
	[
		"|A∪B|=|A|+|B|−|A∩B|",
		"A quantidade de elementos da união é a soma das quantidades menos a interseção.",
		"Separe as regiões só A, ambos e só B; em subconjuntos, conte duas escolhas por elemento.",
	],
	[
		"(a,b]={x∈ℝ:a<x≤b}",
		"O intervalo aberto em a e fechado em b contém os reais maiores que a e menores ou iguais a b.",
		"Teste cada extremo na condição original e diferencie ‘e’, que exige os dois testes, de ‘ou’.",
	],
	[
		"a⁻ⁿ=1/aⁿ, a≠0",
		"Uma potência de expoente negativo é o recíproco da potência correspondente; a base não pode ser zero.",
		"Desmonte a potência em fatores quando possível e confira se o sinal pertence à base.",
	],
	[
		"aʳaˢ=aʳ⁺ˢ, a>0",
		"O produto de potências da mesma base positiva soma os expoentes.",
		"Distinga soma de números de produto de potências; para radicais, use a raiz principal.",
	],
	[
		"logₐb=c ⇔ aᶜ=b",
		"O logaritmo de b na base a é c exatamente quando a elevado a c é b.",
		"Traduza a pergunta para uma potência e confira base positiva diferente de um e argumento positivo.",
	],
	[
		"logₐ(xy)=logₐx+logₐy",
		"O logaritmo de um produto positivo é a soma dos logaritmos, numa base admissível.",
		"Identifique se o argumento é produto, quociente ou potência; soma de argumentos não tem a mesma regra.",
	],
	[
		"ax+b=0 ⇒ x=−b/a, a≠0",
		"Na equação linear com coeficiente a não nulo, x é menos b dividido por a.",
		"Faça a mesma operação nos dois membros e separe o caso de coeficiente da incógnita igual a zero.",
	],
	[
		"S={(x,y):as duas equações são verdadeiras}",
		"A solução do sistema reúne os pares que satisfazem simultaneamente as duas equações.",
		"Elimine uma incógnita e interprete a igualdade restante: informação, identidade ou contradição.",
	],
	[
		"x=(−b±√Δ)/(2a)",
		"As raízes quadráticas reais são menos b, mais ou menos a raiz de delta, tudo dividido por duas vezes a.",
		"Escolha fatoração ou fórmula geral e confira os sinais de b e c antes de calcular.",
	],
	[
		"Δ=b²−4ac",
		"Delta é b ao quadrado menos quatro vezes a vezes c.",
		"Confira se a equação continua quadrática e traduza a quantidade de raízes pedida numa condição sobre delta.",
	],
	[
		"t=x²≥0",
		"A substituição t igual a x ao quadrado exige t não negativo no universo real.",
		"Resolva em t, descarte valores negativos e volte a x, incluindo os dois sinais quando cabível.",
	],
	[
		"a<b, c<0 ⇒ ac>bc",
		"Multiplicar uma desigualdade por um número negativo inverte seu sentido.",
		"Observe qual operação está sendo feita; só multiplicação ou divisão por negativo inverte a ordem.",
	],
	[
		"(x−r)(x−s)≤0, r<s ⇒ x∈[r,s]",
		"Um produto de dois fatores lineares com raízes r e s ordenadas é não positivo entre as raízes, incluindo os extremos.",
		"Ordene os zeros, determine o sinal em cada intervalo e confira se a igualdade foi permitida.",
	],
	[
		"(x−r)²≥0",
		"O quadrado de x menos r é sempre não negativo.",
		"Confira as multiplicidades: uma raiz par não troca sinal, mas continua sendo zero da expressão.",
	],
	[
		"N(x)/D(x): D(x)≠0",
		"Uma fração algébrica só está definida quando seu denominador não é zero.",
		"Anote primeiro os pontos proibidos; cancelamento de fatores não elimina restrições originais.",
	],
	[
		"Hipóteses → método → verificação → solução",
		"Uma solução organizada declara hipóteses, desenvolve o método, verifica e conclui.",
		"Identifique qual ferramenta da unidade responde à pergunta e escreva o conjunto solução no universo pedido.",
	],
	[
		"P(x)=aₙxⁿ+⋯+a₀",
		"Um polinômio é uma soma finita de coeficientes reais multiplicando potências inteiras não negativas.",
		"Ordene por potências e insira coeficientes zero nos termos ausentes antes de ler o grau.",
	],
	[
		"axᵏ+bxᵏ=(a+b)xᵏ",
		"Termos da mesma potência podem ter seus coeficientes somados.",
		"Alinhe termos semelhantes e distribua o sinal negativo por todo o parêntese.",
	],
	[
		"(a+b)²=a²+2ab+b²",
		"O quadrado de uma soma tem dois quadrados e o termo central duas vezes a vezes b.",
		"Expanda pela distributiva para conferir o termo central, especialmente quando houver um sinal de menos.",
	],
	[
		"ax+ay=a(x+y)",
		"Um fator comum pode ser colocado em evidência.",
		"Procure fator comum, produtos notáveis ou agrupamentos e confira expandindo o produto obtido.",
	],
	[
		"P(r)=0 ⇔ (x−r) divide P",
		"Um número r é raiz de P exatamente quando x menos r é fator do polinômio.",
		"Leia zeros pelos fatores e diferencie raízes distintas das contadas com multiplicidade.",
	],
	[
		"P=DQ+R",
		"O dividendo é igual ao divisor vezes o quociente mais o resto.",
		"Mantenha as colunas das potências e use a identidade da divisão para conferir a resposta.",
	],
	[
		"R=P(a) ao dividir por x−a",
		"O resto da divisão por x menos a é o valor do polinômio em a.",
		"Encontre o zero do divisor linear antes de avaliar o polinômio.",
	],
	[
		"Baixar → multiplicar por a → somar",
		"Ruffini repete as operações baixar, multiplicar pelo zero do divisor e somar.",
		"Escreva todos os coeficientes e lembre que o último número da linha é o resto.",
	],
	[
		"p divide a₀; q divide aₙ",
		"Numa raiz racional reduzida p sobre q de um polinômio inteiro, p divide o termo constante e q divide o coeficiente líder.",
		"Liste candidatos em forma reduzida e teste cada um; candidato não significa raiz confirmada.",
	],
	[
		"P(x)=a∏(x−rᵢ)ᵐⁱ",
		"A forma fatorada combina uma escala e fatores associados às raízes e suas multiplicidades.",
		"Confira raízes, multiplicidades, grau e escala antes de expandir.",
	],
	[
		"|A×B|=|A|·|B|",
		"A quantidade de pares de dois conjuntos finitos é o produto de suas cardinalidades.",
		"A primeira coordenada vem do primeiro conjunto e a segunda do segundo; a ordem dos pares importa.",
	],
	[
		"Cada x∈A tem exatamente um f(x)∈B",
		"Uma função associa exatamente uma saída válida a cada entrada do domínio.",
		"Confira existência e unicidade da saída para todas as entradas declaradas.",
	],
	[
		"Im(f)={f(x):x∈A}⊆B",
		"A imagem reúne as saídas alcançadas e está contida no contradomínio.",
		"Separe entradas permitidas, saídas anunciadas e saídas alcançadas; combine todas as restrições de domínio.",
	],
	[
		"Bijetora = injetora e sobrejetora",
		"Uma bijeção não tem colisões e atinge todo o contradomínio.",
		"Pergunte separadamente se há duas entradas com a mesma saída e se sobrou saída sem preimagem.",
	],
	[
		"(f∘g)(x)=f(g(x))",
		"Na composição f de g, aplique g primeiro e depois f ao resultado.",
		"Calcule a expressão interna primeiro e confira se o resultado é entrada permitida da função seguinte.",
	],
	[
		"f⁻¹∘f=id_A; f∘f⁻¹=id_B",
		"As composições de uma bijeção com sua inversa são as identidades nos conjuntos correspondentes.",
		"Declare domínio e contradomínio, isole a entrada e confira as duas composições; inversa não é recíproco.",
	],
	[
		"f(x)=ax+b; a=Δy/Δx",
		"Uma função afim tem taxa constante a, obtida dividindo variação de saída por variação de entrada.",
		"Diferencie taxa de variação, intercepto e zero; para dois pontos, use variações na mesma ordem.",
	],
	[
		"xᵥ=−b/(2a); yᵥ=f(xᵥ)",
		"A entrada do vértice é menos b dividido por duas vezes a; a saída vem da substituição na função.",
		"Localize concavidade, zeros, intercepto e eixo de simetria antes de descrever o gráfico.",
	],
	[
		"f(x)=a(x−h)²+k",
		"Na forma canônica, o vértice tem coordenadas h e k.",
		"Use o sinal de a e confira se o vértice pertence ao domínio; em domínio restrito, avalie os extremos permitidos.",
	],
	[
		"Domínio + regra + contradomínio",
		"A função é especificada pelos conjuntos e pela regra de associação.",
		"Combine a forma algébrica com os conjuntos declarados antes de classificar, inverter ou encontrar a imagem.",
	],
	[
		"Par: f(−x)=f(x); ímpar: f(−x)=−f(x)",
		"Funções pares preservam a saída ao trocar o sinal da entrada; ímpares trocam também o sinal da saída.",
		"Verifique a simetria do domínio e substitua menos x na expressão inteira.",
	],
	[
		"Entrada → intervalo → regra",
		"Numa função por partes, localize a entrada no intervalo antes de escolher a expressão.",
		"Teste o valor de x nas condições dos ramos, observando os extremos abertos e fechados.",
	],
	[
		"f(x+T)=f(x), T>0",
		"Um período positivo preserva todas as saídas após o mesmo deslocamento.",
		"Verifique o padrão em todo o domínio; valores iguais em dois pontos não provam periodicidade.",
	],
	[
		"f(x)=aˣ>0, a>0, a≠1",
		"Uma exponencial básica de base positiva diferente de um tem valores sempre positivos.",
		"Confira se a base está acima de um ou entre zero e um e diferencie assíntota de valor atingido.",
	],
	[
		"ln(eˣ)=x; e^(ln x)=x para x>0",
		"A exponencial natural e o logaritmo natural são inversos, respeitando o argumento positivo do logaritmo.",
		"Troque entrada e saída da exponencial e acompanhe a troca de domínio e imagem.",
	],
	[
		"N(t)=N₀aᵗ",
		"Um modelo multiplicativo aplica o mesmo fator a cada unidade de tempo.",
		"Divida pelo valor inicial, isole a potência e confira se o tempo pedido é real ou inteiro.",
	],
	[
		"senθ=oposto/hipotenusa",
		"O seno de um ângulo agudo é a razão entre cateto oposto e hipotenusa.",
		"Marque o ângulo escolhido antes de nomear os catetos e identifique a hipotenusa pelo ângulo reto.",
	],
	[
		"θ=s/r; π rad=180°",
		"O ângulo em radianos é arco dividido pelo raio; pi radianos equivalem a cento e oitenta graus.",
		"Escreva a unidade original e multiplique pelo fator de conversão correto, conservando o sinal.",
	],
	[
		"P(θ)=(cosθ,senθ)",
		"O ponto do ciclo unitário tem cosseno na coordenada horizontal e seno na vertical.",
		"Localize o quadrante, escolha o ângulo de referência e atribua os sinais às duas coordenadas.",
	],
	[
		"tanθ=senθ/cosθ",
		"A tangente é seno dividido por cosseno, onde o cosseno não é zero.",
		"Escreva a razão usando seno e cosseno e confira o denominador antes de dividir.",
	],
	[
		"sen²θ+cos²θ=1",
		"A soma dos quadrados do seno e do cosseno é um.",
		"Use a relação fundamental e só divida por fatores não nulos; o quadrante determina o sinal de uma raiz.",
	],
	[
		"sen(α+β)=senα cosβ+cosα senβ",
		"O seno de uma soma é a soma dos produtos cruzados de seno e cosseno.",
		"Decomponha o ângulo em notáveis e escreva a fórmula completa antes de substituir números.",
	],
	[
		"T_sen=T_cos=2π; T_tan=π",
		"Os períodos fundamentais do seno e cosseno são duas vezes pi; o da tangente é pi.",
		"Diferencie propriedades das coordenadas seno e cosseno das propriedades do quociente tangente.",
	],
	[
		"tan(−θ)=−tanθ no domínio",
		"A tangente é ímpar nas entradas em que está definida.",
		"Converta a unidade, reduza voltas, determine o quadrante e só então calcule a razão.",
	],
	[
		"A=(aᵢⱼ) de dimensão m×n",
		"Uma matriz m por n tem m linhas e n colunas; os índices informam linha primeiro e coluna depois.",
		"Leia a dimensão e localize primeiro a linha do índice, depois a coluna.",
	],
	[
		"(Aᵀ)ᵢⱼ=aⱼᵢ",
		"A transposta troca os índices de linha e coluna.",
		"Para somar, confira dimensões; para transpor, troque linhas por colunas sem inverter a ordem dentro delas.",
	],
	[
		"(AB)ᵢⱼ=Σₖ aᵢₖbₖⱼ",
		"Uma entrada do produto é a soma dos produtos da linha correspondente pela coluna correspondente.",
		"Confira dimensões internas iguais e calcule uma linha do primeiro fator com uma coluna do segundo.",
	],
	[
		"det[[a,b],[c,d]]=ad−bc",
		"O determinante dois por dois é a vezes d menos b vezes c.",
		"Calcule cada produto com seu sinal antes de subtrair; em três por três, organize os seis produtos de Sarrus.",
	],
	[
		"AA⁻¹=A⁻¹A=I",
		"Multiplicar uma matriz invertível por sua inversa nos dois sentidos produz a identidade.",
		"Verifique determinante não nulo e confira a matriz candidata com o produto linha por coluna.",
	],
	[
		"detA(t)≠0 define os parâmetros invertíveis",
		"Os valores de parâmetro que dão determinante não nulo são os que tornam a matriz invertível.",
		"Identifique o tipo de objeto pedido e conecte a técnica apropriada às condições da expressão original.",
	],
];
if (rows.length !== 60) throw new Error("Faltam roteiros editoriais.");
export const roteiro = (n) => ({
	formula: rows[n - 1][0],
	leitura: rows[n - 1][1],
	dica: rows[n - 1][2],
});
