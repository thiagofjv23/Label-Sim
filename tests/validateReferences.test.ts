import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import { validateReferences } from "../src/simulation/validateReferences.js";
import type { Artist } from "../src/entities/Artist.js";
import type { Label } from "../src/entities/Label.js";

/** Diretorio dos dados semente, relativo a este arquivo de teste. */
const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

describe("validateReferences", () => {
  it("reporta referencias pendentes nos dados semente atuais", () => {
    const world = new World();
    loadSeedData(world, DATABASE_DIR);
    const issues = validateReferences(world);
    const missing = issues.filter((i) => i.kind === "missing").map((i) => i.targetId);

    // Alvos citados pelos exemplos mas ainda sem arquivo em database/.
    expect(missing).toEqual(
      expect.arrayContaining([
        // gravadora atual do Erasmo, ainda sem arquivo:
        "label_universal_music",
        // referencias trazidas pelo Album (gravadora historica e faixas):
        "label_cbs_brasil",
        "song_se_eu_partir",
      ]),
    );
    // Erasmo agora existe (arquivo multi-entidade): writers[1] da Song resolve.
    expect(missing).not.toContain("artist_erasmo_carlos");
    // Referencias ja resolvidas nao devem constar:
    // - country_brazil, genre_mpb e theme_romantic ja possuem arquivo em database/;
    // - Song.albumId agora aponta para o id canonico do album (existente);
    // - "romantic" deixou de ser genero (virou Theme): genre_romantic nao e mais referenciado.
    expect(missing).not.toContain("country_brazil");
    expect(missing).not.toContain("genre_mpb");
    expect(missing).not.toContain("theme_romantic");
    expect(missing).not.toContain("album_detalhes");
    expect(missing).not.toContain("genre_romantic");
  });

  it("nao reporta nada quando todas as referencias existem", () => {
    const world = new World();
    const label: Label = {
      id: "label_x",
      type: "Label",
      name: "X Records",
      countryId: "country_x",
      foundationYear: 2000,
      status: "Active",
      ratings: {
        reputation: 50,
        marketing: 50,
        distribution: 50,
        artistDevelopment: 50,
        financialPower: 50,
        industryInfluence: 50,
      },
      commercial: { budget: 0, marketShare: 0, activeArtists: 1, activeContracts: 1 },
      catalog: { songs: 0, albums: 0 },
      relationships: { artists: ["artist_x"], bands: [], producers: [] },
      flags: { majorLabel: false, acceptsDemos: true },
    };
    const country = { id: "country_x", type: "Country" };
    const artist: Partial<Artist> & { id: string; type: "Artist" } = {
      id: "artist_x",
      type: "Artist",
      currentLabelId: "label_x",
      managerId: null,
      relationships: { bands: [], producers: [], collaborators: [] },
    };
    world.add(label);
    world.add(country);
    world.add(artist as Artist);

    const issues = validateReferences(world);
    // artist_x so referencia label_x (existe); demais campos sao null/vazios.
    expect(issues).toEqual([]);
  });

  it("detecta incompatibilidade de tipo", () => {
    const world = new World();
    const country = { id: "country_x", type: "Country" };
    // currentLabelId aponta para um Country em vez de um Label.
    const artist: Partial<Artist> & { id: string; type: "Artist" } = {
      id: "artist_y",
      type: "Artist",
      currentLabelId: "country_x",
      managerId: null,
      relationships: { bands: [], producers: [], collaborators: [] },
    };
    world.add(country);
    world.add(artist as Artist);

    const issues = validateReferences(world);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      sourceId: "artist_y",
      field: "currentLabelId",
      targetId: "country_x",
      expectedType: "Label",
      kind: "type-mismatch",
      actualType: "Country",
    });
  });
});
