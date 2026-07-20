import type { Venue, VenueStageSize, VenueEventType } from "../entities/Venue.js";

/**
 * Regras de comportamento de `Venue` (lado sistema).
 *
 * A entidade guarda apenas caracteristicas permanentes; estas funcoes derivam
 * decisoes (disponibilidade, adequacao de palco, validacao estrutural) a partir
 * delas. Ver `docs/03_Entities/Venue.md`.
 */

/** Ordem numerica interna dos tamanhos de palco (para comparacao). */
export const STAGE_SIZE_ORDER: Record<VenueStageSize, number> = {
  Small: 1,
  Medium: 2,
  Large: 3,
  Mega: 4,
};

/** Limites dos atributos [0, 100]. */
const ATTR_MIN = 0;
const ATTR_MAX = 100;

/** Indica se o venue comporta uma producao do tamanho `required`. */
export function canHostStageSize(venue: Venue, required: VenueStageSize): boolean {
  return STAGE_SIZE_ORDER[required] <= STAGE_SIZE_ORDER[venue.stage.maxStageSize];
}

/** Indica se o venue aceita um tipo de evento. */
export function venueAllowsEvent(venue: Venue, eventType: VenueEventType): boolean {
  return venue.allowedEventTypes.includes(eventType);
}

/**
 * Disponibilidade do venue em um dado ano: precisa estar ativo e dentro do
 * periodo de operacao (`openedYear` .. `closedYear`).
 */
export function isVenueAvailable(venue: Venue, currentYear: number): boolean {
  if (!venue.active) {
    return false;
  }
  if (currentYear < venue.openedYear) {
    return false;
  }
  if (venue.closedYear !== null && currentYear > venue.closedYear) {
    return false;
  }
  return true;
}

/**
 * Valida as regras estruturais minimas de um venue (spec da entidade).
 * @returns Lista de violacoes (vazia se o venue e valido).
 */
export function validateVenue(venue: Venue): string[] {
  const errors: string[] = [];
  const checkRange = (value: number, label: string): void => {
    if (value < ATTR_MIN || value > ATTR_MAX) {
      errors.push(`${label} fora de [${ATTR_MIN}, ${ATTR_MAX}]`);
    }
  };

  if (venue.type !== "Venue") {
    errors.push("type deve ser 'Venue'");
  }
  if (!venue.id.startsWith("venue_")) {
    errors.push("id deve comecar com 'venue_'");
  }
  if (venue.name.length === 0) {
    errors.push("name vazio");
  }
  if (venue.countryId.length === 0) {
    errors.push("countryId vazio");
  }
  if (venue.city.length === 0) {
    errors.push("city vazia");
  }
  if (venue.openedYear <= 0) {
    errors.push("openedYear invalido");
  }
  if (venue.closedYear !== null && venue.closedYear < venue.openedYear) {
    errors.push("closedYear anterior a openedYear");
  }
  if (venue.capacity.concert <= 0) {
    errors.push("capacity.concert deve ser > 0");
  }
  if (venue.capacity.seatedConcert <= 0) {
    errors.push("capacity.seatedConcert deve ser > 0");
  }
  if (venue.capacity.seatedConcert > venue.capacity.concert) {
    errors.push("capacity.seatedConcert maior que capacity.concert");
  }
  checkRange(venue.facilities, "facilities");
  checkRange(venue.stage.acousticQuality, "stage.acousticQuality");
  checkRange(venue.marketImportance, "marketImportance");
  checkRange(venue.prestige, "prestige");
  checkRange(venue.operatingCost, "operatingCost");
  checkRange(venue.bookingDifficulty, "bookingDifficulty");
  if (venue.defaultTicketPriceMultiplier <= 0) {
    errors.push("defaultTicketPriceMultiplier deve ser > 0");
  }
  return errors;
}
