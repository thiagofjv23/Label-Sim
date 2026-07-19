import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Album da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/albums`. O `Album`
 * representa a **identidade, a classificacao e as relacoes permanentes** de um
 * lancamento. Resultados dinamicos — vendas, posicao em charts, certificacoes,
 * receita, popularidade — NAO moram aqui; sao calculados pelos sistemas da
 * simulacao. Ver `docs/03_Entities/Album.md`.
 */
export interface Album extends Entity {
  readonly type: "Album";

  /** Nome usado para apresentar o album ao jogador. */
  name: string;
  /** Titulo oficial no lancamento original (pode repetir `name`). */
  officialName: string;

  /**
   * Artista responsavel, quando o album e de um artista solo (referencia a
   * `Artist`), ou `null` se for de uma banda. Exatamente um entre `artistId` e
   * `bandId` e preenchido. Ver `docs/decisions/0009-autoria-album-artista-ou-banda.md`.
   */
  artistId: EntityId | null;

  /** Banda responsavel, quando o album e de uma banda (referencia a `Band`), ou `null`. */
  bandId: EntityId | null;

  albumType: AlbumType;

  /** Data de lancamento em formato ISO `AAAA-MM-DD`. */
  releaseDate: string;

  /** Pais de origem do lancamento (referencia a `Country`). */
  countryId: EntityId;
  /** Gravadora do lancamento (referencia a `Label`). */
  labelId: EntityId;

  /** Generos associados (referencias a `Genre`). */
  genreIds: EntityId[];

  /**
   * Tema do album (referencia a `Theme`), ou `null`. Se definido, aplica-se a
   * TODAS as musicas do album (prevalece sobre o `themeId` de cada Song); se
   * `null`, cada musica define o proprio tema. Ver decisao 0007.
   */
  themeId: EntityId | null;

  /** Idioma predominante, ex.: `pt-BR`. */
  language: string;

  /**
   * Faixas do album, na ordem do lancamento (referencias a `Song`).
   * Cada musica permanece uma entidade `Song` independente.
   */
  songIds: EntityId[];

  status: AlbumStatus;
}

/** Tipo do album. Conjunto inicial recomendado; pode crescer. */
export type AlbumType = "studio" | "live" | "compilation" | "soundtrack" | "remix";

/** Estado do album na simulacao. Conjunto inicial recomendado; pode crescer. */
export type AlbumStatus =
  | "planned"
  | "recording"
  | "completed"
  | "announced"
  | "released"
  | "cancelled";
