<div align="center">

<img src="public/brand/bito.webp" alt="Bito, o mascote roxo do trilbit, acenando com uma mochila laranja" width="220" />

<h1>trilbit</h1>

<p>Plataforma de estudo para estudantes de TI do IMD/UFRN,<br />feita por estudantes do BTI.</p>

<p>
  <a href="https://trilhaimd.vercel.app"><strong>Acessar o trilbit →</strong></a>
</p>

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,prisma,postgres,tailwind&theme=dark" alt="Next.js, React, TypeScript, Prisma, PostgreSQL e Tailwind CSS" height="40" />

</div>

<br />

## Sobre

O trilbit transforma as disciplinas do BTI em trilhas de etapas, com conteúdos e exercícios para estudar no próprio ritmo. Cada etapa concluída rende XP, níveis e conquistas, e o Bito acompanha a jornada.

<table>
  <tr>
    <td align="center" width="25%">🗺️<br /><strong>Trilhas</strong><br /><sub>Mapas de etapas por disciplina</sub></td>
    <td align="center" width="25%">✅<br /><strong>Exercícios</strong><br /><sub>Correção com feedback comentado</sub></td>
    <td align="center" width="25%">🔥<br /><strong>Ofensiva</strong><br /><sub>XP, níveis e missões diárias</sub></td>
    <td align="center" width="25%">🛍️<br /><strong>Loja do Bito</strong><br /><sub>Bits viram itens e auxílios</sub></td>
  </tr>
</table>

## Trilhas

| | Disciplina | |
|:-:|---|---|
| **Σ** | Matemática Elementar | 60 passos · 600 questões |
| **01** | Fundamentos de Matemática para Computação | 18 passos |
| **n!** | Análise Combinatória | <sub>em preparação</sub> |
| **∫** | Cálculo 1 | <sub>em preparação</sub> |
| **x,y** | Vetores e Geometria Analítica | <sub>em preparação</sub> |

## Rodando localmente

> Requer **Node.js 24** e **Docker**.

```sh
# 1. Instale as dependências e crie o .env
npm ci
cp .env.example .env

# 2. Suba o banco e aplique as migrações
docker compose up -d
npm run db:migrate

# 3. Inicie o app em http://localhost:3000
npm run dev
```

<br />

<div align="center">
<sub>Feito com 💜 por estudantes do BTI · IMD/UFRN</sub>
</div>
