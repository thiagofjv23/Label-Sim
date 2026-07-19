import type { Chart } from "../entities/Chart.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Fabrica do conjunto padrao de charts.
 *
 * Define, em um unico lugar, o "kit" de charts do jogo — para o mundo e para
 * cada pais. Adicionar os charts de um novo pais e trivial: basta chamar
 * {@link buildCountryCharts} com o pais. Os JSON semente em `database/charts`
 * espelham exatamente esta definicao (garantido por teste).
 *
 * Padrao (simples): cada escopo tem um chart de singles SEMANAL e um de albuns
 * MENSAL, com 100 posicoes e baseados em vendas. Ver `docs/decisions/0010-charts.md`.
 */

/** Quantidade de posicoes padrao dos charts. */
const DEFAULT_CHART_SIZE = 100;
/** Prestigio dos charts mundiais. */
const WORLD_CHART_PRESTIGE = 100;

/** Gera os charts mundiais (singles semanal + albuns mensal). */
export function buildWorldCharts(): Chart[] {
  return [
    makeChart({
      id: "chart_world_singles",
      name: "Top 100 Mundial",
      description: "Chart mundial de singles.",
      scope: "World",
      countryId: null,
      category: "Singles",
      updateFrequency: "Weekly",
      prestige: WORLD_CHART_PRESTIGE,
    }),
    makeChart({
      id: "chart_world_albums",
      name: "Top 100 Mundial (Álbuns)",
      description: "Chart mundial de álbuns.",
      scope: "World",
      countryId: null,
      category: "Albums",
      updateFrequency: "Monthly",
      prestige: WORLD_CHART_PRESTIGE,
    }),
  ];
}

/**
 * Gera os charts de um pais (singles semanal + albuns mensal).
 * @param countryId ID do pais, ex.: `country_brazil`.
 * @param displayName Nome do pais no titulo do chart, ex.: `Brasil`.
 * @param prestige Prestigio dos charts do pais [0, 100].
 */
export function buildCountryCharts(
  countryId: EntityId,
  displayName: string,
  prestige: number,
): Chart[] {
  const slug = countryId.replace(/^country_/, "");
  return [
    makeChart({
      id: `chart_${slug}_singles`,
      name: `Top 100 ${displayName}`,
      description: "Chart nacional de singles.",
      scope: "Local",
      countryId,
      category: "Singles",
      updateFrequency: "Weekly",
      prestige,
    }),
    makeChart({
      id: `chart_${slug}_albums`,
      name: `Top 100 ${displayName} (Álbuns)`,
      description: "Chart nacional de álbuns.",
      scope: "Local",
      countryId,
      category: "Albums",
      updateFrequency: "Monthly",
      prestige,
    }),
  ];
}

/** Campos que variam entre um chart e outro; o restante e padrao. */
interface ChartSeed {
  id: string;
  name: string;
  description: string;
  scope: Chart["scope"];
  countryId: EntityId | null;
  category: Chart["category"];
  updateFrequency: Chart["updateFrequency"];
  prestige: number;
}

/** Monta um `Chart` completo aplicando os padroes (tamanho, fontes). */
function makeChart(seed: ChartSeed): Chart {
  return {
    id: seed.id,
    type: "Chart",
    name: seed.name,
    description: seed.description,
    scope: seed.scope,
    countryId: seed.countryId,
    category: seed.category,
    size: DEFAULT_CHART_SIZE,
    updateFrequency: seed.updateFrequency,
    usesSales: true,
    usesStreaming: false,
    usesRadio: false,
    prestige: seed.prestige,
  };
}
