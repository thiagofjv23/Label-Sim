import { describe, it, expect } from "vitest";
import { resolveEffectiveThemeId } from "../src/simulation/resolveTheme.js";
import type { Song } from "../src/entities/Song.js";
import type { Album } from "../src/entities/Album.js";

/** Cria uma Song minima com o `themeId` desejado. */
function makeSong(themeId: Song["themeId"], albumId: Song["albumId"] = null): Song {
  return {
    id: "song_x",
    type: "Song",
    title: "X",
    artistId: "artist_x",
    albumId,
    writers: [],
    performers: [],
    genreIds: [],
    themeId,
    language: "Portuguese",
    releaseDate: "1990-01-01",
    ratings: {
      composition: 0,
      lyrics: 0,
      melody: 0,
      arrangement: 0,
      production: 0,
      commercialAppeal: 0,
      radioAppeal: 0,
      liveAppeal: 0,
      originality: 0,
      longevity: 0,
    },
    commercial: { isSingle: false, marketingWeight: 0, initialBuzz: 0 },
    status: { released: true, banned: false, remastered: false },
    metadata: { bpm: 100, key: "C", explicit: false },
  };
}

/** Cria um Album minimo com o `themeId` desejado. */
function makeAlbum(themeId: Album["themeId"]): Album {
  return {
    id: "album_x",
    type: "Album",
    name: "X",
    officialName: "X",
    artistId: "artist_x",
    bandId: null,
    albumType: "studio",
    releaseDate: "1990-01-01",
    countryId: "country_x",
    labelId: "label_x",
    genreIds: [],
    themeId,
    language: "pt-BR",
    songIds: ["song_x"],
    status: "released",
  };
}

describe("resolveEffectiveThemeId", () => {
  it("usa o tema do album quando ele esta definido (prevalece sobre o da musica)", () => {
    const song = makeSong("theme_romantic", "album_x");
    const album = makeAlbum("theme_summer");
    expect(resolveEffectiveThemeId(song, album)).toBe("theme_summer");
  });

  it("usa o tema da musica quando o album nao tem tema", () => {
    const song = makeSong("theme_romantic", "album_x");
    const album = makeAlbum(null);
    expect(resolveEffectiveThemeId(song, album)).toBe("theme_romantic");
  });

  it("usa o tema da musica quando ela e um single sem album", () => {
    const song = makeSong("theme_romantic", null);
    expect(resolveEffectiveThemeId(song, null)).toBe("theme_romantic");
  });

  it("retorna null quando nem album nem musica tem tema", () => {
    const song = makeSong(null, "album_x");
    const album = makeAlbum(null);
    expect(resolveEffectiveThemeId(song, album)).toBeNull();
  });
});
