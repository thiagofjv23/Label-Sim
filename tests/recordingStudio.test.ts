import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import {
  isStudioActive,
  studioOffersService,
  validateRecordingStudio,
} from "../src/systems/recordingStudio.js";
import type { RecordingStudio } from "../src/entities/RecordingStudio.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

function loadMosh(): RecordingStudio {
  const world = new World();
  loadSeedData(world, DATABASE_DIR);
  return world.get("recording_studio_mosh") as RecordingStudio;
}

describe("RecordingStudio — carga e validacao", () => {
  it("o Mosh Studios carrega de database/studios e passa na validacao", () => {
    const mosh = loadMosh();
    expect(mosh.type).toBe("RecordingStudio");
    expect(mosh.location.countryId).toBe("country_brazil");
    expect(validateRecordingStudio(mosh)).toEqual([]);
  });
});

describe("isStudioActive", () => {
  it("ativo em 2005 (aberto em 1979, sem fechamento)", () => {
    expect(isStudioActive(loadMosh(), 2005)).toBe(true);
  });

  it("inativo antes de abrir e depois de fechar", () => {
    const mosh = loadMosh();
    expect(isStudioActive(mosh, 1978)).toBe(false);
    expect(isStudioActive({ ...mosh, activeToYear: 2000 }, 2005)).toBe(false);
  });
});

describe("studioOffersService", () => {
  it("reconhece os servicos oferecidos", () => {
    const mosh = loadMosh();
    expect(studioOffersService(mosh, "Mastering")).toBe(true);
    expect(studioOffersService({ ...mosh, services: ["Recording"] }, "Mastering")).toBe(false);
  });
});

describe("validateRecordingStudio — violacoes", () => {
  it("acusa faixas invalidas, custo <= 0 e ano de fim anterior ao de inicio", () => {
    const bad: RecordingStudio = {
      ...loadMosh(),
      quality: 120,
      activeToYear: 1970,
      dailyCost: { amount: 0, currency: "BRL" },
    };
    const errors = validateRecordingStudio(bad);
    expect(errors).toContain("quality fora de [0, 100]");
    expect(errors).toContain("activeToYear anterior a activeFromYear");
    expect(errors).toContain("dailyCost.amount deve ser > 0");
  });
});
