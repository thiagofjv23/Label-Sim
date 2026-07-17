import { Engine } from "./engine/Engine.js";
import { Clock } from "./engine/time/Clock.js";
import { GameDate } from "./engine/time/GameDate.js";
import type { System, TickContext } from "./engine/System.js";
import type { Entity } from "./entities/Entity.js";

/**
 * Demonstracao minima do motor de simulacao.
 *
 * Constroi um motor iniciando em 1990-01-01, registra um sistema de exemplo e
 * avanca alguns ticks, imprimindo a data de cada um. Serve como prova de que o
 * loop de tempo funciona ponta a ponta. Nao representa regras de jogo finais.
 */

/** Ano em que a simulacao de exemplo comeca. */
const START_YEAR = 1990;
/** Quantidade de ticks (dias) a simular na demonstracao. */
const DEMO_TICKS = 7;
/** Tick em que a gravadora de exemplo e fundada. */
const FOUNDING_TICK = 3;

/** Gravadora de exemplo (composicao: apenas dados sobre a base Entity). */
interface Label extends Entity {
  readonly type: "label";
  readonly name: string;
}

/** Sistema de exemplo: funda uma gravadora em um tick especifico. */
const foundingSystem: System = {
  name: "founding",
  update(ctx: TickContext): void {
    if (ctx.tick !== FOUNDING_TICK) {
      return;
    }
    const label: Label = {
      id: ctx.world.nextId("label"),
      type: "label",
      name: "Gravadora Exemplo",
    };
    ctx.world.add(label);
  },
};

function main(): void {
  const engine = new Engine({
    clock: new Clock({ start: GameDate.fromCalendar(START_YEAR, 1, 1) }),
    seed: 42,
  });
  engine.register(foundingSystem);

  for (let tick = 1; tick <= DEMO_TICKS; tick += 1) {
    engine.run(1);
    const date = engine.getClock().getDate().toISO();
    const labels = engine.getWorld().count();
    console.log(`tick ${tick} | ${date} | entidades: ${labels}`);
  }
}

main();
