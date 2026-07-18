import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Musica da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/songs`. Referencia
 * artistas, album e generos por ID.
 */
export interface Song extends Entity {
  readonly type: "Song";

  title: string;

  /** Artista principal creditado. */
  artistId: EntityId;
  /** Album ao qual pertence, ou `null` se single avulso. */
  albumId: EntityId | null;

  /** Compositores (podem incluir artistas nao performaticos). */
  writers: EntityId[];
  /** Interpretes creditados na gravacao. */
  performers: EntityId[];

  genreIds: EntityId[];

  /**
   * Tema proprio da musica (referencia a `Theme`), ou `null`. Regra de tema
   * efetivo: se o album da musica tiver `themeId`, ele prevalece sobre este;
   * caso contrario, vale este. Ver `resolveEffectiveThemeId` e a decisao 0007.
   */
  themeId: EntityId | null;

  language: string;

  /** Data de lancamento em formato ISO `AAAA-MM-DD`. */
  releaseDate: string;

  ratings: SongRatings;
  commercial: SongCommercial;
  status: SongStatus;
  metadata: SongMetadata;
}

/** Notas qualitativas da musica, cada uma no intervalo [0, 100]. */
export interface SongRatings {
  composition: number;
  lyrics: number;
  melody: number;
  arrangement: number;
  production: number;
  commercialAppeal: number;
  radioAppeal: number;
  liveAppeal: number;
  originality: number;
  longevity: number;
}

/** Atributos comerciais no lancamento. */
export interface SongCommercial {
  isSingle: boolean;
  /** Peso de marketing no intervalo [0, 100]. */
  marketingWeight: number;
  /** Expectativa inicial no intervalo [0, 100]. */
  initialBuzz: number;
}

/** Estado de publicacao da musica. */
export interface SongStatus {
  released: boolean;
  banned: boolean;
  remastered: boolean;
}

/** Metadados tecnicos da faixa. */
export interface SongMetadata {
  bpm: number;
  key: string;
  explicit: boolean;
}
