import { lesson } from "../estrutura.mjs";
export default [
	lesson({
		n: 7,
		title: "Divisibilidade e divisão euclidiana",
		source: "Rosen, 6ª ed., §3.4",
		goal: "Aplicar a definição de divisibilidade e encontrar quociente e resto, inclusive para inteiros negativos.",
		prereq: "Inteiros, multiplicação e provas diretas.",
		hook: "Distribuir 29 peças em caixas de cinco deixa quatro peças fora. Essa sobra tem uma regra: precisa ser não negativa e menor que a capacidade da caixa.",
		concept:
			"Para inteiros a≠0 e b, a divide b, escrito a∣b, se b=ak para algum k∈ℤ. Isso é uma afirmação, não a fração a/b. Para todo inteiro n e divisor positivo d, há únicos q,r∈ℤ tais que n=dq+r e 0≤r<d. Uma divisão exata tem resto zero. Se a divide b e c, divide também toda combinação inteira ub+vc.",
		why: "Os múltiplos consecutivos de d separam os inteiros em blocos. Há um único bloco que contém n; sua posição determina q, e a distância até seu início determina r. Para combinações lineares, b=ak e c=aℓ implicam ub+vc=a(uk+vℓ), um múltiplo de a.",
		example: [
			"Para dividir −17 por 5 na convenção euclidiana, procure −17=5q+r com 0≤r<5.",
			"Com q=−4, temos 5q=−20 e r=3. A alternativa q=−3 daria r=−2 e viola a condição do resto.",
			"Confira: 5·(−4)+3=−17 e 0≤3<5. Logo o par correto é (−4,3); a convenção precisa ser explícita ao comparar com operadores de linguagens de programação.",
		],
		trap: "Não confunda quociente truncado em direção a zero com quociente euclidiano para dividendo negativo. E a∣b não significa b∣a: 3 divide 12, mas 12 não divide 3.",
		transfer:
			"Use quociente e resto para endereçar posições em blocos, repartir dados e interpretar operações de módulo. Declare sempre o divisor positivo e a faixa escolhida para o resto.",
		quiz: `A afirmação 4∣28 é verdadeira? | Sim, pois 28=4·7. | Não, pois 4<28. | Sim, pois 4=28·7. | Divisibilidade exige que o segundo número seja múltiplo inteiro do primeiro.
Qual par (q,r) satisfaz 29=5q+r, com 0≤r<5? | (5,4). | (6,−1). | (4,9). | 5·5+4=29 e o resto 4 está na faixa exigida.
Qual é o resto euclidiano de −17 por 5? | 3. | −2. | 2. | −17=5·(−4)+3; a convenção exige resto não negativo.
Se a∣b e a∣c, o que sempre vale? | a∣(b+c). | b∣a. | a=b=c. | Escrever b=ak e c=aℓ dá b+c=a(k+ℓ).
Qual número é divisível por 7? | 91. | 93. | 95. | 91=7·13.
Qual é o quociente euclidiano de −1 por 4? | −1. | 0. | 1. | −1=4·(−1)+3. O quociente 0 deixaria um resto negativo.
Na divisão por um divisor positivo d, qual condição o resto deve satisfazer? | 0≤r<d. | 0<r≤d. | −d<r≤0. | Essa faixa padroniza o resto e garante a unicidade da divisão.
Para a≠0, qual afirmação sempre vale? | a∣0. | 0∣a. | a∣1. | O inteiro 0 é a·0; a divisibilidade de 1 só vale para a=1 ou a=−1.
Se 6∣a e 6∣b, qual expressão é certamente divisível por 6? | 2a−3b. | a+1. | b−1. | Combinações com coeficientes inteiros preservam a divisibilidade por 6.
Qual é o par euclidiano de 42 por 7? | (6,0). | (5,7). | (7,−7). | A divisão é exata: 42=7·6+0; um resto igual ao divisor não é permitido.`,
	}),
	lesson({
		n: 8,
		title: "MDC, MMC e o algoritmo de Euclides",
		source: "Rosen, 6ª ed., §§3.5–3.6",
		goal: "Calcular MDC e MMC e usar divisões sucessivas e combinações de Bézout.",
		prereq: "Divisão euclidiana e divisibilidade.",
		hook: "Duas rotinas se repetem a cada 12 e 18 minutos. Descobrir quando coincidem novamente é diferente de descobrir o maior bloco que reparte ambos os intervalos sem sobra.",
		concept:
			"Para inteiros positivos a,b, mdc(a,b) é seu maior divisor comum positivo; mmc(a,b), o menor múltiplo comum positivo. Eles satisfazem mdc(a,b)·mmc(a,b)=ab. No algoritmo de Euclides, se a=bq+r, então mdc(a,b)=mdc(b,r); o último resto não nulo é o MDC. Existem inteiros u,v com mdc(a,b)=ua+vb, identidade de Bézout. Se o MDC é 1, os números são coprimos.",
		why: "Um divisor comum de a e b divide r=a−bq. Um divisor comum de b e r divide a=bq+r. Portanto os conjuntos de divisores comuns coincidem, justificando cada etapa de Euclides. Reverter as substituições expressa o último resto como combinação dos números iniciais.",
		example: [
			"Calcule mdc(252,105): 252=2·105+42; 105=2·42+21; 42=2·21+0.",
			"O último resto não nulo é 21. Recuando: 21=105−2·42=105−2(252−2·105)=5·105−2·252.",
			"Confira: 525−504=21. Além disso, mmc(252,105)=252·105/21=1260. MDC e MMC respondem perguntas diferentes.",
		],
		trap: "O último resto do algoritmo é zero; o MDC é o último resto não nulo. Para o MMC, dividir o produto pelo MDC evita contar fatores comuns duas vezes. Para casos envolvendo zero, declare a convenção: mdc(a,0)=a quando a>0.",
		transfer:
			"Use o MMC para sincronizar ciclos e o MDC para simplificar razões. A identidade de Bézout será usada para decidir quando existe um inverso modular.",
		quiz: `Quanto vale mdc(48,18)? | 6. | 12. | 3. | 48=2·18+12; 18=12+6; 12=2·6. O último resto não nulo é 6.
Quanto vale mmc(12,18)? | 36. | 216. | 6. | O MDC é 6, então o MMC é 12·18/6=36.
No algoritmo de Euclides, qual resto fornece o MDC? | O último resto não nulo. | O último resto, que é zero. | O primeiro resto, sempre. | As divisões preservam os divisores comuns até a divisão exata final.
Qual par é coprimo? | 14 e 25. | 14 e 21. | 25 e 35. | 14=2·7 e 25=5² não têm fator primo comum.
Se a=bq+r, qual igualdade é válida? | mdc(a,b)=mdc(b,r). | mdc(a,b)=q. | mdc(a,b)=a+b. | Um divisor de a e b divide r, e um divisor de b e r divide a.
Qual identidade de Bézout para 35 e 12 produz o MDC 1? | 3·12−35=1. | 35−2·12=1. | 35+12=1. | 36−35=1, logo 35 e 12 são coprimos.
Quanto vale mdc(21,0), na convenção para primeiro argumento positivo? | 21. | 0. | 1. | Os divisores comuns positivos são os divisores de 21, cujo maior é 21.
Se mdc(a,b)=4 e ab=240, quanto vale mmc(a,b), para a,b positivos? | 60. | 960. | 244. | Pela identidade, o MMC é 240/4=60.
Dois eventos se repetem a cada 8 e 12 minutos e coincidem agora. Em quanto tempo coincidem novamente? | 24 minutos. | 4 minutos. | 96 minutos. | Procuramos o menor múltiplo comum positivo, que é 24.
Qual escrita confere mdc(252,105)=21 por Bézout? | 5·105−2·252=21. | 2·105−5·252=21. | 252−105=21. | A combinação resulta em 525−504=21 e vem da substituição reversa de Euclides.`,
	}),
	lesson({
		n: 9,
		title: "Primos e fatoração: as peças dos inteiros",
		source: "Rosen, 6ª ed., §3.5",
		goal: "Reconhecer primos e compostos e aplicar a unicidade da fatoração.",
		prereq: "Divisibilidade e MDC.",
		hook: "Para verificar se 97 é primo, é preciso tentar dividi-lo por todos os inteiros menores? Um argumento sobre pares de fatores reduz muito essa investigação.",
		concept:
			"Um inteiro p>1 é primo quando seus únicos divisores positivos são 1 e p. Um inteiro maior que 1 que não é primo é composto; 1 não pertence a nenhuma dessas duas classes. Pelo teorema fundamental da aritmética, todo inteiro maior que 1 tem fatoração em primos única, a menos da ordem dos fatores. Se n é composto, tem um divisor primo não maior que √n. Se p é primo e p∣ab, então p divide a ou b.",
		why: "Se n=ab, com a,b>1, não podem ambos ser maiores que √n, pois o produto excederia n. Um fator não maior que √n possui um divisor primo também nessa faixa. A primalidade é crucial no lema sobre produtos: um fator composto pode dividir um produto sem dividir nenhum fator individualmente.",
		example: [
			"Para testar 97, basta examinar os primos até √97<10: 2,3,5 e 7.",
			"97 é ímpar, sua soma de algarismos é 16, não termina em 0 ou 5, e 7·13=91 deixa resto 6. Nenhum desses primos o divide.",
			"Portanto 97 é primo. Em contraste, 84=2²·3·7 é composto, e os expoentes dessa fatoração descrevem seus divisores.",
		],
		trap: "Ser ímpar não garante ser primo: 9 e 15 são compostos. O número 1 não é primo; incluí-lo como primo destruiria a unicidade da fatoração ao permitir acrescentar fatores 1 arbitrariamente.",
		transfer:
			"Fatorações ajudam a calcular MDC, MMC e a compreender denominadores e resíduos. Distinguir “parece primo” de “foi testado até um limite justificado” é parte do raciocínio matemático.",
		quiz: `Qual número é primo? | 29. | 1. | 27. | 29 não é divisível por 2,3 ou 5, os primos até sua raiz quadrada.
Como se classifica o número 1? | Nem primo nem composto. | Primo. | Composto. | As duas definições exigem inteiro maior que 1.
Qual é a fatoração prima de 84? | 2²·3·7. | 2·3²·7. | 2²·3·5. | 4·3·7=84.
Para testar se 97 é primo por divisões, quais primos bastam? | 2,3,5 e 7. | Somente 2. | Todos os primos até 97. | Um composto possui divisor primo até sua raiz; √97 é menor que 10.
Se p é primo e divide ab, o que se conclui? | p divide a ou p divide b. | p divide necessariamente a e b. | a=b. | O lema exige primalidade e usa “ou” inclusivo.
Qual exemplo mostra que a conclusão anterior falha para divisor composto? | 6∣(2·3), mas 6 não divide 2 nem 3. | 2∣(2·3). | 3∣9. | O divisor composto 6 pode distribuir seus fatores primos entre os dois fatores do produto.
Quantos divisores positivos possui 12=2²·3? | 6. | 5. | 12. | Escolhemos expoente 0,1 ou 2 para 2 e 0 ou 1 para 3: 3·2=6.
Qual número é composto e ímpar? | 15. | 13. | 2. | 15=3·5, mostrando que ser ímpar não basta para primalidade.
O que significa a unicidade da fatoração prima? | Os fatores primos e seus expoentes são determinados, ignorando a ordem. | Só existe uma ordem possível para multiplicá-los. | Todo número tem exatamente dois fatores primos distintos. | Trocar a ordem dos fatores não gera uma fatoração essencialmente diferente.
Há um maior número primo? | Não; o argumento do produto de uma lista de primos mais 1 refuta qualquer lista completa finita. | Sim, mas ele é desconhecido. | Sim, o maior é 97. | Um divisor primo do produto mais 1 não pertence à lista, pois deixaria resto 1 em cada primo listado.`,
	}),
	lesson({
		n: 10,
		title: "Congruências: números com o mesmo resto",
		source: "Rosen, 6ª ed., §§3.4 e 3.7",
		goal: "Operar congruências e reconhecer limites do cancelamento modular.",
		prereq: "Divisão euclidiana, divisibilidade e MDC.",
		hook: "Num relógio de doze horas, avançar quinze horas tem o mesmo efeito que avançar três. Os inteiros não se tornam iguais: ficam equivalentes para uma pergunta específica sobre restos.",
		concept:
			"Para m≥2, a≡b (mod m) significa m∣(a−b), equivalentemente, a e b têm o mesmo resto euclidiano módulo m. Podemos somar, subtrair e multiplicar congruências com o mesmo módulo. Potências inteiras positivas também preservam a congruência. Para cancelar um fator c sem mudar o módulo, precisamos de mdc(c,m)=1. Um sistema completo de resíduos é {0,1,…,m−1}.",
		why: "Se a−b=mk e c−d=mℓ, então (a+c)−(b+d)=m(k+ℓ). Para produtos, ac−bd=c(a−b)+b(c−d), também múltiplo de m. Cancelar é diferente: só podemos desfazer uma multiplicação quando o fator tem inverso modular.",
		example: [
			"Calcule 7²⁰ módulo 5. Primeiro reduza 7≡2 (mod 5).",
			"Como 2⁴=16≡1 (mod 5), temos 2²⁰=(2⁴)⁵≡1⁵≡1 (mod 5).",
			"O resto procurado é 1. Confira o padrão das potências de 2: 2,4,3,1, que se repete. A redução evita construir um inteiro enorme.",
		],
		trap: "Em módulo 6, 2·1≡2·4, mas 1 não é congruente a 4. Não é permitido cancelar 2 nesse módulo, pois mdc(2,6)=2. A congruência original só implica uma relação com módulo reduzido.",
		transfer:
			"Use classes de restos para ciclos, calendários, posições circulares e verificações aritméticas. O módulo faz parte da afirmação: equivalência em módulo 5 não implica equivalência em módulo 7.",
		quiz: `O que significa a≡b (mod m)? | m divide a−b. | a=b nos inteiros. | a divide m. | A diferença ser múltiplo de m equivale a ter o mesmo resto euclidiano.
Qual representante está em {0,1,…,6} e é congruente a −8 módulo 7? | 6. | −1. | 1. | −8=7·(−2)+6.
Quanto vale o resto de 38+27 por 5? | 0. | 3. | 2. | 38≡3 e 27≡2; a soma é congruente a 5, ou 0.
Quanto vale o resto de 9·8 por 7? | 2. | 1. | 4. | 9≡2 e 8≡1, portanto o produto é congruente a 2.
Qual é o resto de 2¹⁰ por 7? | 2. | 4. | 1. | 2³≡1, então 2¹⁰=(2³)³·2≡2.
Qual condição permite cancelar c numa congruência módulo m sem alterar o módulo? | mdc(c,m)=1. | c ser positivo, apenas. | c<m, apenas. | A coprimalidade garante a existência do inverso de c no módulo.
É válido deduzir 1≡4 (mod 6) de 2·1≡2·4 (mod 6)? | Não; 2 não é invertível módulo 6. | Sim; pode-se sempre dividir uma congruência por 2. | Sim; 1 e 4 têm o mesmo resto por 6. | Os produtos diferem por 6, mas 1 e 4 diferem por 3, que não é múltiplo de 6.
Quais inteiros são congruentes a 3 módulo 5? | Os da forma 3+5k, k∈ℤ. | Somente o inteiro 3. | Os da forma 5+3k, sempre. | A diferença para 3 deve ser um múltiplo inteiro de 5.
Qual é o resto de 7²⁰ por 5? | 1. | 2. | 4. | 7≡2 e 2⁴≡1; como 20 é múltiplo de 4, o resultado é 1.
De a≡b (mod m), para inteiro n≥1, o que sempre vale? | aⁿ≡bⁿ (mod m). | a/n≡b/n em qualquer caso. | a=b. | Multiplicar congruências repetidamente preserva o módulo; divisão exige condições adicionais.`,
	}),
	lesson({
		n: 11,
		title: "Inversos e equações modulares",
		source: "Rosen, 6ª ed., §3.7",
		goal: "Decidir se há inverso e resolver congruências lineares.",
		prereq: "Congruências, MDC e identidade de Bézout.",
		hook: "Na aritmética usual, dividir por 3 resolve 3x=1 nos racionais. Em módulo 7, a tarefa é outra: encontrar um inteiro cujo produto por 3 deixe resto 1.",
		concept:
			"Um inverso de a módulo m é um inteiro u com au≡1 (mod m). Ele existe exatamente quando mdc(a,m)=1. Bézout fornece u ao escrever 1=ua+vm. A congruência ax≡b (mod m) tem solução se e somente se d=mdc(a,m) divide b; quando tem, possui d classes de soluções módulo m. Se a é invertível, multiplicar por seu inverso produz a única classe de solução.",
		why: "Se ax−my=b, todo divisor comum de a e m precisa dividir b, mostrando a condição necessária. Quando d divide b, uma identidade de Bézout para d pode ser multiplicada por b/d para produzir uma solução. As demais aparecem em intervalos de m/d dentro de um sistema de resíduos módulo m.",
		example: [
			"Resolva 6x≡8 (mod 14). Temos mdc(6,14)=2, que divide 8; há duas classes módulo 14.",
			"Divida coeficientes e módulo por 2: 3x≡4 (mod 7). Como o inverso de 3 módulo 7 é 5, x≡20≡6 (mod 7).",
			"Em {0,…,13}, as soluções são 6 e 13. Confira: 6·6−8=28 e 6·13−8=70, ambos múltiplos de 14.",
		],
		trap: "Não declare uma solução única módulo 14 apenas porque a congruência reduzida tem uma classe módulo 7. Também não tente obter inverso de 2 módulo 6: nenhum produto 2u pode ter resto ímpar 1.",
		transfer:
			"Use inversos para desfazer multiplicações em códigos e congruências. Sempre confira o MDC antes de dividir e substitua cada solução no problema original.",
		quiz: `Qual é um inverso de 3 módulo 7? | 5. | 3. | 2. | 3·5=15≡1 (mod 7).
O número 2 possui inverso módulo 6? | Não, pois mdc(2,6)=2. | Sim, o inverso é 3. | Sim, todo número diferente de zero tem inverso. | Só as classes coprimas ao módulo possuem inverso.
Qual classe resolve 3x≡4 (mod 7)? | x≡6 (mod 7). | x≡4 (mod 7). | x≡3 (mod 7). | Multiplique por 5: x≡20≡6.
Quantas classes módulo 14 resolvem 6x≡8? | Duas. | Uma. | Nenhuma. | O MDC é 2 e divide 8; portanto há duas classes de solução.
Quais representantes em {0,…,13} resolvem 6x≡8 (mod 14)? | 6 e 13. | 4 e 11. | 6 e 8. | A redução dá x≡6 (mod 7); somar 7 fornece os dois representantes.
A congruência 4x≡3 (mod 6) possui solução? | Não. | Sim, x≡1. | Sim, x≡3. | O MDC de 4 e 6 é 2, que não divide 3.
Qual é um inverso de 7 módulo 26? | 15. | 7. | 13. | 7·15=105=4·26+1.
Se 1=3a−2m, qual número é inverso de a módulo m? | 3. | −2. | m. | Reduzindo a identidade módulo m, fica 3a≡1.
Qual é a condição de existência de solução de ax≡b (mod m)? | mdc(a,m) divide b. | a é sempre primo. | b é sempre menor que a. | A condição permite ou impede que a diferença ax−b seja múltiplo de m.
Quantas classes módulo 9 resolvem 3x≡0? | Três: 0,3 e 6. | Uma: apenas 0. | Nove. | 3x múltiplo de 9 equivale a x múltiplo de 3; há três representantes no sistema de resíduos.`,
	}),
	lesson({
		n: 12,
		title: "Ciclos, códigos e missão dos inteiros",
		source: "Rosen, 6ª ed., §3.7",
		goal: "Aplicar aritmética modular em ciclos, verificação e um exemplo didático de criptografia.",
		prereq: "Primos, potências modulares e inversos.",
		hook: "Um calendário, um dígito verificador e uma cifra podem compartilhar a mesma ideia: descartar parte da informação e trabalhar com restos. É preciso saber o que cada modelo realmente garante.",
		concept:
			"Uma posição circular é calculada reduzindo deslocamentos módulo o tamanho do ciclo. Um dígito verificador simples pode ser escolhido para que uma soma ponderada seja congruente a zero; essa regra detecta certos erros, mas não todos. Para primo p e a não múltiplo de p, o pequeno teorema de Fermat dá a^(p−1)≡1 (mod p). Em um exemplo didático RSA, dois primos distintos p,q dão n=pq e φ(n)=(p−1)(q−1); escolhemos e coprimo a φ(n) e d inverso de e nesse módulo. Mensagens são resíduos módulo n e a operação envolve exponenciação modular. Os números pequenos usados aqui servem apenas para estudo.",
		why: "Ciclos descartam voltas completas, que são múltiplos do tamanho do ciclo. A condição de coprimalidade permite desfazer uma multiplicação no anel de resíduos. No exemplo RSA, a relação ed≡1 (mod φ(n)) é o vínculo entre os expoentes; a justificativa completa também considera separadamente os fatores primos do módulo.",
		example: [
			"Use p=5 e q=11: n=55 e φ(n)=4·10=40. Escolha e=3.",
			"O inverso é d=27, pois 3·27=81≡1 (mod 40). Para a mensagem 7, calcule c=7³ mod 55=13.",
			"A decodificação calcula 13²⁷ mod 55=7. Faça as potências por quadrados sucessivos e reduza a cada multiplicação; não confunda φ(n)=40 com o módulo das mensagens, n=55.",
		],
		trap: "Uma soma verificadora igual não prova que dois arquivos são iguais. E as hipóteses de Fermat importam: a^(p−1)≡1 requer p primo e a não divisível por p. O exemplo de criptografia com números pequenos não é uma receita de segurança para sistemas reais.",
		transfer:
			"Modele ciclos de horários e checagens aritméticas declarando exatamente o módulo. Ao explicar um algoritmo, separe a propriedade matemática demonstrada das garantias adicionais exigidas por uma aplicação real.",
		quiz: `No ciclo das horas 0,…,23, que hora vem 17 horas após as 19? | 12. | 36. | 2. | 19+17=36 e 36≡12 (mod 24).
Qual d∈{0,…,9} torna 7+8+d congruente a 0 módulo 10? | 5. | 3. | 0. | A soma inicial é 15; somar 5 leva a 20, múltiplo de 10.
Duas mensagens têm a mesma soma módulo 10. O que podemos concluir? | A checagem sozinha não garante que as mensagens sejam iguais. | As mensagens são necessariamente iguais. | A checagem detecta todo erro possível. | Mensagens diferentes podem produzir o mesmo resto; isso é uma colisão da checagem.
Quais hipóteses permitem usar a^(p−1)≡1 (mod p)? | p primo e p não divide a. | p positivo, sem outras condições. | a=p. | A primalidade do módulo e a não divisibilidade são as condições do pequeno teorema de Fermat.
Qual é o resto de 3¹⁰⁰ por 7? | 4. | 1. | 3. | 3⁶≡1 e 100 deixa resto 4 na divisão por 6. Assim 3¹⁰⁰≡3⁴=81≡4.
No exemplo p=5 e q=11, quanto valem n e φ(n)? | n=55 e φ(n)=40. | n=40 e φ(n)=55. | n=16 e φ(n)=10. | n é o produto dos primos; φ(n) é (5−1)(11−1)=40.
Por que e=3 admite inverso módulo 40? | Porque mdc(3,40)=1. | Porque 3 divide 40. | Porque 40 é primo. | A coprimalidade é exatamente a condição de existência do inverso.
Qual d resolve 3d≡1 (mod 40)? | 27. | 13. | 3. | 3·27=81=2·40+1.
Quanto vale 7³ mod 55? | 13. | 7. | 18. | 7³=343=6·55+13.
Na missão RSA didática, quais módulos têm papéis diferentes? | 55 para as mensagens e 40 para relacionar os expoentes. | 40 para as mensagens e 55 para os expoentes. | Apenas o módulo 3 é utilizado. | O produto n=pq é o módulo da exponenciação; φ(n) orienta a escolha dos expoentes inversos.`,
	}),
];
