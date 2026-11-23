# trilbit

Plataforma de estudo por trilhas para estudantes de Tecnologia da Informação do IMD/UFRN, construída com a [T3 Stack](https://create.t3.gg/).

## Desenvolvimento local com PostgreSQL

O projeto usa PostgreSQL com Prisma. Com Docker Desktop aberto, copie `.env.example` para `.env` se ainda não tiver um arquivo local e suba o banco:

```sh
docker compose up -d
```

O serviço publica o banco em `localhost:5432`, usa um volume Docker para preservar os dados entre reinicializações e verifica quando o PostgreSQL está pronto. As credenciais padrão estão no `.env.example`; se alterar usuário, senha ou nome do banco, mantenha `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` e `DATABASE_URL` alinhados no `.env`.

Em um banco novo, aplique as migrações e inicie o app:

```sh
npm run db:migrate
npm run dev
```

Para parar o banco sem apagar os dados, rode `docker compose down`. Para apagar também o banco local e seu volume, rode `docker compose down -v`.

## Login com Google

1. Crie um cliente OAuth do tipo **Aplicativo da Web** na [Google Auth Platform](https://console.cloud.google.com/auth/clients).
2. Cadastre `http://localhost:3000/api/auth/callback/google` nas URIs de redirecionamento autorizadas. Em produção, cadastre a mesma rota no domínio HTTPS do app. Se o app OAuth estiver no modo de teste, inclua sua conta nos usuários de teste.
3. No `.env` local, preencha `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` com os valores do cliente. Configure `AUTH_SECRET` (gere com `npx auth secret` se precisar) e aponte `DATABASE_URL` para o PostgreSQL. Em produção, defina também `AUTH_URL` com a origem pública do app.
4. Aplique as [migrações do banco](conteudos/README.md#preparação-do-postgresql). Reinicie o servidor e abra `/login`.

## Painel e progressão

O painel de métricas está em `/admin/dashboard`. Configure `ADMIN_USERNAME` e `ADMIN_PASSWORD` no `.env`. O padrão local é `admin` para ambos. Em produção, o painel exige senha de pelo menos 16 caracteres e HTTPS. Defina `ANALYTICS_ENABLED=false` para pausar a coleta. A página `/privacidade` permite pausar a medição no navegador.

A tabela em `/niveis` mostra o XP acumulado e os itens dos níveis 1 a 1.000. A Mochila recebe as recompensas dos níveis atingidos automaticamente, inclusive para contas existentes. Itens que excedem o limite de estoque viram Bits.

## Conteúdos e atividades

O [guia do banco de aprendizagem](conteudos/README.md) descreve o formato JSON por ponto da trilha, os quatro tipos de questão e os comandos de validação e importação.

A [Matemática Elementar completa](conteudos/elementar/README.md) tem 60 passos reescritos, 1.020 telas e 600 questões comentadas. O [leitor independente](public/materiais/elementar/index.html) funciona sem banco ou login; no aplicativo, o mapa é contínuo do passo 1 ao 60. Consulte as [regras de vidas e itens de reposição](docs/vidas-atividades.md) para o fluxo com progresso salvo.

## Verificações e atualização do banco

Use Node.js 24 e `npm ci`. `npm run verify` executa lint do código autoral, tipos, testes locais e validação dos 60 passos. `npm run build` verifica a compilação de produção. O workflow de qualidade executa ambos em pushes e pull requests.

Antes de iniciar esta versão sobre um banco existente, aplique `npm run db:migrate`. A migração `20261116000100_read_models` adiciona a reconciliação diária da carteira, índices de histórico e a revisão do catálogo usada pelo cache. Publicações e importações SQL atualizam a revisão na mesma transação; respostas e dados pessoais permanecem fora do cache compartilhado.

No Windows com PostgreSQL 16 e Chrome instalados, `npm run test:vidas:local` cria banco e servidor descartáveis e verifica vidas, leituras de RPG, invalidação de catálogo, índice de eventos e navegação desktop/celular. Não usa o banco configurado em `.env`. As opções de executáveis são `TRILBIT_PG_BIN` e `TRILBIT_TEST_CHROME`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
