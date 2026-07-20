# 0017 — Entidade MediaOutlet (mídia) + edições/reservas

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

O usuário forneceu as diretrizes da entidade `MediaOutlet` (programas de TV/rádio,
revistas, jornais, sites) onde artistas e bandas se apresentam/promovem, com
exemplo canônico (Domingão do Faustão) e o sistema de agendamento por pontuação.

## Decisão

1. **Três responsabilidades separadas** (evita dados dinâmicos na entidade
   permanente):
   - `MediaOutlet` — características permanentes do veículo (dado semente);
   - `MediaEdition` — cada ocorrência no calendário (dinâmica);
   - `MediaBooking` — a participação marcada por uma label (dinâmica).
   Só a `MediaOutlet` é dado semente; as demais são geradas pelos sistemas.

2. **Agendamento por pontuação combinada** (nenhum atributo decide sozinho):
   - `bookingScore = label*0.30 + artista*0.30 + popularidadeLocal*0.40`;
   - `requiredBookingScore = 20 + prestige*0.70`;
   - reserva permitida quando `bookingScore >= requiredBookingScore` e há vaga e
     a antecedência mínima (`bookingLeadDays`) foi respeitada.

3. **Popularidade LOCAL:** a exigência usa a popularidade no país da MediaOutlet
   (`countryId`), não uma popularidade mundial.

4. **Suporte na UI** (verificação e ajustes): grupo "Mídia" na Estrutura,
   `entityLabels`, rótulos PT dos campos, e correção geral de `entityName` para
   resolver `Country` por `display.name`.

## Consequências

- `src/entities/MediaOutlet.ts` (inclui `MediaEdition`/`MediaBooking`),
  `src/systems/media.ts`, `tests/media.test.ts`.
- `validateReferences`: `MediaOutlet.countryId → Country`.
- `database/media/…Domingão do Faustão….json`.
- UI: `src/ui/data.ts` (labels, `mediaTypeLabels`, `entityName`),
  `src/ui/App.tsx` (grupo Mídia, ícone, aliases, ícone do inspector).

## Ressalva

`bookingLeadDays` aparece como 15 no exemplo canônico e 21 num exemplo ilustrativo
da spec; adotado **15** no seed. A spec sugere que esse valor seja o mesmo para
todas as MediaOutlets (clareza) — registrado como ToDo.

## ToDo futuro

- Sistema de `MediaEdition`/`MediaBooking` (geração no calendário + fluxo de
  reserva + efeitos promocionais). UI de agenda com edições e estado "escurecido"
  quando a antecedência mínima passou.
