# Registro de Criações de Entidades

Log de controle das entidades criadas pela IA a partir de arquivos enviados pelo
usuário (ou geradas por ferramentas). Objetivo: **controle total** de o que foi
criado, com a origem, os dados-chave e a justificativa das decisões.

Convenção de calibragem: dados de mercado/empresa são coerentes com **2005**
(ano de início da simulação). Popularidade/afinidade dinâmica NÃO mora nas
entidades (decisões 0005/0010) — só dados estruturais/históricos.

---

## 2026-07-19 — Lote a partir do `country_japan`

Gatilho: usuário subiu `database/countries/Country Example - Japan.json`.
Diretrizes aplicadas: 0002 (id de gênero em inglês, nome PT), 0005 (Genre sem
popularidade), 0006 (`description` atemporal), 0011 (criação a partir de country),
0012 (brandTag).

### Correções

- **Descrição do Japão** tornada atemporal (removido "segunda maior… em 2005",
  que varia com a linha do tempo — diretriz 0006).

### Labels criadas (de `activeLabels`, dados coerentes com 2005)

| id | name | país | fundação | brandTag | notas |
|----|------|------|----------|----------|-------|
| `label_sony_music_entertainment_japan` | Sony Music Entertainment Japan | Japão | 1968 | `sony` | Major; forte no mercado doméstico. |
| `label_avex_group` | Avex | Japão | 1988 | — | Independente de grande porte; pop/dance/ídolos. |
| `label_universal_music_japan` | Universal Music Japan | Japão | 1998 | `universal` | Major; participação menor no Japão (mercado doméstico forte). |

`marketShare`/`ratings` estimados para o mercado japonês de ~2005 (domésticas
dominam; majors internacionais com participação menor). Valores ajustáveis.

### brandTag adicionada a labels já existentes (decisão 0012)

- `sony` → `label_sony_music` (Brasil), `label_sony_music_entertainment_japan` (Japão).
- `universal` → `label_universal_music` (Brasil), `label_universal_music_japan` (Japão).

### Gêneros criados (de `genreAffinity`, ativos em 2005)

Arquivo: `database/genres/Generos - Lote a partir do Country Japão.json`.

| id | name | origem | ativo desde |
|----|------|--------|-------------|
| `genre_j_pop` | J-Pop | Japão | 1990 |
| `genre_idol_pop` | Idol Pop | Japão | 1971 |
| `genre_j_rock` | J-Rock | Japão | 1970 |
| `genre_enka` | Enka | Japão | 1950 |
| `genre_visual_kei` | Visual Kei | Japão | 1988 |
| `genre_rnb` | R&B | EUA | 1948 |
| `genre_hip_hop` | Hip Hop | EUA | 1973 |
| `genre_metal` | Metal | Reino Unido | 1970 |
| `genre_jazz` | Jazz | EUA | 1917 |
| `genre_dance` | Dance | EUA | 1974 |
| `genre_classical` | Música Clássica | — (difusa) | 1750 |
| `genre_electronic` | Eletrônica | — (difusa) | 1970 |

- Origens atribuídas a países existentes na base quando claras; `null` quando a
  origem é difusa/anterior ao conjunto de países (Clássica, Eletrônica) — ver
  decisão 0011 (`countryOfOriginId` anulável).
- `Pop`, `Rock`, `MPB` já existiam; não recriados.
- **Pendência de mapeamento:** o `genreAffinity` do país ainda usa **nomes**;
  a ligação nome→`genreId` acontecerá na migração para o sistema de mercado
  (decisão 0005).

---

## 2026-07-19 — Backfill Brasil / EUA / Reino Unido

Gatilho: usuário autorizou o backfill retroativo dos gêneros/labels citados por
nome nos países já existentes. Diretrizes: 0002, 0005, 0011, 0012, 0013.

### Gêneros criados (ativos em 2005)

Arquivo: `database/genres/Generos - Backfill Brasil, EUA e Reino Unido.json`.

