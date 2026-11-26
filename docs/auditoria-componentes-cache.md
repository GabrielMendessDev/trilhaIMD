# Auditoria de componentes e cache

## Escopo

Revisei os 119 módulos TypeScript e JavaScript autorais em src, incluindo os 72 arquivos React em TSX. A revisão incluiu módulos abaixo de 500 linhas, componentes de servidor e cliente, rotas, modelos de leitura e funções de domínio. A tabela agrupa os módulos existentes no início da auditoria.

| Área | Módulos revisados | Arquivos TSX | Decisão |
| --- | ---: | ---: | --- |
| API | 5 | 0 | Preservar os formatos existentes e adicionar consultas opcionais para superfícies que pedem só histórico ou estado resumido. |
| Administração | 2 | 1 | Separar login, consultas e apresentação dos grupos de métricas. |
| Atividades e trilhas | 32 | 24 | Separar navegação, telas restauradas, materiais, pré-carga e controles interativos. Preservar renderizadores de conteúdo e feedback que já são reutilizáveis. |
| Componentes compartilhados | 30 | 26 | Separar catálogo, confirmação, filtros, histórico e menu da conta. Manter componentes pequenos como barra de progresso, ícones e botões. |
| Demais telas e rotas | 20 | 20 | Separar seções da página de progresso. Manter a composição local de autenticação, perfil, provas, missões e navegação quando cada trecho depende do mesmo fluxo. |
| Domínio e utilitários | 8 | 1 | Reutilizar o formatador de dias de estudo. Manter as definições de itens, conquistas e regras de calendário no domínio. |
| Servidor | 22 | 0 | Separar catálogo de conteúdo, avaliação, operações de loja, recursos das atividades e consultas de histórico. Manter escritas relacionadas dentro da mesma transação. |

## Divisões

| Arquivo principal | Linhas antes | Linhas depois |
| --- | ---: | ---: |
| `app/_components/rpg-hub.tsx` | 691 | 362 |
| `app/aprender/_etapa/lesson-player.tsx` | 523 | 267 |
| `app/admin/dashboard/page.tsx` | 499 | 72 |
| `app/progresso/page.tsx` | 285 | 164 |
| `app/aprender/_etapa/controls.tsx` | 269 | 109 |
| `app/_components/dashboard.tsx` | 236 | 193 |
| `server/rpg.ts` | 661 | 180 |
| `server/rpg-actions.ts` | 618 | 356 |
| `server/lesson.ts` | 547 | 232 |

O maior arquivo React após as divisões tem 362 linhas. Formulário de resposta, rastreamento da sessão, prova e feedback seguem em módulos próprios porque cada um coordena um fluxo de estado específico.

## Cache e consultas

| Dado | Onde e por quanto tempo | Atualização |
| --- | --- | --- |
| Filtros de Loja, Mochila e Conquistas | sessionStorage por aba e tela | Cada alteração salva a preferência após validação das opções. |
| Pré-carga de imagens públicas das atividades | Até 128 URLs de sucesso no sessionStorage, por 15 minutos | O navegador mantém sua política de cache HTTP. A pré-carga é deduplicada e usa prioridade baixa. |
| Histórico da Mochila | Memória da aba por conta, por até 30 segundos | Abre sob demanda, reúne requisições concorrentes e invalida após uma alteração de RPG nessa aba. Falhas permitem nova tentativa. |
| Conteúdo publicado das atividades | Cache do servidor por revisão da publicação | Guarda a projeção das telas e dos materiais e a reutiliza até a revisão mudar. O navegador recebe os modelos de apresentação. |

A carga inicial de Loja e Conquistas, a Mochila fechada e as mutações da interface dispensam as duas consultas do histórico. O formato completo da API continua disponível aos chamadores existentes. Saldo, estoque, recompensas, progresso e métricas administrativas continuam sob validação do servidor.

A inicialização de uma carteira com progresso anterior busca as chaves das questões em um lote. O progresso semanal agrega conclusões em uma única passagem e reaproveita o formatador de datas de São Paulo.

O impacto registrado é a redução de consultas e de trabalho repetido no código. A auditoria não inclui uma medição de latência em produção.
