import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import {
  resolveMarketCountry,
  resolveMarketCountryId,
  isAggregatorCountry,
} from "../src/simulation/resolveMarketCountry.js";
import type { Country } from "../src/entities/Country.js";
import type { Artist } from "../src/entities/Artist.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

function loadCountries(): Country[] {
  const world = new World();
  loadSeedData(world, DATABASE_DIR);
  return world.ofType<Country>("Country");
}

describe("resolveMarketCountry", () => {
  it("nacionalidade de pais simulado resolve para ele mesmo (BRA -> Brasil)", () => {
    const countries = loadCountries();
    expect(resolveMarketCountryId("BRA", countries)).toBe("country_brazil");
    expect(resolveMarketCountryId("JPN", countries)).toBe("country_japan");
  });

  it("nacionalidade agregada resolve para o agregador (FRA -> Western Europe)", () => {
    const countries = loadCountries();
    // Pauline Croze (FRA): UI mostra França, charts usam Western Europe.
    expect(resolveMarketCountryId("FRA", countries)).toBe("country_western_europe");
    expect(resolveMarketCountryId("DEU", countries)).toBe("country_western_europe");
  });

  it("nacionalidade desconhecida resolve para undefined", () => {
    const countries = loadCountries();
    expect(resolveMarketCountry("XYZ", countries)).toBeUndefined();
  });

  it("Pauline Croze (nacionalidade FRA) aparece nos charts sob Western Europe", () => {
    const world = new World();
    loadSeedData(world, DATABASE_DIR);
    const pauline = world.get("artist_pauline_croze") as Artist | undefined;
    expect(pauline?.nationality).toBe("FRA");

    const countries = world.ofType<Country>("Country");
    const marketCountryId = resolveMarketCountryId(pauline!.nationality, countries);
    expect(marketCountryId).toBe("country_western_europe");
  });

  it("identifica paises agregadores", () => {
    const countries = loadCountries();
    const weu = countries.find((c) => c.id === "country_western_europe") as Country;
    const brazil = countries.find((c) => c.id === "country_brazil") as Country;
    expect(isAggregatorCountry(weu)).toBe(true);
    expect(isAggregatorCountry(brazil)).toBe(false);
  });
});
