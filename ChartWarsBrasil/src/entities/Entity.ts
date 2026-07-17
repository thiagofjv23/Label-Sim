import type { EntityId } from "../utils/IdFactory.js";

/**
 * Base minima de toda entidade da simulacao.
 *
 * Seguindo a diretriz de "preferir composicao a heranca", entidades sao dados
 * simples (POJOs). Comportamento vive nos sistemas ({@link System}), nao aqui.
 * O unico contrato obrigatorio e possuir um {@link EntityId} unico e um `type`
 * que identifica a familia da entidade (o mesmo prefixo usado no ID).
 */
export interface Entity {
  /** Identificador unico, ex.: `artist_000001`. */
  readonly id: EntityId;
  /** Tipo/familia da entidade, ex.: `artist`, `song`, `label`. */
  readonly type: string;
}
