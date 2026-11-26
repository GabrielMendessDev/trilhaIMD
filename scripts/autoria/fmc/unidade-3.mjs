import { lesson } from "../estrutura.mjs";
export default [
	lesson({
		n: 13,
		title: "Contar sem listar: soma e produto",
		source: "Rosen, 6ª ed., §5.1",
		goal: "Escolher entre os princípios aditivo e multiplicativo e explicitar restrições.",
		prereq: "Conjuntos, operações e potências.",
		hook: "Um sistema oferece três perfis e quatro temas de tela. É diferente escolher um perfil e um tema de escolher apenas um item de duas listas alternativas.",
		concept:
			"Se uma tarefa possui etapas sucessivas com n₁,n₂,… possibilidades em cada ramo, o princípio multiplicativo conta o produto dessas quantidades quando a quantidade de opções de cada etapa é a mesma em todos os ramos anteriores. Para alternativas disjuntas, o princípio aditivo soma as quantidades. Se as alternativas se sobrepõem, a soma simples conta repetições. Uma sequência de n bits tem 2ⁿ possibilidades; uma posição fixa reduz o número de escolhas livres.",
		why: "Organizar resultados como pares ou caminhos de uma árvore faz cada resultado corresponder a uma escolha em cada etapa. Para alternativas disjuntas, cada resultado pertence a exatamente uma categoria, por isso somar não cria duplicatas. A correspondência entre o modelo e o que se deseja contar deve ser justificada.",
		example: [
			"Uma identificação possui duas letras de um alfabeto de 4 letras, seguidas por um dígito decimal. Repetições são permitidas.",
			"Há 4 escolhas na primeira posição, 4 na segunda e 10 na terceira: 4·4·10=160 identificações.",
			"Se as letras precisassem ser distintas, a segunda posição teria 3 escolhas, dando 4·3·10=120. A regra mudou porque a restrição mudou.",
		],
		trap: "Multiplicar não exige probabilidades independentes; exige uma contagem correta de opções por ramo. Se o número varia entre ramos, separe casos e some os produtos correspondentes.",
		transfer:
			"Modele senhas, rotas e configurações descrevendo primeiro posições, opções e restrições. Não faça uma conta antes de decidir se a ordem ou a repetição gera resultados diferentes.",
		quiz: `Há 3 perfis e 4 temas. Quantos pares perfil-tema existem? | 12. | 7. | 16. | Para cada perfil há quatro temas: 3·4=12.
Escolhe-se um único item entre 5 livros e 3 revistas, todos distintos. Quantas opções há? | 8. | 15. | 2. | As categorias são disjuntas e a escolha é de um único item, então somamos 5+3.
Quantas sequências de quatro bits existem? | 16. | 8. | 4. | Cada posição tem duas opções: 2⁴=16.
Quantas sequências de quatro bits começam por 1? | 8. | 16. | 4. | A primeira posição está fixa e três ficam livres: 2³=8.
Um código de duas letras usa um alfabeto de 5 letras, com repetição. Quantos códigos existem? | 25. | 20. | 10. | São 5 opções em cada posição: 5²=25.
E se as duas letras do código anterior precisarem ser distintas? | 20. | 25. | 10. | Depois da primeira escolha, restam quatro letras: 5·4=20.
Por que somar tamanhos de categorias que se sobrepõem pode dar errado? | Um resultado pode ser contado mais de uma vez. | Porque o princípio aditivo nunca funciona. | Porque toda sobreposição é vazia. | A soma simples pressupõe categorias disjuntas; a interseção exige correção.
Quantos códigos têm duas letras de um alfabeto de 4 letras e um dígito, com repetições? | 160. | 120. | 18. | O produto é 4·4·10.
Se as duas letras desse código forem distintas, quantos códigos restam? | 120. | 160. | 80. | A segunda letra tem três opções, portanto 4·3·10=120.
Quando as quantidades de opções variam entre ramos, qual estratégia é segura? | Separar casos disjuntos e somar os produtos corretos de cada caso. | Multiplicar sempre os maiores números encontrados. | Ignorar as restrições. | Uma árvore de escolhas ou uma separação de casos evita contar caminhos inexistentes.`,
	}),
	lesson({
		n: 14,
		title: "Permutações e arranjos: quando a ordem importa",
		source: "Rosen, 6ª ed., §§5.3 e 5.5",
		goal: "Contar ordenações completas e parciais, com e sem objetos repetidos.",
		prereq: "Princípio multiplicativo e fatorial.",
		hook: "Escolher três pessoas para uma equipe não é a mesma tarefa que escolher presidente, secretário e tesoureiro. Na segunda, trocar pessoas de cargo altera o resultado.",
		concept:
			"Para n objetos distintos, uma permutação dos n objetos tem n! possibilidades. Uma escolha ordenada de r objetos distintos, sem reposição, tem P(n,r)=n!/(n−r)!, para 0≤r≤n. Se há grupos de objetos indistinguíveis com tamanhos n₁,…,nₖ e soma n, as ordenações distintas são n!/(n₁!⋯nₖ!). Já uma sequência de r posições com n opções em cada uma, permitindo repetição, possui nʳ possibilidades. A fórmula depende do modelo, não do nome usado pelo enunciado.",
		why: "Sem reposição, as opções diminuem: n na primeira posição, n−1 na segunda e assim por diante. Para objetos repetidos, marcar artificialmente objetos iguais conta cada arranjo várias vezes; dividir pelas permutações internas de cada grupo remove essa multiplicidade.",
		example: [
			"Quantas palavras distintas podem ser feitas com todas as letras de ARARA? São cinco letras, com A repetido três vezes e R duas.",
			"Se cada cópia fosse rotulada, teríamos 5! ordenações. Cada palavra sem rótulos aparece 3!·2! vezes nessa contagem.",
			"O total é 5!/(3!·2!)=10. Não exigimos que a palavra exista no dicionário; contamos sequências de letras.",
		],
		trap: "Não use n! para uma escolha ordenada que ocupa apenas r posições. E dividir por r! só faz sentido quando as r! ordens contadas representam o mesmo resultado não ordenado.",
		transfer:
			"Distinga cargos, pódios, posições em fila e conjuntos de pessoas. Declare se objetos repetidos são realmente indistinguíveis ou apenas têm características iguais.",
		quiz: `Quantas filas existem com quatro pessoas distintas? | 24. | 16. | 4. | São 4!=4·3·2·1=24 ordenações.
Quantos pódios de três posições podem ser formados com seis pessoas distintas, sem empates? | 120. | 20. | 216. | As posições têm 6,5 e 4 opções: 6·5·4=120.
Quanto vale P(5,2)? | 20. | 10. | 25. | Escolhemos dois objetos em ordem, sem reposição: 5·4=20.
Quantas sequências de três posições usam quatro símbolos com repetição permitida? | 64. | 24. | 12. | Cada posição tem quatro opções: 4³=64.
Quantas ordenações distintas possuem as letras de ARARA? | 10. | 120. | 20. | Divida 5! por 3! para os A e 2! para os R.
Quantas ordenações distintas possuem as letras de CASA? | 12. | 24. | 6. | Há quatro letras com A repetido duas vezes: 4!/2!=12.
Quanto vale 0!? | 1. | 0. | Não existe. | Há uma única ordenação vazia, compatível com a definição recursiva do fatorial.
Escolher presidente e secretário entre cinco pessoas exige qual contagem? | 5·4. | 5+4. | 5·5, sem restrição. | Os cargos distinguem as posições e a mesma pessoa não ocupa ambos nessa escolha.
Por que dividimos por 3!·2! em ARARA? | Porque trocar cópias dos A e dos R não altera a palavra sem rótulos. | Porque a ordem nunca importa em palavras. | Porque há somente duas letras. | A divisão corrige as múltiplas rotulações artificiais de um mesmo resultado.
Quantas ordenações de ABCDE começam por A? | 24. | 120. | 5. | A primeira posição está fixa; as quatro restantes podem ser permutadas de 4! formas.`,
	}),
	lesson({
		n: 15,
		title: "Combinações e coeficientes binomiais",
		source: "Rosen, 6ª ed., §§5.3–5.5",
		goal: "Contar seleções sem ordem e reconhecer identidades binomiais básicas.",
		prereq: "Permutações, fatorial e princípio aditivo.",
		hook: "A equipe {Ana,Bia,Caio} é a mesma se os nomes forem listados em outra ordem. Uma contagem que distingue essas listas precisa ser corrigida antes de contar equipes.",
		concept:
			"Uma seleção de r objetos entre n distintos, sem ordem e sem reposição, tem C(n,r)=n!/[r!(n−r)!] possibilidades. Vale C(n,r)=C(n,n−r), pois escolher quem entra determina quem fica fora. A identidade de Pascal é C(n,r)=C(n−1,r−1)+C(n−1,r), nos índices aplicáveis. No desenvolvimento de (x+y)ⁿ, o coeficiente de xⁿ⁻ʳyʳ é C(n,r). Quando são escolhidos r objetos indistinguíveis de n tipos, com repetição permitida e sem limites por tipo, a contagem é C(n+r−1,r).",
		why: "Uma escolha ordenada de r objetos conta cada subconjunto r! vezes, uma por ordem interna; dividir corrige a multiplicidade. Na identidade de Pascal, separe as seleções que incluem um objeto fixado das que não incluem. As categorias são disjuntas e cobrem todas as possibilidades.",
		example: [
			"Escolher três pessoas entre oito, sem cargos, é uma seleção sem ordem.",
			"A contagem ordenada 8·7·6 conta a mesma equipe de 3!=6 maneiras. Dividindo: C(8,3)=56.",
			"Confira pela divisão de casos sobre uma pessoa fixa: C(7,2)+C(7,3)=21+35=56. As duas justificativas descrevem a mesma família de equipes.",
		],
		trap: "C(n,r) não serve automaticamente para posições distintas ou para escolhas com repetição. Antes da fórmula, escreva se a ordem importa, se objetos podem se repetir e se há limites por tipo.",
		transfer:
			"Use combinações para comissões, amostras sem ordem e coeficientes. Para misturas de tipos com repetição, estabeleça explicitamente se as cópias de cada tipo são indistinguíveis.",
		quiz: `Quanto vale C(8,3)? | 56. | 336. | 24. | 8·7·6 dividido por 3·2·1 resulta em 56.
Quantos pares sem ordem podem ser escolhidos entre cinco pessoas? | 10. | 20. | 25. | C(5,2)=5·4/2=10.
Quanto vale C(6,0)? | 1. | 0. | 6. | Há um único subconjunto vazio.
Quanto vale C(6,6)? | 1. | 6. | 720. | Existe uma única seleção que inclui todos os seis objetos.
Qual igualdade expressa a simetria das combinações? | C(n,r)=C(n,n−r). | C(n,r)=nʳ, sempre. | C(n,r)=r!. | A escolha de quem entra equivale à escolha do complemento.
Qual é o coeficiente de x³y² em (x+y)⁵? | 10. | 20. | 5. | É C(5,2)=10, escolhendo em quais dois fatores aparece y.
Quanto vale C(5,2)+C(5,3)? | 20. | 10. | 30. | Ambos valem 10; pela identidade de Pascal a soma é C(6,3)=20.
Quantas soluções inteiras não negativas tem a+b+c=4? | 15. | 12. | 81. | Distribuir quatro unidades indistinguíveis entre três variáveis dá C(4+3−1,3−1)=C(6,2)=15.
Escolher três sabores distintos entre sete, sem importar a ordem, exige qual expressão? | C(7,3). | P(7,3). | 7³. | É uma seleção de três elementos distintos sem ordem nem repetição.
Em uma prova de Pascal, por que os casos “inclui o objeto fixado” e “não inclui” podem ser somados? | São disjuntos e cobrem todas as seleções. | Porque a ordem dos objetos passou a importar. | Porque têm sempre o mesmo tamanho. | O princípio aditivo é válido porque nenhuma seleção pertence aos dois casos.`,
	}),
	lesson({
		n: 16,
		title: "Restrições, sobreposições e princípio das gavetas",
		source: "Rosen, 6ª ed., §5.2 e §§7.5–7.6",
		goal: "Aplicar inclusão-exclusão e o princípio das gavetas com domínios finitos.",
		prereq: "Conjuntos, contagem aditiva e combinações.",
		hook: "Vinte alunos usam uma ferramenta e quinze usam outra. A soma 35 não informa quantos alunos distintos usam alguma delas: pessoas podem estar nas duas listas.",
		concept:
			"Para conjuntos finitos, a cardinalidade da união de dois conjuntos é a soma de suas cardinalidades menos a da interseção. Para três conjuntos, somamos os tamanhos individuais, subtraímos as três interseções de pares e adicionamos a interseção tripla. No princípio das gavetas, distribuir N objetos em k≥1 caixas garante uma caixa com pelo menos ⌈N/k⌉ objetos. São garantias de existência, não uma indicação de qual caixa atingirá o limite.",
		why: "Na soma de dois tamanhos, um elemento da interseção aparece duas vezes e deve ficar uma. Com três conjuntos, um elemento da interseção tripla é contado três vezes, subtraído três vezes e, por isso, precisa ser adicionado uma vez. Para as gavetas, se todas as caixas tivessem menos que o limite necessário, a capacidade total não comportaria os N objetos.",
		example: [
			"Entre os inteiros de 1 a 30, quantos são divisíveis por 2 ou por 3? Há 15 múltiplos de 2 e 10 de 3.",
			"Os múltiplos comuns são os múltiplos de 6: existem 5. Subtraia a contagem repetida: 15+10−5=20.",
			"O “ou” é inclusivo: 6 e 12 entram uma vez. Como há 30 inteiros no universo, 10 não são divisíveis por nenhum dos dois.",
		],
		trap: "Não use inclusão-exclusão sem identificar o universo e as interseções. No princípio das gavetas, a garantia depende da pior distribuição possível; uma distribuição particular mais concentrada não muda esse limite garantido.",
		transfer:
			"Aplique essas ideias a listas sobrepostas, restrições de senhas e colisões em categorias. Distinguir “há uma repetição garantida” de “todos os grupos têm repetição” evita conclusões excessivas.",
		quiz: `Se A tem 20 elementos, B tem 15 e A∩B tem 6, quantos elementos tem A∪B? | 29. | 35. | 41. | 20+15−6=29, corrigindo a dupla contagem dos elementos comuns.
Entre 1 e 30, quantos inteiros são divisíveis por 2 ou por 3? | 20. | 25. | 15. | Há 15 múltiplos de 2, 10 de 3 e 5 de 6: 15+10−5=20.
Em um universo de 30 elementos, a união tem 20. Quantos estão fora dela? | 10. | 20. | 50. | O complemento tem 30−20=10 elementos.
Treze pessoas são agrupadas por mês de nascimento. O que é garantido? | Pelo menos duas nasceram no mesmo mês. | Todas nasceram no mesmo mês. | Cada mês tem ao menos uma pessoa. | Há 13 pessoas para 12 categorias, então alguma categoria contém ao menos duas.
Dez objetos são distribuídos em três caixas. Qual ocupação mínima é garantida em alguma caixa? | Pelo menos 4 objetos. | Pelo menos 3 objetos. | Pelo menos 5 objetos. | O teto de 10/3 é 4. A distribuição 4,3,3 mostra que não se garante 5.
Para garantir três objetos em alguma de cinco caixas, quantos objetos bastam e são necessários no pior caso? | 11. | 10. | 15. | Com dez, é possível colocar dois por caixa. O décimo primeiro força uma caixa a chegar a três.
Na inclusão-exclusão de três conjuntos, o que fazemos com a interseção tripla após subtrair as interseções de pares? | Adicionamos uma vez. | Subtraímos mais uma vez. | Ignoramos sempre. | O elemento triplo teve saldo zero após as duas etapas anteriores; precisa aparecer uma vez.
Quantas sequências de quatro bits possuem ao menos um bit 1? | 15. | 16. | 14. | Do total 2⁴=16, retire apenas 0000.
Se A e B são disjuntos, quanto vale a cardinalidade de A∪B? | A soma das cardinalidades de A e B. | A soma mais 1. | O produto das cardinalidades. | A interseção tem tamanho zero, então não há dupla contagem a corrigir.
Se um cadastro associa 101 pessoas a apenas 100 códigos possíveis, o que é garantido? | Duas pessoas recebem o mesmo código. | Todas recebem códigos distintos. | Exatamente duas pessoas recebem o mesmo código, necessariamente. | As gavetas garantem pelo menos uma colisão, mas não determinam a quantidade exata de colisões.`,
	}),
	lesson({
		n: 17,
		title: "Construir recorrências e escolher as bases",
		source: "Rosen, 6ª ed., §7.1",
		goal: "Modelar contagens e processos por recorrências com condições iniciais corretas.",
		prereq: "Recursão, princípios de contagem e indução.",
		hook: "Quantas sequências binárias de comprimento n não têm dois bits 1 consecutivos? Listar todas cresce rapidamente; classificar pelo começo da sequência conecta o problema a comprimentos menores.",
		concept:
			"Uma relação de recorrência determina termos a partir de anteriores; condições iniciais selecionam uma sequência específica. Para contar sequências de bits sem 11, use a₀=1 para a sequência vazia e a₁=2 para 0 e 1. Para n≥2, aₙ=aₙ₋₁+aₙ₋₂: as sequências que começam por 0 correspondem a problemas de tamanho n−1; as que começam por 1 precisam começar por 10 e correspondem ao tamanho n−2. Uma recorrência precisa declarar domínio, índices e bases.",
		why: "Os dois casos do modelo são disjuntos e cobrem todas as sequências válidas. Remover o prefixo fixado produz uma bijeção com a família menor correspondente. As bases tratam os tamanhos nos quais a classificação por dois caracteres ainda não pode ser aplicada diretamente.",
		example: [
			"Para sequências sem 11: a₀=1 e a₁=2. Calcule a₂=a₁+a₀=3.",
			"Depois a₃=3+2=5 e a₄=5+3=8. As três sequências válidas de comprimento 2 são 00,01 e 10.",
			"O valor a₄=8 depende das bases 1 e 2. A mesma regra com bases diferentes produziria outra sequência; ela é relacionada a Fibonacci, mas os índices precisam ser ajustados.",
		],
		trap: "A sequência vazia conta como uma possibilidade quando contamos todas as sequências de comprimento zero. Usar a₀=0 neste problema altera todos os termos seguintes. Não reutilize bases de outro problema só porque a fórmula recursiva parece igual.",
		transfer:
			"Para modelar um processo, desenhe um caso pequeno, separe casos disjuntos e explique como cada um reduz o tamanho. Só depois escreva a recorrência e determine as bases.",
		quiz: `Com a₀=1, a₁=2 e aₙ=aₙ₋₁+aₙ₋₂, quanto vale a₂? | 3. | 2. | 4. | a₂=a₁+a₀=2+1.
Na mesma sequência, quanto vale a₄? | 8. | 5. | 13. | Os termos iniciais são 1,2,3,5,8.
Quantas sequências de bits de comprimento zero existem? | Uma, a sequência vazia. | Nenhuma. | Duas. | Há uma única maneira de não escolher posições; essa convenção é a base combinatória adequada.
Quantas sequências de três bits não contêm 11? | 5. | 6. | 8. | São 000,001,010,100 e 101.
Por que os casos “começa por 0” e “começa por 10” podem ser somados para n≥2? | São disjuntos e cobrem todas as sequências válidas. | Porque têm necessariamente a mesma quantidade. | Porque toda sequência contém 10. | Toda sequência válida começa por 0 ou, se começa por 1, precisa ter 0 na segunda posição.
Uma recorrência sem condições iniciais normalmente determina uma única sequência? | Não; as bases selecionam uma sequência entre várias. | Sim, sempre. | Sim, se houver uma soma. | A mesma regra pode gerar sequências diferentes a partir de valores iniciais distintos.
Com b₀=3 e bₙ=bₙ₋₁+2 para n≥1, quanto vale b₃? | 9. | 6. | 11. | A sequência começa 3,5,7,9.
Se T₀=0 e Tₙ=2Tₙ₋₁+1, quanto vale T₃? | 7. | 8. | 6. | Os termos são 0,1,3,7.
Se a recorrência usa n−2, qual cuidado é necessário? | Declarar um início no qual esses índices façam sentido e fornecer as bases correspondentes. | Substituir sempre termos negativos por zero, sem aviso. | Ignorar o caso n=0. | O domínio dos índices faz parte da definição matemática.
Qual etapa deve vir antes de aplicar uma fórmula pronta de recorrência? | Definir o que o termo conta e justificar a decomposição do problema. | Escolher bases por aparência. | Supor que todas as recorrências são Fibonacci. | Modelos semelhantes podem ter regras ou bases diferentes; o significado do termo orienta a conta.`,
	}),
	lesson({
		n: 18,
		title: "Resolver recorrências e missão integradora",
		source: "Rosen, 6ª ed., §§7.1–7.2",
		goal: "Encontrar e verificar fórmulas explícitas para recorrências simples.",
		prereq: "Indução, potências, modelos recursivos e contagem.",
		hook: "Conhecer uma regra que gera o próximo termo é útil, mas calcular o milésimo termo repetindo mil passos pode ser desnecessário. Uma fórmula explícita permite ver o padrão e precisa ser conferida nas bases e na regra.",
		concept:
			"Para aₙ=raₙ₋₁, com a₀ dado, aₙ=a₀rⁿ. Para T₀=0 e Tₙ=2Tₙ₋₁+1, a fórmula é Tₙ=2ⁿ−1. Ela pode ser conjecturada por expansão e verificada por indução. Na recorrência linear homogênea aₙ=c₁aₙ₋₁+c₂aₙ₋₂, raízes características distintas e não nulas r₁,r₂ da equação r²−c₁r−c₂=0 levam à forma aₙ=A r₁ⁿ+B r₂ⁿ, com A,B determinados pelas bases. Raiz repetida exige outra forma e não é coberta por essa fórmula de raízes distintas.",
		why: "Substituir aₙ=rⁿ na regra homogênea conduz à equação característica. Cada raiz fornece uma solução, e combinações lineares também satisfazem a regra. As bases definem os coeficientes. Para regras com termo adicional, como +1, é preciso incluir uma solução particular ou encontrar outra transformação; não se pode aplicar cegamente a fórmula homogênea.",
		example: [
			"Considere a₀=1, a₁=3 e aₙ=3aₙ₋₁−2aₙ₋₂. A equação característica é r²−3r+2=0, com raízes 1 e 2.",
			"Escreva aₙ=A+B·2ⁿ. As bases dão A+B=1 e A+2B=3, portanto B=2 e A=−1.",
			"Logo aₙ=2ⁿ⁺¹−1, que produz 1,3,7,15. Substituir na recorrência e nas duas bases confere a solução. A representação binária desses valores contém n+1 bits 1, conectando contagem, recorrência e bases numéricas.",
		],
		trap: "Ajustar uma fórmula aos três primeiros termos não demonstra que ela vale sempre. Verifique as condições iniciais e prove que a fórmula satisfaz a regra no domínio inteiro. Também separe raízes distintas de repetidas na equação característica.",
		transfer:
			"Na missão final, modele uma contagem, obtenha uma recorrência, resolva um caso simples e justifique a resposta por indução. Use restos e bases numéricas como verificações adicionais, sempre explicando por que cada teste é pertinente.",
		quiz: `Se a₀=5 e aₙ=2aₙ₋₁, qual fórmula é correta? | aₙ=5·2ⁿ. | aₙ=2·5ⁿ. | aₙ=5+2n. | A base é 5 e cada passo multiplica por 2.
Para T₀=0 e Tₙ=2Tₙ₋₁+1, qual fórmula é correta? | Tₙ=2ⁿ−1. | Tₙ=2ⁿ. | Tₙ=n². | A base dá 0 e 2(2ⁿ⁻¹−1)+1=2ⁿ−1.
Na recorrência aₙ=3aₙ₋₁−2aₙ₋₂, qual equação característica aparece? | r²−3r+2=0. | r²+3r−2=0. | r−3=0. | Substitua aₙ=rⁿ e reúna os termos da regra homogênea.
Quais são as raízes de r²−3r+2=0? | 1 e 2. | −1 e −2. | 2 e 3. | A fatoração é (r−1)(r−2).
Com a₀=1 e a₁=3, quais coeficientes satisfazem aₙ=A+B·2ⁿ? | A=−1 e B=2. | A=1 e B=2. | A=2 e B=−1. | A+B=1 e A+2B=3 dão B=2 e A=−1.
Na sequência anterior, quanto vale a₄? | 31. | 15. | 63. | A fórmula 2ⁿ⁺¹−1 dá 2⁵−1=31.
Qual é a escrita binária de 31? | 11111₂. | 10000₂. | 11110₂. | 31=16+8+4+2+1, somando cinco potências consecutivas de 2.
Por que a fórmula homogênea não pode ser aplicada diretamente a Tₙ=2Tₙ₋₁+1? | Há um termo adicional independente dos termos anteriores. | Porque nenhuma recorrência possui fórmula explícita. | Porque T₀=0 é proibido. | O +1 torna a recorrência não homogênea e precisa ser tratado.
Qual verificação é necessária para aceitar uma fórmula explícita proposta? | Conferir as bases e demonstrar que satisfaz a recorrência no domínio. | Conferir apenas o termo n=1. | Observar que seus valores são positivos. | Bases e regra determinam a sequência; poucos exemplos não substituem a demonstração.
Quantas sequências binárias não vazias têm comprimento no máximo 4? | 30. | 16. | 31. | Somamos 2¹+2²+2³+2⁴=30. Incluir o comprimento zero acrescentaria uma sequência e daria 31.`,
	}),
];
