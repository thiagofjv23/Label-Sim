import type { Country } from "../entities/Country.js";

/**
 * Resolucao de nacionalidade (ISO) para o pais de MERCADO/CHART.
 *
 * Alguns paises reais nao sao simulados individualmente: eles sao AGREGADOS por
 * um pais agregador (ex.: `country_western_europe`, cujo `includedCountries`
 * lista `FRA`, `DEU`, ...). A nacionalidade do artista preserva o pais real
 * (ISO), mas charts, mercado e exibicao usam o pais simulado que o cobre:
 *
 *   - se algum pais simulado tem esse `isoCode` -> ele proprio (ex.: `BRA` -> Brasil);
 *   - senao, o agregador cujo `includedCountries` inclui o ISO (ex.: `FRA` -> Western Europe).
 *
 * Ver decisao 0014.
 */

/** Um pais e agregador quando lista paises em `includedCountries`. */
export function isAggregatorCountry(country: Country): boolean {
  return (country.includedCountries?.length ?? 0) > 0;
}

/**
 * Resolve o pais de mercado/chart para uma nacionalidade (ISO alpha-3).
 * @param nationalityIso Codigo ISO da nacionalidade (ex.: `FRA`, `BRA`).
 * @param countries Paises simulados disponiveis.
 * @returns O pais simulado que cobre a nacionalidade, ou `undefined` se nenhum.
 */
export function resolveMarketCountry(
  nationalityIso: string,
  countries: readonly Country[],
): Country | undefined {
  // 1. Pais simulado individualmente com esse ISO.
  const standalone = countries.find((c) => c.isoCode === nationalityIso);
  if (standalone !== undefined) {
    return standalone;
  }
  // 2. Agregador que inclui esse ISO.
  return countries.find((c) => (c.includedCountries ?? []).includes(nationalityIso));
}

/** Como {@link resolveMarketCountry}, mas retorna apenas o ID (ou `undefined`). */
export function resolveMarketCountryId(
  nationalityIso: string,
  countries: readonly Country[],
): string | undefined {
  return resolveMarketCountry(nationalityIso, countries)?.id;
}