| id | name | origem | ativo desde | citado por |
|----|------|--------|-------------|-----------|
| `genre_samba` | Samba | Brasil | 1917 | Brasil |
| `genre_pagode` | Pagode | Brasil | 1980 | Brasil |
| `genre_sertanejo` | Sertanejo | Brasil | 1920 | Brasil |
| `genre_axe` | Axé | Brasil | 1985 | Brasil |
| `genre_forro` | Forró | Brasil | 1946 | Brasil |
| `genre_gospel` | Gospel | EUA | 1920 | Brasil, EUA, Reino Unido |
| `genre_country` | Country | EUA | 1923 | EUA |

Os demais nomes de afinidade (Rock, Pop, Hip Hop, Electronic, Metal, R&B, Jazz,
MPB) já existiam. Após este lote, **todo** nome de `genreAffinity` de Brasil, EUA
e Reino Unido possui entidade `Genre`.

### Labels criadas (Brasil, coerentes com 2005)

| id | name | fundação | brandTag | notas |
|----|------|----------|----------|-------|
| `label_emi_brazil` | EMI | 1953 | `emi` | Major; ano de fundação aproximado. |
| `label_bmg_brazil` | BMG | 1987 | `bmg` | Major. **Ressalva 2005:** a BMG fundiu-se com a Sony (Sony BMG, 2004-2008); mantida separada conforme o arquivo do país — revisar se preferir modelar Sony BMG. |
| `label_som_livre` | Som Livre | 1969 | — | Nacional (grupo de mídia); forte em trilhas de novela. Sem `brandTag` (marca nacional isolada). |

`brandTag` `emi`/`bmg` aplicadas proativamente por serem marcas multinacionais
(decisão 0012, nota).

### Normalização de referências do Brasil (decisão 0013)

- `activeLabels` reescrito de ids fora do padrão para os ids reais:
  `sony_music_brazil`→`label_sony_music`, `universal_music_brazil`→`label_universal_music`
  (eram **duplicatas** das labels já existentes), `emi_brazil`→`label_emi_brazil`,
  `bmg_brazil`→`label_bmg_brazil`, `som_livre`→`label_som_livre`.
- `mainCharts` reescrito: `hot100_brazil`/`top_albums_brazil` →
  `chart_brazil_singles`/`chart_brazil_albums`.
- `Country.activeLabels`→`Label` e `Country.mainCharts`→`Chart` agora são validados.
- `mainRadioNetworks` permanece **não** validado (entidade `RadioStation` não
  modelada). Backfill de rádios pendente.

---

## 2026-07-19 — Lote a partir do `country_western_europe` (país agregador)

Gatilho: usuário subiu `database/countries/Western Europe.json` — um **país
agregador** (decisão 0014). Diretrizes: 0002, 0005, 0006, 0011, 0012, 0013, 0014.

### Modelagem (decisão 0014)

- `Country.includedCountries` (ISO dos países agregados) e `Country.capital`
  anulável; `Artist.nationality` (ISO); `resolveMarketCountry` (país-real → mercado).
- Charts do WEU gerados (`chart_western_europe_singles/albums`); `mainCharts` ligado.
- Artistas existentes (Roberto, Erasmo, integrantes Titãs) marcados `nationality: BRA`.

### Labels-mãe globais criadas (de `activeLabels`, coerentes com 2005)

| id | name | fundação | brandTag | notas |
|----|------|----------|----------|-------|
| `label_universal_music_group` | Universal Music Group | 1998 | `universal` | Matriz global; maior grupo. |
| `label_sony_bmg_music_entertainment` | Sony BMG Music Entertainment | 2004 | `sony` | União Sony+BMG (existiu 2004-2008); resolve a ressalva da BMG em 2005. |
| `label_emi_group` | EMI Group | 1931 | `emi` | Matriz global de origem britânica. |

`countryId` = `country_western_europe` (mercado agregado). As `brandTag`
conectam essas matrizes às subsidiárias por país (Sony/Universal/EMI) — base do
sistema de subsidiárias (decisão 0012).

