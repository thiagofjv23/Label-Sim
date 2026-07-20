# 0002 — Padronização de ID de Gênero (inglês)

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

A Song referenciava `genre_romantico` enquanto o Album referenciava
`genre_romantic` — duas grafias para o mesmo gênero. Sem padronização, as
referências nunca casariam entre si nem com uma futura entidade `Genre`.

## Decisão

O ID técnico de gênero usa **nomenclatura padronizada em inglês**. O gênero de
música romântica é `genre_romantic`.

A referência da Song foi alterada de `genre_romantico` para `genre_romantic`.

O **nome apresentado ao jogador** (em português) mora na entidade `Genre`, no
campo `name`, e não é duplicado nas demais entidades:

```json
{
  "id": "genre_romantic",
  "type": "Genre",
  "name": "Música Romântica"
}
```

## Consequências

- O ID técnico permanece estável e único; a localização do nome é feita em
  `Genre.name`, sem alterar referências internas.
- Artist, Song e Album referenciam gêneros exclusivamente por `genreIds`.
- Detalhamento da entidade em 0005 (Genre como entidade).

## Atualização (0007)

O termo `romantic` **não** é um gênero, e sim um **tema** — foi remodelado como
entidade `Theme` (`theme_romantic`) na decisão 0007. `genre_romantic` deixou de
existir. A regra geral desta decisão (ID de gênero em inglês, nome PT em
`Genre.name`) permanece válida para os gêneros de fato.
