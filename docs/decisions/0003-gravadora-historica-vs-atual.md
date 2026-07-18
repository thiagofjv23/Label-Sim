# 0003 — Gravadora histórica (Album) vs. atual (Artist)

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

O álbum *Detalhes* (1971) referenciava `label_cbs_brasil`, enquanto o artista
Roberto Carlos referenciava `label_sony_music`. Isso parecia uma inconsistência,
mas na verdade são **relações diferentes** (a CBS foi posteriormente adquirida
pela Sony).

## Decisão

Não há inconsistência. Os campos representam vínculos distintos:

- **`Album.labelId`** — a gravadora responsável por **aquele lançamento
  específico**, no momento histórico do lançamento. Não deve ser atualizada caso
  o catálogo seja depois comprado ou transferido. *Detalhes* permanece associado
  a `label_cbs_brasil`.

- **`Artist.currentLabelId`** — a gravadora **atual** do artista na data presente
  da simulação. O campo foi **renomeado** de `labelId` para `currentLabelId` para
  eliminar a ambiguidade.

Enquanto não existir um sistema de contratos, `currentLabelId` é apenas uma
referência simples à gravadora atual do artista.

## Consequências

- `src/entities/Artist.ts`: `labelId` → `currentLabelId`.
- `database/artists/…Roberto Carlos….json`: campo renomeado.
- `src/simulation/validateReferences.ts`: registro atualizado.

## ToDo futuro — Sistema de contratos e vínculos históricos

Registrar como pendência a criação de um **sistema separado de contratos**,
capaz de armazenar o histórico completo de vínculos:

- gravadora;
- artista;
- data de início;
- data de término;
- tipo de contrato;
- situação atual.

Até lá, `currentLabelId` cobre apenas o vínculo atual, sem histórico.
