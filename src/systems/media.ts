import { GameDate } from "../engine/time/GameDate.js";
import type {
  MediaOutlet,
  MediaEdition,
  MediaBooking,
  MediaSupportedEntity,
  MediaAppearanceType,
  WeekDay,
} from "../entities/MediaOutlet.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Sistema de midia (lado sistema).
 *
 * A `MediaOutlet` guarda caracteristicas permanentes; este modulo deriva:
 *   - a agenda de `MediaEdition` (a partir de `availability`);
 *   - a avaliacao de uma reserva (`MediaBooking`) por pontuacao combinada.
 * Nada disso e armazenado na entidade permanente (principio 0004). Ver
 * `docs/03_Entities/MediaOutlet.md`.
 */

/** Limites dos atributos [0, 100]. */
const ATTR_MIN = 0;
const ATTR_MAX = 100;
/** Prefixo de ID exigido. */
const ID_PREFIX = "media_";

/**
 * Antecedencia minima (dias) para reservar uma vaga — UNIFORME para todas as
 * MediaOutlets (clareza ao jogador; decisao 0017). Passado esse prazo, a edicao
 * continua visivel, mas nao aceita novas reservas.
 */
export const MEDIA_BOOKING_LEAD_DAYS = 15;

/** Pesos da pontuacao de candidatura (spec). */
const WEIGHT_LABEL_PRESTIGE = 0.3;
const WEIGHT_ARTIST_PRESTIGE = 0.3;
const WEIGHT_LOCAL_POPULARITY = 0.4;

/** Conversao do prestigio da MediaOutlet em exigencia de agendamento (spec). */
const REQUIRED_SCORE_BASE = 20;
const REQUIRED_SCORE_PRESTIGE_FACTOR = 0.7;

