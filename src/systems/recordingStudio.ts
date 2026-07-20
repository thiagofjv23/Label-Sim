import type { RecordingStudio, StudioService } from "../entities/RecordingStudio.js";

/**
 * Regras de comportamento de `RecordingStudio` (lado sistema).
 *
 * A entidade guarda apenas caracteristicas permanentes; estas funcoes derivam
 * decisoes (disponibilidade por ano, servicos oferecidos, validacao estrutural)
 * a partir delas. Ver `docs/03_Entities/RecordingStudio.md`.
 */

/** Limites dos atributos [0, 100]. */
const ATTR_MIN = 0;
const ATTR_MAX = 100;

/** Prefixo de ID exigido para a entidade. */
const ID_PREFIX = "recording_studio_";

/** Indica se o estudio esta em operacao em um dado ano. */
export function isStudioActive(studio: RecordingStudio, currentYear: number): boolean {
  if (currentYear < studio.activeFromYear) {
    return false;
  }
  if (studio.activeToYear !== null && currentYear > studio.activeToYear) {
    return false;
  }
  return true;
}

/** Indica se o estudio oferece uma etapa de producao. */
export function studioOffersService(studio: RecordingStudio, service: StudioService): boolean {
  return studio.services.includes(service);
}

/**
 * Valida as regras estruturais minimas de um estudio (spec da entidade).
 * @returns Lista de violacoes (vazia se valido).
 */
export function validateRecordingStudio(studio: RecordingStudio): string[] {
  const errors: string[] = [];
  const checkRange = (value: number, label: string): void => {
    if (value < ATTR_MIN || value > ATTR_MAX) {
      errors.push(`${label} fora de [${ATTR_MIN}, ${ATTR_MAX}]`);
    }
  };

  if (studio.type !== "RecordingStudio") {
    errors.push("type deve ser 'RecordingStudio'");
  }
  if (!studio.id.startsWith(ID_PREFIX)) {
    errors.push(`id deve comecar com '${ID_PREFIX}'`);
  }
  if (studio.name.length === 0) {
    errors.push("name vazio");
  }
  if (studio.location.city.length === 0) {
    errors.push("location.city vazia");
  }
  if (studio.location.countryId.length === 0) {
    errors.push("location.countryId vazio");
  }
  if (studio.activeFromYear <= 0) {
    errors.push("activeFromYear invalido");
  }
  if (studio.activeToYear !== null && studio.activeToYear < studio.activeFromYear) {
    errors.push("activeToYear anterior a activeFromYear");
  }
  checkRange(studio.quality, "quality");
  checkRange(studio.facilities, "facilities");
  checkRange(studio.prestige, "prestige");
  if (studio.services.length === 0) {
    errors.push("services vazio");
  }
  if (studio.dailyCost.amount <= 0) {
    errors.push("dailyCost.amount deve ser > 0");
  }
  if (studio.dailyCost.currency.length === 0) {
    errors.push("dailyCost.currency vazia");
  }
  return errors;
}
