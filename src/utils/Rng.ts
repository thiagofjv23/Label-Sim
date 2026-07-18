/**
 * Gerador de numeros pseudoaleatorios deterministico (mulberry32).
 *
 * A simulacao inteira deve ser reprodutivel: dado o mesmo seed e a mesma
 * sequencia de chamadas, o resultado e sempre identico. Por isso o estado
 * interno e exposto via {@link Rng.getState}/{@link Rng.setState} para poder
 * ser salvo e restaurado junto com o resto do mundo.
 */

/** Constante de avanco do gerador mulberry32. */
const MULBERRY_INCREMENT = 0x6d2b79f5;
/** Divisor para normalizar um uint32 em [0, 1). */
const UINT32_RANGE = 4294967296; // 2^32

export class Rng {
  private state: number;

  /**
   * @param seed Semente inicial. O mesmo seed produz sempre a mesma sequencia.
   */
  constructor(seed: number) {
    // Forca a semente para um inteiro sem sinal de 32 bits.
    this.state = seed >>> 0;
  }

  /**
   * Retorna o proximo numero em ponto flutuante no intervalo [0, 1).
   */
  nextFloat(): number {
    this.state = (this.state + MULBERRY_INCREMENT) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / UINT32_RANGE;
  }

  /**
   * Retorna um inteiro no intervalo [minInclusive, maxExclusive).
   */
  nextInt(minInclusive: number, maxExclusive: number): number {
    const span = maxExclusive - minInclusive;
    return minInclusive + Math.floor(this.nextFloat() * span);
  }

  /**
   * Escolhe um elemento aleatorio de uma lista nao vazia.
   * @throws Se a lista estiver vazia.
   */
  pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Rng.pick chamado com lista vazia");
    }
    return items[this.nextInt(0, items.length)] as T;
  }

  /** Le o estado interno para serializacao (save). */
  getState(): number {
    return this.state;
  }

  /** Restaura o estado interno a partir de um save. */
  setState(state: number): void {
    this.state = state >>> 0;
  }
}
