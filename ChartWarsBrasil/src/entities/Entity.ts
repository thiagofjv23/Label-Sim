import type { EntityId } from "../utils/IdFactory.js";

/**
 * Base minima de toda entidade da simulacao.
 *
 * Seguindo a diretriz de "preferir composicao a heranca", entidades sao dados
 * simples (POJOs). Comportamento vive nos sistemas ({@link System}), nao aqui.
 * O unico contrato obrigatorio e possuir um {@link EntityId} unico e um `type`.
 *
 * Convencao de nomes:
 * - `type` e o nome do dominio em PascalCase, ex.: `Artist`, `Song`, `Label`.
 * - o `id` carrega o prefixo da familia em minusculas, ex.: `artist_...`.
 *   IDs de dados semente sao slugs legiveis (`artist_roberto_carlos`); IDs
 *   gerados em tempo de execucao usam contador ({@link IdFactory}, `artist_000001`).
 *   Os dois formatos nunca colidem.
 */
export interface Entity {
  /** Identificador unico, ex.: `artist_roberto_carlos` ou `artist_000001`. */
  readonly id: EntityId;
  /** Tipo/dominio da entidade em PascalCase, ex.: `Artist`, `Song`, `Label`. */
  readonly type: string;
}
