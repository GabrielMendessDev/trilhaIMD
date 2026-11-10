# Matemática Elementar · Unidade 1

Pesquisa e atividades para a trilha `elementar`, pontos 1 a 10, com base no recorte da P1 de IMD1001 (IMD/UFRN, 2025.2). A unidade tem 184 telas de conteúdo e prática e 129 questões corrigíveis. Cada ponto tem uma abertura, um exemplo guiado, explicações intercaladas e materiais consultáveis. A revisão acrescenta uma segunda tentativa apenas às questões erradas.

## Mapa da trilha

| Ponto | Tema | O que o aluno precisa dominar |
| --- | --- | --- |
| [1](../01.json) | Linguagem dos conjuntos e conjuntos numéricos | Ler e escrever conjuntos, distinguir pertinência de inclusão e classificar números. |
| [2](../02.json) | Operações, intervalos e cardinalidade | Operar conjuntos, interpretar extremidades na reta e contar elementos e subconjuntos. |
| [3](../03.json) | Potenciação e raízes | Simplificar potências e radicais, inclusive com expoentes negativos, fracionários e reais. |
| [4](../04.json) | Logaritmos e número de Euler | Converter entre potência e logaritmo, aplicar propriedades e simplificar expressões com `e` e `ln`. |
| [5](../05.json) | Desafio de revisão | Combinar conjuntos, potências e logaritmos dentro do que foi estudado até aqui. |
| [6](../06.json) | Equações e sistemas do 1º grau | Isolar a incógnita, resolver sistemas `2 × 2` e descrever o conjunto-solução. |
| [7](../07.json) | Equações quadráticas e biquadradas | Usar discriminante, Bhaskara e soma e produto, e resolver biquadradas com a troca `t = x²`. |
| [8](../08.json) | Inequações lineares, quadráticas e simultâneas | Resolver desigualdades, ler sinais na reta e intersectar condições simultâneas. |
| [9](../09.json) | Inequações-produto e inequações-quociente | Identificar domínio e pontos críticos, estudar sinais e escrever a união de intervalos. |
| [10](../10.json) | Desafio final da Unidade 1 | Revisar os dois blocos e integrar conjuntos, domínio e álgebra na escrita de soluções. |

A distribuição é uma proposta didática. O mapa reserva o ponto 5 para um desafio e o 10 para o desafio final. Os pontos 1 e 2 concentram linguagem matemática, conjuntos numéricos e operações. A reta numérica aparece desde o ponto 1 e volta nas inequações. Os números complexos entram como complemento do ponto 7, depois das equações quadráticas em ℝ.

## Arquivos de trabalho

- [Anotações dos pontos 1 a 10](anotacoes.md) · conceitos, pré-requisitos, erros frequentes e localizadores nas listas e na prova.
- [Fontes, materiais e videoaulas](referencias.md) · PDFs de origem, leituras e aulas complementares por ponto.
- [Análise das listas e da P1](analise-p1.md) · recorte do programa, habilidades observadas e correções de gabarito.

## Importação dos dez pontos

Depois de [preparar o banco e gerar o cliente Prisma](../../README.md#preparação-do-postgresql), execute na raiz do projeto com PowerShell.

```powershell
foreach ($ponto in 1..10) {
    $arquivo = 'conteudos/elementar/{0:00}.json' -f $ponto
    npm run conteudo:importar -- $arquivo
    if ($LASTEXITCODE -ne 0) { throw "Falha ao importar $arquivo" }
}
```
