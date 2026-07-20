import type { Entity } from "./Entity.js";

/**
 * Tema de uma musica/album.
 *
 * Tema e distinto de genero: uma cancao tem um genero (ex.: MPB) e um tema
 * (ex.: romantico, verao). Contrato de dados que espelha os JSON de
 * `database/themes`. Como `Genre`, e a fonte unica de temas: Song e Album
 * referenciam por `themeId`, sem duplicar nomes. Ver
 * `docs/decisions/0007-theme-como-entidade.md`.
 *
 * `Theme` guarda apenas dados estruturais. Qualquer popularidade/demanda de tema
 * e estado dinamico de mercado e nao mora aqui (mesmo principio da decisao 0005).
 */
export interface Theme extends Entity {
  readonly type: "Theme";

  /** Nome apresentado ao jogador (em portugues), ex.: `Romântico`. */
  name: string;
  /** Slug tecnico em ingles, ex.: `romantic`. */
  slug: string;
}
