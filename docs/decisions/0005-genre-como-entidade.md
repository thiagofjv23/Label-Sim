# 0005 — Genre como entidade

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

Gêneros apareciam de formas divergentes: `Artist.genres` e `Country.genreAffinity`
usam **nomes** (strings), enquanto `Song.genreIds` e `Album.genreIds` usam
**referências**. Grafias divergiam (`genre_romantico` vs. `genre_romantic`). Sem
uma entidade única, os nomes se duplicam e as tendências de mercado não têm onde
morar.

## Decisão

`Genre` será uma **entidade** de primeira classe:

- Artist, Song e Album referenciam gêneros **exclusivamente por `genreIds`**;
- nomes de gêneros **não** devem ser duplicados nessas entidades;
- IDs técnicos usam a nomenclatura padronizada em **inglês** (ver 0002),
  ex.: `genre_romantic`, `genre_mpb`;
- `Genre.name` armazena o nome apresentado ao jogador em **português**;
- a **popularidade do gênero por país/mercado NÃO** é armazenada em `Genre`,
  pois varia por local e período histórico.

Exemplo:

```json
{
  "id": "genre_romantic",
  "type": "Genre",
  "name": "Música Romântica"
}
```

## Consequências

- `Artist.genres` (strings) deverá migrar para `genreIds` quando os gêneros
  forem criados (pendência de modelagem do Artist).
- `Country.genreAffinity` (mapa por nome) é, na prática, **popularidade/afinidade
  de gênero por mercado** — deve migrar para chaves por `genreId` e, conforme
  esta decisão, essa dimensão pertence a um futuro sistema de **tendências de
  mercado**, não à entidade `Genre`.

## ToDo pendente — Popularidade/tendências por mercado

Não implementar agora. Registrar como pendência para a futura entidade ou sistema
responsável por tendências de mercado: a popularidade de cada gênero varia por
país e por período histórico e deve ser processada por esse sistema, lendo
`Genre` e `Country` por referência.

## Reconciliação encerrada — caminho (B)

O exemplo `genre_mpb` havia introduzido `popularity` (`global` + `brazil`) e
`commercialAppeal` dentro de `Genre`. Decisão tomada: **caminho (B)**.

> «Popularidade, demanda e apelo comercial de gêneros são estados dinâmicos do
> mercado e nunca devem ser armazenados diretamente em "Genre".»

Esses valores variam conforme país, período histórico, mídia e acontecimentos da
simulação. Portanto, pertencem ao **futuro sistema de mercado/tendências**, que
lerá `Genre` e `Country` por referência.

A entidade `Genre` armazena apenas dados **estruturais e históricos relativamente
estáveis**:

`id`, `type`, `name`, `slug`, `countryOfOriginId`, `parentGenreId`,
`subgenreIds`, `description`, `typicalInstruments`, `activeFromYear`,
`activeToYear`.

Os campos `popularity` e `commercialAppeal` foram removidos do JSON de exemplo e
do contrato `src/entities/Genre.ts`.
