# Entidade: Genre (Gênero musical)

Arquivo de dados: `database/genres/` — exemplo: `Exemplo Genre - MPB.json`.
Contrato TypeScript: `src/entities/Genre.ts`.
Decisão canônica: `docs/decisions/0005-genre-como-entidade.md`.

`Genre` é a fonte única de gêneros. Artist, Song e Album referenciam por
`genreIds`; nomes não são duplicados. ID técnico em inglês (`genre_mpb`), nome de
apresentação em português em `Genre.name`.

## Campos

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| `id` | `genre_mpb` | Identificador único (inglês). |
| `type` | `Genre` | Tipo da entidade. |
| `name` | `MPB` | Nome apresentado ao jogador (português). |
| `slug` | `mpb` | Slug técnico em minúsculas. |
| `countryOfOriginId` | `country_brazil` | País de origem (`Country`). |
| `parentGenreId` | `null` | Gênero-pai (`Genre`) ou `null` se principal. |
| `subgenreIds` | `[]` | Subgêneros derivados (`Genre`). |
| `description` | *(texto)* | Descrição atemporal, apenas UI (diretriz `0006`). |
| `typicalInstruments` | `[Violão, Piano, ...]` | Instrumentos típicos (sabor/UI). |
| `activeFromYear` | `1965` | Ano de surgimento. |
| `activeToYear` | `null` | Ano de fim, ou `null` se ativo. |

> `Genre` guarda apenas dados estruturais e históricos estáveis. Popularidade,
> demanda e apelo comercial são **estados dinâmicos do mercado** e ficam no futuro
> sistema de mercado/tendências (decisão 0005) — nunca em `Genre`.

## Observações (do exemplo)

- `countryOfOriginId` referencia a entidade `Country` (Brasil).
- `parentGenreId` é `null` porque a MPB é tratada como gênero principal.
- `subgenreIds` poderá ser preenchido futuramente com gêneros derivados.
- `activeToYear` é `null` porque o gênero continua ativo.

## ToDo — design a explorar posteriormente

1. **[RESOLVIDO — `decisions/0005`, caminho B]** `popularity` e `commercialAppeal`
   removidos de `Genre`. São estados dinâmicos do mercado e pertencem ao futuro
   sistema de mercado/tendências, que lerá `Genre` e `Country` por referência.

2. **`Artist.genres` (strings) → `genreIds`.** O Artist ainda lista gêneros por
   nome; migrar para referências quando houver gêneros suficientes na base.

3. **`Country.genreAffinity` → sistema de mercado.** Afinidade de gênero por
   mercado é estado dinâmico — mesma direção da decisão 0005; migrar para o sistema
   de tendências (chaves por `genreId`).

4. **Hierarquia de gêneros.** `parentGenreId`/`subgenreIds` habilitam árvore de
   gêneros. Definir regras (um subgênero herda algo do pai?).
