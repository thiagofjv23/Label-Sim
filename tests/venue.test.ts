import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import {
  isVenueAvailable,
  canHostStageSize,
  venueAllowsEvent,
  validateVenue,
} from "../src/systems/venue.js";
import type { Venue } from "../src/entities/Venue.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

function loadMaracana(): Venue {
  const world = new World();
  loadSeedData(world, DATABASE_DIR);
  return world.get("venue_maracana") as Venue;
}

describe("Venue — carga e validacao", () => {
  it("o Maracana carrega de database/venues e passa na validacao estrutural", () => {
    const maracana = loadMaracana();
    expect(maracana.type).toBe("Venue");
    expect(validateVenue(maracana)).toEqual([]);
  });

  it("os templates NAO sao carregados como entidades", () => {
    const world = new World();
    loadSeedData(world, DATABASE_DIR);
    // venue_example vive em database/templates e nao deve existir no mundo.
    expect(world.get("venue_example")).toBeUndefined();
  });
});

describe("isVenueAvailable", () => {
  it("disponivel dentro do periodo de operacao (Maracana em 2005)", () => {
    expect(isVenueAvailable(loadMaracana(), 2005)).toBe(true);
  });

  it("indisponivel antes de abrir", () => {
    expect(isVenueAvailable(loadMaracana(), 1949)).toBe(false);
  });

  it("indisponivel se inativo ou fechado", () => {
    const maracana = loadMaracana();
    expect(isVenueAvailable({ ...maracana, active: false }, 2005)).toBe(false);
    expect(isVenueAvailable({ ...maracana, closedYear: 2000 }, 2005)).toBe(false);
  });
});

describe("regras de palco e evento", () => {
  it("um venue Mega comporta producoes menores e ate Mega", () => {
    const maracana = loadMaracana();
    expect(canHostStageSize(maracana, "Small")).toBe(true);
    expect(canHostStageSize(maracana, "Mega")).toBe(true);
  });

  it("um venue Medium nao comporta uma producao Mega", () => {
    const medium: Venue = { ...loadMaracana(), stage: { ...loadMaracana().stage, maxStageSize: "Medium" } };
    expect(canHostStageSize(medium, "Mega")).toBe(false);
  });

  it("valida o tipo de evento aceito", () => {
    const maracana = loadMaracana();
    expect(venueAllowsEvent(maracana, "Concert")).toBe(true);
    expect(venueAllowsEvent(maracana, "TV")).toBe(false);
  });
});

describe("validateVenue — violacoes", () => {
  it("acusa capacidade sentada maior que a total e multiplicador invalido", () => {
    const bad: Venue = {
      ...loadMaracana(),
      capacity: { concert: 100, seatedConcert: 200 },
      defaultTicketPriceMultiplier: 0,
    };
    const errors = validateVenue(bad);
    expect(errors).toContain("capacity.seatedConcert maior que capacity.concert");
    expect(errors).toContain("defaultTicketPriceMultiplier deve ser > 0");
  });
});
