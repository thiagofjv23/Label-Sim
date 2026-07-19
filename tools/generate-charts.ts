import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Chart } from "../src/entities/Chart.js";
import { buildWorldCharts, buildCountryCharts } from "../src/simulation/standardCharts.js";

/**
 * Gera os JSON semente dos charts em `database/charts` a partir da factory
 * (`src/simulation/standardCharts`). Para expandir a outros paises, adicione uma
 * entrada em COUNTRIES e rode novamente: `npm run generate:charts`.
 */

/** Paises que recebem o kit padrao de charts (id, nome no titulo, prestigio). */
const COUNTRIES: Array<{ countryId: string; name: string; prestige: number }> = [
  { countryId: "country_brazil", name: "Brasil", prestige: 85 },
  { countryId: "country_usa", name: "Estados Unidos", prestige: 95 },
  { countryId: "country_uk", name: "Reino Unido", prestige: 80 },
];

const chartsDir = fileURLToPath(new URL("../database/charts", import.meta.url));

function writeChart(chart: Chart): void {
  const path = join(chartsDir, `${chart.id}.json`);
  writeFileSync(path, `${JSON.stringify(chart, null, 2)}\n`);
}

const charts: Chart[] = [
  ...buildWorldCharts(),
  ...COUNTRIES.flatMap((c) => buildCountryCharts(c.countryId, c.name, c.prestige)),
];

charts.forEach(writeChart);
console.log(`Gerados ${charts.length} charts em ${chartsDir}`);
