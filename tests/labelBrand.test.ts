import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import type { Label } from "../src/entities/Label.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

/** Agrupa os IDs de label por `brandTag` (ignora as sem tag). */
function groupByBrand(labels: Label[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const label of labels) {
    if (!label.brandTag) {
      continue;
    }
    const ids = groups.get(label.brandTag) ?? [];
    ids.push(label.id);
    groups.set(label.brandTag, ids);
  }
  return groups;
}

describe("brandTag (subsidiárias)", () => {
  it("correlaciona gravadoras da mesma marca em países diferentes", () => {
    const world = new World();
    loadSeedData(world, DATABASE_DIR);
    const groups = groupByBrand(world.ofType<Label>("Label"));

    expect(groups.get("sony")).toEqual(
      expect.arrayContaining(["label_sony_music", "label_sony_music_entertainment_japan"]),
    );
    expect(groups.get("universal")).toEqual(
      expect.arrayContaining(["label_universal_music", "label_universal_music_japan"]),
    );
  });
});
