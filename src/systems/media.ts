import type { MediaOutlet, MediaEdition } from "../entities/MediaOutlet.js";

/**
 * Regras do sistema de midia (lado sistema).
 *
 * A `MediaOutlet` guarda caracteristicas permanentes; estas funcoes derivam
 * decisoes de agendamento (pontuacao combinada, exigencia, disponibilidade) a
 * partir delas. Ver `docs/03_Entities/MediaOutlet.md`.
 */

/** Limites dos atributos [0, 100]. */
const ATTR_MIN = 0;
const ATTR_MAX = 100;
/** Prefixo de ID exigido. */
const ID_PREFIX = "media_";

/** Pesos da pontuacao de candidatura (spec). */
const WEIGHT_LABEL_PRESTIGE = 0.3;
const WEIGHT_ARTIST_PRESTIGE = 0.3;
const WEIGHT_LOCAL_POPULARITY = 0.4;

/** Conversao do prestigio da MediaOutlet em exigencia de agendamento (spec). */
const REQUIRED_SCORE_BASE = 20;
const REQUIRED_SCORE_PRESTIGE_FACTOR = 0.7;

/** Fatores de uma candidatura de agendamento. */
export interface BookingCandidate {
  /** Prestigio atual da label. */
  labelPrestige: number;
  /** Prestigio atual do artista/banda. */
  artistPrestige: number;
  /** Popularidade do artista/banda NO pais da MediaOutlet. */
  localArtistPopularity: number;
}

/** Pontuacao combinada da candidatura (nenhum atributo decide sozinho). */
export function bookingScore(candidate: BookingCandidate): number {
  return (
    candidate.labelPrestige * WEIGHT_LABEL_PRESTIGE +
    candidate.artistPrestige * WEIGHT_ARTIST_PRESTIGE +
    candidate.localArtistPopularity * WEIGHT_LOCAL_POPULARITY
  );
}

/**
 * Exigencia de agendamento derivada do prestigio da MediaOutlet.
 * `20 + prestige * 0.70` (usar o prestigio direto tornaria veiculos de topo
 * praticamente inacessiveis).
 */
export function requiredBookingScore(outlet: MediaOutlet): number {
  return REQUIRED_SCORE_BASE + outlet.prestige * REQUIRED_SCORE_PRESTIGE_FACTOR;
}

/** Indica se a candidatura alcanca a exigencia do veiculo. */
export function meetsBookingRequirement(outlet: MediaOutlet, candidate: BookingCandidate): boolean {
  return bookingScore(candidate) >= requiredBookingScore(outlet);
}

/** Indica se a MediaOutlet esta em operacao em um dado ano. */
export function isMediaOutletActive(outlet: MediaOutlet, currentYear: number): boolean {
  if (outlet.status !== "Active") {
    return false;
  }
  if (currentYear < outlet.activeFromYear) {
    return false;
  }
  if (outlet.activeToYear !== null && currentYear > outlet.activeToYear) {
    return false;
  }
  return true;
}

/** Vagas restantes de uma edicao (derivado, nunca armazenado). */
export function availableSlots(edition: MediaEdition): number {
  return edition.capacity - edition.bookingIds.length;
}

/**
 * Indica se ainda e possivel reservar para uma edicao, dada a antecedencia
 * minima. A janela fecha quando faltam menos que `bookingLeadDays` dias.
 * @param daysUntilEdition Dias entre a data atual e a data da edicao.
 */
export function isBookingWindowOpen(outlet: MediaOutlet, daysUntilEdition: number): boolean {
  return daysUntilEdition >= outlet.bookingRules.bookingLeadDays;
}

/**
 * Valida as regras estruturais minimas de uma MediaOutlet.
 * @returns Lista de violacoes (vazia se valida).
 */
export function validateMediaOutlet(outlet: MediaOutlet): string[] {
  const errors: string[] = [];
  const checkRange = (value: number, label: string): void => {
    if (value < ATTR_MIN || value > ATTR_MAX) {
      errors.push(`${label} fora de [${ATTR_MIN}, ${ATTR_MAX}]`);
    }
  };

  if (outlet.type !== "MediaOutlet") {
    errors.push("type deve ser 'MediaOutlet'");
  }
  if (!outlet.id.startsWith(ID_PREFIX)) {
    errors.push(`id deve comecar com '${ID_PREFIX}'`);
  }
  if (outlet.name.length === 0) {
    errors.push("name vazio");
  }
  if (outlet.countryId.length === 0) {
    errors.push("countryId vazio");
  }
  if (outlet.activeFromYear <= 0) {
    errors.push("activeFromYear invalido");
  }
  if (outlet.activeToYear !== null && outlet.activeToYear < outlet.activeFromYear) {
    errors.push("activeToYear anterior a activeFromYear");
  }
  checkRange(outlet.prestige, "prestige");
  checkRange(outlet.audienceReach, "audienceReach");
  if (outlet.editionCapacity <= 0) {
    errors.push("editionCapacity deve ser > 0");
  }
  if (outlet.bookingRules.bookingLeadDays < 0) {
    errors.push("bookingLeadDays deve ser >= 0");
  }
  if (outlet.appearanceTypes.length === 0) {
    errors.push("appearanceTypes vazio");
  }
  if (outlet.supportedEntityTypes.length === 0) {
    errors.push("supportedEntityTypes vazio");
  }
  return errors;
}
