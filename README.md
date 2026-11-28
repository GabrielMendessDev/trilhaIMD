<div align="center">

<img src="public/brand/bito.webp" alt="Bito, o mascote roxo do trilbit, acenando com uma mochila laranja" width="220" />

# trilbit

**Aprenda TI. Evolua por trilhas.**

Plataforma de estudo para estudantes de TI do IMD/UFRN.

[Acessar o trilbit](https://trilhaimd.vercel.app)

</div>

## Sobre

O trilbit transforma as disciplinas do BTI em trilhas de etapas, com conteúdos e exercícios para estudar no próprio ritmo. Cada etapa concluída rende XP, níveis e conquistas, e o Bito acompanha a jornada.

## Trilhas

- **Matemática Elementar**: 60 passos e 600 questões comentadas
- **Fundamentos de Matemática para Computação (FMC 1)**: 18 passos
- **Em preparação**: Análise Combinatória, Cálculo 1 e Vetores e Geometria Analítica

## Tecnologias

Next.js · React · TypeScript · Prisma · PostgreSQL · Tailwind CSS · Auth.js

## Rodando localmente

Com Node.js 24 e Docker instalados:

```sh
npm ci
cp .env.example .env
docker compose up -d
npm run db:migrate
npm run dev
```

O app abre em http://localhost:3000.
