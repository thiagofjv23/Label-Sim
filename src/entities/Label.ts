import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Gravadora da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/labels`. A gravadora que
 * o jogador dirige e apenas uma entre varias no mercado.
 */
export interface Label extends Entity {
  readonly type: "Label";

  name: string;

  /**
   * Tag da marca-mae, quando a mesma marca opera em varios paises como
   * subsidiarias (ex.: `sony`, `universal`). Gravadoras que compartilham a
   * `brandTag` pertencem ao mesmo grupo. `null`/ausente para marcas isoladas.
   * Base para o futuro sistema de subsidiarias. Ver decisao 0012.
   */
  brandTag?: string | null;

  countryId: EntityId;

  foundationYear: number;

  status: string;

  ratings: LabelRatings;
  commercial: LabelCommercial;
  catalog: LabelCatalog;
  relationships: LabelRelationships;
  flags: LabelFlags;
}

/** Reputacao e capacidades da gravadora, cada uma no intervalo [0, 100]. */
export interface LabelRatings {
  reputation: number;
  marketing: number;
  distribution: number;
  artistDevelopment: number;
  financialPower: number;
  industryInfluence: number;
}

/** Situacao comercial da gravadora. */
export interface LabelCommercial {
  /** Caixa disponivel na moeda da simulacao. */
  budget: number;
  /** Participacao de mercado em pontos percentuais [0, 100]. */
  marketShare: number;
  activeArtists: number;
  activeContracts: number;
}

/** Catalogo acumulado da gravadora. */
export interface LabelCatalog {
  songs: number;
  albums: number;
}

/** Relacionamentos da gravadora com outras entidades. */
export interface LabelRelationships {
  artists: EntityId[];
  bands: EntityId[];
  producers: EntityId[];
}

/** Sinalizadores de estado da gravadora. */
export interface LabelFlags {
  majorLabel: boolean;
  acceptsDemos: boolean;
}
