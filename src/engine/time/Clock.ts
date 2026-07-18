import { GameDate } from "./GameDate.js";

/**
 * Relogio da simulacao.
 *
 * O tempo avanca em "ticks" discretos. Cada tick corresponde a um numero fixo
 * de dias ({@link ClockConfig.daysPerTick}). O relogio nunca decide nada: ele
 * apenas mantem e reporta o tempo atual para os sistemas da simulacao.
 */

/** Quantidade de dias por tick padrao (um tick = um dia). */
const DEFAULT_DAYS_PER_TICK = 1;

/** Configuracao de criacao do relogio. */
export interface ClockConfig {
  /** Data inicial da simulacao. */
  readonly start: GameDate;
  /** Quantos dias cada tick avanca. Padrao: 1. */
  readonly daysPerTick?: number;
}

/** Estado serializavel do relogio. */
export interface ClockState {
  readonly startDayIndex: number;
  readonly daysPerTick: number;
  readonly tickCount: number;
}

export class Clock {
  private readonly start: GameDate;
  private readonly daysPerTick: number;
  private tickCount: number;

  constructor(config: ClockConfig) {
    this.start = config.start;
    this.daysPerTick = config.daysPerTick ?? DEFAULT_DAYS_PER_TICK;
    this.tickCount = 0;
  }

  /**
   * Avanca o relogio em `ticks` ticks.
   * @param ticks Numero de ticks a avancar (padrao: 1).
   */
  advance(ticks = 1): void {
    if (ticks < 0) {
      throw new Error("Clock.advance nao aceita valores negativos");
    }
    this.tickCount += ticks;
  }

  /** Numero total de ticks decorridos desde o inicio. */
  getTick(): number {
    return this.tickCount;
  }

  /** Data de calendario correspondente ao tick atual. */
  getDate(): GameDate {
    return this.start.addDays(this.tickCount * this.daysPerTick);
  }

  /** Le o estado para serializacao (save). */
  getState(): ClockState {
    return {
      startDayIndex: this.start.toDayIndex(),
      daysPerTick: this.daysPerTick,
      tickCount: this.tickCount,
    };
  }

  /** Reconstroi um relogio a partir de um estado salvo. */
  static fromState(state: ClockState): Clock {
    const clock = new Clock({
      start: GameDate.fromDayIndex(state.startDayIndex),
      daysPerTick: state.daysPerTick,
    });
    clock.tickCount = state.tickCount;
    return clock;
  }
}
