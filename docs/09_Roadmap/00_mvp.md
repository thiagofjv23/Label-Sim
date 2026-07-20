# Roadmap — MVP

## Decisoes de stack (fase inicial)

- **Linguagem/engine:** TypeScript + Node.
- **Dados (`database/`):** arquivos JSON (versionaveis, faceis de editar/semear).
- **Primeira fatia:** motor de simulacao e tempo.

## Fase 0 — Motor de tempo (concluida)

- [x] Estrutura de pastas do projeto.
- [x] `Rng` deterministico e `IdFactory` (IDs unicos por tipo).
- [x] `GameDate` (calendario em UTC) e `Clock` (ticks -> data).
- [x] `Entity`, `World` (estado), `System`/`TickContext`, `Engine` (loop).
- [x] Demo executavel (`src/main.ts`) e testes (`vitest`).

## Fase 1 — Persistencia e entidades

- [x] Definir entidades de dominio (Artist, Song, Label) em `src/entities` e
      seus JSON de exemplo em `database/`.
- [x] Carregar dados semente do `database/` para o `World` (`SeedLoader`).
- [x] Validacao de referencias entre entidades (`validateReferences`): checa
      existencia e tipo do alvo de `labelId`, `artistId`, `genreIds`, etc.
- [ ] Camada de save/load (`src/save`): serializar World + Clock + Rng + IdFactory.
- [x] Entidade `Country` (mercado) + exemplo `country_brazil` em
      `database/countries` (resolve a referencia `Label.countryId`).
- [x] Entidade `Album` + exemplo `Detalhes` em `database/albums` (validacao de
      referencias estendida a Album).
- [x] Decisoes canonicas registradas em `docs/decisions` (0001-0007).
      Correcoes de dados/contrato aplicadas.
- [x] Entidade `Genre` + exemplo `genre_mpb` (validacao estendida; resolve
      `genre_mpb` em Song/Album).
- [x] Diretriz `description` (decisao 0006): campo opcional na base `Entity`,
      apenas UI, atemporal. Exemplos enriquecidos (Artist, Country, Label, Genre).
- [x] `Genre.popularity`/`commercialAppeal` removidos (decisao 0005, caminho B):
      estados dinamicos de mercado nunca ficam em `Genre`.
- [x] Entidade `Theme` (decisao 0007): `romantic` remodelado de genero para tema
      (`theme_romantic`). Song/Album ganham `themeId`; `resolveEffectiveThemeId`
      implementa a heranca album -> musica.
- [x] Exemplo de `Artist` Erasmo Carlos adicionado; `SeedLoader` passa a aceitar
      arquivo com array de entidades (decisao 0008). Resolve `artist_erasmo_carlos`.
- [x] Entidade `Band` + exemplo `Titãs` e todos os seus elementos: label
      `label_abril_music`, generos `genre_pop_rock`/`genre_new_wave`, 8 artistas
      integrantes e o album `album_titas_como_estao_voces_2003` (decisao 0009:
      autoria de album por artista OU banda).
- [x] Entidade `Chart` (decisao 0010): esquema, nomenclatura uniforme e janela de
      apuracao (`resolveChartPeriod`: semanal seg-dom, mensal dia 1-ultimo). Factory
      `standardCharts` + `npm run generate:charts`. Estrutura de expansao exercitada:
      paises Brasil, EUA, Reino Unido e Japao geram seus charts pela lista em
      `tools/generate-charts.ts` (10 charts semeados).
- [x] Fluxo de criacao a partir de arquivos de country (decisao 0011): labels de
      `activeLabels` + generos de `genreAffinity`, calibrados a 2005, com registro
      em `docs/03_Entities/Registro de Criacoes.md`. Primeiro lote: Japao (3 labels,
      12 generos). `Genre.countryOfOriginId` agora anulavel.
- [x] `brandTag` em Label (decisao 0012): base para subsidiarias (Sony/Universal
      correlacionadas entre Brasil e Japao).
