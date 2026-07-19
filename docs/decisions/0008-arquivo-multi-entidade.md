# 0008 — Arquivo de dados pode conter uma entidade ou um array

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

Até aqui a convenção era "uma entidade por arquivo JSON". Ao adicionar Erasmo
Carlos no mesmo arquivo de Roberto Carlos, surgiu a necessidade de agrupar
entidades relacionadas em um único arquivo. Dois objetos JSON concatenados são
**JSON inválido**, então o formato precisava ser definido.

## Decisão

Um arquivo em `database/**/*.json` pode conter:

- **uma entidade** — um objeto JSON no topo; ou
- **várias entidades** — um **array** JSON de objetos.

O `SeedLoader` aceita ambos: se o topo é array, todas as entidades são
carregadas; caso contrário, o objeto único é carregado. A carga permanece
determinística (ordenação por `id` após a leitura).

Cada entidade continua exigindo `id` e `type`; IDs duplicados continuam sendo
rejeitados por `World.add`.

## Consequências

- `src/simulation/SeedLoader.ts`: `parseEntity` → `parseEntities` (retorna lista;
  `readEntitiesFromDir` usa `flatMap`).
- O arquivo de exemplo foi convertido em array e **renomeado** para refletir o
  conteúdo agrupado:
  `database/artists/Artistas Exemplo - Roberto e Erasmo Carlos.json`.
- Ao agrupar, o **nome do arquivo** deve descrever o grupo (não um único
  integrante), para não enganar quem procura pela entidade.
- Correções aplicadas no mesmo passo: removida vírgula sobrante em `genres` e
  unidos os dois objetos em um array válido.
