import { lesson } from "./estrutura.mjs";
export default [
	lesson({
		n: 41,
		title: "Simetria: o espelho precisa de domínio",
		goal: "Distinguir funções pares, ímpares e sem essas simetrias.",
		prereq: "Funções, polinômios e substituição com sinais.",
		hook: "Um gráfico parece um espelho. Mas será que é simétrico no eixo vertical ou em torno da origem? E se alguém recortar metade do domínio? A aparência dá pistas; substituir −x e conferir as entradas dá a decisão.",
		concept:
			"Com domínio simétrico em relação a zero, f é par se f(−x)=f(x), e ímpar se f(−x)=−f(x), para todo x do domínio. Pares têm simetria no eixo y; ímpares, na origem. Uma função pode ser nenhuma das duas. A função nula em domínio simétrico é simultaneamente par e ímpar.",
		why: "Trocar x por −x reflete horizontalmente os pontos. Para função par, a saída permanece; para ímpar, também troca de sinal. Um polinômio real em ℝ é par quando só tem potências pares com coeficientes não nulos; é ímpar quando só tem potências ímpares, sem constante não nula. Isso decorre de (−x)ⁿ=(−1)ⁿxⁿ.",
		example: [
			"Para f(x)=x⁴−3x²+2 em ℝ, calcule f(−x)=(−x)⁴−3(−x)²+2.",
			"Como os expoentes são pares, o resultado é x⁴−3x²+2=f(x). A função é par.",
			"Já g(x)=x³+x é ímpar: g(−x)=−x³−x=−g(x). Em h(x)=x²+x, a substituição não dá nem h(x) nem −h(x) para todo x.",
		],
		trap: "O expoente de um único termo não classifica toda a expressão. Além disso, f(x)=x² com domínio [0,∞) não é par pela definição adotada: o domínio não é simétrico. O desenho recortado perdeu o espelho.",
		transfer:
			"Descreva simetria por uma igualdade, não só por um adjetivo. Testes em alguns pontos podem refutar paridade, mas não a provam em domínio infinito. Use a transformação simbólica para cobrir todas as entradas.",
		quiz: `f(x)=x⁴−3x²+2 em ℝ é qual tipo? | Par | Ímpar | Nenhuma | Todos os expoentes são pares, incluindo o expoente zero da constante.
g(x)=x³+x em ℝ é qual tipo? | Ímpar | Par | Nenhuma | g(−x)=−x³−x=−g(x).
h(x)=x²+x em ℝ é qual tipo? | Nem par nem ímpar | Par | Ímpar | h(−x)=x²−x não é identicamente igual a h(x) nem a −h(x).
Qual igualdade define função par? | f(−x)=f(x) | f(−x)=−f(x) | f(x)=x | A reflexão da entrada preserva a saída.
Qual simetria corresponde à função ímpar? | Em relação à origem | Apenas em relação ao eixo y | Apenas em relação ao eixo x | O ponto (x,y) acompanha (−x,−y).
Qual condição sobre o domínio vem antes da classificação? | Ser simétrico em relação a zero | Conter apenas positivos | Ser finito | Se x está no domínio, −x também precisa estar.
f(x)=x² em [0,∞) é par nesta trilha? | Não | Sim | Só por ter expoente par | O domínio não é simétrico em relação a zero.
Como classificar f(x)=0 em ℝ? | Par e ímpar | Só par | Só ímpar | Zero satisfaz simultaneamente f(−x)=f(x)=−f(x).
Se f é ímpar e 0 está no domínio, quanto vale f(0)? | 0 | 1 | Não é possível concluir | f(0)=−f(0) implica 2f(0)=0.
Uma função constante não nula em ℝ é qual tipo? | Par e não ímpar | Ímpar e não par | Nem par nem ímpar | A saída não muda com x, mas não é igual ao próprio oposto.`,
	}),
	lesson({
		n: 42,
		title: "Funções por partes: escolha o ramo antes da conta",
		goal: "Avaliar e esboçar funções definidas por intervalos.",
		prereq: "Intervalos e gráficos afins e quadráticos.",
		hook: "Uma sala tem uma regra de acesso antes do meio-dia e outra depois. Você não aplica as duas ao mesmo instante: primeiro localiza o horário, depois segue a regra. Funções por partes pedem exatamente essa ordem.",
		concept:
			"Uma função por partes associa expressões diferentes a regiões do domínio. Os intervalos indicam qual expressão usar. Cada entrada deve ter uma única saída; sobreposição de regras com resultados diferentes viola a definição. No gráfico, ponto fechado indica extremo incluído e ponto aberto, excluído. Lacunas de domínio devem ser explicitadas.",
		why: "Considere f(x)=x+1 para x<0 e f(x)=x² para x≥0. O conjunto dos dois intervalos cobre ℝ e eles não se sobrepõem. Para x=0 só a segunda regra vale: f(0)=0. O primeiro ramo se aproxima do ponto (0,1), que é aberto; isso não o transforma em valor da função no zero.",
		example: [
			"Avalie a função do conceito em x=−2,0,2. Para −2, use o ramo x<0: f(−2)=−2+1=−1.",
			"Para 0, use x≥0: f(0)=0²=0. Para 2, o mesmo ramo dá f(2)=4.",
			"No esboço, trace y=x+1 só à esquerda de zero, com (0,1) aberto; trace a metade de y=x² com x≥0, incluindo (0,0).",
		],
		trap: "Não escolha o ramo pelo sinal do resultado. Escolha pelo valor da entrada. E um círculo aberto no gráfico de um ramo não significa necessariamente que a entrada está fora do domínio: outro ramo pode defini-la em outra altura.",
		transfer:
			"Funções por partes podem modelar faixas de acesso, tabelas de uso de equipamentos e regras administrativas fictícias. Escreva o domínio como união dos intervalos e confira se há sobreposição ou lacuna antes de calcular valores.",
		quiz: `Se f(x)=x+1 para x<0 e x² para x≥0, quanto vale f(−2)? | −1 | 4 | 3 | A entrada −2 pertence ao primeiro ramo, dando −2+1=−1.
Na mesma função, quanto vale f(0)? | 0 | 1 | Não definido | O símbolo ≥ inclui zero no segundo ramo.
Quanto vale f(2)? | 4 | 3 | −1 | A entrada 2 usa a expressão x².
Qual ponto fica aberto no ramo x+1 do exemplo? | (0,1) | (0,0) | (−1,0) | A fórmula x+1 vale apenas para x<0; seu extremo em x=0 não entra.
Qual ponto fica fechado em x=0? | (0,0) | (0,1) | Nenhum | O segundo ramo inclui zero e produz a saída zero.
O que determina a escolha do ramo? | O intervalo da entrada | O sinal da saída desejada | O ramo com menor expressão | Primeiro localizamos x nas condições do domínio.
Regras f(x)=0 para x≤1 e f(x)=2 para x≥1 definem uma função em ℝ? | Não | Sim | Só se os ramos forem desenhados separados | Em x=1 as regras dão duas saídas diferentes.
Regras só para x<0 e x>0 cobrem qual domínio? | ℝ sem 0 | ℝ | Apenas {0} | Nenhum ramo inclui zero.
Se dois ramos se sobrepõem mas dão sempre o mesmo valor na sobreposição, há conflito de unicidade? | Não | Sim | Apenas se houver infinitos pontos | A mesma entrada continua com uma única saída, embora a escrita seja redundante.
Um círculo aberto em (1,3) impede f(1)=2 por outro ramo? | Não | Sim | Impede qualquer saída em x=1 | O círculo exclui aquele ponto específico, não toda a vertical.`,
	}),
	lesson({
		n: 43,
		title: "Periodicidade: repetir exige uma regra",
		goal: "Reconhecer períodos, período fundamental e limites da observação.",
		prereq: "Funções e leitura de padrões.",
		hook: "Uma rotina de laboratório se repete em ciclos. Ver dois resultados iguais não prova que o ciclo inteiro voltou: pode ter sido coincidência. A periodicidade exige que toda a função aceite o mesmo deslocamento, não apenas um par de pontos.",
		concept:
			"T>0 é um período de f se o domínio é preservado por deslocamentos ±T e f(x+T)=f(x) para todo x do domínio. Quando existe o menor período positivo, ele é o período fundamental. Se T é período, múltiplos inteiros positivos de T também são. Funções constantes admitem qualquer T>0 e não têm menor período positivo.",
		why: "A igualdade pode ser aplicada sucessivamente: f(x+2T)=f((x+T)+T)=f(x+T)=f(x). Isso demonstra os múltiplos positivos. Em uma função constante, qualquer deslocamento mantém a saída; sempre podemos escolher T/2, impedindo um menor período positivo. Uma amostra finita não estabelece a regra em toda a reta.",
		example: [
			"Uma função em ℝ repete o bloco: valor 0 em [2k,2k+1) e valor 1 em [2k+1,2k+2), para todo inteiro k.",
			"Somar 2 mantém a posição dentro de blocos do mesmo tipo, portanto f(x+2)=f(x). Somar 1 troca os valores 0 e 1, então 1 não é período.",
			"O período fundamental é 2: um deslocamento entre 0 e 1 muda a saída perto de 1; entre 1 e 2, muda a saída em x=0. Todo T em (0,2) falha.",
		],
		trap: "O fato de f(0)=f(2) não torna 2 um período. Em f(x)=x²−2x, f(0)=f(2)=0, mas f(1)=−1 e f(3)=3. Para uma afirmação universal, um padrão observado precisa de justificativa que cubra todas as entradas.",
		transfer:
			"Periodicidade será a ponte para seno, cosseno e tangente. Antes de olhar fórmulas, descreva o que se repete, em qual domínio e após qual deslocamento. Em dados reais, ciclos podem ser aproximações; aqui estudamos igualdade matemática exata.",
		quiz: `Se T é período, qual igualdade vale para todas as entradas? | f(x+T)=f(x) | f(T)=0 | f(x+T)=T·f(x) | A função repete a saída após o deslocamento T.
Se 3 é período, qual também é período? | 6 | 1 | 3/2 | Aplicar duas vezes o deslocamento de 3 preserva a saída.
Uma função constante em ℝ tem menor período positivo? | Não | Sim, 1 | Sim, 0 | Todo T>0 é período e T/2 também; zero não é período positivo.
f(0)=f(2) prova que 2 é período? | Não | Sim | Apenas se f for contínua | É necessário verificar a igualdade para todo x, não só num ponto.
No bloco alternado 0 e 1 do exemplo, qual é o período fundamental? | 2 | 1 | 4 | Deslocar 2 repete o bloco; deslocamentos positivos menores falham.
Nesse exemplo, somar 1 faz o quê? | Troca 0 por 1 e 1 por 0 | Preserva sempre a saída | Deixa o domínio vazio | O deslocamento passa de uma metade do bloco à outra.
Qual função não é periódica em ℝ? | f(x)=x | f(x)=5 | O bloco alternado do exemplo | Se T>0, f(x+T)=x+T difere de x.
O período fundamental, quando existe, precisa ser qual? | O menor período positivo | Qualquer ponto de máximo | O maior período | Múltiplos de um período não têm maior valor, mas pode haver um menor positivo.
Qual exigência sobre o domínio é relevante? | Ele precisa admitir os deslocamentos usados | Precisa ser só [0,T] | Precisa ser finito | Comparar x e x+T exige entradas válidas e uma estrutura de repetição.
Se 2 é o período fundamental, 4 pode ser chamado de período? | Sim | Não | Só se a função for constante | O período fundamental é o menor, mas seus múltiplos também são períodos.`,
	}),
	lesson({
		n: 44,
		title: "Exponenciais: crescer, decair e nunca tocar zero",
		goal: "Descrever gráficos, domínio, imagem e assíntota de aˣ.",
		prereq: "Potências reais e função crescente ou decrescente.",
		hook: "Um arquivo dobrado a cada rodada e uma quantidade reduzida à metade têm curvas opostas, mas uma característica em comum: nenhum número finito de rodadas produz exatamente zero. A linha horizontal aparece como aproximação, não como destino alcançado.",
		concept:
			"Para a>0 e a≠1, f(x)=aˣ tem domínio ℝ, imagem (0,∞), intercepto (0,1) e assíntota horizontal y=0. Se a>1 é estritamente crescente; se 0<a<1 é estritamente decrescente. Na primeira, aˣ tende a 0 quando x vai para −∞; na segunda, quando x vai para +∞.",
		why: "aˣ é sempre positivo e cada y>0 tem o expoente x=logₐy, o que justifica a imagem. Se x₂>x₁, aˣ²/aˣ¹=a^(x₂−x₁). Essa razão é maior que 1 para a>1 e menor que 1 para 0<a<1, demonstrando a monotonia. Bases positivas garantem a definição para todo real x.",
		example: [
			"Compare f(x)=2ˣ e g(x)=(1/2)ˣ nos valores −1,0,1: f dá 1/2,1,2; g dá 2,1,1/2.",
			"Os gráficos passam por (0,1), são positivos e têm sentidos de monotonia opostos. Além disso, g(x)=f(−x), uma reflexão no eixo vertical.",
			"Nenhum gráfico passa por (x,0). A assíntota descreve valores cada vez mais próximos de zero em uma direção ilimitada, sem afirmar igualdade em uma entrada finita.",
		],
		trap: "A imagem não é [0,∞): zero não é atingido. Uma curva exponencial de base positiva também não passa pela origem. O modelo exponencial pode ser matematicamente definido em ℝ e fisicamente válido apenas num intervalo de tempo.",
		transfer:
			"Compare uma sequência linear 1,2,3,4 com uma exponencial 1,2,4,8 nos mesmos instantes. Explique a diferença entre acrescentar uma quantidade fixa e multiplicar por um fator fixo. Isso ajuda a interpretar modelos sem vender previsões ilimitadas.",
		quiz: `Qual é o domínio de 2ˣ? | ℝ | (0,∞) | [0,∞) | A base positiva admite todo expoente real.
Qual é a imagem de 2ˣ? | (0,∞) | [0,∞) | ℝ | Os valores são positivos e todo positivo é atingido.
Qual é o intercepto vertical de aˣ? | (0,1) | (0,0) | (1,0) | a⁰=1 para a>0.
Qual é a assíntota horizontal de 2ˣ? | y=0 | x=0 | y=1 | Quando x vai para −∞, os valores se aproximam de zero.
Como é a monotonia de (1/3)ˣ? | Estritamente decrescente | Estritamente crescente | Constante | A base está entre 0 e 1.
Quanto vale 2⁻¹? | 1/2 | −2 | 0 | Expoente negativo produz o recíproco.
Existe x real tal que 2ˣ=0? | Não | Sim, x=0 | Sim, x=−1 | Potências reais de base positiva são estritamente positivas.
Qual relação vale entre (1/2)ˣ e 2ˣ? | (1/2)ˣ=2⁻ˣ | (1/2)ˣ=−2ˣ | (1/2)ˣ=2ˣ/2 | A base recíproca equivale a trocar o sinal do expoente.
Se x₂>x₁ e a>1, como comparar aˣ² e aˣ¹? | aˣ²>aˣ¹ | aˣ²<aˣ¹ | São iguais | A função é estritamente crescente para base maior que 1.
O modelo dobrado a cada rodada tem qual mudança entre saídas consecutivas? | Razão constante 2 | Diferença constante 2 | Soma constante 2 | Crescimento exponencial mantém um fator multiplicativo, não um acréscimo fixo.`,
	}),
	lesson({
		n: 45,
		title: "Logarítmica: o gráfico de volta",
		goal: "Relacionar exponencial e logarítmica, incluindo eˣ e ln x.",
		prereq: "Logaritmos, exponenciais e função inversa.",
		hook: "A curva exponencial já sabe ir da rodada ao tamanho. A logarítmica responde o caminho de volta: do tamanho à rodada. Trocar as coordenadas transforma a tabela e também gira nossa interpretação de entradas e saídas.",
		concept:
			"f(x)=logₐx, a>0 e a≠1, tem domínio (0,∞), imagem ℝ, intercepto horizontal (1,0) e assíntota vertical x=0. É crescente para a>1 e decrescente para 0<a<1. É a inversa de aˣ. Em particular ln(eˣ)=x para x∈ℝ e e^(ln x)=x para x>0.",
		why: "O par (u,aᵘ) da exponencial corresponde a (aᵘ,u) da logarítmica, refletido em y=x. Domínio e imagem trocam de papel. Como aᵘ pode ser qualquer positivo e u pode ser qualquer real, obtemos os conjuntos declarados. Para base maior que 1, logₐx tende a −∞ quando x se aproxima de 0 pela direita.",
		example: [
			"Na exponencial 2ˣ, os pontos (−1,1/2),(0,1),(1,2) tornam-se (1/2,−1),(1,0),(2,1) em log₂x.",
			"Assim log₂(1/2)=−1 e log₂2=1. A curva cruza o eixo x em x=1 e não cruza o eixo y, pois x=0 é proibido.",
			"Para ln, o mesmo raciocínio fornece ln1=0 e ln e=1. A expressão e^(ln7) retorna 7 e ln(e⁻²) retorna −2.",
		],
		trap: "ln0 não é zero nem um número real muito negativo: não está definido. A assíntota indica um comportamento de aproximação. Esta etapa mantém domínio geral da função básica; cálculos elaborados de domínio de expressões logarítmicas ficam fora da prioridade da P3 2025.2 conforme o acervo.",
		transfer:
			"Desenhe a reta y=x e reflita três pontos da exponencial para construir a logarítmica. Escreva as coordenadas em texto junto ao desenho. É uma forma de visualizar inversas sem depender de um aplicativo ou de percepção de cor.",
		quiz: `Qual é o domínio de ln x? | (0,∞) | ℝ | [0,∞) | O argumento do logaritmo real deve ser positivo.
Qual é a imagem de ln x? | ℝ | (0,∞) | [0,∞) | Cada real u aparece como ln(eᵘ).
Qual é o intercepto horizontal de logₐx? | (1,0) | (0,1) | (0,0) | logₐ1=0.
Qual é a assíntota vertical da função logarítmica básica? | x=0 | y=0 | x=1 | O gráfico se aproxima do eixo y pelo lado positivo do domínio.
Quanto vale ln(e⁻²)? | −2 | 2 | e⁻² | ln desfaz a exponencial natural em todo expoente real.
Quanto vale e^(ln7)? | 7 | ln7 | e·7 | O argumento 7 é positivo, permitindo a composição inversa.
Quanto vale ln0 em ℝ? | Não está definido | 0 | −1 | Não há expoente real que faça eˣ=0.
Se (2,4) está em y=2ˣ, qual ponto correspondente está na inversa? | (4,2) | (−2,4) | (2,−4) | A inversão troca as coordenadas.
Como é a monotonia de log_(1/2)x? | Estritamente decrescente | Estritamente crescente | Constante | A função inversa mantém o sentido de monotonia da exponencial de base 1/2.
Qual é o ponto comum de todas as logarítmicas básicas admissíveis? | (1,0) | (0,1) | (e,1) | Toda base admissível elevada a zero produz 1, logo logₐ1=0.`,
	}),
	lesson({
		n: 46,
		title: "Modelos multiplicativos e tempo de espera",
		goal: "Resolver equações exponenciais simples e interpretar logaritmos em modelos.",
		prereq: "Inversão entre exponencial e logaritmo.",
		hook: "Um projeto de catalogação dobra o número de registros organizados a cada etapa de um modelo ideal. Outro perde metade dos arquivos pendentes por etapa. O desafio não é só calcular o tamanho: é descobrir quando uma meta será atingida e se o resultado cabe numa etapa inteira.",
		concept:
			"Um modelo multiplicativo pode ser N(t)=N₀aᵗ, com N₀>0 e a>0, a≠1. Para atingir M>0, resolva aᵗ=M/N₀, obtendo t=ln(M/N₀)/ln a. Se t representa etapas inteiras e se pede ‘ao menos’, compare inteiros e use o sentido de crescimento ou decaimento. O modelo não autoriza extrapolações ilimitadas.",
		why: "Dividir por N₀ isola a potência. Aplicar ln transforma ln(aᵗ)=t ln a; como a≠1, ln a≠0 e a divisão é válida. Esse argumento deriva a fórmula a partir das propriedades já demonstradas. Para a<1, o denominador é negativo, coerente com a redução multiplicativa.",
		example: [
			"Uma coleção fictícia começa com 50 registros e dobra por etapa: N(t)=50·2ᵗ. Para chegar a 400, resolva 2ᵗ=8.",
			"Como 8=2³, a meta exata ocorre em t=3. Pelo logaritmo: ln8/ln2=3.",
			"Se a meta for pelo menos 300 em etapas inteiras, N(2)=200 e N(3)=400. A primeira etapa admissível é 3, embora o instante real de igualdade esteja entre 2 e 3.",
		],
		trap: "Uma redução de 20% por etapa corresponde a fator 0,8, não −0,2. E duplicar a cada etapa não significa acrescentar sempre o mesmo número. Antes de calcular logaritmos, confira se as grandezas comparadas têm unidades compatíveis.",
		transfer:
			"Use exemplos em acervos, ambientes, redes ou culturas fictícias como modelos matemáticos, sem tomar os números como previsões reais. Declare o que o tempo mede, se ele é contínuo ou discreto e em que faixa a regra foi assumida.",
		quiz: `Em N(t)=50·2ᵗ, qual é o valor inicial? | 50 | 2 | 100 | N(0)=50·1=50.
Quanto vale N(3) nesse modelo? | 400 | 300 | 150 | 50·2³=50·8=400.
Em qual etapa exata N(t)=400? | 3 | 8 | 4 | A equação se reduz a 2ᵗ=8.
Qual é a primeira etapa inteira com N(t)≥300? | 3 | 2 | 6 | Na etapa 2 há 200; na 3 há 400, e o modelo é crescente.
Uma redução de 20% por etapa usa qual fator? | 0,8 | −0,2 | 1,2 | Permanece 80% do valor anterior, isto é, 0,8 vezes esse valor.
Uma redução pela metade usa qual modelo com início 80? | N(t)=80·(1/2)ᵗ | N(t)=80−t/2 | N(t)=80·2ᵗ | O fator multiplicativo é 1/2 a cada etapa.
Após três etapas de redução pela metade a partir de 80, qual é o valor? | 10 | 40 | 20 | 80·(1/2)³=80/8=10.
Qual fórmula resolve N₀aᵗ=M nas condições dadas? | t=ln(M/N₀)/ln a | t=ln(M−N₀) | t=M/(N₀a) | Dividir pelo inicial e aplicar ln isola o expoente.
Por que ln a pode ser usado como divisor? | Porque a≠1 implica ln a≠0 | Porque todo logaritmo é positivo | Porque a pode ser negativo | O único argumento positivo com ln igual a zero é 1.
O modelo matemático garante previsões válidas para sempre num fenômeno real? | Não | Sim | Só se usar base e | Validade empírica depende das hipóteses e da faixa de aplicação, não apenas da forma algébrica.`,
	}),
];
