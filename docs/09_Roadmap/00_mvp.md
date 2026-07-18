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
- [x] Decisoes canonicas registradas em `docs/decisions` (0001 id de album,
      0002 id de genero, 0003 gravadora historica/atual, 0004 entidade vs sistema,
      0005 Genre como entidade). Correcoes de dados/contrato aplicadas.
- [ ] Entidades ainda referenciadas sem arquivo (reportadas pela validacao):
      `Genre` (`genre_romantic`, `genre_mpb`), `Song` (faixas do album `Detalhes`),
      `Label` (`label_cbs_brasil`), `Artist` (`artist_erasmo_carlos`).
- [ ] Proxima entidade a modelar: **Genre** (aguardando exemplo do usuario).
- [ ] Migrar `Artist.genres` (strings) para `genreIds` quando `Genre` existir.
- [ ] Migrar `Country.genreAffinity` para chaves por `genreId`.

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

- [ ] Camada de UI que apenas le e renderiza o estado (nunca decide).
