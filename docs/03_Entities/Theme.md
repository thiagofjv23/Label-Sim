# Entidade: Theme (Tema)

Arquivo de dados: `database/themes/` — exemplo: `Exemplo Theme - Romantic.json`.
Contrato TypeScript: `src/entities/Theme.ts`.
Decisão canônica: `docs/decisions/0007-theme-como-entidade.md`.

Tema é distinto de gênero. Uma música tem um **gênero** (ex.: MPB) e um **tema**
(ex.: romântico, verão). `Theme` é a fonte única de temas; Song e Album
referenciam por `themeId`, sem duplicar nomes.

## Campos

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| `id` | `theme_romantic` | Identificador único (inglês). |
| `type` | `Theme` | Tipo da entidade. |
| `name` | `Romântico` | Nome apresentado ao jogador (português). |
| `slug` | `romantic` | Slug técnico em inglês. |
| `description` | *(texto)* | Descrição atemporal, apenas UI (diretriz `0006`). |

## Relação com Song e Album

- **`Song.themeId`** — tema próprio da música (`null` se nenhum).
- **`Album.themeId`** — tema do álbum (`null` se nenhum). Quando definido,
  **prevalece** e vale para todas as músicas do álbum.
- **Tema efetivo** de uma música é **derivado** por
  `resolveEffectiveThemeId(song, album)`: tema do álbum, se houver; senão, o da
  música. Nunca é duplicado no dado da Song (princípio da decisão 0004).

## ToDo — design a explorar posteriormente

1. **Vocabulário de temas.** Semear os temas iniciais (romantic, summer, …)
   conforme necessário.
2. **Popularidade/demanda de tema** (se existir) é estado dinâmico de mercado —
   fica no sistema de tendências, nunca em `Theme` (mesmo princípio da 0005).
3. **Hierarquia/curadoria.** Avaliar se temas precisam de agrupamento ou apenas
   uma lista plana.
