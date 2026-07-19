# 0009 — Autoria de Album: artista OU banda

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

`Album` referenciava o autor apenas por `artistId` (`Artist`). Ao modelar os
Titãs, surgiu um álbum de **banda** (`album_titas_como_estao_voces_2003`), que
não tem um artista solo como autor. O modelo precisava acomodar autoria por
banda.

## Decisão

Um álbum é de um artista solo **ou** de uma banda. A `Album` passa a ter:

- `artistId: EntityId | null` — preenchido para álbuns de artista solo;
- `bandId: EntityId | null` — preenchido para álbuns de banda.

**Exatamente um** dos dois é não-nulo. A validação de referências checa cada um
contra seu tipo (`Artist` / `Band`); campos nulos são ignorados.

## Consequências

- `src/entities/Album.ts`: `artistId` passa a ser anulável; adicionado `bandId`.
- `database/albums/…Detalhes….json`: `bandId: null` (autoria solo — Roberto Carlos).
- `database/albums/…Como Estão Vocês….json`: `artistId: null`, `bandId: band_titas`.
- `validateReferences`: `Album.bandId → Band`.

## ToDo futuro

- Regra "exatamente um de artistId/bandId" hoje é convenção documentada; poderia
  ser reforçada por uma validação estrutural dedicada (além da referencial).
- Colaborações (álbum de artista + banda, ou múltiplos artistas) não são cobertas;
  avaliar quando surgir o caso.
