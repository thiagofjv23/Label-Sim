# Entidade: Chart (Parada)

Arquivos de dados: `database/charts/` — ex.: `chart_world_singles.json`,
`chart_brazil_singles.json`.
Contrato TypeScript: `src/entities/Chart.ts`.
Decisão canônica: `docs/decisions/0010-charts.md`.

A `Chart` representa **apenas a definição** de uma parada. O ranking em si (as
posições calculadas a cada período) **não** é armazenado — é resultado do sistema
de charts (princípio da decisão 0004).

## Campos

| Campo | Descrição |
|-------|-----------|
| `id` | Identificador único, ex.: `chart_brazil_singles`. |
| `type` | Sempre `Chart`. |
| `name` | Nome exibido ao jogador, ex.: `Top 100 Brasil`. |
| `description` | Apenas interface (diretriz 0006). |
| `scope` | `World` (mundial) ou `Local` (de um país). |
| `countryId` | País do chart (`Country`). `null` no mundial. |
| `category` | `Singles` ou `Albums`. |
| `size` | Quantidade de posições (100, 50, 200…). |
| `updateFrequency` | `Weekly` ou `Monthly`. |
| `usesSales` | Considera vendas (físicas/digitais). |
| `usesStreaming` | Considera streaming. |
| `usesRadio` | Considera execução em rádio. |
| `prestige` | Importância do chart na carreira [0, 100]. |

## Nomenclatura (simples, uniforme)

- Mundial de singles: **Top 100 Mundial** (semanal).
- Mundial de álbuns: **Top 100 Mundial (Álbuns)** (mensal).
- País de singles: **Top 100 {País}** (semanal), ex.: `Top 100 Brasil`.
- País de álbuns: **Top 100 {País} (Álbuns)** (mensal).

Cada país tem o seu chart; o nome não muda de formato entre países — apenas o
nome do país no título.

## Janela de apuração (período)

A frequência define a janela de vendas que o sistema de charts soma:

- **`Weekly`** → de **segunda a domingo** da semana.
- **`Monthly`** → do **dia 1 ao último dia** do mês.

Essa janela é **derivada** (nunca armazenada) por
`resolveChartPeriod(frequency, date)` em `src/systems/chartPeriod.ts`.

## Fácil expansão para novos países

O conjunto padrão de charts é definido em um único lugar:
`src/simulation/standardCharts.ts` (`buildWorldCharts`, `buildCountryCharts`). Os
JSON semente são gerados a partir dele:

```
npm run generate:charts
```

Para adicionar os charts de um país novo, inclua uma entrada em
`tools/generate-charts.ts` (`countryId`, nome no título, prestígio) e rode o
comando. Um teste (`tests/standardCharts.test.ts`) garante que os JSON semente
não divergem da factory.

## Não armazenar

- O ranking (posições) em si — é resultado dinâmico do sistema de charts.
- Qualquer histórico de posições/semanas — pertence aos sistemas.
