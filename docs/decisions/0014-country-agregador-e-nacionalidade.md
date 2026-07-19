# 0014 — País agregador e nacionalidade de artista

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

Simular cada país da Europa Ocidental individualmente adiciona complexidade sem
ganho proporcional. O usuário criou `country_western_europe` como um **país
agregador**: um `Country` que se comporta como um país normal (charts, mercado,
exibição), mas na verdade representa vários países reais que **não** são
simulados um a um.

Ao mesmo tempo, a identidade nacional dos artistas deve ser preservada: Pauline
Croze continua **francesa** na UI, ainda que, para charts, a França apareça sob
Western Europe.

## Decisão

### 1. País agregador

- `Country.includedCountries?: string[]` — lista de **códigos ISO 3166-1 alpha-3**
  dos países reais agregados (ex.: `FRA`, `DEU`, `ITA`). Vazio/ausente em países
  comuns.
- Um país é **agregador** quando `includedCountries` é não-vazio
  (`isAggregatorCountry`). Os países listados **não** existem como entidades
  próprias — são apenas ISO.
- `Country.capital` passa a aceitar `null` (o agregador não tem capital única).
- O agregador tem estatísticas de mercado, `genreAffinity`, `activeLabels` e
  **charts próprios**, como qualquer país. É ele quem é usado em charts, mercado
  e exibição.

### 2. Nacionalidade do artista

- `Artist.nationality: string` — **código ISO** do país real do artista
  (ex.: `BRA`, `FRA`). É o que a UI mostra. **Não** é referência à entidade
  `Country` (o país real pode não ser simulado), por isso não é validado como tal.

### 3. Resolução país-real → país-de-mercado

`resolveMarketCountry(nationalityIso, countries)`
(`src/simulation/resolveMarketCountry.ts`):

- se algum país simulado tem esse `isoCode` → ele mesmo (`BRA` → Brasil);
- senão, o agregador cujo `includedCountries` inclui o ISO
  (`FRA` → `country_western_europe`).

Charts e mercado usam o país resolvido; a UI de identidade usa a `nationality`.

### 4. Turnês e venues (design futuro)

Para turnês, **cada país real** terá suas próprias venues, mas elas leem os dados
do país de mercado (o agregador) para popularidade/prestígio de artistas e bandas.
Ou seja: granularidade fina de venues por país; dados de mercado agregados. A
entidade `Venue` e o sistema de turnês serão modelados posteriormente.

## Consequências

- `src/entities/Country.ts`: `capital` anulável; `includedCountries?`.
- `src/entities/Artist.ts`: `nationality` (ISO). Artistas existentes marcados `BRA`.
- `src/simulation/resolveMarketCountry.ts` + testes (`FRA`→WEU, `BRA`→Brasil).
- Charts do WEU gerados (`chart_western_europe_*`); `mainCharts` do WEU ligado.
- Labels-mãe globais criadas (ver registro): Universal Music Group, Sony BMG,
  EMI Group — matrizes que compartilham `brandTag` com as subsidiárias por país.

## Atualização — `Band` estendida

`Band.countryId` (referência a `Country`) foi substituído por
`Band.nationality` (ISO), mesmo modelo do `Artist`. Bandas de países agregados
(ex.: `DEU`) passam a ser representáveis; o país de mercado é derivado por
`resolveMarketCountry`. `validateReferences` não valida `nationality` (não é
referência a entidade). Titãs → `nationality: "BRA"`.

## ToDo futuro

- Entidade `Venue` + sistema de turnês (venues por país real, mercado agregado).
- Possível entidade leve de "país real" (ISO → nome/gentílico) para a UI, caso a
  exibição precise de mais que o código ISO.
