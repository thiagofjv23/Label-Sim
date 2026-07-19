# Entidade: Band (Banda)

Arquivo de dados: `database/bands/` — exemplo: `Exemplo de Bands - Titãs.json`.
Contrato TypeScript: `src/entities/Band.ts`.

A `Band` referencia seus integrantes (entidades `Artist`) por ID, com função e
período de participação, e mantém o histórico de ex-integrantes. Segue as
diretrizes gerais: gêneros por `genreIds` (decisão 0005) e gravadora atual em
`currentLabelId` (decisão 0003).

## Campos

| Campo | Descrição |
|-------|-----------|
| `id` | Identificador único da banda. |
| `type` | Sempre `Band`. |
| `name` | Nome artístico da banda. |
| `description` | Texto descritivo, apenas UI (diretriz 0006). |
| `countryId` | País de origem (`Country`). |
| `formationDate` | Data de formação (`AAAA-MM-DD`). |
| `endDate` | Data de encerramento, ou `null` se ativa. |
| `careerStatus` | `Active`, `Hiatus` ou `Disbanded`. |
| `currentLabelId` | Gravadora atual no início da simulação (`Label`), ou `null`. |
| `managerId` | Empresário responsável (`Manager`), ou `null`. |
| `genreIds` | Gêneros da banda (`Genre`). |
| `members` | Integrantes atuais: `{ artistId, role, startDate, endDate }`. |
| `formerMembers` | Histórico de ex-integrantes (mesmo formato). |
| `albumIds` | Álbuns da banda (`Album`). |

## Correções aplicadas na ingestão

- **`genres` → `genreIds`.** O exemplo trazia IDs sob o nome `genres`; renomeado
  para `genreIds` (consistente com a decisão 0005).
- **ID de álbum com ano.** A referência `album_titas_como_estao_voces` foi ajustada
  para `album_titas_como_estao_voces_2003` (decisão 0001, formato com ano).
- **Álbum de banda.** Criado com `bandId: band_titas` e `artistId: null` (decisão
  0009).

## ToDo — design a explorar posteriormente

1. **Validação de `members[].artistId` / `formerMembers[].artistId`.** O validador
   atual não percorre arrays de objetos; hoje esses vínculos não são checados
   contra `Artist`. Estender `validateReferences` para caminhos aninhados em
   arrays de objetos.
2. **Semântica de `Artist.relationships.bands`.** Aqui, integrantes atuais listam
   `band_titas`; ex-integrantes ficam com `[]` (o histórico vive em
   `Band.formerMembers`). Definir se `relationships.bands` é "bandas atuais" ou
   "todas as bandas já integradas".
3. **`role` como vocabulário controlado.** Hoje é texto livre (`Bass`,
   `Vocals/Keyboards`). Avaliar padronizar funções instrumentais.
4. **Dados biográficos dos integrantes são placeholders.** `birthDate` e
   `birthPlace` dos 8 artistas criados são aproximações a verificar; estatísticas
   0-100 são estimativas ajustáveis.
5. **Vínculo integrante ↔ banda vs. sistema de formação.** Entradas/saídas de
   membros ao longo do tempo podem, futuramente, ser geridas por um sistema
   (linha do tempo), com a entidade guardando o estado estrutural.
