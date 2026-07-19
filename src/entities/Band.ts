import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Banda musical da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/bands`. A banda referencia
 * seus integrantes (entidades `Artist`) por ID, com funcao e periodo de
 * participacao; mantem tambem o historico de ex-integrantes. Segue as diretrizes
 * gerais: generos por `genreIds` (decisao 0005) e gravadora ATUAL em
 * `currentLabelId` (decisao 0003).
 */
export interface Band extends Entity {
  readonly type: "Band";

  name: string;

  /** Pais de origem da banda (referencia a `Country`). */
  countryId: EntityId;

  /** Data de formacao em formato ISO `AAAA-MM-DD`. */
  formationDate: string;
  /** Data de encerramento, ou `null` se ainda ativa. */
  endDate: string | null;

  /** Situacao da carreira: `Active`, `Hiatus` ou `Disbanded`. */
  careerStatus: string;

  /** Gravadora atual da banda, ou `null` (referencia a `Label`). */
  currentLabelId: EntityId | null;
  /** Empresario responsavel, ou `null` (referencia a `Manager`). */
  managerId: EntityId | null;

  /** Generos da banda (referencias a `Genre`). */
  genreIds: EntityId[];

  /** Integrantes atuais. */
  members: BandMember[];
  /** Historico de ex-integrantes. */
  formerMembers: BandMember[];

  /** Albuns lancados pela banda (referencias a `Album`). */
  albumIds: EntityId[];
}

/**
 * Vinculo de um integrante com a banda: quem, em que funcao e por qual periodo.
 * A identidade do musico vive na entidade `Artist`; aqui guarda-se apenas a
 * referencia e os dados do vinculo.
 */
export interface BandMember {
  /** Musico (referencia a `Artist`). */
  artistId: EntityId;
  /** Funcao na banda, ex.: `Bass`, `Drums`, `Vocals/Keyboards`. */
  role: string;
  /** Inicio da participacao em formato ISO `AAAA-MM-DD`. */
  startDate: string;
  /** Fim da participacao, ou `null` se ainda ativo. */
  endDate: string | null;
}
