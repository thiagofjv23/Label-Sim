import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import { buildWorldCharts, buildCountryCharts } from "../src/simulation/standardCharts.js";
import type { Chart } from "../src/entities/Chart.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

describe("standardCharts (factory)", () => {
  it("gera o kit mundial: singles semanal + albuns mensal", () => {
    const [singles, albums] = buildWorldCharts();
    expect(singles).toMatchObject({
      id: "chart_world_singles",
      scope: "World",
      countryId: null,
      category: "Singles",
      updateFrequency: "Weekly",
    });
    expect(albums).toMatchObject({
      id: "chart_world_albums",
      category: "Albums",
      updateFrequency: "Monthly",
    });
  });

  it("gera o kit de um pais a partir do countryId", () => {
    const [singles, albums] = buildCountryCharts("country_japan", "Japão", 70);
    expect(singles).toMatchObject({
      id: "chart_japan_singles",
      name: "Top 100 Japão",
      scope: "Local",
      countryId: "country_japan",
      category: "Singles",
      updateFrequency: "Weekly",
      prestige: 70,
    });
    expect(albums.id).toBe("chart_japan_albums");
    expect(albums.name).toBe("Top 100 Japão (Álbuns)");
  });

  it("os JSON semente em database/charts espelham exatamente a factory", () => {
    const world = new World();
    loadSeedData(world, DATABASE_DIR);

    const expected: Chart[] = [
      ...buildWorldCharts(),
      ...buildCountryCharts("country_brazil", "Brasil", 85),
      ...buildCountryCharts("country_usa", "Estados Unidos", 95),
      ...buildCountryCharts("country_uk", "Reino Unido", 80),
      ...buildCountryCharts("country_japan", "Japão", 90),
      ...buildCountryCharts("country_western_europe", "Europa Ocidental", 92),
    ];

    for (const chart of expected) {
      expect(world.get(chart.id)).toEqual(chart);
    }
    // Nenhum chart extra alem dos esperados.
    expect(world.ofType<Chart>("Chart")).toHaveLength(expected.length);
  });
});
