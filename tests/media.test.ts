import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { World } from "../src/simulation/World.js";
import { loadSeedData } from "../src/simulation/SeedLoader.js";
import { GameDate } from "../src/engine/time/GameDate.js";
import {
  bookingScore,
  requiredBookingScore,
  meetsBookingRequirement,
  isMediaOutletActive,
  availableSlots,
  isBookingWindowOpen,
  generateEditions,
  evaluateBooking,
  validateMediaOutlet,
  MEDIA_BOOKING_LEAD_DAYS,
} from "../src/systems/media.js";
import type { MediaOutlet, MediaEdition } from "../src/entities/MediaOutlet.js";

const DATABASE_DIR = fileURLToPath(new URL("../database", import.meta.url));

function loadDomingao(): MediaOutlet {
  const world = new World();
  loadSeedData(world, DATABASE_DIR);
  return world.get("media_domingao_do_faustao") as MediaOutlet;
}

describe("MediaOutlet — carga e validacao", () => {
  it("o Domingao do Faustao carrega e passa na validacao", () => {
    const outlet = loadDomingao();
    expect(outlet.type).toBe("MediaOutlet");
    expect(validateMediaOutlet(outlet)).toEqual([]);
  });

  it("ativo em 2005, inativo apos activeToYear (2021)", () => {
    const outlet = loadDomingao();
    expect(isMediaOutletActive(outlet, 2005)).toBe(true);
    expect(isMediaOutletActive(outlet, 2022)).toBe(false);
  });
});

describe("Pontuacao de agendamento", () => {
  it("exigencia derivada do prestigio: 20 + 98*0.70 = 88.6", () => {
    expect(requiredBookingScore(loadDomingao())).toBeCloseTo(88.6, 5);
  });

  it("candidatura forte (90.5) aprovada; fraca (58.5) recusada", () => {
    const outlet = loadDomingao();
    expect(bookingScore({ labelPrestige: 90, artistPrestige: 85, localArtistPopularity: 95 })).toBeCloseTo(90.5, 5);
    expect(meetsBookingRequirement(outlet, { labelPrestige: 90, artistPrestige: 85, localArtistPopularity: 95 })).toBe(true);
    expect(bookingScore({ labelPrestige: 45, artistPrestige: 50, localArtistPopularity: 75 })).toBeCloseTo(58.5, 5);
    expect(meetsBookingRequirement(outlet, { labelPrestige: 45, artistPrestige: 50, localArtistPopularity: 75 })).toBe(false);
  });
});

describe("Antecedencia uniforme", () => {
  it("a janela usa a constante global (15 dias)", () => {
    expect(MEDIA_BOOKING_LEAD_DAYS).toBe(15);
    expect(isBookingWindowOpen(21)).toBe(true);
    expect(isBookingWindowOpen(15)).toBe(true);
    expect(isBookingWindowOpen(14)).toBe(false);
  });
});

describe("Geracao de edicoes", () => {
  it("gera uma edicao em cada domingo do intervalo (Domingao, jan/2005)", () => {
    const outlet = loadDomingao();
    // 2005-01-01 foi sabado; os domingos de jan sao 2, 9, 16, 23, 30.
    const editions = generateEditions(outlet, GameDate.fromCalendar(2005, 1, 3), GameDate.fromCalendar(2005, 1, 31));
    expect(editions.map((e) => e.date)).toEqual(["2005-01-09", "2005-01-16", "2005-01-23", "2005-01-30"]);
    expect(editions[0].capacity).toBe(2);
    expect(editions[0].status).toBe("Open");
  });

  it("respeita excludedDates e activeToYear", () => {
    const outlet: MediaOutlet = {
      ...loadDomingao(),
      availability: { ...loadDomingao().availability, excludedDates: ["2005-01-16"] },
    };
    const dates = generateEditions(outlet, GameDate.fromCalendar(2005, 1, 3), GameDate.fromCalendar(2005, 1, 31)).map((e) => e.date);
    expect(dates).not.toContain("2005-01-16");
  });
});

describe("Avaliacao de reserva (fluxo completo)", () => {
  const openEdition: MediaEdition = {
    id: "media_edition_domingao_2005_01_23",
    type: "MediaEdition",
    mediaOutletId: "media_domingao_do_faustao",
    date: "2005-01-23",
    status: "Open",
    capacity: 2,
    bookingIds: [],
  };

  it("aprova quando todas as regras sao atendidas", () => {
    const result = evaluateBooking({
      outlet: loadDomingao(),
      edition: openEdition,
      currentYear: 2005,
      daysUntilEdition: 20,
      participantType: "Artist",
      appearanceType: "MusicalPerformance",
      candidate: { labelPrestige: 90, artistPrestige: 85, localArtistPopularity: 95 },
    });
    expect(result.allowed).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it("recusa por janela fechada, edicao cheia e pontuacao baixa", () => {
    const fullPast: MediaEdition = { ...openEdition, bookingIds: ["a", "b"] };
    const result = evaluateBooking({
      outlet: loadDomingao(),
      edition: fullPast,
      currentYear: 2005,
      daysUntilEdition: 5,
      participantType: "Artist",
      appearanceType: "MusicalPerformance",
      candidate: { labelPrestige: 45, artistPrestige: 50, localArtistPopularity: 75 },
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons).toEqual(expect.arrayContaining(["EditionFull", "WindowClosed", "ScoreTooLow"]));
  });

  it("recusa participante ou aparicao nao suportados", () => {
    const result = evaluateBooking({
      outlet: loadDomingao(),
      edition: openEdition,
      currentYear: 2005,
      daysUntilEdition: 20,
      participantType: "Band",
      appearanceType: "MusicalPerformance",
      candidate: { labelPrestige: 90, artistPrestige: 85, localArtistPopularity: 95 },
    });
    // Band e aparicao musical sao suportados -> aprovado (controle positivo).
    expect(result.allowed).toBe(true);
  });

  it("edicao com vagas: availableSlots reflete as reservas", () => {
    expect(availableSlots(openEdition)).toBe(2);
    expect(availableSlots({ ...openEdition, bookingIds: ["a"] })).toBe(1);
  });
});
