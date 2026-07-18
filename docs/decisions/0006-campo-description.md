# 0006 — Campo `description` (opcional, apenas UI)

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

A interface do jogo (estilo Wikipédia) se beneficia de textos descritivos das
entidades. Esse conteúdo é de apresentação e não deve influenciar a simulação.

## Decisão

Toda entidade **pode** possuir um campo opcional `description` (definido na base
`Entity`, herdado por todas):

- objetivo exclusivo: **enriquecer a UI**;
- a simulação **nunca** deve depender do conteúdo;
- o texto deve ser **atemporal** — evitar informações que mudem com a evolução da
  linha do tempo do jogo (ex.: prêmios, número de álbuns, gravadora atual).

Exemplos:

- **Artist:** "Cantor e compositor brasileiro considerado um dos maiores nomes da
  música popular brasileira."
- **Genre:** "Gênero musical brasileiro surgido na década de 1960 que combina
  elementos da bossa nova, samba e outros estilos nacionais."
- **Label:** "Gravadora brasileira responsável pelo lançamento de diversos
  artistas da música popular."
- **Country:** "Maior país da América do Sul, reconhecido por sua diversidade
  cultural e forte tradição musical."

## Consequências

- `src/entities/Entity.ts`: `description?: string` na base.
- Exemplos semente enriquecidos: Artist, Country, Label e Genre.
- É conteúdo de apresentação (parente do futuro `display`), mas texto, não
  layout; permanece na entidade por ser atemporal e diretamente atribuído.
- **Cuidado com fidelidade histórica:** não incluir dados que já são campos
  (ex.: ano de fundação) e que possam divergir; o texto do Label de exemplo foi
  mantido atemporal, sem ano, para não conflitar com `foundationYear`.
