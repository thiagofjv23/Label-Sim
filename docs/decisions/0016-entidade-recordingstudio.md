# 0016 — Entidade RecordingStudio

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

O usuário forneceu as diretrizes da entidade `RecordingStudio` (estúdio onde
músicas são gravadas, mixadas ou masterizadas), com exemplo canônico (Mosh
Studios).

## Decisão

1. **Entidade `RecordingStudio`** modelada conforme a spec
   (`docs/03_Entities/RecordingStudio.md`): contrato em
   `src/entities/RecordingStudio.ts`; comportamento em
   `src/systems/recordingStudio.ts` (`isStudioActive`, `studioOffersService`,
   `validateRecordingStudio`). Guarda apenas características **permanentes**.

2. **`quality` é potencial permanente** — não muda a cada gravação. Resultados por
   sessão pertencem à futura `RecordingSession` (princípio 0004).

3. **`ownerLabelId` opcional** — só armazenado quando o estúdio pertence a uma
   `Label`. Estúdios independentes (Mosh) não têm o campo.

4. **Instância real em `database/studios/`.** Novo diretório para estúdios.

## Consequências

- `src/entities/RecordingStudio.ts`, `src/systems/recordingStudio.ts`,
  `tests/recordingStudio.test.ts`.
- `validateReferences`: `RecordingStudio.location.countryId → Country`,
  `ownerLabelId → Label`.
- `database/studios/Estudio Exemplo - Mosh Studios.json` (`recording_studio_mosh`).

## ToDo futuro

- `RecordingSession` (sessões e resultados dinâmicos).
- Uso de `quality` na produção musical; custo dinâmico de `dailyCost`.
- Estúdios pertencentes a gravadoras (`ownerLabelId`).
