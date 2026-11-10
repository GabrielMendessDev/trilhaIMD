# Auditoria de feedback do Trilbit

Validação de 10/11/2026. A experiência mantém a paleta e os componentes oficiais de `DESIGN.md`. O percurso principal foi exercitado em Chrome com conta descartável, servidor local e PostgreSQL.

| Dimensão | Nota de 0 a 4 | Evidência e limite |
| --- | --- | --- |
| Acessibilidade | 3 | Mensagens em regiões `aria-live`, foco na chegada, controle por teclado, estados sem depender de cor e alternativa com movimento reduzido. A validação cobriu semântica e comportamento no navegador. |
| Desempenho | 3 | CSS e Web Animations nativas, efeitos curtos e animação contínua restrita a processamento real. As requisições não são atrasadas para exibir efeitos. |
| Temas | 3 | Estados usam os tokens semânticos existentes. As capturas do percurso principal usam o tema escuro. |
| Responsividade | 3 | Percurso verificado em viewports emulados de 390 × 844 e 1440 × 1000, com foco e teclado. O teste não substitui validação em aparelho físico. |
| Integridade | 3 | Resultado, XP, próxima etapa e medalhas derivam dos registros de conclusão. O detector Impeccable retornou avisos consultivos de tipografia e raios preexistentes em `stage.module.css`. |

## Fluxos verificados

- Um envio lento mantém a largura do botão, apresenta spinner e bloqueia o segundo clique.
- Uma falha de rede preserva a escolha, exibe a causa e permite repetir o envio.
- Acerto confirmado aplica Menta, check e pulso à resposta. Erro confirmado aplica Coral e uma vibração curta.
- O primeiro erro bloqueia novas escolhas e reaparece somente na revisão final. A segunda resposta encerra aquela questão.
- A atualização do indicador distingue questão corrigível de tela de conteúdo.
- O aviso temporário termina e o feedback essencial permanece até o estudante continuar.
- A revisão diferencia acerto direto, recuperação e dificuldade definitiva.
- A conclusão exibe o XP persistido, a próxima etapa e as conquistas cujas condições foram atingidas naquela conclusão.
- Recarregar o resultado preserva os números e evita repetir a celebração no mesmo navegador.
- O mapa realça a etapa liberada. Um link navegado por teclado anuncia o carregamento durante a requisição e encerra o estado no destino.
- Movimento reduzido mantém o feedback textual e os valores corretos, com efeitos espaciais desativados.

## Componentes compartilhados

`FeedbackProvider` e `FeedbackViewport` gerenciam avisos e navegação. `ActionButton` e `ActionLink` conectam os estados aos controles. `LessonTransition`, `AnswerMotion`, `CompletionEffects`, `XpBalance` e `ProgressBar` apresentam as mudanças de estado. As condições das conquistas são compartilhadas em `learning-metrics.ts`.

As páginas de início, trilhas, disciplinas, lições, materiais, revisão, resultado, conquistas, conta e login usam os componentes comuns nos respectivos pontos de interação. A redução de movimento fica centralizada em `feedback.css` e nos efeitos específicos de resposta.

## Reprodução

Execute `npm run test:aprendizagem`, `npm run test:feedback` e a checagem TypeScript. Com o servidor e o banco locais disponíveis, execute `npm run test:aprendizagem:http` e `npm run test:feedback:browser`. As variáveis de ambiente e a configuração do Chrome estão documentadas no [guia de autoria](../conteudos/README.md).
