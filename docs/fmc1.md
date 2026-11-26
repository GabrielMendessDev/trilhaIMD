# FMC 1: conteúdo e publicação

18 módulos divididos em três unidades de seis módulos. Cada módulo contém seis telas de estudo, um exemplo guiado de três passos e dez exercícios com resposta comentada: 306 telas, 180 exercícios e 18 exemplos ao todo. As provas têm 20 questões cada e são liberadas após concluir as etapas 1–6, 7–12 e 13–18, respectivamente.

1. Representar e justificar: linguagem matemática, conjuntos e lógica introdutória, sistemas de numeração, representação computacional, demonstrações, indução e recursão.
2. Entender os números inteiros: divisibilidade, divisão euclidiana, MDC/MMC, primos, congruências, inversos e aplicações.
3. Contar e reconhecer padrões: princípios de contagem, permutações, combinações, inclusão-exclusão, gavetas e recorrências.

A divisão é uma proposta editorial do Trilbit; não representa o calendário oficial de provas de uma turma. O módulo 18 integra os assuntos. Não há uma quarta prova independente. Questões sobre demonstrações verificam etapas e argumentos; a plataforma não corrige provas escritas livremente.

## Fonte e autoria

Consulte [FONTES.md](../conteudos/fmc/FONTES.md). Os textos, exemplos e exercícios são autorais, baseados no recorte indicado do Rosen, com complemento específico de representação computacional. O PDF do livro não é distribuído pelo aplicativo. Recomenda-se revisão pedagógica por docente antes de uso em turma.

Edite `scripts/autoria/fmc/unidade-{1,2,3}.mjs` e execute:

```sh
npm run conteudo:gerar:fmc
npm run conteudo:validar:fmc
npm run test:fmc
```

O gerador atualiza os JSONs, o manifesto, a apostila, o leitor público e as verificações dos materiais. As provas ficam em `src/server/fmc-exam-rows.mjs`.

## Banco e implantação

Com `DATABASE_URL` configurada para o destino correto:

```sh
npm run db:migrate
npm run conteudo:publicar:fmc
npm run build
```

A migração adiciona `trail` às tentativas de prova, com padrão `elementar`, preservando as provas existentes de ME. FMC e ME têm históricos separados por estudante, trilha e unidade. A versão e as questões de cada tentativa ficam salvas para preservar seu resultado após revisões do banco de questões.

O publicador valida todos os módulos antes de escrever, faz backup local e publica em transação. A repetição da mesma publicação não altera o catálogo. Se já houver progresso no catálogo antigo de FMC, arquiva essa versão para preservar os registros; se o arquivo de histórico previsto já existir, interrompe para exigir uma nova identificação de versão. Não exclua o arquivo histórico nem os progressos para contornar essa proteção. Backups contêm dados do catálogo e ficam fora do Git. As outras trilhas não são republicadas por esse comando.

## Validação local

```sh
npm run verify
npm run build
# Em outro terminal: npm start -- -p 3337
# PowerShell, antes de iniciar o servidor local de produção: $env:AUTH_TRUST_HOST='true'
$env:TRILBIT_TEST_URL='http://localhost:3337'
npm run test:fmc:http
npm run test:fmc:browser
npm run test:prova:http
```

Os testes HTTP e de navegador exigem banco e servidor locais, criam usuários temporários e removem esses usuários ao terminar. Publique o conteúdo de ME no banco de testes para a verificação de isolamento entre disciplinas. O leitor está em `/materiais/fmc/leitor.html`; o plano em `/aprender/fmc/plano`. O acesso às etapas usa o progresso normal, sem atalhos de teste.
