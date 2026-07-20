import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Genero musical da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/genres`. Conforme a decisao
 * 0005, `Genre` e a fonte unica de generos: Artist, Song e Album referenciam por
 * `genreIds`, sem duplicar nomes. O ID tecnico e padronizado em ingles
 * (`genre_rock`); `name` guarda o nome apresentado ao jogador em portugues.
 *
 * `Genre` guarda apenas dados estruturais e historicos relativamente estaveis.
 * Popularidade, demanda e apelo comercial sao ESTADOS DINAMICOS DO MERCADO
 * (variam por pais, periodo, midia e eventos da simulacao) e nunca sao
 * armazenados aqui — pertencem ao futuro sistema de mercado/tendencias
 * (decisao 0005).
 */
export interface Genre extends Entity {
  readonly type: "Genre";

  /** Nome apresentado ao jogador (em portugues), ex.: `Música Romântica`. */
  name: string;
  /** Slug tecnico em minusculas, ex.: `mpb`. */
  slug: string;

  /**
   * Pais de origem do genero (referencia a `Country`), ou `null` quando a
   * origem e difusa/nao modelada (ex.: generos com raiz em varios paises ou
   * anteriores ao conjunto de paises da simulacao). Ver decisao 0011.
   */
  countryOfOriginId: EntityId | null;

  /** Genero-pai, ou `null` se este for um genero principal (referencia a `Genre`). */
  parentGenreId: EntityId | null;
  /** Subgeneros derivados (referencias a `Genre`). */
  subgenreIds: EntityId[];

  /** Instrumentos tipicos do estilo (texto livre, uso de UI/sabor). */
  typicalInstruments: string[];

  /** Ano em que o genero surgiu. */
  activeFromYear: number;
  /** Ano em que deixou de ser ativo, ou `null` se ainda ativo. */
  activeToYear: number | null;
}
