import { lesson } from "./estrutura.mjs";
import foundations from "./unidade-1-fundamentos.mjs";

const investigations = [
	lesson({
		n: 11,
		title: "O mistério das inscrições repetidas",
		goal: "Justificar contagens com união, interseção e conjunto das partes.",
		prereq: "Pertinência, inclusão e operações entre conjuntos (passos 1 e 2).",
		hook: "Uma mostra universitária recebeu 18 inscrições para cinema e 15 para debate. A organização anunciou 33 pessoas. Alguém levantou a mão: ‘Eu me inscrevi nos dois’. A soma acaba de ganhar uma testemunha contra ela. Como corrigir a contagem sem conhecer todos os nomes?",
		concept:
			"Para conjuntos finitos A e B, |A∪B|=|A|+|B|−|A∩B|. As barras aqui significam número de elementos. A interseção é subtraída porque foi contada duas vezes. O complemento Aᶜ depende de um universo U declarado. Um conjunto com n elementos possui 2ⁿ subconjuntos e 2ⁿ−1 subconjuntos próprios, incluindo o vazio quando n>0.",
		why: "Divida a união em três regiões disjuntas: só A, ambos, só B. Suas contagens são |A|−|A∩B|, |A∩B| e |B|−|A∩B|. Somá-las demonstra a fórmula. Para contar subconjuntos, cada elemento tem duas escolhas independentes: entrar ou ficar de fora. As n escolhas produzem 2ⁿ possibilidades, sem que a ordem crie conjuntos novos.",
		example: [
			"Se 6 pessoas se inscreveram nas duas atividades, as regiões exclusivas têm 18−6=12 e 15−6=9 pessoas.",
			"Logo |A∪B|=12+6+9=27. Com universo de 40 participantes, 40−27=13 não escolheram nenhuma.",
			"Uma comissão escolhida de {Ana, Bia, Caio} é um subconjunto: há 2³=8 possibilidades, ou 7 se a comissão não puder ser o grupo completo. Se também não puder ser vazia, restam 6.",
		],
		trap: "‘Próprio’ significa diferente do conjunto original; não significa ‘não vazio’. Para A=∅, o único subconjunto é ∅, portanto há zero subconjuntos próprios. E 18+15 só seria uma contagem de pessoas distintas se a interseção fosse vazia.",
		transfer:
			"Em pesquisas de Saúde, Humanas ou Tecnologia, uma pessoa pode marcar várias opções. Antes de somar frequências, pergunte se as categorias se sobrepõem. Reconstrua a fórmula desenhando três regiões e explique por que a interseção aparece uma vez no resultado.",
		quiz: `18 pessoas escolhem cinema, 15 debate e 6 ambos. Quantas escolhem ao menos um? | 27 | 33 | 21 | A soma 33 contou as seis pessoas duas vezes; subtraímos uma cópia de cada: 33−6=27.
No universo de 40 pessoas, 27 escolhem alguma atividade. Quantas não escolhem nenhuma? | 13 | 27 | 67 | O complemento da união tem 40−27=13 elementos.
Se |A|=12 e |A∩B|=5, quantas pessoas estão só em A? | 7 | 12 | 17 | Remova de A as cinco pessoas que também estão em B: 12−5=7.
Um conjunto com 4 elementos tem quantos subconjuntos? | 16 | 8 | 4 | Cada elemento pode entrar ou sair: 2⁴=16.
Quantos subconjuntos próprios tem um conjunto de 4 elementos? | 15 | 16 | 14 | Dos 16 subconjuntos, excluímos somente o conjunto completo.
Quantos subconjuntos não vazios e próprios tem {a,b,c}? | 6 | 7 | 8 | São 8 subconjuntos; removemos o vazio e o completo, que são distintos.
Qual é a quantidade de subconjuntos próprios de ∅? | 0 | 1 | 2 | O único subconjunto de ∅ é ele mesmo, portanto não é próprio.
Se A∩B=∅, qual contagem vale para conjuntos finitos? | |A∪B|=|A|+|B| | |A∪B|=|A|−|B| | |A∪B|=0 | Sem interseção não há repetição na soma das cardinalidades.
Em U={1,2,3,4,5}, A={2,4}. Qual é Aᶜ? | {1,3,5} | {2,4} | {1,2,3,4,5} | O complemento reúne exatamente os elementos de U que não pertencem a A.
Numa pesquisa, |A|=10, |B|=8 e |A∪B|=14. Qual é |A∩B|? | 4 | 18 | 6 | De 14=10+8−|A∩B| obtemos interseção igual a 4.`,
	}),
	lesson({
		n: 12,
		title: "Intervalos: quem pode entrar?",
		goal: "Traduzir condições simultâneas e alternativas para intervalos.",
		prereq: "Reta real, união e interseção.",
		hook: "A sala de estudos funciona das 8h às 20h; uma atividade aceita chegadas depois das 10h e até as 12h. O relógio não lê intenções: chegar exatamente às 10h conta? Esse pequeno detalhe é a diferença entre um extremo aberto e um fechado.",
		concept:
			"Um intervalo é um conjunto de reais entre limites. Em (a,b], a<x≤b: parêntese exclui e colchete inclui. ±∞ não são números reais e sempre levam parênteses. ‘E’ pede interseção; ‘ou’ inclusivo pede união. Uma solução pode ser vazia, um ponto ou vários intervalos.",
		why: "Na interseção, cada número precisa passar por todos os filtros. Para x>1 e x≤4, os testes deixam (1,4]. Na união basta passar por um filtro. Para x<0 ou x≥2, há dois pedaços separados: (−∞,0)∪[2,∞). Testar os extremos evita decidir o colchete por aparência.",
		example: [
			"Uma biblioteca aceita acesso para 8≤t≤20 e uma atividade exige 10<t≤12. Escreva [8,20]∩(10,12].",
			"O segundo intervalo já está contido no primeiro. A interseção é (10,12].",
			"Verifique: 10 não entra, 11 entra, 12 entra. Aqui t é um horário idealizado como número real; uma regra administrativa diferente mudaria o modelo.",
		],
		trap: "Não arredonde um intervalo real para uma lista de inteiros sem que o domínio peça isso. (1,2) contém infinitos reais, embora não contenha nenhum inteiro. Também não use [−∞,3], pois infinito não é ponto final alcançável.",
		transfer:
			"Em alimentação, transporte ou planejamento de pesquisa, condições de viabilidade podem ser combinadas do mesmo jeito. Escreva primeiro a frase, depois os testes sobre x e só então o intervalo. Desenhe a reta com legenda verbal para que a resposta não dependa da cor.",
		quiz: `Qual intervalo representa 1<x≤4? | (1,4] | [1,4) | [1,4] | O limite 1 é excluído e 4 é incluído.
Qual é [0,5]∩(2,8)? | (2,5] | [0,8) | [2,5] | Os números precisam ser maiores que 2 e no máximo 5.
Qual é (−∞,1)∪[1,∞)? | ℝ | ℝ sem 1 | ∅ | O segundo intervalo inclui 1 e os dois cobrem todos os reais.
Qual é [0,1]∩[2,3]? | ∅ | [0,3] | {1,2} | Nenhum número pertence aos dois intervalos.
Qual é [0,2]∩[2,4]? | {2} | ∅ | (0,4) | O único ponto comum é o extremo 2, incluído nos dois.
Qual é a escrita correta de x≤3? | (−∞,3] | [−∞,3] | (−∞,3) | O infinito fica aberto; 3 pertence ao conjunto.
Quantos inteiros há em (1,2)? | 0 | 1 | Infinitos | Nenhum inteiro é estritamente maior que 1 e menor que 2.
Qual condição representa [2,6)? | 2≤x<6 | 2<x≤6 | x≤2 ou x>6 | Leia cada extremo conforme seu colchete ou parêntese.
Qual é o conjunto de x>3 e x<1? | ∅ | (1,3) | ℝ | Um real não pode satisfazer simultaneamente essas duas desigualdades.
Qual é a solução de x<0 ou x≥2? | (−∞,0)∪[2,∞) | (0,2) | [0,2] | ‘Ou’ reúne os dois conjuntos; 0 fica fora e 2 entra.`,
	}),
	lesson({
		n: 13,
		title: "Potências sob investigação",
		goal: "Aplicar leis de expoentes com suas hipóteses e diagnosticar regras falsas.",
		prereq: "Multiplicação, frações e potências do passo 3.",
		hook: "Um arquivo é duplicado três vezes. Você prevê 2³ cópias. Agora alguém propõe que duplicar e triplicar dá ‘2³+2²=2⁵’. Parece uma economia de escrita. A matemática pede para ver as contas antes de assinar.",
		concept:
			"Para a>0 e expoentes reais r,s: aʳaˢ=aʳ⁺ˢ, aʳ/aˢ=aʳ⁻ˢ e (aʳ)ˢ=aʳˢ. Para a≠0, expoentes inteiros admitem a⁰=1 e a⁻ⁿ=1/aⁿ. A definição de expoente racional envolve raízes; base positiva evita ambiguidades ao estender as regras a expoentes reais.",
		why: "Com expoentes naturais, a³a² concatena três fatores e dois fatores: cinco ao todo. Já a³+a² soma dois números e não concatena fatores. O expoente zero é compatível com a³/a³=a⁰=1, desde que a≠0. Para racionais m/n, aᵐ⁄ⁿ é a raiz n-ésima de aᵐ quando a>0.",
		example: [
			"Calcule (16^(3/4)·2⁻¹)/2. Primeiro 16^(1/4)=2, porque 2⁴=16.",
			"Então 16^(3/4)=2³=8 e 2⁻¹=1/2. O numerador vale 4.",
			"Dividir por 2 dá 2. Uma conferência alternativa troca 16 por 2⁴ e reúne expoentes: 2³·2⁻¹/2¹=2¹.",
		],
		trap: "−2²=−4, enquanto (−2)²=4. O sinal faz parte da base apenas no segundo caso. Em ℝ, √(x²)=|x|, portanto a simplificação para x exige x≥0. Não estenda automaticamente identidades de bases positivas a bases negativas com expoentes fracionários.",
		transfer:
			"Escalas de laboratório e ordens de grandeza de dados usam a mesma estrutura. Explique as condições antes de simplificar. Para refutar uma regra universal falsa, basta um contraexemplo: 2³+2²=12 e 2⁵=32.",
		quiz: `Quanto vale 2³·2⁴? | 128 | 24 | 64 | Some os expoentes: 2⁷=128.
Quanto vale 3⁵/3²? | 27 | 9 | 243 | Subtraia expoentes: 3³=27.
Quanto vale (2³)²? | 64 | 32 | 256 | Multiplique os expoentes: 2⁶=64.
Quanto vale 5⁻²? | 1/25 | −25 | −1/25 | Expoente negativo indica recíproco, não sinal negativo.
Quanto vale 27^(2/3)? | 9 | 18 | 6 | A raiz cúbica de 27 é 3; ao quadrado resulta 9.
Quanto vale (−3)²? | 9 | −9 | 6 | A base inteira é −3, e (−3)(−3)=9.
Quanto vale −3²? | −9 | 9 | −6 | A potência é calculada antes do sinal: −(3²)=−9.
Se x=−4, quanto vale √(x²)? | 4 | −4 | 16 | A raiz quadrada principal é não negativa: √16=4.
Qual igualdade é falsa? | 2³+2²=2⁵ | 2³·2²=2⁵ | (2³)²=2⁶ | A soma vale 12, enquanto 2⁵ vale 32.
Para a>0, qual é aʳ/aˢ? | aʳ⁻ˢ | aʳ⁺ˢ | aʳ⁄ˢ | O quociente de potências da mesma base subtrai expoentes.`,
	}),
	lesson({
		n: 14,
		title: "Logaritmos: a pergunta escondida",
		goal: "Justificar propriedades logarítmicas a partir de potências.",
		prereq: "Potências positivas e definição de logaritmo do passo 4.",
		hook: "Uma cultura fictícia dobra a cada etapa: 1, 2, 4, 8, 16. A pergunta ‘quantas etapas até 16?’ é um logaritmo disfarçado. Ele não é um inimigo novo; é a pergunta de potência olhando na direção contrária.",
		concept:
			"logₐb=c significa aᶜ=b, com a>0, a≠1 e b>0. Para x,y>0: logₐ(xy)=logₐx+logₐy e logₐ(x/y)=logₐx−logₐy. Para r real, logₐ(xʳ)=r logₐx. A mudança de base é logₐb=ln b/ln a. A constante e≈2,71828 é a base de ln; não é uma incógnita.",
		why: "Se u=logₐx e v=logₐy, então x=aᵘ e y=aᵛ. Logo xy=aᵘ⁺ᵛ. A unicidade do expoente dá logₐ(xy)=u+v. Essa demonstração também mostra por que não existe uma regra semelhante para x+y: somar potências não soma expoentes. A base 1 falha porque 1ᶜ não distingue expoentes.",
		example: [
			"Calcule log₂(8·√2). Escreva 8=2³ e √2=2^(1/2).",
			"O produto é 2^(7/2). O expoente procurado pelo logaritmo é 7/2.",
			"Pelas propriedades, log₂8+log₂√2=3+1/2=7/2. Os dois caminhos concordam e todos os argumentos são positivos.",
		],
		trap: "ln(x+y) não é ln x+ln y. Com x=y=1, o lado esquerdo é ln2 e o direito é 0. E ln(x²)=2ln x só pode ser escrito dessa forma com x>0; para x≠0, a forma geral é 2ln|x|, como observação complementar.",
		transfer:
			"Escalas logarítmicas permitem falar de grandes variações sem escrever uma fila interminável de zeros. Aqui os valores são exercícios de matemática, sem interpretar escalas clínicas. Recupere a definição sempre que uma propriedade parecer mágica: qual expoente produz o argumento?",
		quiz: `Quanto vale log₂32? | 5 | 16 | 3 | Como 2⁵=32, o expoente procurado é 5.
Quanto vale log₃(1/9)? | −2 | 2 | 1/3 | Temos 3⁻²=1/9.
Quanto vale log₁₀1? | 0 | 1 | 10 | Toda base admissível elevada a zero dá 1.
Quanto vale log₂(8·4)? | 5 | 6 | 12 | O produto é 32=2⁵; também podemos somar 3+2.
Quanto vale log₂(8/4)? | 1 | 5 | 2 | A propriedade do quociente dá 3−2=1.
Quanto vale ln(e³)? | 3 | e³ | 1 | ln desfaz a potência de base e.
Quanto vale e^(ln 7)? | 7 | ln 7 | e·7 | A exponencial e o logaritmo natural são inversos para argumentos positivos.
Qual base é inadmissível para logₐx? | 1 | 2 | 1/2 | Na base 1, todas as potências valem 1, impedindo uma inversão.
Qual expressão representa log₂7 por mudança de base? | ln7/ln2 | ln2/ln7 | ln(7/2) | Dividimos o logaritmo do argumento pelo logaritmo da base.
Qual afirmação vale para x,y>0? | ln(xy)=lnx+lny | ln(x+y)=lnx+lny | ln(x/y)=lnx/lny | Só a primeira é uma propriedade logarítmica; divisão no argumento vira subtração.`,
	}),
	lesson({
		n: 15,
		title: "Sistemas: três finais possíveis",
		goal: "Classificar sistemas 2×2 e justificar equivalência das operações.",
		prereq: "Equações lineares e sistemas do passo 6.",
		hook: "Dois grupos registram a quantidade de refeições de um evento. Cada relatório oferece uma equação. Há três finais: os relatórios se completam, repetem a mesma informação ou discordam. O sistema vai contar qual história ocorreu.",
		concept:
			"Um sistema pede um par (x,y) que satisfaça todas as equações. Pode ser possível determinado, com solução única; possível indeterminado, com infinitas; ou impossível, sem solução. Somar a uma equação um múltiplo da outra preserva as soluções porque a operação pode ser desfeita. Multiplicar uma equação por zero não é reversível.",
		why: "Retas não paralelas se cruzam em um ponto. Retas coincidentes descrevem os mesmos pares. Retas paralelas distintas não compartilham pares. Na eliminação, 0=0 indica que uma equação não acrescentou informação; 0=c, c≠0, é uma contradição. Classifique o sistema inteiro, considerando também a equação restante.",
		example: [
			"Resolva x+y=9 e 2x+y=14. Subtraia a primeira da segunda: x=5.",
			"Substitua em x+y=9: y=4. O par candidato é (5,4).",
			"Confira nos dois relatórios: 5+4=9 e 2·5+4=14. A solução única é S={(5,4)}.",
		],
		trap: "Uma conta que termina em 0=0 não significa que qualquer par serve. Em x+y=9 e 2x+2y=18, todos os pares da reta x+y=9 servem, mas (0,0) não. Não confunda infinitas soluções com ausência de restrições.",
		transfer:
			"Modelos de produção, pesquisas sociais e distribuição de horários podem gerar sistemas. Declare as unidades e verifique se soluções reais também satisfazem as condições do contexto, como quantidades inteiras e não negativas. A álgebra pode resolver um modelo mal escolhido sem perceber o problema.",
		quiz: `Resolva x+y=9 e 2x+y=14. | (5,4) | (4,5) | (9,14) | A subtração fornece x=5; então y=4.
Como classificar x+y=2 e 2x+2y=4? | Infinitas soluções | Solução única | Nenhuma solução | A segunda equação é o dobro da primeira; ambas descrevem a mesma reta.
Como classificar x+y=2 e 2x+2y=5? | Nenhuma solução | Infinitas soluções | Solução (1,1) | Dobrar a primeira exigiria 2x+2y=4, incompatível com 5.
Qual operação preserva as soluções de um sistema? | Somar à segunda equação duas vezes a primeira | Multiplicar a primeira por zero e descartá-la | Trocar x por 0 | A primeira operação é reversível por subtração do mesmo múltiplo.
Em x+y=2 e 2x+2y=4, (0,0) é solução? | Não | Sim | Todo par é solução | Apesar de haver infinitos pares, todos precisam satisfazer x+y=2.
Resolva x−y=1 e x+y=5. | (3,2) | (2,3) | (4,1) | Somando, 2x=6; logo x=3 e y=2.
Uma eliminação termina em 0=3. O que isso indica? | Contradição | Uma identidade | x=3 | Nenhum valor das incógnitas torna 0 igual a 3.
No sistema x=2 e y=−1, qual é o conjunto solução? | {(2,−1)} | {2,−1} | {(−1,2)} | O elemento do conjunto solução é um par ordenado, com x primeiro.
Uma solução representa número de pessoas e resulta x=2,5. O que fazer? | Rever a adequação ao contexto | Arredondar sem conferir | Aceitar meia pessoa | A solução real pode ser incompatível com uma contagem inteira; arredondar pode violar as equações.
Se ax+y=1 e 2x+y=3, quando as retas são paralelas distintas? | a=2 | a=0 | a=1 | Com a=2 os lados esquerdos são iguais e os direitos distintos.`,
	}),
	lesson({
		n: 16,
		title: "Discriminante e o parâmetro suspeito",
		goal: "Determinar condições para raízes reais e raízes duplas.",
		prereq: "Equações quadráticas e discriminante do passo 7.",
		hook: "Um problema esconde um número sob a letra k e exige ‘exatamente uma raiz real’. É um enigma com pista forte: duas raízes estão tentando ocupar o mesmo endereço. O discriminante detecta o encontro.",
		concept:
			"Para ax²+bx+c=0, a≠0, Δ=b²−4ac. Se Δ>0, há duas raízes reais distintas; se Δ=0, há uma raiz real distinta de multiplicidade dois; se Δ<0, não há raízes reais. A fórmula é x=(−b±√Δ)/(2a). Antes de usar Δ com parâmetros, confira se o coeficiente de x² continua diferente de zero.",
		why: "Completar o quadrado transforma a equação em (x+b/(2a))²=Δ/(4a²). Como 4a²>0 e um quadrado real é não negativo, o sinal de Δ explica os três casos. Esta justificativa retoma a ideia geométrica; a dedução geral não é prioridade da P1 2025.2, segundo o acervo.",
		example: [
			"Em x²−6x+k=0, temos a=1, b=−6 e c=k. Portanto Δ=36−4k.",
			"Uma raiz real distinta exige Δ=0: 36−4k=0, logo k=9.",
			"A equação vira (x−3)²=0, com raiz dupla x=3. Para k<9 há duas raízes reais; para k>9 não há raízes reais.",
		],
		trap: "Se a=0, a equação deixa de ser quadrática e precisa de análise própria. Em kx²+x−1=0, k=0 produz a equação linear x−1=0, que também possui uma solução real. Ignorar esse caso perde soluções do problema com parâmetro.",
		transfer:
			"Ao escrever uma solução discursiva, registre os coeficientes, o discriminante, a condição pedida e a verificação. ‘Uma raiz’ deve ser interpretado com cuidado: uma raiz distinta pode ter multiplicidade dois. Faça essa distinção em suas próprias palavras.",
		quiz: `Em x²−6x+k=0, qual k produz raiz dupla? | 9 | 6 | 36 | Δ=36−4k=0 implica k=9.
Para x²−6x+k=0 ter duas raízes reais distintas, qual condição vale? | k<9 | k>9 | k=9 | Precisamos de Δ=36−4k>0.
Qual é Δ de 2x²−3x+1=0? | 1 | 17 | 5 | Δ=(−3)²−4·2·1=9−8=1.
Quais são as raízes de 2x²−3x+1=0? | 1 e 1/2 | 1 e 2 | −1 e −1/2 | Pela fórmula, x=(3±1)/4.
Quantas raízes reais distintas tem x²+4=0? | 0 | 1 | 2 | O discriminante é −16; nenhum quadrado real vale −4.
Qual é a raiz de x²+4x+4=0? | −2 | 2 | −4 | A expressão é (x+2)², cujo zero é −2.
Em kx²+x−1=0, o caso k=0 é qual equação? | x−1=0 | x²−1=0 | −1=0 | O termo quadrático desaparece e resta uma equação linear.
Qual condição precisa vir antes da fórmula quadrática? | a≠0 | b≠0 | c≠0 | O denominador 2a e a classificação quadrática exigem a diferente de zero.
Se Δ=0 numa quadrática, quantas raízes reais distintas existem? | 1 | 2 | 0 | As duas expressões da fórmula coincidem; a raiz tem multiplicidade dois.
Qual condição dá raízes reais a x²+k=0? | k≤0 | k≥0 | k>0 | Precisamos de x²=−k≥0, portanto k≤0.`,
	}),
	lesson({
		n: 17,
		title: "Biquadradas: a troca que precisa voltar",
		goal: "Resolver equações biquadradas e controlar a restrição t≥0.",
		prereq: "Raízes quadráticas, fatoração e discriminante.",
		hook: "Uma equação de quarto grau chega usando apenas x⁴ e x². Ela parece enorme, mas repete a mesma peça. Trocar x² por t é como perceber que o monstro final usa o mesmo padrão do tutorial. Só não esqueça de voltar para x.",
		concept:
			"Uma biquadrada tem a forma ax⁴+bx²+c=0, a≠0. Com t=x², obtemos at²+bt+c=0. No universo real, somente t≥0 pode gerar x. Se t>0, aparecem x=±√t; se t=0, apenas x=0; se t<0, não há x real associado.",
		why: "A substituição funciona porque x⁴=(x²)²=t². Resolver a quadrática em t fornece candidatos, não as respostas finais. O mapa x↦x² junta os valores opostos x e −x: por isso cada t positivo produz duas raízes reais. A simetria explica por que raízes não nulas vêm aos pares.",
		example: [
			"Resolva x⁴−5x²+4=0. Com t=x²: t²−5t+4=(t−1)(t−4)=0.",
			"As possibilidades t=1 e t=4 são não negativas. Retorne: x²=1 ou x²=4.",
			"Logo S={−2,−1,1,2}. Conferindo x=2: 16−20+4=0; as raízes opostas funcionam porque só há potências pares.",
		],
		trap: "Não escreva x=1 ou x=4 depois de resolver t. Também não aceite x=±√(−1) como raízes reais. O exercício pode ter zero, uma, duas, três ou quatro raízes reais distintas; a raiz zero não ganha uma cópia por usar ±0.",
		transfer:
			"Use um roteiro de três verbos: substituir, filtrar, retornar. Em problemas de medidas, ainda pode haver uma condição extra x≥0. As quatro soluções algébricas não são automaticamente quatro medidas possíveis.",
		quiz: `Com t=x², em que se transforma x⁴−5x²+4=0? | t²−5t+4=0 | t⁴−5t+4=0 | t²−5t²+4=0 | Substituímos x⁴ por t² e x² por t.
Se t=9, quais x reais correspondem a t=x²? | −3 e 3 | Apenas 3 | −9 e 9 | As duas raízes quadradas com sinais opostos têm quadrado 9.
Se t=−4, quantos x reais correspondem? | 0 | 2 | 1 | Um quadrado real nunca é negativo.
Se t=0, qual é o conjunto de valores de x? | {0} | {−1,1} | ∅ | x²=0 só é possível para x=0.
Qual é a solução real de x⁴−5x²+4=0? | {−2,−1,1,2} | {1,4} | {−4,−1,1,4} | Os valores de t são 1 e 4; suas raízes quadradas geram os quatro x.
Resolva x⁴−9=0 em ℝ. | {−√3,√3} | {−3,3} | ∅ | t²=9 dá t=3 ou −3; apenas t=3 gera x real.
Quantas raízes reais distintas tem x⁴−4x²=0? | 3 | 4 | 2 | x²(x²−4)=0 gera x=0 e x=±2.
Qual é a solução real de x⁴+x²+1=0? | ∅ | {−1,1} | {0} | Todos os termos são não negativos e o termo constante é positivo; a soma nunca zera.
Se uma medida x≥0 satisfaz x⁴−5x²+4=0, quais valores são admissíveis? | 1 e 2 | −2 e −1 | 1 e 4 | Filtramos as quatro raízes pela condição de medida não negativa.
Por que raízes não nulas aparecem aos pares numa biquadrada? | Substituir x por −x preserva as potências pares | Toda equação tem raízes opostas | O grau sempre dá quatro raízes reais | A simetria vem dos expoentes pares; não vale para qualquer equação.`,
	}),
	lesson({
		n: 18,
		title: "A régua dos sinais",
		goal: "Construir e justificar tabelas de sinais de produtos.",
		prereq: "Fatoração e inequações dos passos 8 e 9.",
		hook: "Um produto fica positivo quando seus dois fatores são negativos. Isso pode parecer uma conspiração até você olhar cada intervalo. A missão é montar uma régua em que nenhuma troca de sinal aconteça escondida.",
		concept:
			"Para estudar um produto, encontre os zeros dos fatores e divida a reta nesses pontos. Em cada intervalo sem zeros, fatores lineares mantêm o sinal. Um produto é positivo com um número par de fatores negativos e negativo com um número ímpar. Nas desigualdades ≥ ou ≤, zeros do produto podem entrar se a expressão estiver definida.",
		why: "O fator x−a é negativo antes de a e positivo depois de a. Uma raiz de multiplicidade ímpar provoca troca de sinal; de multiplicidade par não provoca. Isso explica o comportamento de (x−a)²: nunca é negativo. Não basta alternar sinais mecanicamente sem observar multiplicidades.",
		example: [
			"Resolva (x−1)(x−3)≤0. Os pontos críticos são 1 e 3; eles dividem a reta em três intervalos.",
			"Antes de 1, ambos os fatores são negativos: produto positivo. Entre 1 e 3, os sinais são + e −: produto negativo. Depois de 3: ambos positivos.",
			"Escolhemos o intervalo central e incluímos os zeros, pois ≤ aceita igualdade. S=[1,3]. Testar x=2 confirma o produto −1.",
		],
		trap: "‘O produto é negativo, então os dois fatores são negativos’ está errado: dois negativos produzem positivo. E uma raiz dupla pode apenas encostar no zero. Em (x−2)²>0, todos os reais servem exceto 2; não há intervalo negativo.",
		transfer:
			"Uma tabela de sinais é um argumento sobre intervalos inteiros, não só sobre números testados. Justifique por que não há novos zeros dentro de cada intervalo. Depois escreva a solução em frase e em notação de conjuntos: duas formas de detectar um extremo esquecido.",
		quiz: `Qual é a solução de (x−1)(x−3)≤0? | [1,3] | (−∞,1]∪[3,∞) | (1,3) | O produto é negativo entre as raízes e zero nos extremos.
Qual é a solução de (x−1)(x−3)>0? | (−∞,1)∪(3,∞) | (1,3) | [1,3] | O produto é positivo fora das raízes, que não entram na desigualdade estrita.
Qual é o sinal de (x−1)(x−3) em x=2? | Negativo | Positivo | Zero | Os fatores valem 1 e −1, com produto −1.
Em x<1, quais são os sinais de x−1 e x−3? | Ambos negativos | Ambos positivos | Um positivo e outro negativo | Um número menor que 1 também é menor que 3.
Qual é a solução de (x−2)²>0? | ℝ sem 2 | x>2 | ℝ | O quadrado só deixa de ser positivo em x=2.
Qual é a solução de (x−2)²<0? | ∅ | x<2 | ℝ sem 2 | Um quadrado real nunca é negativo.
Ao atravessar uma raiz dupla, o sinal necessariamente muda? | Não | Sim | Só se a raiz for positiva | Multiplicidade par mantém o sinal dos fatores restantes no entorno.
Qual é a solução de x(x−2)≥0? | (−∞,0]∪[2,∞) | [0,2] | (0,2) | Os dois fatores têm o mesmo sinal fora do intervalo entre as raízes; os zeros entram.
Um produto de três fatores estritamente negativos tem que sinal? | Negativo | Positivo | Zero | Três é uma quantidade ímpar de sinais negativos.
Qual justificativa permite escolher um teste por intervalo para fatores lineares? | Cada fator só muda de sinal no seu zero | Um único teste prova qualquer função positiva | Todos os intervalos têm o mesmo sinal | A análise depende de termos identificado todos os pontos onde o sinal pode mudar.`,
	}),
	lesson({
		n: 19,
		title: "Quocientes: o ponto que nunca entra",
		goal: "Resolver inequações racionais sem perder o domínio.",
		prereq: "Tabela de sinais, intervalos e frações algébricas.",
		hook: "Você simplifica (x−2)/(x−2) e obtém 1. Tudo parece resolvido, até x=2 bater à porta. O cancelamento apagou o fator da expressão, mas não pode apagar a restrição que veio com ele.",
		concept:
			"Um quociente exige denominador diferente de zero. Para resolver uma inequação racional, registre o domínio, encontre zeros do numerador e do denominador, estude os sinais e só depois selecione os intervalos. Zeros do denominador nunca entram; zeros do numerador entram apenas quando a desigualdade aceita igualdade e o domínio permite.",
		why: "Multiplicar uma desigualdade por um denominador de sinal desconhecido pode inverter o sentido sem aviso. A tabela evita isso: o sinal do quociente é positivo quando numerador e denominador têm o mesmo sinal. Uma simplificação algébrica é uma igualdade no domínio comum, não uma permissão para reinserir pontos proibidos.",
		example: [
			"Resolva ((x−2)(x−4))/((x+3)(x−1))≥0. Primeiro x≠−3 e x≠1. Os pontos críticos ordenados são −3,1,2,4.",
			"Da esquerda para a direita, os sinais nos cinco intervalos são +,−,+,−,+. Todos os fatores têm multiplicidade um, logo o sinal troca a cada ponto crítico.",
			"Escolhendo sinais não negativos: S=(−∞,−3)∪(1,2]∪[4,∞). −3 e 1 ficam excluídos pelo domínio; 2 e 4 entram como zeros válidos.",
		],
		trap: "Não multiplique por x−1 como se ele fosse positivo em toda a reta. Se preferir multiplicar, separe explicitamente os casos x>1 e x<1. Em (x−2)/(x−2)≥0, a resposta continua ℝ sem 2, mesmo que a forma reduzida seja 1.",
		transfer:
			"A organização do argumento importa tanto quanto a conta: domínio, pontos críticos, sinais, resposta e conferência. O exemplo corresponde à expressão destacada no acervo para P1 D2; a solução aqui foi calculada diretamente, sem depender de um gabarito oficial não conferido.",
		quiz: `Qual é o domínio de (x−2)/(x−2)? | ℝ sem 2 | ℝ | ℝ sem 0 | O denominador zera em 2 e a simplificação não muda essa restrição.
Qual é a solução de (x−2)/(x−2)≥0? | ℝ sem 2 | ℝ | [2,∞) | No domínio o quociente vale 1; x=2 permanece proibido.
Qual é a solução de (x−2)/(x−1)≥0? | (−∞,1)∪[2,∞) | [1,2] | (1,2) | Antes de 1 os sinais são iguais; entre 1 e 2 são opostos; a partir de 2 o quociente é não negativo.
Na expressão do exemplo, quais pontos são proibidos? | −3 e 1 | 2 e 4 | −3 e 4 | São os zeros do denominador (x+3)(x−1).
Na expressão do exemplo, quais zeros podem entrar em ≥0? | 2 e 4 | −3 e 1 | Todos os quatro | Os zeros do numerador são permitidos porque não anulam o denominador.
Qual é o sinal de 1/(x−1) quando x<1? | Negativo | Positivo | Zero | O numerador é positivo e o denominador negativo.
Qual é a solução de 1/(x−1)>0? | (1,∞) | [1,∞) | (−∞,1) | O denominador precisa ser positivo; x=1 não pertence ao domínio.
Pode-se multiplicar por x−1 sem analisar seu sinal? | Não | Sim, sempre | Sim, se a desigualdade for ≥ | O sentido da desigualdade depende do sinal do fator multiplicador.
Qual é a solução de (x−2)²/(x+1)≤0? | (−∞,−1)∪{2} | (−∞,−1] | [−1,2] | O numerador é positivo exceto em 2; o quociente é negativo antes de −1 e zero em 2.
Qual é o sinal da expressão do exemplo para x>4? | Positivo | Negativo | Zero | Os quatro fatores são estritamente positivos nesse intervalo.`,
	}),
	lesson({
		n: 20,
		title: "Missão P1: defender uma solução",
		goal: "Integrar os fundamentos e construir justificativas completas.",
		prereq: "Passos 1 a 19; reveja o tema de cada erro antes de repetir.",
		hook: "Chegou a banca da sua própria solução. Ela aceita calculadora mental, rascunho e uma dose moderada de café imaginário. Mas vai pedir: ‘Por que esse intervalo? De onde saiu essa raiz?’ A missão é fazer o raciocínio sobreviver a essas perguntas.",
		concept:
			"Resolver é produzir valores que satisfazem condições; justificar é mostrar por que todos os valores obtidos servem e nenhum outro serve. Uma resposta discursiva precisa declarar universo, restrições, transformações equivalentes e conjunto solução. Esta revisão é autoral e combina habilidades do mapa da P1 2025.2, sem reproduzir a prova.",
		why: "Cada transformação deve preservar as soluções ou ter seus candidatos conferidos ao final. Dividir por uma expressão que pode zerar exige separar casos. Elevar ao quadrado pode introduzir soluções. Testar candidatos confirma inclusão, mas a garantia de completude vem do método, não de experimentar alguns números.",
		example: [
			"Determine k para que x²−4x+k=0 tenha uma raiz real distinta. A equação é quadrática porque a=1.",
			"Calcule Δ=16−4k e imponha Δ=0. Então k=4 e a equação fica (x−2)²=0.",
			"Conclua: k=4, com raiz dupla x=2. Verifique 2²−4·2+4=0 e explique que qualquer k diferente muda o sinal de Δ para um dos outros casos.",
		],
		trap: "Uma lista de respostas sem restrições não permite revisar o método. Também evite justificar uma identidade por um único exemplo: exemplos podem refutar uma afirmação universal, mas não demonstrá-la. Quando errar, identifique a decisão incorreta, não apenas o número final.",
		transfer:
			"Faça esta revisão em duas passagens: primeiro sem consulta; depois explique cada alternativa escolhida com uma frase e uma conta. Se um tema travar, retorne ao passo indicado pelo assunto. O objetivo é autonomia: contar, transformar, resolver e comunicar.",
		quiz: `Se A={1,2,3} e B={3,4}, qual é A∩B? | {3} | {1,2,3,4} | ∅ | A interseção contém apenas o elemento comum 3.
Um conjunto com 5 elementos tem quantos subconjuntos próprios? | 31 | 32 | 30 | Há 2⁵=32 subconjuntos e só o completo é excluído.
Quanto vale 8^(2/3)·2⁻¹? | 2 | 4 | 8 | A raiz cúbica de 8 é 2; 2²·1/2=2.
Quanto vale ln(e²)+log₃27? | 5 | 6 | 2 | As duas parcelas valem 2 e 3.
Resolva 3x−5=7 em ℝ. | {4} | {2/3} | {−4} | Somando 5 e dividindo por 3, obtemos x=4.
Resolva x+y=6 e x−y=2. | {(4,2)} | {(2,4)} | {(3,3)} | Somando as equações: 2x=8; depois y=2.
Qual k dá raiz dupla a x²−4x+k=0? | 4 | 2 | 16 | Δ=16−4k=0 implica k=4.
Quais são as raízes reais de x⁴−10x²+9=0? | −3,−1,1,3 | 1 e 9 | −9,−1,1,9 | t²−10t+9=(t−1)(t−9); retornar a x dá ±1 e ±3.
Qual é a solução de 2x−1≥3 e x<5? | [2,5) | (2,5] | [2,∞) | A primeira condição dá x≥2; intersectando com x<5 resulta [2,5).
Qual é a solução de (x−1)/(x+2)<0? | (−2,1) | [−2,1] | (−∞,−2)∪(1,∞) | O quociente é negativo entre os pontos críticos; −2 é proibido e 1 não satisfaz a desigualdade estrita.`,
	}),
];

const redistribution = {
	11: 5,
	12: 6,
	13: 8,
	14: 10,
	15: 12,
	16: 14,
	17: 15,
	18: 17,
	19: 19,
	20: 20,
};
export default [
	...foundations,
	...investigations.map((item) => ({
		...item,
		n: redistribution[item.n],
		prereq: {
			11: "Linguagem, inclusão e operações entre conjuntos (passos 1 a 4).",
			12: "Conjuntos numéricos e operações entre conjuntos (passos 2 a 4).",
			13: "Potências inteiras e frações (passo 7).",
			14: "Potências e definição de logaritmo (passos 7 a 9).",
			15: "Equações lineares (passo 11).",
			16: "Métodos para equações quadráticas (passo 13).",
			17: "Equações quadráticas e raízes (passos 13 e 14).",
			18: "Fatoração e inequações lineares (passos 13 e 16).",
			19: "Produtos e tabelas de sinais (passos 17 e 18).",
			20: "Passos 1 a 19; retome o tema de cada erro.",
		}[item.n],
	})),
].sort((a, b) => a.n - b.n);
