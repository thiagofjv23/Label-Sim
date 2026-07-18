import type { Song } from "../entities/Song.js";
import type { Album } from "../entities/Album.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Resolve o tema EFETIVO de uma musica.
 *
 * Regra (decisao 0007): o tema do album, quando definido, vale para todas as
 * suas musicas e prevalece sobre o tema proprio da musica. Se o album nao tem
 * tema (ou a musica e um single sem album), usa-se o `themeId` da propria Song.
 *
 * O tema efetivo e sempre DERIVADO — nunca duplicado no dado da Song — em linha
 * com o principio "identidade estatica vs resultado" (decisao 0004).
 *
 * @param song Musica cujo tema se quer resolver.
 * @param album Album ao qual a musica pertence, ou `null` se avulsa.
 * @returns O `themeId` efetivo, ou `null` se nenhum tema se aplica.
 */
export function resolveEffectiveThemeId(song: Song, album: Album | null): EntityId | null {
  if (album !== null && album.themeId !== null) {
    return album.themeId;
  }
  return song.themeId;
}
