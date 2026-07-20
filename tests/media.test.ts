import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import {
  bookingScore,
  requiredBookingScore,
  meetsBookingRequirement,
  isMediaOutletActive,
  availableSlots,
  isBookingWindowOpen,
  validateMediaOutlet,
} from "../src/systems/media.js";
import type { MediaOutlet, MediaEdition } from "../src/entities/MediaOutlet.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

function loadDomingao(): MediaOutlet {
  const world = new World();
  loadSeedData(world, DATABASE_DIR);
  return world.get("media_domingao_do_faustao") as MediaOutlet;
}

describe("MediaOutlet — carga e validacao", () => {
  it("o Domingao do Faustao carrega de database/media e passa na validacao", () => {
    const outlet = loadDomingao();
    expect(outlet.type).toBe("MediaOutlet");
    expect(outlet.countryId).toBe("country_brazil");
    expect(validateMediaOutlet(outlet)).toEqual([]);
  });

  it("ativo em 2005, inativo apos activeToYear (2021)", () => {
    const outlet = loadDomingao();
    expect(isMediaOutletActive(outlet, 2005)).toBe(true);
    expect(isMediaOutletActive(outlet, 2022)).toBe(false);
    expect(isMediaOutletActive(outlet, 1988)).toBe(false);
  });
});

describe("Sistema de agendamento (pontuacao combinada)", () => {
  it("exigencia derivada do prestigio: 20 + 98*0.70 = 88.6", () => {
    expect(requiredBookingScore(loadDomingao())).toBeCloseTo(88.6, 5);
  });

  it("grande label + artista forte (90.5) e aprovado", () => {
    const outlet = loadDomingao();
    const candidate = { labelPrestige: 90, artistPrestige: 85, localArtistPopularity: 95 };
    expect(bookingScore(candidate)).toBeCloseTo(90.5, 5);
    expect(meetsBookingRequirement(outlet, candidate)).toBe(true);
  });

  it("label menor + artista em crescimento (58.5) e recusado", () => {
    const outlet = loadDomingao();
    const candidate = { labelPrestige: 45, artistPrestige: 50, localArtistPopularity: 75 };
    expect(bookingScore(candidate)).toBeCloseTo(58.5, 5);
    expect(meetsBookingRequirement(outlet, candidate)).toBe(false);
  });
});

describe("Edicoes e janela de reserva", () => {
  it("vagas restantes = capacidade - reservas", () => {
    const edition: MediaEdition = {
      id: "media_edition_x",
      type: "MediaEdition",
      mediaOutletId: "media_domingao_do_faustao",
      date: "2005-01-02",
      status: "Open",
      capacity: 2,
      bookingIds: ["media_booking_a"],
    };
    expect(availableSlots(edition)).toBe(1);
  });

  it("a janela fecha quando falta menos que a antecedencia minima (15 dias)", () => {
    const outlet = loadDomingao();
    expect(isBookingWindowOpen(outlet, 21)).toBe(true);
    expect(isBookingWindowOpen(outlet, 15)).toBe(true);
    expect(isBookingWindowOpen(outlet, 10)).toBe(false);
  });
});
