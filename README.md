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

[**Acessar o trilbit**](https://trilhaimd.vercel.app) · [Começar a desenvolver](#-começando)

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
- Um cliente OAuth do Google, para o login
