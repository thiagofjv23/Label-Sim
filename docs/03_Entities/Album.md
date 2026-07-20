# Entidade: Album

Arquivo de dados: `database/albums/` — exemplo: `Album Example - Detalhes (Roberto Carlos).json`.
Contrato TypeScript: `src/entities/Album.ts`.

A entidade **Album** armazena a identidade, a classificacao e as relacoes
permanentes de um lancamento. Vendas, charts, certificacoes, receitas e
popularidade sao calculados e registrados pelos respectivos sistemas da
simulacao — nao pela entidade.

## Campos

| Campo | Exemplo | Descricao |
|-------|---------|-----------|
| `id` | `album_roberto_carlos_detalhes_1971` | Identificador unico e permanente. Nao muda durante a simulacao. |
| `type` | `Album` | Tipo da entidade (obrigatorio para a carga). |
| `name` | `Detalhes` | Nome usado para apresentar o album ao jogador. |
| `officialName` | `Roberto Carlos` | Titulo oficial no lancamento. Pode repetir `name` ou ser omitido quando iguais. |
| `artistId` | `artist_roberto_carlos` | Referencia ao artista (`Artist`). |
| `albumType` | `studio` | `studio` \| `live` \| `compilation` \| `soundtrack` \| `remix`. |
| `releaseDate` | `1971-12-01` | Data de lancamento `AAAA-MM-DD`. Dia desconhecido usa o 1o do mes conhecido. |
| `countryId` | `country_brazil` | Referencia ao pais de origem (`Country`). |
| `labelId` | `label_cbs_brasil` | Referencia a gravadora do lancamento (`Label`). |
| `genreIds` | `[genre_mpb]` | Generos associados (`Genre`). Um album pode ter varios. |
| `themeId` | `null` | Tema do album (`Theme`) ou `null`. Se definido, vale para todas as faixas (decisao 0007). |
| `language` | `pt-BR` | Idioma predominante das faixas. |
| `songIds` | `[song_detalhes, ...]` | Faixas na ordem do lancamento (`Song`). |
| `status` | `released` | `planned` \| `recording` \| `completed` \| `announced` \| `released` \| `cancelled`. |

## Relacoes

```
Album
 ├── Artist   (artistId)
 ├── Label    (labelId)
 ├── Country  (countryId)
 ├── Genre    (genreIds[])
 ├── Theme    (themeId, opcional)
 └── Song     (songIds[])
```

Todas as relacoes sao feitas por identificadores; o album nunca duplica os dados
das entidades relacionadas.

## Nao armazenar no Album (dados dinamicos)

Estes sao resultados da simulacao e pertencem aos sistemas (vendas, charts,
certificacoes, distribuicao, recepcao, historico, financas), nao a entidade:

- vendas acumuladas, receita gerada, copias em estoque;
- posicao atual e semanas nos charts, historico semanal de desempenho;
- certificacoes conquistadas, avaliacao da critica, popularidade atual.

> Regra principal: a entidade **Album** representa o lancamento musical; os
> sistemas representam tudo o que acontece com ele ao longo do tempo.

## ToDo — design a explorar posteriormente

1. **Campo `type` obrigatorio.** O exemplo veio sem `type` (adicionado como
   `"Album"`). Recorrente (ver Country) — reforca a necessidade de **templates
   canonicos** em `database/templates/`.

2. **[RESOLVIDO — `decisions/0001`]** Convencao de ID do album. Formato canonico
   `album_[artist_slug]_[album_slug]_[release_year]`; nao simplificar. `Song.albumId`
   atualizado para `album_roberto_carlos_detalhes_1971`.

3. **[RESOLVIDO — `decisions/0002`]** ID de genero padronizado em ingles
   (`genre_romantic`); a Song foi corrigida. Nome em portugues vive em `Genre.name`.

4. **[RESOLVIDO — `decisions/0003`]** `Album.labelId` = gravadora do lancamento
   (historica, imutavel); `Artist.currentLabelId` = gravadora atual. Nao ha
   inconsistencia. Historico completo de contratos fica para um sistema futuro.

5. **`officialName` opcional.** A doc permite repetir `name` ou omitir. Definir a
   regra de normalizacao e se o campo e opcional no schema.

6. **`albumType`/`status` como enums.** Fixados como uniao de literais. Confirmar
   o conjunto inicial e a politica de extensao.

7. **`songIds` ordenado = numero da faixa.** A ordem e dado canonico. Decidir a
   fonte unica do numero da faixa (indice do array vs `trackNumber` na Song) e se
   uma Song pode pertencer a mais de um album (ex.: coletaneas) — o que quebra a
   relacao 1:1.

8. **Formato de idioma inconsistente entre entidades.** Album usa `pt-BR` (codigo);
   Song e Country usam `Portuguese` (nome). Padronizar (ex.: BCP-47).

9. **[RESOLVIDO — `decisions/0004`]** Principio identidade estatica vs resultado
   de sistema elevado a documento canonico:
   `docs/02_Arquitetura/01_entidade_vs_sistema.md` ("estatico" nao e "imutavel":
   dado de entidade muda so por acao explicita do dominio).

10. **Cobertura do catalogo.** O album lista 12 faixas, mas so `song_detalhes`
    esta semeada — a validacao reporta as outras 11 como `Song` inexistente.
    Esperado; seed conforme necessario.
