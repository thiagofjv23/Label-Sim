import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Genero musical da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/genres`. Conforme a decisao
 * 0005, `Genre` e a fonte unica de generos: Artist, Song e Album referenciam por
 * `genreIds`, sem duplicar nomes. O ID tecnico e padronizado em ingles
 * (`genre_romantic`); `name` guarda o nome apresentado ao jogador em portugues.
 *
 * ATENCAO (reconciliacao pendente com a decisao 0005): `popularity` e
 * `commercialAppeal` sao tratados aqui como caracteristicas ESTRUTURAIS/historicas
 * do estilo (baseline), nao como a popularidade que varia por ano/mercado — esta
 * ultima pertence ao futuro sistema de tendencias de mercado. Ver
 * `docs/03_Entities/Genre.md` e a nota na decisao 0005.
 */
export interface Genre extends Entity {
  readonly type: "Genre";

  /** Nome apresentado ao jogador (em portugues), ex.: `Música Romântica`. */
  name: string;
  /** Slug tecnico em minusculas, ex.: `mpb`. */
  slug: string;

  /** Pais de origem do genero (referencia a `Country`). */
  countryOfOriginId: EntityId;

  /** Genero-pai, ou `null` se este for um genero principal (referencia a `Genre`). */
  parentGenreId: EntityId | null;
  /** Subgeneros derivados (referencias a `Genre`). */
  subgenreIds: EntityId[];

  /** Instrumentos tipicos do estilo (texto livre, uso de UI/sabor). */
  typicalInstruments: string[];

  /**
   * Popularidade ESTRUTURAL (baseline) do genero: `global` e por pais
   * (chave por enquanto textual, ex.: `brazil`). Serve de modificador para
   * sistemas de mercado — nao e a popularidade dinamica de um ano especifico.
   */
  popularity: GenrePopularity;

  /**
   * Potencial comercial medio do estilo por midia (caracteristica historica,
   * nao a performance de um ano especifico).
   */
  commercialAppeal: GenreCommercialAppeal;

  /** Ano em que o genero surgiu. */
  activeFromYear: number;
  /** Ano em que deixou de ser ativo, ou `null` se ainda ativo. */
  activeToYear: number | null;
}

/** Popularidade estrutural [0, 100]: global e por mercado. */
export interface GenrePopularity {
  global: number;
  /** Chaves adicionais por mercado (ex.: `brazil`). */
  [market: string]: number;
}

/** Potencial comercial medio do genero por midia [0, 100]. */
export interface GenreCommercialAppeal {
  radio: number;
  live: number;
  streaming: number;
}
