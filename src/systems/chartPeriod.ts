import { GameDate } from "../engine/time/GameDate.js";
import type { ChartFrequency } from "../entities/Chart.js";

/**
 * Calculo da janela de apuracao (periodo) de um chart.
 *
 * Cada chart apura vendas dentro de uma janela determinada pela sua frequencia:
 *   - `Weekly`  : de segunda a domingo da semana que contem a data.
 *   - `Monthly` : do dia 1 ao ultimo dia do mes que contem a data.
 *
 * O sistema de charts usa esta janela para somar as vendas do periodo. A janela
 * e sempre DERIVADA da data e da frequencia — nunca armazenada na entidade
 * `Chart` (principio da decisao 0004).
 */

/** Dias em uma semana. */
const DAYS_IN_WEEK = 7;
/** Codigo de dia da semana correspondente a segunda-feira (0 = domingo). */
const MONDAY = 1;

/** Intervalo fechado `[start, end]` de datas de um periodo de apuracao. */
export interface ChartPeriod {
  /** Primeiro dia do periodo (inclusive). */
  readonly start: GameDate;
  /** Ultimo dia do periodo (inclusive). */
  readonly end: GameDate;
}

/**
 * Resolve o periodo de apuracao que contem `date`, para a frequencia dada.
 * @param frequency Frequencia do chart (`Weekly` ou `Monthly`).
 * @param date Data de referencia (qualquer dia dentro do periodo desejado).
 */
export function resolveChartPeriod(frequency: ChartFrequency, date: GameDate): ChartPeriod {
  if (frequency === "Weekly") {
    return resolveWeeklyPeriod(date);
  }
  return resolveMonthlyPeriod(date);
}

/** Semana de segunda a domingo que contem `date`. */
function resolveWeeklyPeriod(date: GameDate): ChartPeriod {
  const daysSinceMonday = (date.weekday() - MONDAY + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const start = date.addDays(-daysSinceMonday);
  const end = start.addDays(DAYS_IN_WEEK - 1);
  return { start, end };
}

/** Mes (dia 1 ao ultimo dia) que contem `date`. */
function resolveMonthlyPeriod(date: GameDate): ChartPeriod {
  const { year, month } = date.toCalendar();
  const start = GameDate.fromCalendar(year, month, 1);
  const firstOfNextMonth =
    month === 12
      ? GameDate.fromCalendar(year + 1, 1, 1)
      : GameDate.fromCalendar(year, month + 1, 1);
  const end = firstOfNextMonth.addDays(-1);
  return { start, end };
}