/** Nomes de dia da semana indexados por `GameDate.weekday()` (0 = domingo). */
const WEEKDAYS: WeekDay[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ---------------------------------------------------------------------------
// Pontuacao e requisitos de agendamento
// ---------------------------------------------------------------------------

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

/** Exigencia de agendamento derivada do prestigio: `20 + prestige * 0.70`. */
export function requiredBookingScore(outlet: MediaOutlet): number {
  return REQUIRED_SCORE_BASE + outlet.prestige * REQUIRED_SCORE_PRESTIGE_FACTOR;
}

/** Indica se a candidatura alcanca a exigencia do veiculo. */
export function meetsBookingRequirement(outlet: MediaOutlet, candidate: BookingCandidate): boolean {
  return bookingScore(candidate) >= requiredBookingScore(outlet);
}

// ---------------------------------------------------------------------------
// Disponibilidade
// ---------------------------------------------------------------------------

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
 * Indica se ainda e possivel reservar, dada a antecedencia minima uniforme.
 * @param daysUntilEdition Dias entre a data atual e a data da edicao.
 */
export function isBookingWindowOpen(daysUntilEdition: number): boolean {
  return daysUntilEdition >= MEDIA_BOOKING_LEAD_DAYS;
}

// ---------------------------------------------------------------------------
// Geracao de edicoes (agenda)
// ---------------------------------------------------------------------------

/** Indica se ha uma edicao da MediaOutlet na data informada. */
export function isEditionDate(outlet: MediaOutlet, date: GameDate): boolean {
  const { year, month, day } = date.toCalendar();
  if (year < outlet.activeFromYear) {
    return false;
  }
  if (outlet.activeToYear !== null && year > outlet.activeToYear) {
    return false;
  }
  const availability = outlet.availability;
  if (availability.months.length > 0 && !availability.months.includes(month)) {
    return false;
  }
  if (availability.excludedDates.includes(date.toISO())) {
    return false;
  }
  switch (availability.frequency) {
    case "Daily":
      return true;
    case "Weekly":
    case "Biweekly": // aproximado como semanal ate haver ancora de semana
      return availability.weekDays.includes(WEEKDAYS[date.weekday()] as WeekDay);
    case "Monthly":
    case "Quarterly":
    case "Annual":
      return availability.monthDays.includes(day);
    case "Irregular":
      return false;
    default:
      return false;
  }
}

/** ID canonico de uma edicao: `media_edition_<slug>_<AAAA_MM_DD>`. */
export function editionId(outlet: MediaOutlet, date: GameDate): EntityId {
  const slug = outlet.id.replace(new RegExp(`^${ID_PREFIX}`), "");
  return `media_edition_${slug}_${date.toISO().replace(/-/g, "_")}`;
}

/** Cria a entidade de edicao (dinamica) para uma data. */
export function makeEdition(outlet: MediaOutlet, date: GameDate): MediaEdition {
  return {
    id: editionId(outlet, date),
    type: "MediaEdition",
    mediaOutletId: outlet.id,
    date: date.toISO(),
    status: "Open",
    capacity: outlet.editionCapacity,
    bookingIds: [],
  };
}

/**
 * Gera as edicoes da MediaOutlet no intervalo `[from, to]` (inclusive).
 * @returns Edicoes em ordem cronologica.
 */
export function generateEditions(outlet: MediaOutlet, from: GameDate, to: GameDate): MediaEdition[] {
  const editions: MediaEdition[] = [];
  const lastIndex = to.toDayIndex();
  for (let index = from.toDayIndex(); index <= lastIndex; index += 1) {
    const date = GameDate.fromDayIndex(index);
    if (isEditionDate(outlet, date)) {
      editions.push(makeEdition(outlet, date));
    }
  }
  return editions;
}

// ---------------------------------------------------------------------------
// Avaliacao de reserva (fluxo de MediaBooking)
// ---------------------------------------------------------------------------

/** Motivo de recusa de uma reserva. */
export type BookingRejection =
  | "OutletInactive"
  | "EditionFull"
  | "WindowClosed"
  | "UnsupportedParticipant"
  | "AppearanceNotAllowed"
  | "ScoreTooLow";

/** Contexto de uma tentativa de reserva. */
export interface BookingAttempt {
  outlet: MediaOutlet;
  edition: MediaEdition;
  currentYear: number;
  /** Dias entre a data atual e a data da edicao. */
  daysUntilEdition: number;
  participantType: MediaSupportedEntity;
  appearanceType: MediaAppearanceType;
  candidate: BookingCandidate;
}

/** Resultado da avaliacao de uma reserva. */
export interface BookingEvaluation {
  allowed: boolean;
  reasons: BookingRejection[];
}

/**
 * Avalia uma tentativa de reserva contra todas as regras da spec (veiculo ativo,
 * vaga, prazo, tipo de participante, tipo de aparicao, pontuacao combinada).
 */
export function evaluateBooking(attempt: BookingAttempt): BookingEvaluation {
  const reasons: BookingRejection[] = [];
  if (!isMediaOutletActive(attempt.outlet, attempt.currentYear)) {
    reasons.push("OutletInactive");
  }
  if (availableSlots(attempt.edition) <= 0) {
    reasons.push("EditionFull");
  }
  if (!isBookingWindowOpen(attempt.daysUntilEdition)) {
    reasons.push("WindowClosed");
  }
  if (!attempt.outlet.supportedEntityTypes.includes(attempt.participantType)) {
    reasons.push("UnsupportedParticipant");
  }
  if (!attempt.outlet.appearanceTypes.includes(attempt.appearanceType)) {
    reasons.push("AppearanceNotAllowed");
  }
  if (!meetsBookingRequirement(attempt.outlet, attempt.candidate)) {
    reasons.push("ScoreTooLow");
  }
  return { allowed: reasons.length === 0, reasons };
}

/** Cria a entidade de reserva (dinamica) a partir de uma tentativa aprovada. */
export function createBooking(params: {
  edition: MediaEdition;
  labelId: EntityId;
  participantId: EntityId;
  participantType: MediaSupportedEntity;
  appearanceType: MediaAppearanceType;
  promotedEntityType: string | null;
  promotedEntityId: EntityId | null;
  bookingDate: string;
}): MediaBooking {
  const slug = params.edition.id.replace(/^media_edition_/, "");
  return {
    id: `media_booking_${params.participantId}_${slug}`,
    type: "MediaBooking",
    mediaEditionId: params.edition.id,
    labelId: params.labelId,
    participantId: params.participantId,
    participantType: params.participantType,
    appearanceType: params.appearanceType,
    promotedEntityType: params.promotedEntityType,
    promotedEntityId: params.promotedEntityId,
    bookingDate: params.bookingDate,
    status: "Scheduled",
  };
}

// ---------------------------------------------------------------------------
// Validacao estrutural
// ---------------------------------------------------------------------------

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
  if (outlet.appearanceTypes.length === 0) {
    errors.push("appearanceTypes vazio");
  }
  if (outlet.supportedEntityTypes.length === 0) {
    errors.push("supportedEntityTypes vazio");
  }
  return errors;
}
