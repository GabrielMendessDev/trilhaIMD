# Matemática Elementar · 60 passos

A sequência foi **inteiramente reescrita**, incluindo os antigos passos 1 a 10. Cada unidade contém 20 passos e cada passo contém **17 telas**, com 10 questões corrigíveis, seis telas de leitura e um exemplo guiado em três momentos. Total: **1.020 telas, 600 questões e 60 exemplos resolvidos**.

- [Unidade 1 — passos 1–20](unidade-1/README.md)
- [Unidade 2 — passos 21–40](unidade-2/README.md)
- [Unidade 3 — passos 41–60](unidade-3/README.md)
- [Apostila completa em Markdown](APOSTILA-COMPLETA.md)
- [Leitor interativo independente](../../public/materiais/elementar/index.html) — pode ser aberto diretamente no navegador; funciona sem banco, login ou conexão.
- [Matriz de cobertura curricular](COBERTURA.md)

## Autoria e manutenção

As fontes editoriais estão em scripts/autoria. Execute npm run conteudo:gerar:elementar para gerar os 60 JSONs, a apostila e o leitor. Execute npm run test:elementar para verificar sequência, telas, alternativas, recursos locais e gabaritos de exemplos calculáveis.

Referência curricular: IMD1001_acervo_unificado_P1_P2_P3.md, fornecido pelo estudante; recorte P1/P2/P3 de 2025.2. Texto, exemplos e questões desta versão são autorais. Os PDFs de P2/P3 não foram conferidos diretamente nesta produção. As exclusões de 2025.2 não devem ser presumidas para outras ofertas.

## Publicação no aplicativo

Os 60 JSONs obedecem ao esquema existente. O comando npm run conteudo:publicar:elementar valida todos os arquivos antes de gravar e substitui somente as atividades da trilha elementar em uma transação. Ele salva um backup local do catálogo anterior. Havendo progresso na distribuição antiga, arquiva os pontos anteriores com seus IDs, respostas, conclusões, XP, leituras e auxílios; os 60 passos novos recebem IDs próprios e progresso independente. O histórico arquivado continua disponível nas métricas e não aparece no mapa ativo. A reimportação da mesma versão é idempotente. Não altere IDs e números de telas depois de começar a coletar progresso.

O leitor independente é material de estudo: respostas ficam disponíveis para autocorreção e não geram XP, notas oficiais ou progresso do aplicativo. O aplicativo mantém sua correção no servidor após a importação.
