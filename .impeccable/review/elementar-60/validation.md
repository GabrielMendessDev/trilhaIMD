# Validação da entrega

Data local: 12/11/2026. Escopo: reescrita integral da trilha de Matemática Elementar, mapa contínuo e vidas com reposição.

- 60 arquivos JSON validados: três unidades curriculares de 20 passos, com 17 telas por passo; 1.020 telas, 600 questões corrigíveis e 60 exemplos guiados.
- 32 testes unitários passaram: aprendizagem, conteúdo, vidas, economia, política de itens e feedback. O conteúdo também foi conferido por cálculos independentes de potências, logaritmos, parâmetros, determinantes, inversas e intervalos.
- Compilação final de produção passou após as correções e o arquivamento. Typecheck e Biome nos arquivos de implementação/autoria alterados passaram. As inclusões temporárias de tipos de build foram removidas do tsconfig ao encerrar a verificação.
- Teste real de PostgreSQL/HTTP passou: quinto erro, bloqueio após perda, repetição concorrente sem desconto duplicado, histórico da rodada, recomeço idempotente, rejeição de envio antigo, revisão sem perda, três itens, teto de cinco e consumo de estoque único.
- Fixture de versão anterior passou: pontos antigos arquivados com conclusão, XP e Bits preservados; pontos novos independentes. Reimportação idêntica não grava nem duplica atividades.
- Teste de navegador passou em 1440×1000 e 390×844: 60 nós no mesmo mapa, ausência de overflow, perguntas do leitor, mochila, vidas, derrota, recomeço, revisão e loja. Contas e ambientes de teste foram descartados.
- Correções da revisão independente: Sora local incorporada no HTML e rótulos do ciclo ampliados. Quatro recapturas via `file://` validaram fonte sem conexão, navegação, figuras e largura móvel. `verdict.md` registra **ship**, restrito aos dois ajustes apontados.
- Detector executado uma vez, sem falhas primárias. Cor secundária e tamanho secundário de vidas foram alinhados; corpo de 18px é decisão local documentada para leitura.
- Banco principal: migração aplicada e material publicado. Conferência encontrou 60 pontos ativos, 1.020 telas, 600 questões e três itens novos. As assinaturas dos seis progressos anteriores e das carteiras coincidiram antes/depois do arquivamento.
- Cliente Prisma: JavaScript e tipos atualizados. O gerador encontrou bloqueio do Windows ao substituir o binário carregado; SHA-256 confirmou que o binário novo era idêntico ao existente. O arquivo temporário foi removido, a cópia do schema foi sincronizada e consultas tipadas aos campos `archived`, `lives` e `run` passaram no banco principal.

O texto e as questões são autorais, orientados pelo acervo fornecido. Não se afirma auditoria dos PDFs oficiais de P2/P3 nem de avaliações futuras. A revisão visual independente não constitui auditoria matemática integral dos 600 exercícios.
