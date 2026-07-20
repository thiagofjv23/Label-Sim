import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Definicao de um chart (parada musical).
 *
 * Contrato de dados que espelha os JSON de `database/charts`. A entidade `Chart`
 * representa APENAS a definicao do chart (escopo, categoria, tamanho, frequencia,
 * fontes consideradas, prestigio). O ranking em si — as posicoes calculadas a
 * cada periodo — NUNCA e armazenado aqui; e resultado do sistema de charts
 * (principio da decisao 0004). Ver `docs/decisions/0010-charts.md`.
 */
export interface Chart extends Entity {
  readonly type: "Chart";

  /** Nome exibido ao jogador, ex.: `Top 100 Brasil`. */
  name: string;

  /** `World` (mundial) ou `Local` (de um pais). */
  scope: ChartScope;
  /** Pais do chart (referencia a `Country`), ou `null` no chart mundial. */
  countryId: EntityId | null;

  /** `Singles` ou `Albums`. */
  category: ChartCategory;

  /** Quantidade de posicoes (ex.: 100, 50, 200). */
  size: number;

  /**
   * Frequencia de atualizacao. Define a janela de apuracao de vendas:
   * `Weekly` = segunda a domingo; `Monthly` = dia 1 ao ultimo dia do mes.
   * A janela e derivada por `resolveChartPeriod`, nao armazenada.
   */
  updateFrequency: ChartFrequency;

  /** Considera vendas (fisicas/digitais). */
  usesSales: boolean;
  /** Considera streaming. */
  usesStreaming: boolean;
  /** Considera execucao em radio. */
  usesRadio: boolean;

  /** Importancia do chart na carreira [0, 100]. */
  prestige: number;
}

/** Abrangencia do chart. */
export type ChartScope = "World" | "Local";

/** Categoria do chart. */
export type ChartCategory = "Singles" | "Albums";

/** Frequencia de atualizacao do chart. */
export type ChartFrequency = "Weekly" | "Monthly";