- [ ] Entidades ainda referenciadas sem arquivo (reportadas pela validacao):
      `Song` (faixas do album `Detalhes`), `Label` (`label_cbs_brasil`).
- [x] Backfill de generos/labels de Brasil/EUA/Reino Unido (decisao 0013): 7
      generos (Samba, Pagode, Sertanejo, Axe, Forro, Gospel, Country) + 3 labels
      (EMI, BMG, Som Livre). Referencias do Brasil (`activeLabels`/`mainCharts`)
      normalizadas e validadas.
- [x] País agregador + nacionalidade (decisão 0014): `country_western_europe`
      agrega países por ISO (`includedCountries`); `Artist.nationality` (ISO);
      `resolveMarketCountry` (FRA→WEU, BRA→Brasil). Charts do WEU gerados; 3
      labels-mãe globais + 8 gêneros criados.
- [ ] Entidade `RadioStation` + backfill de `mainRadioNetworks` (radios).
- [x] `Band` com nacionalidade (decisão 0014).
- [x] Entidade `Venue` (decisão 0015): contrato + helpers (`isVenueAvailable`,
      tamanho de palco, `validateVenue`); Maracanã em `database/venues`; loader
      ignora `templates/`. Validação `countryId`/`genreAffinityIds`.
- [x] Entidade `RecordingStudio` (decisão 0016): contrato + helpers
      (`isStudioActive`, `studioOffersService`, `validateRecordingStudio`); Mosh
      Studios em `database/studios`. Validação `location.countryId`/`ownerLabelId`.
- [ ] Sistema de turnês: `Concert`, `Tour`, `Festival`, `LiveAlbum`, `City`.
- [ ] `RecordingSession` (sessões de gravação; resultados dinâmicos).

## Fase 2 (previa) — Sistema de charts

- [ ] Sistema que calcula o ranking por periodo (usa `resolveChartPeriod` + vendas).
- [x] Migrado `Artist.genres` (strings) para `genreIds` (referencias a `Genre`).
- [x] Semeados `genre_rock`/`genre_pop` (origem EUA), paises `country_usa` e
      `country_uk`, e a label `label_universal_music` (Universal Music, Brasil).
      Metricas 0-100 desses exemplos sao estimativas ajustaveis.
- [ ] Migrar `Country.genreAffinity` para o sistema de mercado (chaves por `genreId`).

## Pendencias registradas (sistemas futuros)

- [ ] **Sistema de contratos e vinculos historicos** (decisao 0003): gravadora,
      artista, inicio, termino, tipo de contrato, situacao. Ate la,
      `currentLabelId` cobre so o vinculo atual.
- [ ] **Sistema de tendencias de mercado** (decisao 0005): popularidade de genero
      por pais e periodo historico; le `Genre` e `Country` por referencia.

## Fase 2 — Core loop minimo

Seguindo o loop do README: Descobrir -> Contratar -> Produzir -> Marketing ->
Lancar -> Charts -> Receita -> Expandir.

- [ ] Sistema de descoberta de artistas.
- [ ] Contrato e producao de musica.
- [ ] Lancamento e chart simples.
- [ ] Receita e expansao da gravadora.

## Fase 3 — UI observadora

- [x] Estrutura da UI (React + Vite) em `src/ui`: le a `database/` via
      `import.meta.glob` e renderiza; nunca decide (alinhada ao guia de UI do
      README). Doc em `docs/08_UI/00_estrutura_ui.md`. Comandos: `npm run ui`,
      `ui:build`, `ui:preview` (saida em `dist-ui/`, separada do motor em `dist/`).
      `templates/` excluido da carga da UI (alinhado a decisao 0015).
- [ ] Ligar a UI aos resultados dos sistemas conforme forem criados (charts,
      vendas, receita), mantendo pendentes o que a simulacao ainda nao produziu.
