import { fileURLToPath } from "node:url";
import { Engine } from "./engine/Engine.js";
import { Clock } from "./engine/time/Clock.js";
import { GameDate } from "./engine/time/GameDate.js";
import type { System, TickContext } from "./engine/System.js";
import { World } from "./simulation/World.js";
import { loadSeedData } from "./simulation/SeedLoader.js";
import { validateReferences, formatReferenceIssue } from "./simulation/validateReferences.js";
import type { Artist } from "./entities/Artist.js";

/**
 * Demonstracao do motor sobre os dados semente reais de `database/`.
 *
 * Carrega artistas, musicas e gravadoras do disco para o mundo, registra um
 * sistema de exemplo que faz a popularidade dos artistas oscilar de forma
 * deterministica e avanca alguns ticks, imprimindo a evolucao. As regras aqui
 * sao placeholders — servem apenas para provar o fluxo dados -> mundo -> tick.
 */

/** Ano em que a simulacao de exemplo comeca. */
const START_YEAR = 1990;
/** Quantidade de ticks (dias) a simular. */
const DEMO_TICKS = 5;
/** Limites do atributo de popularidade. */
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 100;
/** Amplitude da oscilacao diaria de popularidade (placeholder). */
const DRIFT_MIN = -1;
const DRIFT_MAX = 2; // exclusivo em nextInt => valores -1, 0, +1

/** Diretorio dos dados semente, relativo a este arquivo. */
const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

/** Sistema placeholder: oscila a popularidade de cada artista a cada tick. */
const popularityDriftSystem: System = {
  name: "popularity-drift",
  update(ctx: TickContext): void {
    for (const artist of ctx.world.ofType<Artist>("Artist")) {
      const delta = ctx.rng.nextInt(DRIFT_MIN, DRIFT_MAX);
      const next = artist.commercial.popularity + delta;
      artist.commercial.popularity = clamp(next, MIN_POPULARITY, MAX_POPULARITY);
    }
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function main(): void {
  const world = new World();
  const loaded = loadSeedData(world, DATABASE_DIR);
  console.log(`Carregados ${loaded} registros de ${DATABASE_DIR}`);
  for (const artist of world.ofType<Artist>("Artist")) {
    console.log(`  ${artist.type}: ${artist.stageName} (pop ${artist.commercial.popularity})`);
  }

  const issues = validateReferences(world);
  if (issues.length > 0) {
    console.warn(`\n${issues.length} referencia(s) pendente(s):`);
    for (const issue of issues) {
      console.warn(`  - ${formatReferenceIssue(issue)}`);
    }
    console.warn("");
  }

  const engine = new Engine({
    clock: new Clock({ start: GameDate.fromCalendar(START_YEAR, 1, 1) }),
    seed: 42,
    world,
  });
  engine.register(popularityDriftSystem);

  for (let tick = 1; tick <= DEMO_TICKS; tick += 1) {
    engine.run(1);
    const date = engine.getClock().getDate().toISO();
    const artists = engine.getWorld().ofType<Artist>("Artist");
    const pops = artists.map((a) => `${a.stageName}=${a.commercial.popularity}`).join(", ");
    console.log(`tick ${tick} | ${date} | ${pops}`);
  }
}

main();
