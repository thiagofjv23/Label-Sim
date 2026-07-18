import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Artista da simulacao (solo ou membro de banda).
 *
 * Contrato de dados que espelha os JSON de `database/artists`. Os campos de
 * dominio sao mutaveis: sistemas ({@link System}) evoluem popularidade, fanbase
 * etc. a cada tick. Apenas `id` e `type` sao imutaveis (herdados de Entity).
 */
export interface Artist extends Entity {
  readonly type: "Artist";

  name: string;
  stageName: string;

  /** Data de nascimento em formato ISO `AAAA-MM-DD`. */
  birthDate: string;
  birthPlace: PlaceOfBirth;

  gender: string;

  careerStatus: string;
  careerStart: number;
  /** Ano de encerramento da carreira, ou `null` se ainda ativa. */
  careerEnd: number | null;

  artistType: string;

  /**
   * Gravadora ATUAL do artista na data presente da simulacao, ou `null` se
   * independente/sem contrato. Nao confundir com `Album.labelId`, que registra
   * a gravadora do lancamento no momento historico. Ver
   * `docs/decisions/0003-gravadora-historica-vs-atual.md`.
   */
  currentLabelId: EntityId | null;
  /** Empresario atual, ou `null` se nenhum. */
  managerId: EntityId | null;

  genres: string[];

  skills: ArtistSkills;
  commercial: ArtistCommercial;
  fanbase: ArtistFanbase;
  careerStats: ArtistCareerStats;
  relationships: ArtistRelationships;
  flags: ArtistFlags;
}

/** Local de nascimento do artista. */
export interface PlaceOfBirth {
  city: string;
  state: string;
  country: string;
}

/** Habilidades artisticas, cada uma no intervalo [0, 100]. */
export interface ArtistSkills {
  composition: number;
  vocals: number;
  livePerformance: number;
  musicianship: number;
  charisma: number;
}

/** Atributos comerciais, cada um no intervalo [0, 100]. */
export interface ArtistCommercial {
  popularity: number;
  prestige: number;
  marketingPower: number;
  mediaAppeal: number;
  fanLoyalty: number;
}

/** Base de fas do artista. */
export interface ArtistFanbase {
  size: number;
  /** Tendencia de crescimento, ex.: `Growing`, `Stable`, `Declining`. */
  growth: string;
  averageAge: number;
}

/** Estatisticas acumuladas de carreira. */
export interface ArtistCareerStats {
  albumsReleased: number;
  songsReleased: number;
  concertsPerformed: number;
  awards: number;
}

/** Relacionamentos do artista com outras entidades. */
export interface ArtistRelationships {
  bands: EntityId[];
  producers: EntityId[];
  collaborators: EntityId[];
}

/** Sinalizadores de estado do artista. */
export interface ArtistFlags {
  isLegend: boolean;
  isHallOfFame: boolean;
  retired: boolean;
}
