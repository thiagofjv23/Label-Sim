import { Clock } from "./time/Clock.js";
import type { System, TickContext } from "./System.js";
import { World } from "../simulation/World.js";
import { Rng } from "../utils/Rng.js";

/**
 * Motor da simulacao.
 *
 * Orquestra o avanco do tempo e a execucao dos sistemas. A cada tick o motor:
 *   1. avanca o relogio em um tick;
 *   2. executa `update` de cada sistema registrado, na ordem de registro.
 *
 * O motor e a unica autoridade sobre a progressao do jogo. Conforme a diretriz
 * de UI do README, a interface apenas observa o estado resultante; ela nao
 * chama sistemas diretamente nem avanca o tempo por conta propria.
 */

/** Configuracao de criacao do motor. */
export interface EngineConfig {
  /** Relogio ja inicializado com a data de inicio. */
  readonly clock: Clock;
  /** Semente da aleatoriedade deterministica. */
  readonly seed: number;
  /** Mundo inicial. Se omitido, um mundo vazio e criado. */
  readonly world?: World;
}

export class Engine {
  private readonly clock: Clock;
  private readonly world: World;
  private readonly rng: Rng;
  private readonly systems: System[];

  constructor(config: EngineConfig) {
    this.clock = config.clock;
    this.world = config.world ?? new World();
    this.rng = new Rng(config.seed);
    this.systems = [];
  }

  /**
   * Registra um sistema. A ordem de registro define a ordem de execucao.
   * @returns O proprio motor, para encadeamento.
   */
  register(system: System): this {
    this.systems.push(system);
    return this;
  }

  /**
   * Avanca a simulacao em `ticks` ticks, executando todos os sistemas em cada.
   * @param ticks Numero de ticks a processar (padrao: 1).
   */
  run(ticks = 1): void {
    for (let i = 0; i < ticks; i += 1) {
      this.step();
    }
  }

  /** Processa exatamente um tick. */
  private step(): void {
    this.clock.advance(1);
    const context: TickContext = {
      world: this.world,
      clock: this.clock,
      rng: this.rng,
      tick: this.clock.getTick(),
    };
    for (const system of this.systems) {
      system.update(context);
    }
  }

  /** Acesso somente leitura ao mundo (para a UI observar). */
  getWorld(): World {
    return this.world;
  }

  /** Acesso somente leitura ao relogio (para a UI observar). */
  getClock(): Clock {
    return this.clock;
  }
}
