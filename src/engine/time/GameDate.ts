/**
 * Data de calendario da simulacao, independente de fuso horario.
 *
 * Internamente a data e representada por um indice inteiro de dias desde a
 * epoca Unix (1970-01-01), calculado em UTC. Isso mantem a aritmetica de datas
 * deterministica (sem influencia do fuso do host) e barata de serializar.
 */

/** Milissegundos em um dia. */
const MS_PER_DAY = 86_400_000;

/** Componentes de calendario de uma data. */
export interface CalendarParts {
  /** Ano com quatro digitos, ex.: 1990. */
  readonly year: number;
  /** Mes no intervalo [1, 12]. */
  readonly month: number;
  /** Dia do mes no intervalo [1, 31]. */
  readonly day: number;
}

export class GameDate {
  /** Numero de dias desde 1970-01-01 (UTC). */
  private readonly dayIndex: number;

  private constructor(dayIndex: number) {
    this.dayIndex = dayIndex;
  }

  /**
   * Cria uma data a partir dos componentes de calendario.
   * @param year Ano com quatro digitos.
   * @param month Mes no intervalo [1, 12].
   * @param day Dia do mes no intervalo [1, 31].
   */
  static fromCalendar(year: number, month: number, day: number): GameDate {
    const ms = Date.UTC(year, month - 1, day);
    return new GameDate(Math.floor(ms / MS_PER_DAY));
  }

  /** Cria uma data a partir do indice de dias (usado em saves). */
  static fromDayIndex(dayIndex: number): GameDate {
    return new GameDate(dayIndex);
  }

  /** Retorna uma nova data deslocada em `days` dias (pode ser negativo). */
  addDays(days: number): GameDate {
    return new GameDate(this.dayIndex + days);
  }

  /** Indice de dias desde a epoca (usado em saves e comparacoes). */
  toDayIndex(): number {
    return this.dayIndex;
  }

  /** Decompoe a data em ano, mes e dia. */
  toCalendar(): CalendarParts {
    const date = new Date(this.dayIndex * MS_PER_DAY);
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }

  /** Formata como ISO curto `AAAA-MM-DD`. */
  toISO(): string {
    const { year, month, day } = this.toCalendar();
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }
}
