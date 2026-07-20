# 0015 — Entidade Venue; templates não são carregados

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

O usuário forneceu o template e as diretrizes completas da entidade `Venue`
(local físico de shows/festivais/premiações). O template foi colocado em
`database/templates/`, mas o `SeedLoader` carrega recursivamente todo o
`database/` — seria preciso definir o papel de `templates/`.

## Decisão

1. **Entidade `Venue`** modelada conforme a spec (ver `docs/03_Entities/Venue.md`):
   contrato em `src/entities/Venue.ts`; comportamento em `src/systems/venue.ts`
   (`isVenueAvailable`, `canHostStageSize`, `venueAllowsEvent`, `validateVenue`).
   Guarda apenas características **permanentes**; agenda/receita/histórico ficam em
   outros sistemas (`Concert`, `Tour`, ...).

2. **Sem campo `owner`.** Conforme a spec, a entidade não tem `owner` genérico.
   Um `labelOwnerId?` só será adicionado quando existir o sistema de propriedade
   de venues.

3. **`templates/` não é carregado.** O `SeedLoader` passa a **ignorar** o
   diretório `database/templates/`. Templates são scaffolding para criar
   entidades, não dados de jogo — nunca devem virar entidades vivas.

4. **Instância real vs. template.** O Maracanã vira entidade real em
   `database/venues/Venue Example - Maracanã.json`; o genérico fica em
   `database/templates/venue.template.json`.

## Consequências

- `src/entities/Venue.ts`, `src/systems/venue.ts`, `tests/venue.test.ts`.
- `src/simulation/SeedLoader.ts`: `IGNORED_DIRS = { "templates" }`.
- `validateReferences`: `Venue.countryId → Country`, `Venue.genreAffinityIds → Genre`.
- `database/venues/` (novo diretório) com o Maracanã.

## ToDo futuro

- Entidades de evento (`Concert`, `Tour`, `Festival`, `Award`, `LiveAlbum`).
- `City` como entidade; propriedade de venues (`labelOwnerId?`).
- Sistema de turnês usando os venues por país real (decisão 0014) e os dados de
  mercado do país (agregado, quando for o caso).
