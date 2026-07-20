# 0007 — Theme (tema) como entidade, distinto de Genre

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

`romantic` havia sido modelado como gênero (`genre_romantic`). Na verdade,
"romântico" é um **tema** de música, não um gênero. Uma canção tem um gênero
(ex.: MPB) **e** um tema (ex.: romântico, verão):

- Song 1 — Genre: MPB, Theme: Romantic
- Song 2 — Genre: MPB, Theme: Summer

## Decisão

1. **Theme é uma entidade**, análoga a `Genre`:
   - vive em `database/themes`;
   - ID técnico em **inglês** (`theme_romantic`); `name` em **português**
     (`Romântico`); `slug` em inglês;
   - referenciada por `themeId` (sem duplicar nomes).

2. **Uma música tem no máximo um tema** — `Song.themeId: EntityId | null`.

3. **O álbum pode ter um tema opcional** — `Album.themeId: EntityId | null`:
   - se o álbum tem tema, ele **prevalece** e vale para **todas** as músicas do
     álbum;
   - se o álbum **não** tem tema (`null`), cada música define o próprio `themeId`.

4. **Tema efetivo é derivado, não duplicado** (princípio da decisão 0004). A
   função `resolveEffectiveThemeId(song, album)` (`src/simulation/resolveTheme.ts`)
   implementa a regra: tema do álbum, se houver; senão, tema da música.

5. **`romantic` deixa de ser gênero.** `genre_romantic` foi removido de
   `Song.genreIds` e `Album.genreIds`; em seu lugar entra o tema `theme_romantic`.

## Consequências

- Novo contrato `src/entities/Theme.ts` e exemplo `database/themes/…Romantic….json`.
- `Song` e `Album` ganham `themeId`; `validateReferences` estendido (`themeId → Theme`).
- No exemplo *Detalhes*: o álbum fica sem tema (`themeId: null`) e a música
  `song_detalhes` recebe `theme_romantic` — demonstrando o caminho por-música.
- Popularidade/demanda de tema, se um dia existir, é estado dinâmico de mercado e
  **não** fica em `Theme` (mesmo princípio da decisão 0005).

## ToDo futuro

- Ação de criação de álbum que escolhe o tema do álbum (propaga a resolução a
  todas as faixas) pertence a um sistema, não ao dado.
- Vocabulário inicial de temas (romantic, summer, …) a semear conforme necessário.
