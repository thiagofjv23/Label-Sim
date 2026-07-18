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
| `popularity` | `{ global: 45, brazil: 92 }` | Popularidade **estrutural** (baseline). Ver ToDo. |
| `commercialAppeal` | `{ radio, live, streaming }` | Potencial comercial médio por mídia (histórico). |
| `activeFromYear` | `1965` | Ano de surgimento. |
| `activeToYear` | `null` | Ano de fim, ou `null` se ativo. |

## Observações (do exemplo)

- `countryOfOriginId` referencia a entidade `Country` (Brasil).
- `parentGenreId` é `null` porque a MPB é tratada como gênero principal.
- `subgenreIds` poderá ser preenchido futuramente com gêneros derivados.
- `popularity` representa a popularidade **estrutural** do gênero (mundo e Brasil),
  servindo como modificador para sistemas de mercado.
- `commercialAppeal` representa o potencial comercial médio do gênero em
  diferentes mídias. **Não** é a popularidade em um ano específico, e sim uma
  característica histórica do estilo.
- `activeToYear` é `null` porque o gênero continua ativo.

## ToDo — design a explorar posteriormente

1. **[RECONCILIAR — `decisions/0005`] `popularity` por mercado dentro de `Genre`.**
   A decisão 0005 diz que a popularidade do gênero **por país/período** não fica em
   `Genre` (pertence ao sistema de tendências de mercado). O exemplo traz
   `popularity.brazil`, justificado como popularidade **estrutural/baseline** (não
   varia por ano). Há duas leituras a conciliar:
   - **(A)** `popularity`/`commercialAppeal` são baseline permanente do estilo →
     legítimos como atributo de entidade (princípio 0004), e o sistema de mercado
     apenas *modula* esse baseline ao longo do tempo/lugar.
     Sugestão: renomear para deixar a natureza explícita, ex.: `baselinePopularity`,
     e usar chave por `countryId` em vez de `brazil` literal.
   - **(B)** Qualquer valor por país sai de `Genre` e vai para o sistema de mercado.

   Decisão pendente do usuário. Até lá, o campo fica modelado como no exemplo e
   **não** é consumido por nenhum sistema.

2. **Chave de mercado textual (`brazil`) vs `countryId`.** `popularity.brazil` usa
   uma chave literal; o padrão do projeto é referenciar países por ID
   (`country_brazil`). Migrar chaves para `countryId`.

3. **`Artist.genres` (strings) → `genreIds`.** Pendência aberta (decisão 0005): o
   Artist ainda lista gêneros por nome; migrar para referências quando houver
   gêneros suficientes na base.

4. **`Country.genreAffinity` → chaves por `genreId`.** Mesma direção; e essa
   dimensão (afinidade por mercado) tende ao sistema de tendências de mercado.

5. **Hierarquia de gêneros.** `parentGenreId`/`subgenreIds` habilitam árvore de
   gêneros. Definir regras (um subgênero herda algo do pai? afinidades somam?).
