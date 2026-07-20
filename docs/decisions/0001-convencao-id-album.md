# 0001 — Convenção de ID para Album

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

O exemplo de Album usava o ID `album_roberto_carlos_detalhes_1971`, enquanto a
Song referenciava `album_detalhes` em `albumId`. A divergência deixava a
referência pendente e não havia convenção definida para IDs de álbum.

## Decisão

O ID canônico de um Album segue o formato:

```
album_[artist_slug]_[album_slug]_[release_year]
```

Exemplo: `album_roberto_carlos_detalhes_1971`.

Motivos:

- evita colisões entre álbuns de artistas diferentes;
- diferencia relançamentos e álbuns homônimos de anos distintos;
- facilita identificar o registro durante manutenção e depuração;
- mantém o ID estável e suficientemente descritivo.

**O ID do Album não deve ser simplificado.** A referência `Song.albumId` foi
alterada de `album_detalhes` para `album_roberto_carlos_detalhes_1971`.

## Consequências

- `database/songs/…Detalhes….json`: `albumId` atualizado para o ID canônico.
- O ID é permanente: não muda durante a simulação, mesmo que outros campos do
  álbum sejam atualizados.
