import type { Clock } from "./time/Clock.js";
import type { World } from "../simulation/World.js";
import type { Rng } from "../utils/Rng.js";

/**
 * Contexto entregue a cada sistema em todo tick.
 *
 * Reune tudo que um sistema precisa para operar: o estado do mundo, o tempo
 * atual e a fonte de aleatoriedade deterministica. Sistemas nao guardam
 * referencias globais; recebem o contexto explicitamente.
 */
export interface TickContext {
  /** Estado do mundo (entidades). */
  readonly world: World;
  /** Relogio da simulacao (somente leitura durante o tick). */
  readonly clock: Clock;
  /** Fonte de aleatoriedade deterministica. */
  readonly rng: Rng;
  /** Numero do tick que esta sendo processado. */
  readonly tick: number;
}

/**
 * Unidade de comportamento da simulacao.
 *
 * Cada sistema encapsula uma regra do mundo (ex.: envelhecer artistas, apurar
 * charts, calcular receita). O motor chama {@link System.update} de todos os
 * sistemas registrados, em ordem, a cada tick.
 */
export interface System {
  /** Nome legivel do sistema (para logs e depuracao). */
  readonly name: string;
  /** Executa a logica do sistema para o tick atual. */
  update(context: TickContext): void;
}
