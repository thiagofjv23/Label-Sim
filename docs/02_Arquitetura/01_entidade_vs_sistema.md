# Arquitetura — Entidade vs. Sistema

Princípio canônico aplicável a **todas** as entidades da simulação.

> «Entidades armazenam identidade, características próprias e relações
> estruturais. Resultados produzidos pela passagem do tempo e pela simulação
> devem ser armazenados e processados pelos sistemas responsáveis.»

## Dados próprios de entidades

Pertencem à entidade (ficam nos JSON de `database/` e nos contratos de
`src/entities`):

- identidade (`id`, `type`);
- nome;
- data de origem;
- classificação (ex.: `albumType`, `artistType`);
- relações com outras entidades (por ID);
- características permanentes ou diretamente atribuídas.

## Dados dinâmicos (pertencem aos sistemas)

Resultados produzidos pela passagem do tempo e pela simulação. **Não** são
campos canônicos das entidades:

- vendas;
- posições em charts;
- popularidade atual;
- receita;
- certificações;
- histórico semanal;
- resultados de campanhas;
- eventos ocorridos;
- mudanças produzidas pela simulação.

## "Estático" não é "imutável"

Um dado pertencente à entidade **pode mudar** — mas somente por uma **ação
explícita do domínio**, nunca como efeito colateral difuso da simulação.

Exemplos de mudança legítima de dado da entidade:

- um artista pode mudar de gravadora (`currentLabelId`);
- uma banda pode ganhar ou perder integrantes;
- um álbum pode passar de `recording` para `released`;
- uma música pode ter seu lançamento cancelado.

Em contraste, **vendas** e **posições em charts** não são atributos próprios do
lançamento: são resultados produzidos por sistemas e vivem fora da entidade.

## Como isto guia o código

- Entidades (`src/entities`) são POJOs de dados; não contêm lógica.
- Sistemas (`src/systems`, via `System`/`TickContext`) leem entidades e produzem
  e guardam os resultados dinâmicos.
- A camada de UI apenas observa — não decide (ver README e `00_motor_de_simulacao.md`).

Decisão canônica correspondente: `docs/decisions/0004-entidade-vs-sistema.md`.
