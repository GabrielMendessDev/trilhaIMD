(() => {
  "use strict";

  const STORAGE_KEY = "trilhaImdFinalStateV2";
  const MAX_HEARTS = 5;
  const HEART_RECHARGE_MS = 30 * 60 * 1000;

  const COLORS = {
    green: "#58cc02",
    purple: "#9b6bdf",
    pink: "#ef6c8f",
    teal: "#20a5a5",
    orange: "#ff9600",
    blue: "#1cb0f6"
  };

  const q = (type, prompt, options, correct, helper = "", extra = {}) => ({ type, prompt, options, correct, helper, ...extra });
  const lesson = (id, title, description, questions, xp = 15) => ({ id, type: "lesson", title, description, questions, xp });
  const chest = (id, title = "Baú de recompensas", reward = 30) => ({ id, type: "chest", title, description: `Abra para ganhar ${reward} gemas.`, reward });
  const trophy = (id, title, description, questions) => ({ id, type: "trophy", title, description, questions, xp: 25 });

  const courses = [
    {
      id: "fmc", code: "FMC", emblem: "¬", color: COLORS.purple,
      name: "Fundamentos Matemáticos da Computação",
      units: [
        {
          id: "fmc-u1", title: "Lógica e proposições",
          description: "Construa a base para raciocinar com proposições, conectivos e tabelas-verdade.",
          guide: [
            ["Proposição", "Sentença declarativa que pode ser classificada como verdadeira ou falsa."],
            ["Conectivos", "Negação, conjunção, disjunção, implicação e bicondicional."],
            ["Tabela-verdade", "Organiza todas as combinações possíveis de valores lógicos."]
          ],
          nodes: [
            lesson("fmc-1", "Proposições e valores lógicos", "Identifique proposições e seus valores.", [
              q("choice", "Qual das frases abaixo é uma proposição?", ["Feche a porta.", "Que horas são?", "7 é um número primo.", "Tomara que chova."], 2, "Uma proposição precisa afirmar algo que possa ser verdadeiro ou falso."),
              q("boolean", "A frase “2 + 2 = 5” é uma proposição.", ["Verdadeiro", "Falso"], 0, "O valor lógico pode ser falso e ainda assim a frase ser uma proposição."),
              q("choice", "Se p representa “10 é par”, qual é o valor lógico de p?", ["Verdadeiro", "Falso"], 0)
            ]),
            lesson("fmc-2", "Conectivos lógicos", "Combine proposições com E, OU e NÃO.", [
              q("choice", "Qual símbolo representa a conjunção lógica “E”?", ["∨", "∧", "¬", "→"], 1),
              q("choice", "Se p é verdadeira e q é falsa, qual é o valor de p ∧ q?", ["Verdadeiro", "Falso"], 1),
              q("boolean", "A negação de uma proposição verdadeira é falsa.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("fmc-c1"),
            lesson("fmc-3", "Implicação", "Entenda quando uma implicação é falsa.", [
              q("choice", "Quando p → q é falsa?", ["p falsa e q falsa", "p falsa e q verdadeira", "p verdadeira e q falsa", "p verdadeira e q verdadeira"], 2),
              q("boolean", "Se o antecedente p é falso, a implicação p → q é verdadeira.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Na expressão p → q, p é chamado de...", ["Consequente", "Antecedente", "Negação", "Equivalência"], 1)
            ]),
            trophy("fmc-t1", "Desafio da unidade", "Consolide lógica proposicional.", [
              q("choice", "Quantas linhas tem a tabela-verdade de 3 proposições simples?", ["3", "6", "8", "9"], 2),
              q("choice", "Qual é a negação de p ∧ q segundo De Morgan?", ["¬p ∧ ¬q", "¬p ∨ ¬q", "p ∨ q", "p → q"], 1),
              q("boolean", "p ∨ q é falsa somente quando p e q são falsas.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        },
        {
          id: "fmc-u2", title: "Conjuntos e relações",
          description: "Trabalhe com operações de conjuntos, subconjuntos e relações.",
          guide: [
            ["União", "A ∪ B contém elementos que pertencem a A, a B ou a ambos."],
            ["Interseção", "A ∩ B contém elementos presentes simultaneamente em A e B."],
            ["Subconjunto", "A ⊆ B quando todo elemento de A também pertence a B."]
          ],
          nodes: [
            lesson("fmc-4", "Operações com conjuntos", "Pratique união e interseção.", [
              q("choice", "Se A={1,2} e B={2,3}, qual é A ∪ B?", ["{2}", "{1,2,3}", "{1,3}", "{}"], 1),
              q("choice", "Para os mesmos conjuntos, qual é A ∩ B?", ["{2}", "{1,2,3}", "{1,3}", "{}"], 0),
              q("boolean", "O conjunto vazio é subconjunto de qualquer conjunto.", ["Verdadeiro", "Falso"], 0)
            ]),
            lesson("fmc-5", "Relações", "Entenda pares ordenados e propriedades.", [
              q("choice", "Uma relação de A em B é um subconjunto de...", ["A ∪ B", "A × B", "A ∩ B", "B × B apenas"], 1),
              q("boolean", "Uma relação reflexiva em A contém (a,a) para todo a ∈ A.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Se (a,b) implica (b,a), a relação possui qual propriedade?", ["Reflexiva", "Simétrica", "Transitiva", "Antissimétrica"], 1)
            ]),
            chest("fmc-c2", "Baú de conjuntos", 35),
            lesson("fmc-6", "Técnicas de demonstração", "Conheça prova direta e contradição.", [
              q("choice", "Uma prova por contradição começa assumindo...", ["A própria tese", "A negação da tese", "Um exemplo qualquer", "Que toda hipótese é falsa"], 1),
              q("boolean", "Um contraexemplo pode refutar uma afirmação universal.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Para provar “se p então q” diretamente, parte-se normalmente de...", ["p", "¬p", "¬q", "q falso"], 0)
            ]),
            trophy("fmc-t2", "Checkpoint de FMC", "Finalize os fundamentos desta trilha.", [
              q("choice", "Se A ⊆ B e B ⊆ A, então...", ["A e B são disjuntos", "A = B", "A é vazio", "B é vazio"], 1),
              q("choice", "Qual propriedade permite concluir aRc de aRb e bRc?", ["Reflexividade", "Simetria", "Transitividade", "Totalidade"], 2),
              q("boolean", "Um único contraexemplo basta para invalidar uma proposição universal.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        }
      ]
    },
    {
      id: "me", code: "ME", emblem: "x", color: COLORS.pink, name: "Matemática Elementar",
      units: [
        {
          id: "me-u1", title: "Álgebra essencial", description: "Reforce operações algébricas, equações e produtos notáveis.",
          guide: [["Equação", "Igualdade com uma ou mais incógnitas."],["Distributiva", "a(b+c)=ab+ac."],["Fatoração", "Reescreve uma expressão como produto de fatores."]],
          nodes: [
            lesson("me-1", "Expressões algébricas", "Simplifique e avalie expressões.", [
              q("choice", "Quanto vale 2(x + 3) para x = 2?", ["7", "8", "10", "12"], 2),
              q("choice", "Simplifique 3x + 2x.", ["5", "5x", "6x", "x⁵"], 1),
              q("boolean", "2(a+b) = 2a + 2b.", ["Verdadeiro", "Falso"], 0)
            ]),
            lesson("me-2", "Equações do 1º grau", "Isole a incógnita e resolva equações.", [
              q("choice", "Resolva 2x + 4 = 12.", ["2", "3", "4", "6"], 2),
              q("choice", "Resolva 5x = 35.", ["5", "6", "7", "8"], 2),
              q("boolean", "x=3 é solução de x+4=7.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("me-c1"),
            lesson("me-3", "Produtos notáveis", "Reconheça padrões algébricos úteis.", [
              q("choice", "(a+b)² é igual a...", ["a²+b²", "a²+2ab+b²", "a²-ab+b²", "2a+2b"], 1),
              q("choice", "(a-b)(a+b) é...", ["a²-b²", "a²+b²", "a²-2ab+b²", "a-b²"], 0),
              q("boolean", "(a-b)² = a² - 2ab + b².", ["Verdadeiro", "Falso"], 0)
            ]),
            trophy("me-t1", "Desafio de álgebra", "Teste sua base algébrica.", [
              q("choice", "Se 3x-6=9, então x vale...", ["3", "4", "5", "6"], 2),
              q("choice", "Fatore x²-9.", ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "x(x-9)"], 0),
              q("boolean", "4x+4 pode ser fatorado como 4(x+1).", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        },
        {
          id: "me-u2", title: "Funções", description: "Compreenda domínio, imagem e comportamento de funções.",
          guide: [["Função", "Associa cada elemento do domínio a exatamente um valor."],["Domínio", "Conjunto de valores de entrada permitidos."],["Imagem", "Valores efetivamente produzidos pela função."]],
          nodes: [
            lesson("me-4", "Conceito de função", "Identifique entradas, saídas e avaliações.", [
              q("choice", "Se f(x)=x+2, qual é f(3)?", ["3", "4", "5", "6"], 2),
              q("boolean", "Uma função pode associar a mesma entrada a dois valores diferentes.", ["Verdadeiro", "Falso"], 1),
              q("choice", "Em f: A → B, A representa...", ["Imagem", "Domínio", "Coeficiente", "Raiz"], 1)
            ]),
            lesson("me-5", "Função afim", "Analise f(x)=ax+b.", [
              q("choice", "Em y=ax+b, a indica principalmente...", ["Inclinação", "Área", "Domínio", "Raiz sempre"], 0),
              q("choice", "Qual a raiz de f(x)=2x-6?", ["2", "3", "4", "6"], 1),
              q("boolean", "Se a>0 em uma função afim, ela é crescente.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("me-c2", "Baú das funções", 35),
            lesson("me-6", "Inequações", "Resolva desigualdades simples.", [
              q("choice", "Resolva x+2 > 5.", ["x>3", "x<3", "x=3", "x>7"], 0),
              q("boolean", "Ao multiplicar uma inequação por número negativo, o sinal deve inverter.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Resolva -2x < 6.", ["x<-3", "x>-3", "x<3", "x>3"], 1)
            ]),
            trophy("me-t2", "Checkpoint de ME", "Conclua a revisão de matemática elementar.", [
              q("choice", "Para f(x)=3x+1, f(2) vale...", ["5", "6", "7", "8"], 2),
              q("choice", "A função f(x)=-x+4 é...", ["Crescente", "Decrescente", "Constante", "Quadrática"], 1),
              q("boolean", "A raiz de uma função é um x para o qual f(x)=0.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        }
      ]
    },
    {
      id: "vga", code: "VGA", emblem: "→", color: COLORS.teal, name: "Vetores e Geometria Analítica",
      units: [
        {
          id: "vga-u1", title: "Vetores no plano", description: "Aprenda representação, módulo e operações básicas com vetores.",
          guide: [["Vetor", "Possui módulo, direção e sentido."],["Módulo", "Para v=(a,b), |v|=√(a²+b²)."],["Soma", "Somamos coordenadas correspondentes."]],
          nodes: [
            lesson("vga-1", "Representação de vetores", "Calcule vetores a partir de pontos.", [
              q("choice", "Qual é o vetor de A(1,2) até B(4,6)?", ["(3,4)", "(5,8)", "(-3,-4)", "(4,6)"], 0),
              q("boolean", "O vetor de A até B é obtido por B-A.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Se v=(2,-1), então 2v é...", ["(4,-2)", "(4,1)", "(2,-2)", "(1,-2)"], 0)
            ]),
            lesson("vga-2", "Módulo", "Meça o comprimento de vetores.", [
              q("choice", "Qual é o módulo de v=(3,4)?", ["4", "5", "6", "7"], 1),
              q("choice", "O módulo de (0,0) é...", ["0", "1", "Indefinido", "-1"], 0),
              q("boolean", "O módulo de um vetor é sempre não negativo.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("vga-c1"),
            lesson("vga-3", "Produto escalar", "Relacione vetores e ângulos.", [
              q("choice", "Se u=(1,2) e v=(3,4), u·v vale...", ["7", "10", "11", "14"], 2),
              q("choice", "Vetores não nulos ortogonais têm produto escalar...", ["1", "-1", "0", "2"], 2),
              q("boolean", "u·v = v·u.", ["Verdadeiro", "Falso"], 0)
            ]),
            trophy("vga-t1", "Desafio vetorial", "Consolide operações com vetores.", [
              q("choice", "Qual o módulo de (5,12)?", ["12", "13", "15", "17"], 1),
              q("choice", "(1,1)+(2,-3) resulta em...", ["(3,-2)", "(2,-3)", "(1,-2)", "(3,4)"], 0),
              q("boolean", "Dois vetores paralelos necessariamente têm o mesmo módulo.", ["Verdadeiro", "Falso"], 1)
            ])
          ]
        },
        {
          id: "vga-u2", title: "Retas e geometria", description: "Passe da representação vetorial para equações de retas e distâncias.",
          guide: [["Reta", "Pode ser descrita por ponto e vetor diretor."],["Inclinação", "Na forma y=ax+b, a determina a inclinação."],["Distância", "Mede a separação entre pontos ou objetos geométricos."]],
          nodes: [
            lesson("vga-4", "Equação da reta", "Reconheça formas de representar retas.", [
              q("choice", "Em y=ax+b, a representa...", ["Inclinação", "Área", "Distância", "Origem"], 0),
              q("choice", "Uma reta horizontal possui coeficiente angular...", ["0", "1", "-1", "Indefinido"], 0),
              q("boolean", "Retas paralelas não verticais têm o mesmo coeficiente angular.", ["Verdadeiro", "Falso"], 0)
            ]),
            lesson("vga-5", "Distância entre pontos", "Use a fórmula da distância no plano.", [
              q("choice", "A distância entre (0,0) e (3,4) é...", ["4", "5", "6", "7"], 1),
              q("boolean", "A distância entre dois pontos nunca é negativa.", ["Verdadeiro", "Falso"], 0),
              q("choice", "A distância entre (2,1) e (2,6) vale...", ["4", "5", "6", "8"], 1)
            ]),
            chest("vga-c2", "Baú geométrico", 35),
            lesson("vga-6", "Paralelismo e perpendicularidade", "Compare direções de retas.", [
              q("choice", "Se m₁·m₂=-1, as retas não verticais são...", ["Paralelas", "Perpendiculares", "Coincidentes", "Horizontais"], 1),
              q("boolean", "Retas perpendiculares formam ângulo de 90°.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Uma reta perpendicular a y=2x+1 possui inclinação...", ["2", "-2", "-1/2", "1/2"], 2)
            ]),
            trophy("vga-t2", "Checkpoint de VGA", "Finalize a trilha de geometria analítica.", [
              q("choice", "A distância entre (1,1) e (4,5) é...", ["4", "5", "6", "7"], 1),
              q("choice", "Duas retas com m=3 são...", ["Perpendiculares", "Paralelas ou coincidentes", "Sempre verticais", "Sem relação"], 1),
              q("boolean", "Um vetor diretor pode ser usado para descrever a direção de uma reta.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        }
      ]
    },
    {
      id: "calculo", code: "Cálculo", emblem: "∫", color: COLORS.orange, name: "Cálculo",
      units: [
        {
          id: "calc-u1", title: "Limites", description: "Entenda aproximação, continuidade e comportamento local de funções.",
          guide: [["Limite", "Valor ao qual f(x) se aproxima quando x se aproxima de um ponto."],["Continuidade", "Intuitivamente, a função não apresenta salto no ponto."],["Limites laterais", "Observam a aproximação pela esquerda ou pela direita."]],
          nodes: [
            lesson("calc-1", "Ideia de limite", "Comece pela interpretação intuitiva.", [
              q("choice", "Se f(x)=x+1, qual é lim x→2 f(x)?", ["1", "2", "3", "4"], 2),
              q("boolean", "O limite descreve o comportamento de f(x) quando x se aproxima de um valor.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Para f(x)=2x, lim x→3 f(x) vale...", ["3", "5", "6", "9"], 2)
            ]),
            lesson("calc-2", "Propriedades de limites", "Combine limites de soma e produto.", [
              q("choice", "Se lim f=2 e lim g=3, lim(f+g) é...", ["1", "5", "6", "8"], 1),
              q("choice", "Com os mesmos limites, lim(f·g) é...", ["5", "6", "8", "9"], 1),
              q("boolean", "Para polinômios, o limite em um ponto pode ser calculado por substituição direta.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("calc-c1"),
            lesson("calc-3", "Continuidade", "Relacione limite e valor da função.", [
              q("choice", "Para f ser contínua em a, deve ocorrer...", ["lim f(x)=f(a)", "f(a)=0 sempre", "lim f(x)=0 sempre", "f(a) não existir"], 0),
              q("boolean", "Uma função polinomial é contínua em todo número real.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Se os limites laterais são diferentes, o limite bilateral...", ["É a média", "É zero", "Não existe", "É infinito sempre"], 2)
            ]),
            trophy("calc-t1", "Desafio de limites", "Consolide a primeira unidade.", [
              q("choice", "lim x→1 (x²+2) vale...", ["2", "3", "4", "5"], 1),
              q("choice", "Se lim pela esquerda=4 e pela direita=4, o limite bilateral é...", ["0", "4", "8", "Não existe"], 1),
              q("boolean", "Se f(a) existe, então necessariamente lim x→a f(x) existe.", ["Verdadeiro", "Falso"], 1)
            ])
          ]
        },
        {
          id: "calc-u2", title: "Derivadas", description: "Interprete taxa de variação e calcule derivadas elementares.",
          guide: [["Derivada", "Taxa de variação instantânea."],["Regra da potência", "d/dx xⁿ = n·xⁿ⁻¹."],["Ponto crítico", "Pode ocorrer quando f'(x)=0 ou não existe."]],
          nodes: [
            lesson("calc-4", "Conceito de derivada", "Associe derivada a inclinação e variação.", [
              q("choice", "Geometricamente, a derivada em um ponto representa...", ["Área", "Inclinação da tangente", "Volume", "Intercepto sempre"], 1),
              q("boolean", "A derivada mede uma taxa de variação instantânea.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Se posição é função do tempo, sua derivada representa...", ["Velocidade", "Área", "Massa", "Temperatura"], 0)
            ]),
            lesson("calc-5", "Regra da potência", "Derive potências simples.", [
              q("choice", "A derivada de x² é...", ["x", "2x", "x²", "2"], 1),
              q("choice", "A derivada de x³ é...", ["3x²", "x²", "3x", "x⁴"], 0),
              q("boolean", "A derivada de uma constante é zero.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("calc-c2", "Baú das derivadas", 35),
            lesson("calc-6", "Aplicações da derivada", "Analise crescimento e pontos críticos.", [
              q("choice", "Um ponto crítico pode ocorrer quando f'(x) é...", ["0", "1", "Sempre positiva", "Sempre negativa"], 0),
              q("boolean", "Se f'(x)>0 em um intervalo, f tende a ser crescente nesse intervalo.", ["Verdadeiro", "Falso"], 0),
              q("choice", "Se f'(x)<0, o comportamento local indicado é...", ["Crescente", "Decrescente", "Constante necessariamente", "Sem informação"], 1)
            ]),
            trophy("calc-t2", "Checkpoint de Cálculo", "Finalize limites e derivadas.", [
              q("choice", "d/dx(5x²) é...", ["5x", "10x", "10x²", "2x"], 1),
              q("choice", "d/dx(7) é...", ["0", "1", "7", "x"], 0),
              q("boolean", "Derivadas podem ajudar a localizar máximos e mínimos.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        }
      ]
    },
    {
      id: "prog", code: "PROG", emblem: "{}", color: COLORS.blue, name: "Introdução à Programação",
      units: [
        {
          id: "prog-u1", title: "Fundamentos de programação", description: "Aprenda variáveis, tipos, expressões e decisões.",
          guide: [["Variável", "Nome associado a um valor armazenado."],["Booleano", "Tipo com valores verdadeiro ou falso."],["Condição", "Decide qual trecho de código será executado."]],
          nodes: [
            lesson("prog-1", "Variáveis e tipos", "Reconheça dados básicos usados em programas.", [
              q("choice", "Qual tipo representa verdadeiro/falso?", ["string", "boolean", "float", "array"], 1),
              q("choice", "Qual valor é uma string?", ["42", "true", "\"IMD\"", "3.14"], 2),
              q("boolean", "Uma variável pode armazenar um valor para uso posterior.", ["Verdadeiro", "Falso"], 0)
            ]),
            lesson("prog-2", "Operadores", "Use operadores aritméticos e relacionais.", [
              q("code", "Qual é o valor final de x?", ["5", "8", "10", "15"], 2, "Calcule a multiplicação antes da soma.", { code: "let x = 2 + 4 * 2;" }),
              q("choice", "Qual operador normalmente testa igualdade?", ["+", "==", "&&", "!"], 1),
              q("boolean", "O operador > compara se um valor é maior que outro.", ["Verdadeiro", "Falso"], 0)
            ]),
            chest("prog-c1"),
            lesson("prog-3", "Condicionais", "Controle caminhos com if e else.", [
              q("code", "O que será exibido?", ["Aprovado", "Reprovado", "Nada", "Erro obrigatório"], 0, "A condição nota >= 6 é verdadeira.", { code: "let nota = 8;\nif (nota >= 6) {\n  console.log('Aprovado');\n} else {\n  console.log('Reprovado');\n}" }),
              q("choice", "Qual palavra inicia normalmente uma condição?", ["if", "for", "print", "return"], 0),
              q("boolean", "O bloco else pode tratar o caso em que a condição do if é falsa.", ["Verdadeiro", "Falso"], 0)
            ]),
            trophy("prog-t1", "Desafio de lógica", "Teste os fundamentos de programação.", [
              q("code", "Qual valor será impresso?", ["2", "3", "4", "6"], 2, "A variável é incrementada em 1.", { code: "let x = 3;\nx = x + 1;\nconsole.log(x);" }),
              q("choice", "Qual expressão é booleana?", ["2+2", "nome", "idade >= 18", "\"texto\""], 2),
              q("boolean", "Uma condição precisa resultar em verdadeiro ou falso para decidir o fluxo.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        },
        {
          id: "prog-u2", title: "Repetição e funções", description: "Automatize repetições e organize código reutilizável.",
          guide: [["Laço", "Repete um bloco de instruções."],["for", "Útil quando a quantidade de repetições é conhecida."],["Função", "Agrupa uma lógica reutilizável e pode receber parâmetros."]],
          nodes: [
            lesson("prog-4", "Laços de repetição", "Entenda for e while.", [
              q("choice", "Qual estrutura costuma repetir um bloco N vezes?", ["if", "switch", "for", "const"], 2),
              q("boolean", "Um while pode executar zero vezes se a condição já começar falsa.", ["Verdadeiro", "Falso"], 0),
              q("code", "Quantas vezes o console.log executa?", ["2", "3", "4", "5"], 1, "i assume 0, 1 e 2.", { code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}" })
            ]),
            lesson("prog-5", "Funções", "Organize e reutilize lógica.", [
              q("choice", "Uma vantagem de funções é...", ["Duplicar código", "Reutilizar lógica", "Eliminar variáveis", "Impedir parâmetros"], 1),
              q("boolean", "Uma função pode receber parâmetros.", ["Verdadeiro", "Falso"], 0),
              q("code", "Qual valor soma(2,3) retorna?", ["2", "3", "5", "6"], 2, "A função retorna a+b.", { code: "function soma(a, b) {\n  return a + b;\n}\nsoma(2, 3);" })
            ]),
            chest("prog-c2", "Baú de código", 35),
            lesson("prog-6", "Arrays", "Armazene coleções de valores.", [
              q("choice", "Qual estrutura representa uma coleção ordenada de valores?", ["Array", "if", "boolean", "return"], 0),
              q("code", "Qual elemento está no índice 1?", ["10", "20", "30", "Nenhum"], 1, "Índices normalmente começam em 0.", { code: "const valores = [10, 20, 30];" }),
              q("boolean", "Em JavaScript, o primeiro índice de um array é 0.", ["Verdadeiro", "Falso"], 0)
            ]),
            trophy("prog-t2", "Checkpoint de Programação", "Conclua a trilha de fundamentos.", [
              q("code", "Qual é o resultado final de total?", ["3", "6", "9", "12"], 1, "Some 1 + 2 + 3.", { code: "let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}" }),
              q("choice", "Qual palavra envia um valor de volta de uma função?", ["if", "for", "return", "const"], 2),
              q("boolean", "Arrays e laços podem ser combinados para processar vários valores.", ["Verdadeiro", "Falso"], 0)
            ])
          ]
        }
      ]
    }
  ];

  const defaultState = () => ({
    version: 2,
    onboarded: false,
    name: "Estudante IMD",
    currentCourse: "fmc",
    completed: {},
    claimedChests: {},
    xp: 0,
    weeklyXp: 0,
    gems: 120,
    hearts: MAX_HEARTS,
    lastHeartAt: Date.now(),
    streak: 0,
    lastStudyDate: null,
    streakFreeze: 0,
    xpBoostLessons: 0,
    lessonsCompleted: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    theme: "light",
    daily: { date: todayKey(), xp: 0, lessons: 0, correct: 0, claimed: [] }
  });

  let state = loadState();
  let activeNodePopover = null;
  let lessonSession = null;
  let selectedAnswer = null;
  let answerChecked = false;
  let matchSelection = [];
  let matchPairsDone = [];
  let toastTimer = null;

  const $ = id => document.getElementById(id);
  const dom = {
    pages: [...document.querySelectorAll(".page")],
    pageLinks: [...document.querySelectorAll("[data-page-link]")],
    navLinks: [...document.querySelectorAll(".nav-link")],
    bottomLinks: [...document.querySelectorAll(".bottom-nav button")],
    courseSwitcher: $("courseSwitcher"), courseMenu: $("courseMenu"), courseEmblem: $("courseEmblem"), courseName: $("courseName"),
    unitBanner: $("unitBanner"), unitLabel: $("unitLabel"), unitTitle: $("unitTitle"), unitDescription: $("unitDescription"), unitGuideButton: $("unitGuideButton"),
    learningPath: $("learningPath"), nextUnitCard: $("nextUnitCard"), nextUnitTitle: $("nextUnitTitle"),
    streakCount: $("streakCount"), gemCount: $("gemCount"), heartCount: $("heartCount"), mobileStreak: $("mobileStreak"), mobileGems: $("mobileGems"), mobileHearts: $("mobileHearts"),
    sidebarName: $("sidebarName"), sidebarLevel: $("sidebarLevel"), railQuests: $("railQuests"), railStreak: $("railStreak"), streakWeek: $("streakWeek"),
    practiceCourseGrid: $("practiceCourseGrid"), startPracticeButton: $("startPracticeButton"),
    rankingList: $("rankingList"), questList: $("questList"), achievementGrid: $("achievementGrid"),
    shopGemCount: $("shopGemCount"), freezeStatus: $("freezeStatus"), boostStatus: $("boostStatus"),
    profileName: $("profileName"), profileStreak: $("profileStreak"), profileXp: $("profileXp"), profileLessons: $("profileLessons"), profileLevel: $("profileLevel"), profileCourses: $("profileCourses"),
    editProfileButton: $("editProfileButton"), themeToggle: $("themeToggle"), resetProgressButton: $("resetProgressButton"),
    lessonScreen: $("lessonScreen"), lessonCloseButton: $("lessonCloseButton"), lessonProgressBar: $("lessonProgressBar"), lessonHeartCount: $("lessonHeartCount"),
    questionStage: $("questionStage"), questionLabel: $("questionLabel"), questionPrompt: $("questionPrompt"), questionHelper: $("questionHelper"), questionBody: $("questionBody"),
    lessonFooter: $("lessonFooter"), lessonFeedback: $("lessonFeedback"), lessonActionButton: $("lessonActionButton"),
    modalBackdrop: $("modalBackdrop"), modalContent: $("modalContent"), modalCloseButton: $("modalCloseButton"), toast: $("toast")
  };

  init();

  function init() {
    ensureDailyState();
    rechargeHearts();
    applyTheme();
    bindEvents();
    renderAll();
    if (!state.onboarded) setTimeout(openOnboarding, 250);
    window.setInterval(() => {
      const oldHearts = state.hearts;
      rechargeHearts();
      if (oldHearts !== state.hearts) renderHeaderStats();
    }, 60_000);
  }

  function bindEvents() {
    document.addEventListener("click", event => {
      const pageLink = event.target.closest("[data-page-link]");
      if (pageLink) {
        event.preventDefault();
        navigate(pageLink.dataset.pageLink);
      }

      const courseOption = event.target.closest("[data-course-select]");
      if (courseOption) selectCourse(courseOption.dataset.courseSelect);

      const nodeButton = event.target.closest("[data-node]");
      if (nodeButton && !nodeButton.disabled) handleNodeClick(nodeButton.dataset.course, nodeButton.dataset.node);

      const popStart = event.target.closest("[data-start-node]");
      if (popStart) startNode(popStart.dataset.course, popStart.dataset.startNode);

      const practiceCourse = event.target.closest("[data-practice-course]");
      if (practiceCourse) startPractice(practiceCourse.dataset.practiceCourse);

      const buy = event.target.closest("[data-shop]");
      if (buy) buyItem(buy.dataset.shop);

      const claim = event.target.closest("[data-claim-quest]");
      if (claim) claimQuest(claim.dataset.claimQuest);

      const match = event.target.closest("[data-match-item]");
      if (match && lessonSession && !answerChecked) handleMatchItem(match);
    });

    dom.courseSwitcher.addEventListener("click", event => {
      event.stopPropagation();
      dom.courseMenu.hidden = !dom.courseMenu.hidden;
      dom.courseSwitcher.setAttribute("aria-expanded", String(!dom.courseMenu.hidden));
    });

    document.addEventListener("click", event => {
      if (!event.target.closest(".course-header")) {
        dom.courseMenu.hidden = true;
        dom.courseSwitcher.setAttribute("aria-expanded", "false");
      }
      if (!event.target.closest(".path-node-wrap") && activeNodePopover) {
        activeNodePopover.remove();
        activeNodePopover = null;
      }
    });

    dom.unitGuideButton.addEventListener("click", openUnitGuide);
    dom.startPracticeButton.addEventListener("click", () => startPractice());
    dom.lessonCloseButton.addEventListener("click", confirmExitLesson);
    dom.lessonActionButton.addEventListener("click", handleLessonAction);
    dom.modalCloseButton.addEventListener("click", closeModal);
    dom.modalBackdrop.addEventListener("click", event => { if (event.target === dom.modalBackdrop) closeModal(); });
    dom.editProfileButton.addEventListener("click", openEditProfile);
    dom.themeToggle.addEventListener("change", () => {
      state.theme = dom.themeToggle.checked ? "dark" : "light";
      saveState(); applyTheme();
    });
    dom.resetProgressButton.addEventListener("click", confirmReset);
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (!dom.modalBackdrop.hidden) closeModal();
        else if (!dom.lessonScreen.hidden) confirmExitLesson();
      }
      if (lessonSession && !answerChecked && /^[1-4]$/.test(event.key)) {
        const button = dom.questionBody.querySelector(`[data-answer-index="${Number(event.key)-1}"]`);
        if (button) selectChoice(Number(event.key)-1);
      }
      if (event.key === "Enter" && lessonSession && !dom.lessonActionButton.disabled) handleLessonAction();
    });
  }

  function renderAll() {
    renderCourseMenu();
    renderLearningPath();
    renderHeaderStats();
    renderQuests();
    renderPractice();
    renderRanking();
    renderShop();
    renderProfile();
  }

  function renderCourseMenu() {
    dom.courseMenu.innerHTML = courses.map(course => {
      const p = courseProgress(course);
      return `<button class="course-option ${course.id === state.currentCourse ? "active" : ""}" data-course-select="${course.id}" type="button">
        <span class="mini-emblem" style="background:${course.color}">${course.emblem}</span>
        <span><strong>${course.name}</strong><small>${p.percent}% concluído</small></span>
      </button>`;
    }).join("");
  }

  function selectCourse(courseId) {
    if (!courses.some(c => c.id === courseId)) return;
    state.currentCourse = courseId;
    saveState();
    dom.courseMenu.hidden = true;
    renderCourseMenu();
    renderLearningPath();
    renderProfile();
    navigate("learn");
  }

  function renderLearningPath() {
    const course = getCourse(state.currentCourse);
    if (!course) return;
    dom.courseEmblem.textContent = course.emblem;
    dom.courseEmblem.style.background = course.color;
    dom.courseEmblem.style.boxShadow = `0 3px 0 ${darken(course.color, .18)}`;
    dom.courseName.textContent = course.name;

    const currentUnit = getCurrentUnit(course);
    const unitIndex = course.units.findIndex(u => u.id === currentUnit.id);
    dom.unitLabel.textContent = `UNIDADE ${unitIndex + 1}`;
    dom.unitTitle.textContent = currentUnit.title;
    dom.unitDescription.textContent = currentUnit.description;
    dom.unitBanner.style.background = course.color;
    dom.unitBanner.style.boxShadow = `0 5px 0 ${darken(course.color, .18)}`;

    const flat = flattenNodes(course);
    dom.learningPath.innerHTML = course.units.map((unit, uIndex) => {
      const nodes = unit.nodes.map(node => {
        const flatIndex = flat.findIndex(x => x.node.id === node.id);
        const status = nodeStatus(course, flatIndex);
        const icon = nodeIcon(node, status);
        const crown = status === "completed" && node.type !== "chest" ? `<span class="node-crown">♛</span>` : "";
        return `<div class="path-node-row">
          <div class="path-node-wrap">
            ${crown}
            <button class="path-node ${status} ${node.type === "chest" ? "chest" : ""} ${node.type === "trophy" ? "trophy" : ""}"
              type="button" data-node="${node.id}" data-course="${course.id}" ${status === "locked" ? "disabled" : ""}
              aria-label="${node.title} — ${statusLabel(status)}">${icon}</button>
          </div>
        </div>`;
      }).join("");
      return `<section class="path-unit" data-unit="${unit.id}">
        ${uIndex > 0 ? `<div class="path-unit-heading">Unidade ${uIndex + 1} · ${unit.title}</div>` : ""}
        ${nodes}
      </section>`;
    }).join("");

    const currentUnitIdx = course.units.findIndex(u => u.id === currentUnit.id);
    if (currentUnitIdx < course.units.length - 1) {
      dom.nextUnitCard.hidden = false;
      dom.nextUnitTitle.textContent = course.units[currentUnitIdx + 1].title;
    } else {
      dom.nextUnitCard.hidden = true;
    }
  }

  function nodeStatus(course, flatIndex) {
    const flat = flattenNodes(course);
    const entry = flat[flatIndex];
    if (!entry) return "locked";
    if (isNodeCompleted(entry.node)) return "completed";
    if (flatIndex === 0) return "current";
    const previous = flat[flatIndex - 1].node;
    return isNodeCompleted(previous) ? "current" : "locked";
  }

  function isNodeCompleted(node) {
    if (node.type === "chest") return Boolean(state.claimedChests[node.id]);
    return Boolean(state.completed[node.id]);
  }

  function handleNodeClick(courseId, nodeId) {
    const course = getCourse(courseId);
    const found = findNode(course, nodeId);
    if (!found) return;
    const flat = flattenNodes(course);
    const flatIndex = flat.findIndex(x => x.node.id === nodeId);
    const status = nodeStatus(course, flatIndex);
    if (status === "locked") return;

    if (found.node.type === "chest") {
      if (state.claimedChests[nodeId]) {
        showToast("Você já abriu este baú.");
      } else {
        claimChest(found.node);
      }
      return;
    }

    if (activeNodePopover) activeNodePopover.remove();
    const wrap = document.querySelector(`[data-node="${CSS.escape(nodeId)}"]`)?.closest(".path-node-wrap");
    if (!wrap) return;
    const pop = document.createElement("div");
    pop.className = "node-popover";
    pop.innerHTML = `<span>${status === "completed" ? "REVISAR" : found.node.type === "trophy" ? "DESAFIO" : "PRÓXIMA LIÇÃO"}</span>
      <h3>${found.node.title}</h3><p>${found.node.description}</p>
      <button type="button" data-start-node="${nodeId}" data-course="${courseId}">${status === "completed" ? "REVISAR" : "COMEÇAR"}</button>`;
    wrap.appendChild(pop);
    activeNodePopover = pop;
  }

  function claimChest(node) {
    state.claimedChests[node.id] = true;
    state.gems += node.reward;
    saveState();
    renderAll();
    showRewardModal("Baú aberto!", `Você encontrou ${node.reward} gemas.`, "💎", `+${node.reward} gemas`);
  }

  function startNode(courseId, nodeId) {
    const course = getCourse(courseId);
    const found = findNode(course, nodeId);
    if (!found || found.node.type === "chest") return;
    if (state.hearts <= 0) return openNoHeartsModal();
    startLessonSession({
      mode: "path",
      courseId,
      nodeId,
      title: found.node.title,
      questions: shuffle(found.node.questions).map(cloneQuestion),
      xp: found.node.xp,
      firstCompletion: !state.completed[nodeId]
    });
  }

  function startPractice(courseId = null) {
    if (state.hearts <= 0) return openNoHeartsModal();
    const pool = [];
    courses.filter(c => !courseId || c.id === courseId).forEach(course => {
      flattenNodes(course).forEach(({ node }) => {
        if (node.type === "chest") return;
        const available = state.completed[node.id] || nodeStatus(course, flattenNodes(course).findIndex(x => x.node.id === node.id)) !== "locked";
        if (available) node.questions.forEach(question => pool.push({ ...cloneQuestion(question), _course: course.id }));
      });
    });
    if (!pool.length) {
      showToast("Conclua sua primeira lição para liberar a prática.");
      return;
    }
    const selected = shuffle(pool).slice(0, Math.min(6, pool.length));
    startLessonSession({ mode: "practice", courseId, nodeId: null, title: "Prática personalizada", questions: selected, xp: 10, firstCompletion: false });
  }

  function startLessonSession(config) {
    if (activeNodePopover) { activeNodePopover.remove(); activeNodePopover = null; }
    lessonSession = {
      ...config,
      index: 0,
      correct: 0,
      mistakes: 0,
      startedAt: Date.now(),
      finished: false
    };
    selectedAnswer = null;
    answerChecked = false;
    matchSelection = [];
    matchPairsDone = [];
    dom.lessonScreen.hidden = false;
    document.body.style.overflow = "hidden";
    renderQuestion();
  }

  function renderQuestion() {
    if (!lessonSession) return;
    if (lessonSession.index >= lessonSession.questions.length) return finishLesson();
    const question = lessonSession.questions[lessonSession.index];
    selectedAnswer = null;
    answerChecked = false;
    matchSelection = [];
    matchPairsDone = [];

    const total = lessonSession.questions.length;
    dom.lessonProgressBar.style.width = `${(lessonSession.index / total) * 100}%`;
    dom.lessonHeartCount.textContent = state.hearts;
    dom.questionLabel.textContent = `QUESTÃO ${lessonSession.index + 1} DE ${total}`;
    dom.questionPrompt.textContent = question.prompt;
    dom.questionHelper.textContent = question.helper || "Escolha a melhor resposta.";
    dom.lessonFeedback.innerHTML = "";
    dom.lessonFooter.className = "lesson-footer";
    dom.lessonActionButton.textContent = "VERIFICAR";
    dom.lessonActionButton.disabled = true;

    if (question.type === "match") {
      renderMatchQuestion(question);
      return;
    }

    const code = question.code ? `<pre class="code-card">${escapeHtml(question.code)}</pre>` : "";
    const gridClass = question.type === "boolean" ? "answer-grid boolean-grid" : "answer-grid";
    const options = question.options.map((option, index) => `<button class="answer-option" type="button" data-answer-index="${index}">
      <span class="answer-key">${index + 1}</span><span>${escapeHtml(String(option))}</span></button>`).join("");
    dom.questionBody.innerHTML = `${code}<div class="${gridClass}">${options}</div>`;
    dom.questionBody.querySelectorAll("[data-answer-index]").forEach(button => {
      button.addEventListener("click", () => selectChoice(Number(button.dataset.answerIndex)));
    });
  }

  function renderMatchQuestion(question) {
    const items = shuffle(question.pairs.flatMap((pair, pairIndex) => [
      { text: pair[0], pairIndex, side: "left" },
      { text: pair[1], pairIndex, side: "right" }
    ]));
    dom.questionBody.innerHTML = `<div class="match-grid">${items.map((item, i) => `<button class="match-item" type="button" data-match-item="${i}" data-pair="${item.pairIndex}" data-side="${item.side}">${escapeHtml(item.text)}</button>`).join("")}</div>`;
  }

  function selectChoice(index) {
    if (!lessonSession || answerChecked) return;
    selectedAnswer = index;
    dom.questionBody.querySelectorAll("[data-answer-index]").forEach(button => button.classList.toggle("selected", Number(button.dataset.answerIndex) === index));
    dom.lessonActionButton.disabled = false;
  }

  function handleMatchItem(button) {
    if (button.classList.contains("matched")) return;
    const item = { button, pair: button.dataset.pair, side: button.dataset.side };
    if (matchSelection.some(x => x.button === button)) {
      button.classList.remove("selected");
      matchSelection = matchSelection.filter(x => x.button !== button);
      return;
    }
    if (matchSelection.length === 1 && matchSelection[0].side === item.side) {
      matchSelection[0].button.classList.remove("selected");
      matchSelection = [];
    }
    button.classList.add("selected");
    matchSelection.push(item);
    if (matchSelection.length === 2) {
      const [a,b] = matchSelection;
      if (a.pair === b.pair && a.side !== b.side) {
        a.button.classList.remove("selected"); b.button.classList.remove("selected");
        a.button.classList.add("matched"); b.button.classList.add("matched");
        matchPairsDone.push(a.pair);
      } else {
        setTimeout(() => { a.button.classList.remove("selected"); b.button.classList.remove("selected"); }, 320);
      }
      matchSelection = [];
      const totalPairs = new Set([...dom.questionBody.querySelectorAll("[data-pair]")].map(el => el.dataset.pair)).size;
      if (new Set(matchPairsDone).size === totalPairs) {
        selectedAnswer = "matched";
        dom.lessonActionButton.disabled = false;
      }
    }
  }

  function handleLessonAction() {
    if (!lessonSession) return;
    if (lessonSession.finished) {
      closeLesson();
      navigate("learn");
      return;
    }
    if (!answerChecked) checkCurrentAnswer();
    else {
      if (state.hearts === 0 && lessonSession.lastAnswerCorrect === false) {
        showNoHeartsInLesson();
        return;
      }
      lessonSession.index += 1;
      renderQuestion();
    }
  }

  function checkCurrentAnswer() {
    const question = lessonSession.questions[lessonSession.index];
    if (selectedAnswer === null) return;
    answerChecked = true;
    state.totalAnswers += 1;
    ensureDailyState();

    let correct = false;
    if (question.type === "match") correct = selectedAnswer === "matched";
    else correct = selectedAnswer === question.correct;

    if (question.type !== "match") {
      dom.questionBody.querySelectorAll("[data-answer-index]").forEach(button => {
        const idx = Number(button.dataset.answerIndex);
        button.classList.remove("selected");
        if (idx === question.correct) button.classList.add("correct");
        if (idx === selectedAnswer && idx !== question.correct) button.classList.add("wrong");
      });
    }

    lessonSession.lastAnswerCorrect = correct;

    if (correct) {
      lessonSession.correct += 1;
      state.correctAnswers += 1;
      state.daily.correct += 1;
      dom.lessonFooter.classList.add("success");
      dom.lessonFeedback.innerHTML = `<strong>Correto!</strong><span>${feedbackFor(question, true)}</span>`;
    } else {
      lessonSession.mistakes += 1;
      state.hearts = Math.max(0, state.hearts - 1);
      state.lastHeartAt = Date.now();
      dom.lessonHeartCount.textContent = state.hearts;
      dom.lessonFooter.classList.add("error");
      dom.lessonFeedback.innerHTML = `<strong>Quase!</strong><span>${feedbackFor(question, false)}</span>`;
    }

    saveState();
    renderHeaderStats();
    dom.lessonActionButton.textContent = state.hearts === 0 && !correct ? "CONTINUAR" : "CONTINUAR";

  }

  function feedbackFor(question, correct) {
    if (correct) return question.helper || "Boa! Continue assim.";
    if (question.type === "match") return "Revise os pares e tente novamente em outra prática.";
    return `A resposta correta é “${question.options[question.correct]}”. ${question.helper || "Revise o conceito antes de avançar."}`;
  }

  function showNoHeartsInLesson() {
    lessonSession.finished = true;
    dom.lessonProgressBar.style.width = `${(lessonSession.index / lessonSession.questions.length) * 100}%`;
    dom.questionStage.innerHTML = `<div class="no-hearts"><div class="big-heart">❤</div><h1>Seus corações acabaram</h1><p>Recupere seus corações com gemas ou volte depois. Um coração é regenerado a cada 30 minutos.</p><div class="no-hearts-actions"><button class="primary-btn" id="lessonRefillButton" type="button">RECUPERAR POR 50 💎</button><button class="outline-btn" id="lessonExitNoHearts" type="button">SAIR DA LIÇÃO</button></div></div>`;
    dom.lessonFooter.hidden = true;
    $("lessonRefillButton").disabled = state.gems < 50;
    $("lessonRefillButton").addEventListener("click", () => {
      if (state.gems < 50) return showToast("Você não tem gemas suficientes.");
      state.gems -= 50; state.hearts = MAX_HEARTS; state.lastHeartAt = Date.now(); saveState();
      closeLesson(); renderAll(); showToast("Corações recuperados!");
    });
    $("lessonExitNoHearts").addEventListener("click", () => { closeLesson(); renderAll(); });
  }

  function finishLesson() {
    if (!lessonSession) return;
    lessonSession.finished = true;
    const first = lessonSession.firstCompletion;
    let earnedXp = lessonSession.xp + Math.max(0, lessonSession.correct - lessonSession.mistakes) * 2;
    if (state.xpBoostLessons > 0) {
      earnedXp *= 2;
      state.xpBoostLessons -= 1;
    }
    const earnedGems = lessonSession.mode === "path" && first ? 5 : 1;

    state.xp += earnedXp;
    state.weeklyXp += earnedXp;
    state.gems += earnedGems;
    state.daily.xp += earnedXp;
    state.daily.lessons += 1;
    state.lessonsCompleted += 1;
    if (lessonSession.mode === "path" && lessonSession.nodeId && first) state.completed[lessonSession.nodeId] = true;
    updateStreak();
    saveState();

    dom.lessonProgressBar.style.width = "100%";
    dom.lessonFooter.hidden = false;
    dom.lessonFooter.className = "lesson-footer success";
    dom.lessonFooter.innerHTML = `<div class="lesson-feedback"><strong>Lição concluída!</strong><span>Seu progresso foi salvo.</span></div><button class="lesson-action" id="resultContinueButton" type="button">CONTINUAR</button>`;
    dom.questionStage.innerHTML = `<div class="lesson-result"><div class="result-icon">✓</div><h1>Mandou bem!</h1><p>${lessonSession.mode === "practice" ? "Sua revisão de hoje deixou os conteúdos mais frescos." : "Você avançou na trilha e está mais perto de dominar esta unidade."}</p><div class="result-stats"><article><strong>+${earnedXp}</strong><small>XP ganho</small></article><article><strong>${Math.round((lessonSession.correct / lessonSession.questions.length) * 100)}%</strong><small>acertos</small></article><article><strong>+${earnedGems}</strong><small>gemas</small></article></div></div>`;
    $("resultContinueButton").addEventListener("click", () => {
      closeLesson(); renderAll(); navigate("learn");
      setTimeout(checkQuestCompletionToast, 200);
    });
    renderHeaderStats();
  }

  function closeLesson() {
    lessonSession = null;
    selectedAnswer = null;
    answerChecked = false;
    dom.lessonScreen.hidden = true;
    dom.lessonFooter.hidden = false;
    dom.lessonFooter.innerHTML = `<div class="lesson-feedback" id="lessonFeedback"></div><button class="lesson-action" id="lessonActionButton" type="button" disabled>VERIFICAR</button>`;
    dom.lessonFeedback = $("lessonFeedback");
    dom.lessonActionButton = $("lessonActionButton");
    dom.lessonActionButton.addEventListener("click", handleLessonAction);
    document.body.style.overflow = "";
  }

  function confirmExitLesson() {
    if (!lessonSession) return closeLesson();
    openModal(`<h2>Sair da lição?</h2><p>O progresso desta lição ainda não foi concluído. Você poderá recomeçar depois sem perder o progresso anterior da trilha.</p><div class="confirm-actions"><button class="cancel" id="stayLesson" type="button">CONTINUAR ESTUDANDO</button><button class="confirm" id="exitLesson" type="button" style="background:var(--red)">SAIR</button></div>`);
    $("stayLesson").addEventListener("click", closeModal);
    $("exitLesson").addEventListener("click", () => { closeModal(); closeLesson(); });
  }

  function renderHeaderStats() {
    rechargeHearts(false);
    const level = levelFromXp(state.xp);
    dom.streakCount.textContent = state.streak;
    dom.gemCount.textContent = state.gems;
    dom.heartCount.textContent = state.hearts;
    dom.mobileStreak.textContent = state.streak;
    dom.mobileGems.textContent = state.gems;
    dom.mobileHearts.textContent = state.hearts;
    dom.sidebarName.textContent = state.name;
    dom.sidebarLevel.textContent = `Nível ${level}`;
    dom.railStreak.textContent = state.streak;
    dom.streakWeek.innerHTML = renderWeekDots();
  }

  function renderWeekDots() {
    const dots = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const diff = daysBetween(parseDateKey(state.lastStudyDate), d);
      const active = state.lastStudyDate && diff >= 0 && diff < state.streak;
      dots.push(`<span class="streak-dot ${active ? "done" : ""}"></span>`);
    }
    return dots.join("");
  }

  function renderQuests() {
    ensureDailyState();
    const quests = getDailyQuests();
    dom.railQuests.innerHTML = quests.slice(0,2).map(quest => railQuestHtml(quest)).join("");
    dom.questList.innerHTML = quests.map(quest => {
      const progress = Math.min(quest.current, quest.target);
      const pct = Math.round((progress / quest.target) * 100);
      const claimed = state.daily.claimed.includes(quest.id);
      const complete = progress >= quest.target;
      return `<article class="quest-card ${complete ? "complete" : ""} ${claimed ? "claimed" : ""}">
        <div class="quest-icon">${quest.icon}</div>
        <div><h3>${quest.title}</h3><div class="quest-meta"><div class="mini-progress"><span style="width:${pct}%"></span></div><span>${progress}/${quest.target}</span></div></div>
        <div class="quest-reward">${claimed ? "✓ Recebido" : complete ? `<button class="claim-btn" type="button" data-claim-quest="${quest.id}">RECEBER +${quest.reward} 💎</button>` : `+${quest.reward} 💎`}</div>
      </article>`;
    }).join("");
    renderAchievements();
  }

  function railQuestHtml(quest) {
    const progress = Math.min(quest.current, quest.target);
    const pct = Math.round((progress / quest.target) * 100);
    return `<div class="rail-quest"><div class="rail-quest-icon">${quest.icon}</div><div><h4>${quest.title}</h4><div class="mini-progress"><span style="width:${pct}%"></span></div><small>${progress}/${quest.target}</small></div></div>`;
  }

  function getDailyQuests() {
    return [
      { id: "q-xp", icon: "⚡", title: "Ganhe 50 XP", target: 50, current: state.daily.xp, reward: 15 },
      { id: "q-lessons", icon: "✓", title: "Conclua 2 lições", target: 2, current: state.daily.lessons, reward: 20 },
      { id: "q-correct", icon: "🎯", title: "Acerte 8 questões", target: 8, current: state.daily.correct, reward: 20 }
    ];
  }

  function claimQuest(id) {
    const quest = getDailyQuests().find(x => x.id === id);
    if (!quest || quest.current < quest.target || state.daily.claimed.includes(id)) return;
    state.daily.claimed.push(id);
    state.gems += quest.reward;
    saveState(); renderAll();
    showToast(`Missão concluída! +${quest.reward} gemas.`);
  }

  function checkQuestCompletionToast() {
    const pending = getDailyQuests().find(q => q.current >= q.target && !state.daily.claimed.includes(q.id));
    if (pending) showToast(`Missão pronta: ${pending.title}. Vá em Missões para receber a recompensa!`);
  }

  function renderAchievements() {
    const allCompleted = courses.some(course => courseProgress(course).percent === 100);
    const achievements = [
      { icon:"🌱", title:"Primeiros passos", text:"Conclua sua primeira lição.", unlocked: state.lessonsCompleted >= 1 },
      { icon:"🔥", title:"Ritmo de 3", text:"Mantenha 3 dias de sequência.", unlocked: state.streak >= 3 },
      { icon:"⚡", title:"Mente ativa", text:"Acumule 250 XP.", unlocked: state.xp >= 250 },
      { icon:"🎯", title:"Precisão", text:"Acerte 50 questões.", unlocked: state.correctAnswers >= 50 },
      { icon:"🏆", title:"Especialista", text:"Complete uma trilha inteira.", unlocked: allCompleted },
      { icon:"🔥", title:"Sequência 10", text:"Estude por 10 dias seguidos.", unlocked: state.streak >= 10 }
    ];
    dom.achievementGrid.innerHTML = achievements.map(a => `<article class="achievement ${a.unlocked ? "" : "locked"}"><div class="achievement-icon">${a.icon}</div><h3>${a.title}</h3><p>${a.text}</p></article>`).join("");
  }

  function renderPractice() {
    dom.practiceCourseGrid.innerHTML = courses.map(course => {
      const progress = courseProgress(course);
      return `<button class="practice-card" type="button" data-practice-course="${course.id}"><span class="mini-emblem" style="background:${course.color}">${course.emblem}</span><span><h3>${course.name}</h3><p>${progress.done} etapas concluídas</p></span><span>›</span></button>`;
    }).join("");
  }

  function renderRanking() {
    const competitors = [
      ["Ana Clara", "🧑‍💻", 420], ["João Victor", "🧠", 360], ["Maria Eduarda", "📚", 315], ["Pedro Lucas", "👨‍💻", 270],
      ["Beatriz", "🎓", 240], ["Rafael", "🧩", 210], ["Camila", "📐", 185], ["Felipe", "💻", 155], ["Larissa", "🔬", 120], ["Matheus", "📘", 90],
      [state.name, "⭐", state.weeklyXp]
    ].map(([name, avatar, xp], idx) => ({ name, avatar, xp, you: idx === 10 }));
    competitors.sort((a,b) => b.xp - a.xp);
    const userPosition = competitors.findIndex(x => x.you) + 1;
    $("leaguePosition").textContent = `#${userPosition}`;
    dom.rankingList.innerHTML = competitors.map((person, index) => {
      const row = `<div class="rank-row ${person.you ? "you" : ""}"><span class="rank-number">${index+1}</span><span class="rank-avatar">${person.avatar}</span><strong>${escapeHtml(person.name)}${person.you ? " (você)" : ""}</strong><span class="rank-xp">${person.xp} XP</span></div>`;
      if (index === 9) return row + `<div class="promotion-line">▲ ZONA DE PROMOÇÃO</div>`;
      return row;
    }).join("");
  }

  function renderShop() {
    dom.shopGemCount.textContent = state.gems;
    dom.freezeStatus.textContent = state.streakFreeze > 0 ? `Você possui ${state.streakFreeze} proteção(ões).` : "Você não possui proteção.";
    dom.boostStatus.textContent = state.xpBoostLessons > 0 ? `Bônus ativo por ${state.xpBoostLessons} lição(ões).` : "Nenhum bônus ativo.";
    document.querySelectorAll("[data-shop]").forEach(button => {
      const costs = { hearts:50, freeze:100, boost:150 };
      button.disabled = state.gems < costs[button.dataset.shop] || (button.dataset.shop === "hearts" && state.hearts >= MAX_HEARTS);
    });
  }

  function buyItem(item) {
    const items = {
      hearts: { cost:50, action:() => { state.hearts = MAX_HEARTS; state.lastHeartAt = Date.now(); }, msg:"Corações recuperados!" },
      freeze: { cost:100, action:() => { state.streakFreeze += 1; }, msg:"Proteção de sequência adicionada!" },
      boost: { cost:150, action:() => { state.xpBoostLessons += 3; }, msg:"Dobro de XP ativo por 3 lições!" }
    };
    const selected = items[item];
    if (!selected || state.gems < selected.cost) return showToast("Gemas insuficientes.");
    if (item === "hearts" && state.hearts >= MAX_HEARTS) return showToast("Seus corações já estão cheios.");
    state.gems -= selected.cost; selected.action(); saveState(); renderAll(); showToast(selected.msg);
  }

  function renderProfile() {
    const level = levelFromXp(state.xp);
    dom.profileName.textContent = state.name;
    dom.profileStreak.textContent = state.streak;
    dom.profileXp.textContent = state.xp;
    dom.profileLessons.textContent = state.lessonsCompleted;
    dom.profileLevel.textContent = level;
    dom.themeToggle.checked = state.theme === "dark";
    dom.profileCourses.innerHTML = courses.map(course => {
      const p = courseProgress(course);
      return `<article class="profile-course"><span class="mini-emblem" style="background:${course.color}">${course.emblem}</span><div><h3>${course.name}</h3><div class="mini-progress"><span style="width:${p.percent}%;background:${course.color}"></span></div></div><small>${p.percent}%</small></article>`;
    }).join("");
  }

  function openUnitGuide() {
    const course = getCourse(state.currentCourse);
    const unit = getCurrentUnit(course);
    openModal(`<span class="kicker">${course.code} · GUIA DA UNIDADE</span><h2>${unit.title}</h2><p>${unit.description}</p><div class="modal-list">${unit.guide.map(([title,text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`);
  }

  function openEditProfile() {
    openModal(`<h2>Editar perfil</h2><p>Esse nome fica salvo apenas neste navegador.</p><form class="edit-form" id="editProfileForm"><label>Nome<input id="profileNameInput" maxlength="40" value="${escapeAttr(state.name)}" required></label><button class="primary-btn" type="submit">SALVAR ALTERAÇÕES</button></form>`);
    $("editProfileForm").addEventListener("submit", event => {
      event.preventDefault();
      const name = $("profileNameInput").value.trim();
      if (!name) return;
      state.name = name; saveState(); closeModal(); renderAll(); showToast("Perfil atualizado.");
    });
  }

  function openOnboarding() {
    openModal(`<div style="text-align:center"><img src="assets/img/logo.svg" alt="" style="width:76px;height:76px"><h2 style="margin-top:12px">Bem-vindo ao Trilha IMD</h2><p>Aprenda disciplinas fundamentais do IMD em trilhas curtas, com prática, XP e progresso contínuo.</p></div><form class="edit-form" id="onboardingForm"><label>Como quer ser chamado?<input id="onboardingName" maxlength="40" placeholder="Seu nome" required></label><label>Por onde quer começar?<select id="onboardingCourse" style="border:2px solid var(--border);border-radius:12px;padding:12px;background:var(--surface);color:var(--text)">${courses.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}</select></label><button class="primary-btn" type="submit">COMEÇAR A APRENDER</button></form>`);
    dom.modalCloseButton.hidden = true;
    $("onboardingForm").addEventListener("submit", event => {
      event.preventDefault();
      state.name = $("onboardingName").value.trim() || "Estudante IMD";
      state.currentCourse = $("onboardingCourse").value;
      state.onboarded = true; saveState();
      dom.modalCloseButton.hidden = false;
      closeModal(); renderAll(); showToast("Sua trilha está pronta!");
    });
  }

  function confirmReset() {
    openModal(`<h2>Redefinir todo o progresso?</h2><p>Isso apagará XP, gemas, sequência, missões, lições concluídas e compras deste navegador. Essa ação não pode ser desfeita.</p><div class="confirm-actions"><button class="cancel" id="cancelReset" type="button">CANCELAR</button><button class="confirm" id="confirmReset" type="button" style="background:var(--red)">APAGAR PROGRESSO</button></div>`);
    $("cancelReset").addEventListener("click", closeModal);
    $("confirmReset").addEventListener("click", () => {
      state = defaultState(); state.onboarded = true; state.name = "Estudante IMD"; saveState(); closeModal(); applyTheme(); renderAll(); navigate("learn"); showToast("Progresso redefinido.");
    });
  }

  function openNoHeartsModal() {
    rechargeHearts();
    if (state.hearts > 0) return renderAll();
    const minutes = minutesUntilHeart();
    openModal(`<div style="text-align:center"><div style="font-size:70px">❤</div><h2>Sem corações</h2><p>Você recebe 1 coração automaticamente a cada 30 minutos. Próximo em aproximadamente ${minutes} min.</p><button class="primary-btn" id="modalRefillHearts" type="button" ${state.gems < 50 ? "disabled" : ""}>RECUPERAR POR 50 💎</button></div>`);
    $("modalRefillHearts").addEventListener("click", () => { if (state.gems < 50) return; state.gems -= 50; state.hearts = MAX_HEARTS; state.lastHeartAt = Date.now(); saveState(); closeModal(); renderAll(); showToast("Corações recuperados!"); });
  }

  function showRewardModal(title, text, icon, reward) {
    openModal(`<div style="text-align:center"><div style="font-size:72px">${icon}</div><h2>${title}</h2><p>${text}</p><div style="font-size:24px;font-weight:900;color:var(--blue);margin:16px 0">${reward}</div><button class="primary-btn" id="rewardClose" type="button">CONTINUAR</button></div>`);
    $("rewardClose").addEventListener("click", closeModal);
  }

  function navigate(page) {
    dom.pages.forEach(section => section.classList.toggle("active", section.dataset.page === page));
    dom.navLinks.forEach(link => link.classList.toggle("active", link.dataset.pageLink === page));
    dom.bottomLinks.forEach(link => link.classList.toggle("active", link.dataset.pageLink === page));
    if (page === "ranking") renderRanking();
    if (page === "quests") renderQuests();
    if (page === "shop") renderShop();
    if (page === "profile") renderProfile();
    window.scrollTo({ top:0, behavior:"smooth" });
  }

  function updateStreak() {
    const today = todayKey();
    if (state.lastStudyDate === today) return;
    if (!state.lastStudyDate) state.streak = 1;
    else {
      const diff = daysBetween(parseDateKey(today), parseDateKey(state.lastStudyDate));
      if (diff === 1) state.streak += 1;
      else if (diff === 2 && state.streakFreeze > 0) { state.streakFreeze -= 1; state.streak += 1; }
      else state.streak = 1;
    }
    state.lastStudyDate = today;
  }

  function rechargeHearts(shouldSave = true) {
    if (state.hearts >= MAX_HEARTS) { state.lastHeartAt = Date.now(); return; }
    const elapsed = Date.now() - Number(state.lastHeartAt || Date.now());
    const recovered = Math.floor(elapsed / HEART_RECHARGE_MS);
    if (recovered > 0) {
      state.hearts = Math.min(MAX_HEARTS, state.hearts + recovered);
      state.lastHeartAt = state.hearts >= MAX_HEARTS ? Date.now() : Number(state.lastHeartAt) + recovered * HEART_RECHARGE_MS;
      if (shouldSave) saveState();
    }
  }

  function minutesUntilHeart() {
    if (state.hearts >= MAX_HEARTS) return 0;
    const elapsed = Date.now() - Number(state.lastHeartAt || Date.now());
    return Math.max(1, Math.ceil((HEART_RECHARGE_MS - (elapsed % HEART_RECHARGE_MS)) / 60000));
  }

  function ensureDailyState() {
    const today = todayKey();
    if (!state.daily || state.daily.date !== today) state.daily = { date: today, xp:0, lessons:0, correct:0, claimed:[] };
  }

  function getCurrentUnit(course) {
    for (const unit of course.units) {
      if (unit.nodes.some(node => !isNodeCompleted(node))) return unit;
    }
    return course.units[course.units.length - 1];
  }

  function courseProgress(course) {
    const nodes = flattenNodes(course).map(x => x.node);
    const done = nodes.filter(isNodeCompleted).length;
    return { done, total:nodes.length, percent:nodes.length ? Math.round((done/nodes.length)*100) : 0 };
  }

  function flattenNodes(course) {
    return course.units.flatMap((unit, unitIndex) => unit.nodes.map((node, nodeIndex) => ({ unit, node, unitIndex, nodeIndex })));
  }

  function findNode(course, nodeId) { return flattenNodes(course).find(x => x.node.id === nodeId); }
  function getCourse(id) { return courses.find(c => c.id === id) || courses[0]; }
  function nodeIcon(node, status) {
    if (status === "locked") return "🔒";
    if (node.type === "chest") return status === "completed" ? "✓" : "▣";
    if (node.type === "trophy") return status === "completed" ? "✓" : "★";
    return status === "completed" ? "✓" : "★";
  }
  function statusLabel(status) { return status === "completed" ? "concluída" : status === "current" ? "disponível" : "bloqueada"; }
  function levelFromXp(xp) { return Math.floor(xp / 200) + 1; }

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!raw || raw.version !== 2) return defaultState();
      return { ...defaultState(), ...raw, completed:{...raw.completed}, claimedChests:{...raw.claimedChests}, daily:{...defaultState().daily,...raw.daily,claimed:[...(raw.daily?.claimed || [])]} };
    } catch { return defaultState(); }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function applyTheme() { document.body.classList.toggle("dark", state.theme === "dark"); if (dom.themeToggle) dom.themeToggle.checked = state.theme === "dark"; }

  function openModal(html) { dom.modalContent.innerHTML = html; dom.modalBackdrop.hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal() { dom.modalBackdrop.hidden = true; dom.modalContent.innerHTML = ""; dom.modalCloseButton.hidden = false; if (dom.lessonScreen.hidden) document.body.style.overflow = ""; }
  function showToast(message) { clearTimeout(toastTimer); dom.toast.textContent = message; dom.toast.classList.add("show"); toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 2600); }

  function cloneQuestion(question) { return JSON.parse(JSON.stringify(question)); }
  function shuffle(array) { const copy = [...array]; for (let i=copy.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; } return copy; }
  function todayKey() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
  function parseDateKey(key) { if (!key) return null; const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d); }
  function daysBetween(a,b) { if (!a || !b) return Infinity; return Math.round((startOfDay(a)-startOfDay(b))/86400000); }
  function startOfDay(date) { return new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime(); }
  function darken(hex, amount) {
    const n=parseInt(hex.replace("#",""),16); const r=Math.max(0,((n>>16)&255)*(1-amount)); const g=Math.max(0,((n>>8)&255)*(1-amount)); const b=Math.max(0,(n&255)*(1-amount));
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch])); }
  function escapeAttr(value) { return escapeHtml(value).replace(/`/g,"&#96;"); }
})();
