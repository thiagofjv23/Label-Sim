# 0010 — Charts: esquema, nomenclatura e janela de apuração

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

Necessidade de modelar as paradas (charts) do jogo. Diretriz do usuário: manter
simples, sem variações de nome por país, cobrindo singles (semanal) e álbuns
(mensal), no mundial e por país, e com estrutura fácil de expandir a novos países.

## Decisão

1. **Entidade `Chart` = definição, não ranking.** Guarda escopo, país, categoria,
   tamanho, frequência, fontes (vendas/streaming/rádio) e prestígio. O ranking e
   qualquer histórico de posições são resultado do sistema de charts (decisão 0004),
   nunca da entidade.

2. **Nomenclatura uniforme.** `Top 100 Mundial` / `Top 100 {País}` para singles;
   sufixo `(Álbuns)` para álbuns. O formato não muda entre países — apenas o nome
   do país. Cada país tem o seu chart.

3. **Frequências e janelas de apuração.**
   - `Weekly` (singles): soma vendas de **segunda a domingo** da semana.
   - `Monthly` (álbuns): soma vendas do **dia 1 ao último dia** do mês.
   A janela é **derivada** por `resolveChartPeriod` (`src/systems/chartPeriod.ts`),
   não armazenada na entidade.

4. **Fonte única + geração.** O conjunto padrão de charts é definido em
   `src/simulation/standardCharts.ts` (`buildWorldCharts`, `buildCountryCharts`).
   Os JSON semente em `database/charts` são gerados por `npm run generate:charts`
   (`tools/generate-charts.ts`). Adicionar um país = uma entrada na lista + rodar
   o comando. Um teste garante que os JSON não divergem da factory.

## Consequências

- Novos arquivos: `src/entities/Chart.ts`, `src/systems/chartPeriod.ts`,
  `src/simulation/standardCharts.ts`, `tools/generate-charts.ts`.
- `GameDate.weekday()` adicionado (base do cálculo semanal).
- 8 charts semeados: mundial + Brasil + EUA + Reino Unido (singles + álbuns).
- `validateReferences`: `Chart.countryId → Country`.
- Configuração padrão (simples): 100 posições, apenas vendas
  (`usesStreaming`/`usesRadio` = false). Ajustável por chart.

## ToDo futuro

- Sistema de charts que calcula o ranking por período (usando `resolveChartPeriod`
  e as vendas do sistema de vendas).
- Ativar streaming/rádio conforme a linha do tempo do jogo (era-dependente, como
  os atributos de `Country`).
