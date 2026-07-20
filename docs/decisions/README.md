# Decisões (ADRs)

Registro canônico das decisões de projeto (Architecture/Design Decision Records).
Cada arquivo documenta **uma** decisão: o contexto, a decisão tomada e as
consequências. Uma vez aceita, uma decisão só muda por uma nova decisão que a
substitua (indicada no campo *Status*).

Formato: `NNNN-titulo-curto.md`, numeração sequencial.

## Índice

| # | Decisão | Status |
|---|---------|--------|
| 0001 | Convenção de ID para Album | Aceita |
| 0002 | Padronização de ID de Gênero (inglês) | Aceita |
| 0003 | Gravadora histórica (Album) vs. atual (Artist) | Aceita |
| 0004 | Entidade vs. Sistema (identidade estática vs. resultado dinâmico) | Aceita |
| 0005 | Genre como entidade | Aceita |
| 0006 | Campo `description` (opcional, apenas UI) | Aceita |
| 0007 | Theme (tema) como entidade, distinto de Genre | Aceita |
| 0008 | Arquivo de dados: uma entidade ou um array | Aceita |
| 0009 | Autoria de Album: artista OU banda | Aceita |
| 0010 | Charts: esquema, nomenclatura e janela de apuração | Aceita |
| 0011 | Criação de labels e gêneros a partir de arquivos de country | Aceita (diretriz permanente) |
| 0012 | `brandTag` em Label (base para subsidiárias) | Aceita |
| 0013 | Normalização e validação das referências de country | Aceita |
| 0014 | País agregador e nacionalidade de artista | Aceita |
| 0015 | Entidade Venue; templates não são carregados | Aceita |
| 0016 | Entidade RecordingStudio | Aceita |
| 0017 | Entidade MediaOutlet (mídia) + edições/reservas | Aceita |
