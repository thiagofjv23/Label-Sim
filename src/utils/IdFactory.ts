/**
 * Fabrica de identificadores unicos por tipo de entidade.
 *
 * O README exige que "toda entidade possui ID unico". Os IDs sao gerados de
 * forma deterministica (contador monotonico por tipo), o que os torna estaveis
 * entre execucoes e faceis de salvar/restaurar.
 *
 * Formato: `<tipo>_<contador com zeros a esquerda>`, ex.: `artist_000001`.
 */

/** Quantidade de digitos usada no sufixo numerico do ID. */
const ID_PAD_WIDTH = 6;

/** Identificador de uma entidade. Alias de string para clareza semantica. */
export type EntityId = string;

/** Estado serializavel da fabrica (contadores por tipo). */
export type IdFactoryState = Record<string, number>;

export class IdFactory {
  private counters: Map<string, number>;

  constructor(initial?: IdFactoryState) {
    this.counters = new Map(Object.entries(initial ?? {}));
  }

  /**
   * Gera o proximo ID unico para um dado tipo de entidade.
   * @param type Prefixo do tipo, ex.: "artist", "song", "label".
   */
  next(type: string): EntityId {
    const current = this.counters.get(type) ?? 0;
    const nextValue = current + 1;
    this.counters.set(type, nextValue);
    return `${type}_${String(nextValue).padStart(ID_PAD_WIDTH, "0")}`;
  }

  /** Le os contadores para serializacao (save). */
  getState(): IdFactoryState {
    return Object.fromEntries(this.counters);
  }
}
