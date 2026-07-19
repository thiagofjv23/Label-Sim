import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData, readEntitiesFromDir } from "../src/simulation/SeedLoader.js";
import type { Artist } from "../src/entities/Artist.js";
import type { Song } from "../src/entities/Song.js";
import type { Label } from "../src/entities/Label.js";

/** Diretorio dos dados semente, relativo a este arquivo de teste. */
const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

describe("SeedLoader", () => {
  it("carrega os dados semente de exemplo para o mundo", () => {
    const world = new World();
    const count = loadSeedData(world, DATABASE_DIR);

    expect(count).toBeGreaterThanOrEqual(3);
    expect(world.count()).toBe(count);

    const artist = world.get("artist_roberto_carlos") as Artist | undefined;
    expect(artist?.stageName).toBe("Roberto Carlos");
    expect(artist?.currentLabelId).toBe("label_sony_music");

    // Arquivo multi-entidade: o segundo artista do mesmo arquivo tambem carrega.
    const erasmo = world.get("artist_erasmo_carlos") as Artist | undefined;
    expect(erasmo?.stageName).toBe("Erasmo Carlos");
    expect(erasmo?.relationships.collaborators).toContain("artist_roberto_carlos");

    const song = world.get("song_detalhes") as Song | undefined;
    expect(song?.artistId).toBe("artist_roberto_carlos");

    const label = world.get("label_sony_music") as Label | undefined;
    expect(label?.relationships.artists).toContain("artist_roberto_carlos");
  });

  it("e deterministico na ordenacao (independe do sistema de arquivos)", () => {
    const first = readEntitiesFromDir(DATABASE_DIR).map((e) => e.id);
    const second = readEntitiesFromDir(DATABASE_DIR).map((e) => e.id);
    expect(first).toEqual(second);
    expect(first).toEqual([...first].sort((a, b) => a.localeCompare(b)));
  });
});