### Gêneros criados (de `genreAffinity`, ativos em 2005)

Arquivo: `database/genres/Generos - Lote a partir do Country Western Europe.json`.

| id | name | origem | ativo desde |
|----|------|--------|-------------|
| `genre_alternative_rock` | Rock Alternativo | EUA | 1985 |
| `genre_indie_rock` | Indie Rock | Reino Unido | 1980 |
| `genre_folk` | Folk | — (difusa) | 1940 |
| `genre_eurodance` | Eurodance | Europa Ocidental (agregador) | 1989 |
| `genre_house` | House | EUA | 1983 |
| `genre_techno` | Techno | EUA | 1985 |
| `genre_latin_pop` | Latin Pop | — (América Latina não modelada) | 1985 |
| `genre_reggae` | Reggae | — (Jamaica não modelada) | 1968 |

Demais nomes de afinidade já existiam. `Eurodance` usa o próprio agregador como
origem — primeiro uso de `country_western_europe` como `countryOfOriginId`.

### Nota — nacionalidade e France

`FRA` (e demais ISO de `includedCountries`) **não** viram entidade. Pauline Croze,
por exemplo, teria `nationality: "FRA"` (UI: francesa) e, via `resolveMarketCountry`,
apareceria nos charts sob `country_western_europe`.

---

## 2026-07-19 — Artista `artist_pauline_croze` (exemplo francês)

Gatilho: usuário pediu Pauline Croze como exemplo concreto de nacionalidade
agregada. Primeiro artista **não brasileiro** e primeira artista **feminina** da
base; primeiro caso real de `nationality` que resolve para um agregador.

- `nationality: "FRA"` → UI mostra França; charts usam `country_western_europe`
  (testado ponta a ponta em `tests/resolveMarketCountry.test.ts`).
- **Estado calibrado a janeiro/2005** (início da simulação; estreia solo em
  fev/2005): `careerStats.albumsReleased: 0`, popularidade baixa (28) mas não
  nula, `fanbase.growth: "Growing"`, `careerStart: 2001` (participações anteriores
  em projetos/bandas — "não totalmente desconhecida").
- `genreIds`: `genre_folk`, `genre_pop`. `currentLabelId: null` (gravadora não
  modelada).
- Princípio 0004/0006 aplicado: o caráter "estreante" vive nas **estatísticas**;
  a `description` é atemporal (estilo, não fase de carreira).
- **Dados biográficos** (data e local de nascimento) são **placeholders a
  verificar**, como nos demais artistas.

---

## 2026-07-19 — `Band` estendida com nacionalidade (decisão 0014)

- `Band.countryId` (referência a `Country`) → `Band.nationality` (ISO), mesmo
  modelo do `Artist`. Bandas de países agregados (ex.: `DEU`) agora são
  representáveis; país de mercado derivado por `resolveMarketCountry`.
- `Titãs` → `nationality: "BRA"`. `validateReferences` deixou de checar
  `Band.countryId` (nacionalidade não é referência).

---

## 2026-07-19 — Entidade `Venue` + Maracanã (decisão 0015)

Gatilho: usuário subiu o template e as diretrizes de `Venue`.

- Contrato `src/entities/Venue.ts` + helpers `src/systems/venue.ts`
  (`isVenueAvailable`, `canHostStageSize`, `venueAllowsEvent`, `validateVenue`).
- **`venue_maracana`** criado como entidade real em
  `database/venues/Venue Example - Maracanã.json` (dados do template do usuário).
- Template genérico movido para `database/templates/venue.template.json`
  (scaffolding); `SeedLoader` passa a **ignorar** `database/templates/`.
- Validação: `Venue.countryId → Country`, `Venue.genreAffinityIds → Genre`.
- Diretrizes do usuário preservadas em `docs/03_Entities/Venue.md` (renomeadas de
  "Diretrizes para Venue") + seção de modelagem aplicada.
