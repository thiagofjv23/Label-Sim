# 0013 — Normalização e validação das referências de country

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

Os arquivos de country traziam listas de referência (`activeLabels`, `mainCharts`,
`mainRadioNetworks`) com IDs **fora da convenção** (ex.: `sony_music_brazil`,
`hot100_brazil`) e, em alguns casos, **duplicando** entidades já existentes
(`sony_music_brazil` vs. `label_sony_music`). Por isso essas listas não eram
validadas (Country ToDo #4).

## Decisão

1. **IDs canônicos nas referências de country.** `activeLabels` referencia
   `Label` por ID real (`label_*`); `mainCharts` referencia `Chart` por ID real
   (`chart_*`). Referências que duplicavam entidades existentes passam a apontar
   para elas (sem criar duplicatas).

2. **Validação ativada** para `Country.activeLabels → Label` e
   `Country.mainCharts → Chart`.

3. **`mainRadioNetworks` continua não validado** até a entidade `RadioStation`
   existir. Backfill de rádios fica pendente.

## Consequências

- `database/countries/Country Example - Brazil.json`: `activeLabels` e `mainCharts`
  normalizados para IDs reais.
- `src/simulation/validateReferences.ts`: registro `Country` adicionado
  (`activeLabels`, `mainCharts`).
- Resolve o Country ToDo #4 (convenção de ID em `activeLabels`) para labels e charts.

## ToDo futuro

- Entidade `RadioStation` + backfill de `mainRadioNetworks` (ex.: rádios do Brasil).
- Normalizar `activeLabels`/`mainCharts` dos demais países quando forem revisitados
  (EUA, Reino Unido e Japão já usam IDs reais ou listas vazias).
