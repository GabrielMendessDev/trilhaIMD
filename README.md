<div align="center">

<img src="public/brand/bito.webp" alt="Bito, o mascote roxo do trilbit, acenando com uma mochila laranja" width="260" />

# trilbit

**Aprenda TI. Evolua por trilhas.**

Plataforma de estudo por trilhas para estudantes do Bacharelado em Tecnologia da Informação do **IMD/UFRN**.<br />
Feita por estudantes do BTI, para estudantes do BTI.

[![Quality](https://github.com/GabrielMendessDev/trilhaIMD/actions/workflows/quality.yml/badge.svg)](https://github.com/GabrielMendessDev/trilhaIMD/actions/workflows/quality.yml)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

[**Acessar o trilbit**](https://trilhaimd.vercel.app) · [Começar a desenvolver](#-começando) · [Documentação](#-documentação)

</div>

---

## 📖 Sobre

O **trilbit** organiza as disciplinas de TI em **mapas de etapas**, com conteúdos, exercícios e desafios para revisar no próprio ritmo, no celular ou no computador. O progresso vira **XP, níveis, ofensiva e conquistas**. E o **Bito**, o mascote da plataforma, acompanha toda a jornada.

## ✨ Funcionalidades

| | Recurso | Como funciona |
|---|---|---|
| 🗺️ | **Trilhas por etapas** | Cada disciplina é um mapa contínuo de passos com conteúdos, exercícios e materiais complementares. |
| ✅ | **Correção no servidor** | Os exercícios são corrigidos com gabarito no servidor, com duas tentativas e feedback comentado. |
| ⭐ | **XP e níveis** | O XP da etapa é creditado na primeira conclusão. A tabela de níveis vai do nível 1 ao 1.000, com recompensas. |
| 🔥 | **Ofensiva** | Dias seguidos de estudo, contados no fuso de Brasília, com itens de proteção. |
| 🎯 | **Missões diárias** | Metas reais do dia: concluir uma lição, responder cinco questões novas e um material complementar. |
| 🏆 | **Conquistas** | Medalhas desbloqueadas pelo progresso salvo. |
| 🛍️ | **Loja do Bito e Mochila** | Bits ganhos no estudo viram auxílios para as lições, cosméticos e proteção de ofensiva. |
| 📊 | **Progresso** | Precisão na primeira tentativa, questões recuperadas, ritmo semanal e recomendações de revisão. |
| 🌗 | **Tema claro e escuro** | Tema claro por padrão, navegação por teclado e respeito à preferência por movimento reduzido. |
| 🔐 | **Login com Google** | Sem senha local: o primeiro acesso com Google cria a conta. |

## 📚 Trilhas

| Trilha | Disciplina | Conteúdo |
|---|---|---|
| **Σ Elementar** | Matemática Elementar | 60 passos, 1.020 telas e 600 questões comentadas |
| **01 FMC 1** | Fundamentos de Matemática para Computação | 18 passos |
| **n! Combinatória** | Análise Combinatória | Em preparação |
| **∫ Cálculo 1** | Cálculo 1 | Em preparação |
| **x,y VGA** | Vetores e Geometria Analítica 1 | Em preparação |

> [!TIP]
> O [leitor independente da Matemática Elementar](public/materiais/elementar/index.html) funciona sem banco e sem login.

## 🧰 Tecnologias

| Camada | Ferramentas |
|---|---|
| **Aplicação** | [Next.js 15](https://nextjs.org) (App Router, Server Components e Server Actions) · [React 19](https://react.dev) · [TypeScript](https://www.typescriptlang.org) |
| **Estilo** | [Tailwind CSS 4](https://tailwindcss.com) · CSS Modules |
| **Dados** | [PostgreSQL](https://www.postgresql.org) ([Supabase](https://supabase.com) em produção) · [Prisma 6](https://prisma.io) com o driver adapter [`pg`](https://node-postgres.com) |
| **Autenticação** | [Auth.js (NextAuth v5)](https://authjs.dev) com Google OAuth |
| **API** | [tRPC 11](https://trpc.io) · [Zod](https://zod.dev) |
| **Qualidade** | [Biome](https://biomejs.dev) · testes com `node:test` · GitHub Actions |
| **Hospedagem** | [Vercel](https://vercel.com), região `pdx1` (Oregon), ao lado do banco |

## 🚀 Começando

### Pré-requisitos

- [Node.js 24](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), para o PostgreSQL local
- Um cliente OAuth do Google, para o login (veja [Login com Google](#-login-com-google))

### Passo a passo

```sh
# 1. Clone o repositório e instale as dependências
git clone https://github.com/GabrielMendessDev/trilhaIMD.git
cd trilhaIMD
npm ci

# 2. Crie o arquivo de ambiente
cp .env.example .env

# 3. Suba o PostgreSQL local (com o Docker Desktop aberto)
docker compose up -d

# 4. Aplique as migrações e inicie o app
npm run db:migrate
npm run dev
```

O app abre em **http://localhost:3000**.

O banco local fica em `localhost:5432`, com um volume Docker que preserva os dados entre reinicializações. Para parar o banco sem apagar os dados, use `docker compose down`. Para apagar também o volume, use `docker compose down -v`.

> [!NOTE]
> As credenciais padrão do banco estão no `.env.example`. Se mudar usuário, senha ou nome do banco, mantenha `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` e `DATABASE_URL` alinhados no `.env`.

### 🔑 Login com Google

1. Crie um cliente OAuth do tipo **Aplicativo da Web** na [Google Auth Platform](https://console.cloud.google.com/auth/clients).
2. Cadastre `http://localhost:3000/api/auth/callback/google` nas URIs de redirecionamento autorizadas. Em produção, cadastre a mesma rota no domínio HTTPS do app. Se o app OAuth estiver em modo de teste, inclua sua conta nos usuários de teste.
3. No `.env`, preencha `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` e defina `AUTH_SECRET` (gere com `npx auth secret`). Em produção, defina também `AUTH_URL` com a origem pública do app.
4. Reinicie o servidor e abra `/login`.

### ⚙️ Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `DATABASE_URL` | Conexão com o PostgreSQL |
| `POSTGRES_USER` · `POSTGRES_PASSWORD` · `POSTGRES_DB` | Credenciais do banco local usado pelo `compose.yaml` |
| `AUTH_SECRET` | Segredo do Auth.js (`npx auth secret`) |
| `AUTH_URL` | Origem pública do app (somente produção) |
| `AUTH_GOOGLE_ID` · `AUTH_GOOGLE_SECRET` | Cliente OAuth do Google |
| `ADMIN_USERNAME` · `ADMIN_PASSWORD` | Acesso ao painel de métricas |
| `ADMIN_SETUP_TOKEN` | Autoriza a primeira troca de credenciais do admin em produção |
| `ANALYTICS_ENABLED` | `false` pausa a coleta de métricas |
| `TRILBIT_LOCAL_LOGIN` | `true` ativa o login de desenvolvimento (somente com banco local) |

## 📜 Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com Turbopack |
| `npm run build` | Build de produção |
| `npm run preview` | Build e servidor de produção locais |
| `npm run verify` | Lint, tipos, testes e validação dos conteúdos (o mesmo que o CI roda) |
| `npm run check:write` | Corrige formatação e lint com o Biome |
| `npm run typecheck` | Checagem de tipos |
| `npm test` | Testes unitários |
| `npm run db:migrate` | Aplica as migrações do banco |
| `npm run db:studio` | Abre o Prisma Studio |
| `npm run conteudo:validar` | Valida os arquivos de conteúdo |
| `npm run conteudo:importar` | Importa conteúdos para o banco |

## 🗂️ Estrutura

```text
trilhaIMD/
├── conteudos/          # Conteúdos das trilhas em JSON (elementar, fmc)
├── docs/               # Decisões de produto, economia do RPG e auditorias
├── prisma/             # Schema e migrações do banco
├── public/
│   ├── brand/          # Marca e ilustrações do Bito
│   └── materiais/      # Leitor independente dos materiais
├── scripts/            # Geração, validação e publicação de conteúdo
├── src/
│   ├── app/            # Rotas e componentes (App Router)
│   ├── domain/         # Regras de negócio: currículos, vidas, RPG
│   ├── server/         # Acesso a dados, autenticação e ações do servidor
│   └── styles/         # Tokens de design e estilos globais
└── tests/              # Testes unitários, HTTP e de navegador
```

## 🛠️ Administração

- **Painel de métricas** em `/admin/dashboard`. Localmente, o acesso padrão é `admin`/`admin`, e o painel pede a troca de credenciais no primeiro acesso. Em produção, o painel exige senha de pelo menos 16 caracteres e HTTPS.
- **Privacidade:** a página `/privacidade` permite pausar a medição no navegador, e `ANALYTICS_ENABLED=false` pausa a coleta para todos.
- **Níveis:** a página `/niveis` mostra o XP e as recompensas dos níveis 1 a 1.000. A Mochila recebe as recompensas automaticamente; itens acima do limite de estoque viram Bits.

## ✅ Qualidade

O workflow **Quality** roda `npm run verify` e `npm run build` em cada push e pull request.

- **Banco existente:** antes de iniciar uma versão nova, rode `npm run db:migrate`. A migração `20261116000100_read_models` adiciona a reconciliação diária da carteira, índices de histórico e a revisão do catálogo usada pelo cache.
- **Teste de ponta a ponta local:** no Windows, com PostgreSQL 16 e Chrome instalados, `npm run test:vidas:local` cria um banco e um servidor descartáveis e verifica vidas, RPG, cache do catálogo e navegação no desktop e no celular, sem tocar no banco do `.env`. Use `TRILBIT_PG_BIN` e `TRILBIT_TEST_CHROME` para apontar os executáveis.

## ☁️ Deploy

O app roda na **Vercel**, na região `pdx1` (Oregon), ao lado do banco no Supabase (`us-west-2`). O deploy é feito pela CLI a partir da `main` atualizada:

```sh
git switch main && git pull
npx vercel@65.16.0 deploy --prod --yes
```

Na primeira vez, numa máquina nova, faça o login e ligue a pasta ao projeto com `npx vercel@65.16.0 login` e `npx vercel@65.16.0 link --project trilhaimd`. O `.vercelignore` impede que `.env` e builds locais sejam enviados.

## 🤝 Contribuindo

1. Crie um branch a partir da `dev`: `feat/...`, `fix/...`, `perf/...` ou `docs/...`.
2. Rode `npm run verify` antes de abrir o PR.
3. Abra o PR para a **`dev`**. Depois de revisado e com o CI verde, ele é mergeado.
4. As versões vão para produção com um PR da **`dev` para a `main`**, seguido do deploy.

## 📄 Documentação

| Documento | Assunto |
|---|---|
| [Guia do banco de aprendizagem](conteudos/README.md) | Formato JSON dos pontos da trilha, os quatro tipos de questão, validação e importação |
| [Matemática Elementar](conteudos/elementar/README.md) | Os 60 passos da trilha Elementar |
| [Vidas e atividades](docs/vidas-atividades.md) | Regras de vidas e itens de reposição |
| [Economia do RPG](docs/rpg-economia.md) | XP, Bits, itens e proteção de ofensiva |
| [Experiência de aprendizagem](docs/experiencia-aprendizagem.md) | Decisões de experiência das lições |
| [Otimizações implementadas](docs/otimizacoes-implementadas.md) | Melhorias de desempenho |

## 👥 Equipe

<a href="https://github.com/GabrielMendessDev/trilhaIMD/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=GabrielMendessDev/trilhaIMD" alt="Pessoas que contribuíram com o trilbit" />
</a>

<div align="center">
<br />
<sub>Feito com 💜 por estudantes do BTI · IMD/UFRN</sub>
</div>
