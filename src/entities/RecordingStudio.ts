import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Estudio profissional onde musicas podem ser gravadas, mixadas ou masterizadas.
 *
 * Contrato de dados que espelha os JSON de `database/studios`. Guarda apenas
 * caracteristicas PERMANENTES do estudio. Disponibilidade, reservas e ocupacao
 * sao estados dinamicos do futuro sistema de sessoes (`RecordingSession`), nao
 * desta entidade. `quality` representa o POTENCIAL do estudio e nao muda a cada
 * gravacao. Ver `docs/03_Entities/RecordingStudio.md` e a decisao 0016.
 */
export interface RecordingStudio extends Entity {
  readonly type: "RecordingStudio";

  /** Nome comercial do estudio. */
  name: string;

  /** Cidade, estado e mercado (pais) ao qual pertence. */
  location: StudioLocation;

  /** Ano em que o estudio comeca a operar. */
  activeFromYear: number;
  /** Ano de encerramento permanente, ou `null` se ainda ativo. */
  activeToYear: number | null;

  /** Qualidade tecnica geral (potencial) [0, 100]. */
  quality: number;
  /** Estrutura, conforto e capacidade operacional [0, 100]. */
  facilities: number;
  /** Reputacao do estudio na industria [0, 100]. */
  prestige: number;

  technology: StudioTechnology;

  /** Etapas de producao disponiveis. */
  services: StudioService[];

  /** Custo-base por dia de utilizacao (valor de 2005; pode variar na simulacao). */
  dailyCost: StudioDailyCost;

  /**
   * Gravadora proprietaria, apenas quando o estudio pertence a uma `Label`
   * (referencia a `Label`). Ausente/`null` para estudios independentes.
   */
  ownerLabelId?: EntityId | null;
}

/** Localizacao do estudio. */
export interface StudioLocation {
  city: string;
  /** Estado/provincia, ou `null` quando nao aplicavel. */
  state: string | null;
  /** Mercado ao qual pertence (referencia a `Country`). */
  countryId: EntityId;
}

/** Base tecnologica do estudio. */
export type StudioTechnology = "Analog" | "Digital" | "Hybrid";

/** Etapa de producao oferecida pelo estudio. */
export type StudioService = "Recording" | "Mixing" | "Mastering";

/** Custo-base por dia de utilizacao. */
export interface StudioDailyCost {
  /** Valor-base (> 0). */
  amount: number;
  /** Moeda, ex.: `BRL`. */
  currency: string;
}
