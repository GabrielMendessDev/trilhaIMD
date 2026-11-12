import { lesson } from "./estrutura.mjs";
export default [
	lesson({
		n: 47,
		title: "Triângulos: uma razão que não depende do tamanho",
		goal: "Usar seno, cosseno e tangente de ângulos agudos em triângulos retângulos.",
		prereq: "Razões, raízes e teorema de Pitágoras.",
		hook: "Um grupo de extensão mede a altura de uma estrutura sem subir nela. Um desenho em escala diferente mantém os ângulos e muda todos os lados na mesma proporção. As razões sobrevivem à mudança de tamanho: essa é a porta de entrada da trigonometria.",
		concept:
			"Num triângulo retângulo, a hipotenusa é o lado oposto ao ângulo reto. Para um ângulo agudo θ, senθ=cateto oposto/hipotenusa, cosθ=cateto adjacente/hipotenusa e tanθ=cateto oposto/cateto adjacente. O cateto oposto depende do ângulo escolhido. Pitágoras fornece oposto²+adjacente²=hipotenusa².",
		why: "Triângulos retângulos com o mesmo ângulo agudo são semelhantes pelo critério ângulo–ângulo. Seus lados correspondentes mudam pelo mesmo fator; por isso as razões dependem de θ e não do tamanho. Dividir Pitágoras pelo quadrado da hipotenusa dá sen²θ+cos²θ=1.",
		example: [
			"Num triângulo 3–4–5, escolha o ângulo cujo cateto oposto mede 3 e o adjacente 4. A hipotenusa mede 5.",
			"Assim senθ=3/5, cosθ=4/5 e tanθ=3/4. Confira: (3/5)²+(4/5)²=9/25+16/25=1.",
			"Se o triângulo for ampliado por fator 2, os lados viram 6,8,10. As razões continuam 6/10=3/5, 8/10=4/5 e 6/8=3/4.",
		],
		trap: "‘Adjacente’ aqui não é qualquer lado que toca o ângulo: excluímos a hipotenusa. E a altura de uma estrutura pode exigir somar a altura do ponto de observação ao cateto calculado; um desenho com unidades evita essa perda de contexto.",
		transfer:
			"Use problemas geométricos de medidas hipotéticas, sem presumir equipamentos específicos. Esboce um triângulo, marque o ângulo de referência e só então nomeie oposto, adjacente e hipotenusa. Se trocar o ângulo agudo, os dois catetos trocam de papel.",
		quiz: `Qual lado fica oposto ao ângulo reto? | Hipotenusa | Cateto adjacente | Cateto oposto ao ângulo agudo | A hipotenusa é definida pelo ângulo reto e é o maior lado.
No triângulo do exemplo, quanto vale senθ? | 3/5 | 4/5 | 3/4 | O seno divide o cateto oposto 3 pela hipotenusa 5.
Quanto vale cosθ no exemplo? | 4/5 | 3/5 | 4/3 | O cosseno usa cateto adjacente 4 e hipotenusa 5.
Quanto vale tanθ no exemplo? | 3/4 | 4/3 | 3/5 | A tangente divide oposto por adjacente.
Se os catetos medem 5 e 12, quanto mede a hipotenusa? | 13 | 17 | 7 | Pitágoras dá √(25+144)=√169=13.
Ampliar todos os lados por fator 3 muda as razões do mesmo ângulo? | Não | Sim, triplica todas | Sim, divide todas por 3 | O fator comum cancela no quociente dos lados.
Ao trocar um ângulo agudo pelo outro, o que acontece com os catetos oposto e adjacente? | Trocam de papel | Viram hipotenusas | Mantêm sempre o mesmo nome | Esses nomes dependem do ângulo de referência.
Qual identidade deriva de Pitágoras? | sen²θ+cos²θ=1 | senθ+cosθ=1 | tanθ=senθ·cosθ | Dividir os quadrados dos lados pela hipotenusa ao quadrado produz a identidade.
Se um ângulo agudo tem senθ=1/2 e hipotenusa 10, quanto mede o cateto oposto? | 5 | 20 | 10 | Oposto/10=1/2 implica oposto=5.
Qual justificativa explica por que as razões dependem só do ângulo? | Semelhança de triângulos | Todos os triângulos têm lados iguais | Todo ângulo agudo é de 45° | Triângulos com os mesmos ângulos têm lados correspondentes proporcionais.`,
	}),
	lesson({
		n: 48,
		title: "Radianos: medir ângulo pelo arco",
		goal: "Converter graus e radianos e localizar voltas e sentidos.",
		prereq: "Circunferência e proporções.",
		hook: "Graus dividem a volta em 360 partes. Radianos fazem uma pergunta geométrica: quantos raios cabem no comprimento do arco? A nova unidade parece menos familiar, mas conversa diretamente com a circunferência.",
		concept:
			"Em uma circunferência de raio r>0, o ângulo central em radianos é θ=s/r, com s sendo o comprimento de arco orientado. Uma volta mede 2π rad=360°; meia volta, π rad=180°. Converta graus para radianos multiplicando por π/180; faça o caminho inverso multiplicando por 180/π. O sentido anti-horário é positivo.",
		why: "A circunferência inteira tem comprimento 2πr, então θ=(2πr)/r=2π. O raio cancela: a medida angular independe do tamanho da circunferência. Ângulos que diferem por 2kπ, k inteiro, chegam ao mesmo ponto no ciclo, embora suas medidas orientadas possam ser diferentes.",
		example: [
			"Converta 150°: 150·π/180=5π/6 rad. É menor que π e maior que π/2, logo termina no segundo quadrante.",
			"Converta −π/3 rad: −π/3·180/π=−60°. A rotação é horária.",
			"Somando uma volta a −π/3, obtemos 5π/3, que termina no mesmo ponto. Os ângulos são coterminais, não a mesma medida orientada.",
		],
		trap: "π rad equivale a 180°, e não a 3,14°. A constante π é um número; ‘rad’ indica a unidade angular. Também não esqueça o sinal ao converter uma rotação horária.",
		transfer:
			"Use uma volta desenhada com os marcos 0,π/2,π,3π/2 e 2π. Depois localize ângulos intermediários por comparação. Uma conversão exata com π é preferível a arredondar cedo e perder informação.",
		quiz: `Quantos radianos há em uma volta completa? | 2π | π | 360π | O arco completo tem comprimento 2πr; dividido por r resulta 2π.
Quanto vale 180° em radianos? | π | 2π | π/2 | Meia volta equivale a π radianos.
Quanto vale 60° em radianos? | π/3 | π/6 | 3π | Multiplicar 60 por π/180 dá π/3.
Quanto vale 150° em radianos? | 5π/6 | 3π/5 | 5π/3 | Simplificamos 150π/180 para 5π/6.
Quanto vale 3π/2 rad em graus? | 270° | 90° | 180° | Multiplicar por 180/π dá 270°.
Qual é o sentido de um ângulo negativo pela convenção adotada? | Horário | Anti-horário | Sempre vertical | O sentido anti-horário foi escolhido como positivo.
Qual ângulo é coterminal com −π/3? | 5π/3 | π/3 | 2π/3 | Somamos 2π e obtemos 5π/3.
Em qual quadrante termina 5π/6? | Segundo | Primeiro | Terceiro | Está entre π/2 e π.
Se um arco mede 6 e o raio 3, qual é o ângulo em radianos? | 2 | 18 | 1/2 | θ=s/r=6/3=2.
π rad é igual a aproximadamente 3,14°? | Não | Sim | Só em raio 1 | π rad=180°; trocar unidade sem conversão altera a medida.`,
	}),
	lesson({
		n: 49,
		title: "Ciclo unitário e ângulos notáveis",
		goal: "Ler seno e cosseno como coordenadas e obter valores exatos.",
		prereq: "Radianos e razões no triângulo retângulo.",
		hook: "O triângulo retângulo ajudou com ângulos agudos. Agora vamos fazê-lo passear por uma volta completa. No círculo de raio 1, o ponto final da rotação guarda dois números: cosseno na horizontal e seno na vertical.",
		concept:
			"No ciclo unitário, o ponto do ângulo θ é (cosθ,senθ). Quadrantes I, II, III e IV têm sinais de (cos,sen) iguais a (+,+),(−,+),(−,−),(+,−). Os marcos são 0→(1,0), π/2→(0,1), π→(−1,0), 3π/2→(0,−1). Para π/6,π/4,π/3, os senos são 1/2,√2/2,√3/2 e os cossenos, √3/2,√2/2,1/2.",
		why: "Um triângulo retângulo isósceles de catetos 1 tem hipotenusa √2: dividir por ela dá sen(π/4)=cos(π/4)=√2/2. Dividir um triângulo equilátero de lado 2 ao meio produz lados 1,√3,2 e os valores de 30° e 60°. Reflexões no círculo fornecem os sinais e os valores dos demais quadrantes.",
		example: [
			"Calcule sen(5π/6) e cos(5π/6). O ângulo está no segundo quadrante e seu ângulo de referência é π−5π/6=π/6.",
			"O seno é positivo e mantém o valor 1/2. O cosseno é negativo e fica −√3/2.",
			"O ponto é (−√3/2,1/2). Confira que os quadrados somam 3/4+1/4=1, como exige o círculo unitário.",
		],
		trap: "A ordem do par é (cos,sen), mesmo quando você está mais interessado no seno. Nos eixos, não se atribui um quadrante ao ponto. E valores notáveis exatos não precisam virar decimais para ser respostas completas.",
		transfer:
			"Esboce o círculo com os eixos e escreva os sinais por extenso, além de quaisquer cores. Localize um ângulo pela volta e depois use a referência aguda. Essa sequência é mais segura do que tentar memorizar uma tabela enorme sem geometria.",
		quiz: `Qual é o ponto do ciclo correspondente a θ? | (cosθ,senθ) | (senθ,cosθ) | (tanθ,senθ) | O cosseno mede a coordenada horizontal e o seno a vertical.
Quanto vale sen(π/6)? | 1/2 | √3/2 | √2/2 | O triângulo 30°–60°–90° fornece oposto 1 e hipotenusa 2.
Quanto vale cos(π/3)? | 1/2 | √3/2 | 0 | O cosseno de 60° é 1/2.
Quanto vale sen(π/4)? | √2/2 | 1/2 | 1 | No triângulo isósceles retângulo, a razão é 1/√2=√2/2.
Quanto vale cosπ? | −1 | 1 | 0 | O ponto de meia volta é (−1,0).
Quanto vale sen(3π/2)? | −1 | 1 | 0 | O ponto é (0,−1), cuja coordenada vertical é −1.
No segundo quadrante, quais são os sinais de cos e sen? | Negativo e positivo | Positivo e negativo | Ambos negativos | O ponto fica à esquerda e acima da origem.
Quanto vale sen(5π/6)? | 1/2 | −1/2 | √3/2 | A referência é π/6 e o seno é positivo no segundo quadrante.
Quanto vale cos(5π/6)? | −√3/2 | √3/2 | −1/2 | A referência é π/6 e o cosseno é negativo no segundo quadrante.
Um ponto exatamente no eixo vertical superior pertence a qual quadrante? | A nenhum quadrante | Ao primeiro | Ao segundo | Os eixos são fronteiras dos quadrantes, não parte de um deles.`,
	}),
	lesson({
		n: 50,
		title: "Seis razões e seus pontos proibidos",
		goal: "Relacionar tan, sec, csc e cot a seno e cosseno com domínio.",
		prereq: "Ciclo trigonométrico, frações e ângulos notáveis.",
		hook: "Seno e cosseno já guardam as coordenadas. As outras razões combinam ou invertem esses valores. Parece um elenco com seis protagonistas, mas as duas coordenadas sustentam quase toda a trama — desde que ninguém divida por zero.",
		concept:
			"tanθ=senθ/cosθ e secθ=1/cosθ exigem cosθ≠0. cscθ=1/senθ e cotθ=cosθ/senθ exigem senθ≠0. Assim tan e sec excluem θ=π/2+kπ; csc e cot excluem θ=kπ, k∈ℤ. Seno e cosseno estão definidos para todo real. sec é secante; csc, cossecante; cot, cotangente.",
		why: "As definições prolongam as razões do triângulo usando coordenadas orientadas. Os pontos proibidos surgem exatamente dos zeros dos denominadores no ciclo unitário. A tangente é positiva nos quadrantes I e III, pois seno e cosseno têm mesmo sinal; é negativa em II e IV, onde têm sinais opostos.",
		example: [
			"Para θ=π/3, senθ=√3/2 e cosθ=1/2. Então tanθ=√3.",
			"Os recíprocos dão secθ=2 e cscθ=2/√3=2√3/3. A cotangente é 1/√3=√3/3.",
			"Em θ=π/2, o seno vale 1 e o cosseno zero. Logo csc e cot estão definidas, com valores 1 e 0; tan e sec não estão definidas.",
		],
		trap: "sec não é 1/sen: secante é recíproco do cosseno; cossecante é recíproco do seno. E cotθ=1/tanθ só pode ser usado onde ambos os lados estão definidos: em π/2, cot vale 0, mas tan nem existe.",
		transfer:
			"Para calcular qualquer uma das seis razões, comece com o par (cos,sen), confira denominadores e só então divida. Faça uma tabela de pontos proibidos com uma frase explicando a causa de cada exclusão.",
		quiz: `Qual é a definição de secθ? | 1/cosθ | 1/senθ | senθ/cosθ | Secante é o recíproco do cosseno.
Qual é a definição de cscθ? | 1/senθ | 1/cosθ | cosθ/senθ | Cossecante é o recíproco do seno.
Qual é a definição de tanθ? | senθ/cosθ | cosθ/senθ | 1/senθ | A tangente divide a coordenada vertical pela horizontal.
Em quais ângulos a tangente não está definida? | π/2+kπ, k∈ℤ | kπ, k∈ℤ | Apenas em 0 | O denominador cosθ zera nos pontos superiores e inferiores do ciclo.
Em quais ângulos csc não está definida? | kπ, k∈ℤ | π/2+kπ, k∈ℤ | Nenhum real | O denominador senθ zera nos pontos horizontais do ciclo.
Quanto vale tan(π/3)? | √3 | 1/√3 | 2 | (√3/2)/(1/2)=√3.
Quanto vale sec(π/3)? | 2 | 1/2 | √3 | O cosseno é 1/2 e seu recíproco é 2.
Quanto vale cot(π/2)? | 0 | Não definido | 1 | cos(π/2)/sen(π/2)=0/1=0.
Qual é o sinal da tangente no terceiro quadrante? | Positivo | Negativo | Zero em todo o quadrante | Seno e cosseno são ambos negativos, e o quociente é positivo.
Podemos substituir cot(π/2) por 1/tan(π/2)? | Não | Sim | Apenas se arredondar π | A tangente não está definida nesse ângulo, embora a cotangente esteja.`,
	}),
	lesson({
		n: 51,
		title: "Identidades: provar sem apagar o domínio",
		goal: "Demonstrar identidades fundamentais e simplificar expressões válidas.",
		prereq: "Seis razões e pontos proibidos.",
		hook: "Uma identidade parece uma igualdade já pronta, mas sua prova tem trabalho para fazer. O desafio é transformar um lado no outro sem dividir por algo que pode ser zero. Até as fórmulas clássicas precisam apresentar o ingresso do domínio.",
		concept:
			"No círculo unitário, sen²θ+cos²θ=1 para todo real θ. Dividindo por cos²θ, onde cosθ≠0, obtemos 1+tan²θ=sec²θ. Dividindo por sen²θ, onde senθ≠0, obtemos 1+cot²θ=csc²θ. Identidade significa igualdade para todas as entradas do domínio comum indicado.",
		why: "As coordenadas do círculo satisfazem x²+y²=1; trocar x por cosθ e y por senθ fornece a relação fundamental. As outras duas identidades vêm de dividir termo a termo, preservando as restrições. Isso permite reconstruir as fórmulas e explica por que seus domínios não são idênticos.",
		example: [
			"Simplifique sec²θ−tan²θ onde cosθ≠0. Pela identidade 1+tan²θ=sec²θ, a diferença vale 1.",
			"Outra prova escreve (1−sen²θ)/cos²θ=cos²θ/cos²θ=1.",
			"O resultado reduzido 1 não amplia o domínio original: θ=π/2 continua proibido, pois a expressão de partida não existe ali.",
		],
		trap: "Verificar em θ=0 ou θ=π/4 não demonstra uma identidade universal. Também não tire raiz de cos²θ como se fosse sempre cosθ: a raiz principal é |cosθ|. Para escolher o sinal, use o quadrante.",
		transfer:
			"Uma prova eficiente começa pelo lado mais composto, troca razões por seno e cosseno e usa a relação fundamental. Anote as condições antes dos cancelamentos. Compare uma identidade com uma equação trigonométrica: a segunda pode valer só para algumas entradas.",
		quiz: `Qual identidade vale para todo θ real? | sen²θ+cos²θ=1 | senθ+cosθ=1 | tan²θ+1=cos²θ | É a equação do círculo unitário em suas coordenadas.
Quanto vale sec²θ−tan²θ no domínio original? | 1 | 0 | −1 | Reorganizar 1+tan²θ=sec²θ dá a diferença igual a 1.
Qual condição permite dividir a relação fundamental por cos²θ? | cosθ≠0 | senθ≠0 | θ>0 | O divisor precisa ser não nulo.
Qual é a outra identidade pitagórica com cot e csc? | 1+cot²θ=csc²θ | 1+cot²θ=sec²θ | cot²θ+csc²θ=1 | Dividimos a relação fundamental por sen²θ.
Se senθ=3/5 e θ está no segundo quadrante, quanto vale cosθ? | −4/5 | 4/5 | −3/5 | cos²θ=1−9/25=16/25 e o cosseno é negativo no segundo quadrante.
Quanto vale √(cos²θ) em geral? | |cosθ| | cosθ sempre | −cosθ sempre | A raiz principal é não negativa e corresponde ao valor absoluto.
Testar uma igualdade em três ângulos prova uma identidade em ℝ? | Não | Sim | Só se forem ângulos notáveis | Um domínio infinito exige argumento geral; testes podem apenas refutar uma igualdade universal.
Ao reduzir sec²θ−tan²θ a 1, podemos incluir θ=π/2 no domínio original? | Não | Sim | Só se escrever 1 primeiro | As razões originais não estão definidas nesse ponto.
Se tanθ=2, quanto vale sec²θ? | 5 | 3 | 4 | Pela identidade, sec²θ=1+2²=5.
Se cotθ=3, quanto vale csc²θ? | 10 | 8 | 9 | A identidade fornece 1+3²=10.`,
	}),
	lesson({
		n: 52,
		title: "Somar ângulos sem somar senos",
		goal: "Aplicar e justificar fórmulas de soma e diferença.",
		prereq: "Ângulos notáveis, simetria e identidade fundamental.",
		hook: "15° não aparece na primeira tabela de ângulos notáveis, mas é 45°−30°. Esse parentesco permite um valor exato. Só não vale somar os senos como se a curva tivesse assinado contrato de linearidade.",
		concept:
			"sen(α±β)=senα cosβ±cosα senβ. cos(α+β)=cosα cosβ−senα senβ e cos(α−β)=cosα cosβ+senα senβ. Quando as tangentes envolvidas e o quociente estão definidos, tan(α±β)=(tanα±tanβ)/(1∓tanα tanβ). Seno é ímpar e cosseno é par.",
		why: "Para dois pontos unitários de ângulos α e β, a distância ao quadrado é 2−2[cosα cosβ+senα senβ] por expansão das coordenadas. Pela lei dos cossenos no triângulo com dois lados unitários, também é 2−2cos(α−β). Igualar dá a fórmula do cosseno da diferença. Usar −β e a relação sen t=cos(π/2−t) produz as demais. A fórmula da tangente vem de dividir seno por cosseno da soma ou diferença.",
		example: [
			"Calcule sen15°=sen(45°−30°). A fórmula fornece sen45° cos30°−cos45° sen30°.",
			"Substitua os valores: (√2/2)(√3/2)−(√2/2)(1/2).",
			"Portanto sen15°=(√6−√2)/4. Uma conferência de tamanho: é positivo e menor que sen30°=1/2, como esperado para um ângulo agudo menor.",
		],
		trap: "sen(α+β) não é senα+senβ. Com α=β=π/2, o primeiro vale 0 e a soma vale 2. No cosseno, a soma leva menos entre os produtos, enquanto a diferença leva mais. Reconstrua pelo caso α=β para conferir sinais.",
		transfer:
			"Use decomposições por ângulos conhecidos para obter resultados exatos. Como apoio à demonstração, a lei dos cossenos afirma d²=u²+v²−2uv cosγ para lados u,v com ângulo γ; sua origem é a decomposição de um lado em projeções e Pitágoras. Assim cada fórmula mantém uma ligação geométrica.",
		quiz: `Qual é a fórmula de sen(α+β)? | senα cosβ+cosα senβ | senα+senβ | senα senβ+cosα cosβ | A fórmula combina produtos cruzados, sem substituir seno por uma operação linear.
Qual é a fórmula de cos(α−β)? | cosα cosβ+senα senβ | cosα cosβ−senα senβ | cosα−cosβ | Na diferença de ângulos o termo entre os produtos é positivo.
Quanto vale sen15°? | (√6−√2)/4 | (√6+√2)/4 | 1/4 | Use 45°−30° e substitua os valores notáveis.
Quanto vale cos60° pela fórmula de 30°+30°? | 1/2 | 1 | 0 | (√3/2)²−(1/2)²=3/4−1/4=1/2.
Quanto vale sen(−π/6)? | −1/2 | 1/2 | √3/2 | O seno é ímpar.
Quanto vale cos(−π/3)? | 1/2 | −1/2 | −√3/2 | O cosseno é par.
Qual exemplo refuta sen(α+β)=senα+senβ? | α=β=π/2 | α=β=0 | α=0,β=π/3 | No primeiro caso os dois lados valem 0 e 2, respectivamente.
Qual é a fórmula de tan(α+β), no domínio adequado? | (tanα+tanβ)/(1−tanα tanβ) | tanα+tanβ | (tanα−tanβ)/(1+tanα tanβ) | A divisão das fórmulas de seno e cosseno gera esse quociente.
Quanto vale tan75°? | 2+√3 | 2−√3 | √3−1 | Use 45°+30°: (1+1/√3)/(1−1/√3), que simplifica a 2+√3.
O que fazer se 1−tanα tanβ=0 na fórmula da soma? | Verificar a definição original; o quociente escrito não pode ser usado | Definir a tangente como zero | Cancelar o denominador | Divisão por zero é proibida; quando as tangentes individuais existem, esse caso corresponde a cos(α+β)=0.`,
	}),
	lesson({
		n: 53,
		title: "Seno, cosseno e tangente como funções",
		goal: "Descrever domínio, imagem, simetria e períodos das funções básicas.",
		prereq: "Ciclo, periodicidade e seis razões.",
		hook: "Imagine acompanhar só a altura de um ponto dando voltas no círculo. A altura sobe, desce, fica negativa e retorna. Você acabou de construir o gráfico do seno. A posição horizontal constrói o cosseno; a razão das duas coordenadas constrói uma função com interrupções.",
		concept:
			"sen e cos têm domínio ℝ, imagem [−1,1] e período fundamental 2π. Seno é ímpar; cosseno é par. Tan tem domínio ℝ∖{π/2+kπ:k∈ℤ}, imagem ℝ, período fundamental π e é ímpar. Suas assíntotas verticais são x=π/2+kπ. Em (−π/2,π/2), tan é estritamente crescente. Estudamos aqui as funções básicas, sem transformações de período e imagem.",
		why: "As coordenadas do círculo variam de −1 a 1 e repetem a cada volta completa. Meia volta troca simultaneamente os sinais do seno e do cosseno, preservando seu quociente: tan(x+π)=tan x. No intervalo central, a tangente cresce de valores sem limite inferior até valores sem limite superior. Para a,b nesse intervalo e a<b, tan b−tan a=sen(b−a)/(cos a cos b)>0, justificando a monotonia sem cálculo diferencial.",
		example: [
			"Para esboçar sen x em [0,2π], marque (0,0),(π/2,1),(π,0),(3π/2,−1),(2π,0). Ligue com curva suave conforme o movimento do círculo.",
			"Para cos x, marque (0,1),(π/2,0),(π,−1),(3π/2,0),(2π,1). Não troque os valores iniciais.",
			"Para tan x, marque (0,0) no ramo central e desenhe assíntotas em ±π/2. Não conecte ramos atravessando as assíntotas; repita-os a cada π.",
		],
		trap: "A tangente não tem imagem [−1,1]; essa limitação pertence às coordenadas seno e cosseno. Um salto de desenho através de uma assíntota não faz parte do gráfico. Nos extremos ±1 das imagens de sen e cos, use colchetes: ambos os valores são atingidos.",
		transfer:
			"Dê uma descrição verbal de cada gráfico com pontos notáveis, domínio e período. As funções básicas fornecem um vocabulário de ciclos; aplicações com amplitudes, deslocamentos e frequências diferentes são aprofundamento fora do recorte prioritário da P3 2025.2 indicado no acervo.",
		quiz: `Qual é a imagem de sen x? | [−1,1] | (−1,1) | ℝ | O seno atinge os extremos 1 e −1 nos pontos superiores e inferiores do ciclo.
Qual é o período fundamental de cos x? | 2π | π | π/2 | O padrão completo da coordenada horizontal se repete em uma volta.
Qual função é par? | cos x | sen x | tan x | cos(−x)=cos x.
Qual é o valor inicial sen0? | 0 | 1 | −1 | O ponto inicial do ciclo é (1,0), com coordenada vertical zero.
Qual é o valor inicial cos0? | 1 | 0 | −1 | A coordenada horizontal do ponto inicial é 1.
Qual é o período fundamental de tan x? | π | 2π | π/2 | Uma meia volta troca os sinais de seno e cosseno e mantém o quociente.
Qual é a imagem da tangente? | ℝ | [−1,1] | (0,∞) | O ramo central percorre todos os valores reais.
Qual é uma assíntota vertical da tangente? | x=π/2 | y=π/2 | x=0 | O cosseno zera em π/2 e a função se torna indefinida com crescimento sem limite no entorno.
Qual é a monotonia da tangente em (−π/2,π/2)? | Estritamente crescente | Estritamente decrescente | Constante | A diferença tan b−tan a é positiva para a<b nesse intervalo.
Devemos conectar o gráfico de tan x através de x=π/2? | Não | Sim | Só com uma linha vertical contínua | A entrada é proibida e separa ramos diferentes; a assíntota não pertence ao gráfico.`,
	}),
	lesson({
		n: 54,
		title: "Oficina do ciclo: justificar em vez de adivinhar",
		goal: "Integrar conversão, quadrante, identidades e funções trigonométricas.",
		prereq: "Passos 47 a 53.",
		hook: "O desafio reúne um ângulo negativo, uma identidade e uma tangente que talvez nem exista. A missão não é correr até a tabela, mas decidir o que pode ser calculado e por qual caminho. Aqui o quadrante serve de verificação independente para os sinais.",
		concept:
			"Um roteiro confiável é converter a unidade, reduzir por voltas completas, localizar o quadrante ou eixo, obter os valores de referência e aplicar as definições com domínio. Esta oficina autoral treina habilidades relacionadas à trigonometria da P3 2025.2, com respostas justificadas.",
		why: "Reduzir um ângulo por 2kπ preserva seno e cosseno e, onde definida, a tangente. O oposto preserva cosseno e troca o sinal do seno e da tangente. Essas propriedades reduzem muitos problemas a ângulos agudos conhecidos, enquanto o domínio impede resultados sem sentido.",
		example: [
			"Calcule tan(−225°). Converta: −225π/180=−5π/4. Some 2π e obtenha 3π/4, no segundo quadrante.",
			"As coordenadas são cos=−√2/2 e sen=√2/2. Seu quociente é −1.",
			"Portanto tan(−225°)=−1. O denominador não zera, e o sinal negativo combina com o segundo quadrante. Pela periodicidade π, também poderíamos reduzir a −π/4.",
		],
		trap: "Usar uma calculadora em graus com uma entrada em radianos pode produzir uma resposta plausível e errada. A unidade deve estar declarada antes da conta. Nos cálculos exatos desta oficina, π permanece simbólico até a conclusão.",
		transfer:
			"Escolha uma questão para escrever como solução discursiva completa, incluindo unidade, quadrante, valores e conclusão. Em outra, explique por que a expressão não está definida. Saber interromper uma operação inválida também é competência matemática.",
		quiz: `Quanto vale −225° em radianos? | −5π/4 | −4π/5 | −3π/4 | Multiplicar por π/180 e simplificar dá −5π/4.
Qual ângulo em [0,2π) é coterminal com −5π/4? | 3π/4 | 5π/4 | π/4 | Somamos 2π=8π/4 e obtemos 3π/4.
Quanto vale tan(−225°)? | −1 | 1 | Não definido | A redução para 3π/4 dá seno positivo e cosseno negativo de mesmo módulo.
Quanto vale sen(7π/6)? | −1/2 | 1/2 | −√3/2 | O ângulo está no terceiro quadrante e tem referência π/6.
Quanto vale cos(5π/3)? | 1/2 | −1/2 | √3/2 | No quarto quadrante, a referência é π/3 e o cosseno é positivo.
Quanto vale secπ? | −1 | 1 | Não definido | cosπ=−1; seu recíproco é −1.
Quanto vale csc0? | Não definido | 0 | 1 | O denominador sen0 é zero.
Quanto vale 1+tan²(π/4)? | 2 | 1 | 0 | tan(π/4)=1, então 1+1²=2.
Se senθ=4/5 no primeiro quadrante, quanto vale tanθ? | 4/3 | 3/4 | 4/5 | cosθ=3/5 positivo; o quociente é 4/3.
Qual afirmação descreve o domínio da tangente? | Exclui π/2+kπ para k inteiro | Exclui apenas zero | Contém todos os reais | Os zeros do cosseno tornam a divisão sen/cos inválida.`,
	}),
];
