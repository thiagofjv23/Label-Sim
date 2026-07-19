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
