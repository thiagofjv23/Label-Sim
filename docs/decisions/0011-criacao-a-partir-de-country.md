# 0011 — Criação de labels e gêneros a partir de arquivos de country

- **Status:** Aceita (diretriz permanente)
- **Data:** 2026-07-19

## Contexto

Os arquivos de `country` enviados pelo usuário trazem `activeLabels` (IDs de
gravadoras) e `genreAffinity` (gêneros **por nome**). Muitas dessas entidades
ainda não existem na base. O usuário definiu um fluxo permanente para criá-las.

## Decisão (fluxo permanente)

Ao processar um arquivo de `country`:

1. **Labels.** Para cada ID em `activeLabels` sem arquivo, criar a `Label`
   correspondente com dados **coerentes com 2005** (ano de início da simulação):
   `foundationYear` ≤ 2005 e `ratings`/`commercial` plausíveis para a empresa
   naquele mercado e época. Valores de game-design são estimativas ajustáveis.

2. **Gêneros.** Para cada nome em `genreAffinity` sem entidade, criar o `Genre`:
   - ID técnico em **inglês** e `name` em **português** (decisão 0002);
   - dados **estruturais/históricos** coerentes com a época — `activeFromYear`
     tal que o gênero esteja ativo em 2005;
   - **sem** popularidade/afinidade (decisão 0005): esses valores são estado de
     mercado e permanecem no `country` (pendente migração ao sistema de mercado).

3. **Origem de gênero anulável.** `Genre.countryOfOriginId` passa a aceitar
   `null` para origens **difusas ou não modeladas** (ex.: Música Clássica,
   Eletrônica, ou gêneros anteriores ao conjunto de países). Evita inventar
   origens incorretas.

4. **Registro obrigatório.** Toda criação é documentada em
   `docs/03_Entities/Registro de Criacoes.md`, com origem, dados-chave e
   justificativa — para controle total do que foi criado.

## Consequências

- `src/entities/Genre.ts`: `countryOfOriginId` agora é `EntityId | null`.
- Primeiro lote aplicado: `country_japan` (3 labels + 12 gêneros) — ver o
  registro de criações.
- O `genreAffinity` continua por nome até a migração para `genreId` (decisão 0005).

## Escopo

- Aplica-se aos arquivos de country enviados a partir de agora. Backfill dos
  gêneros/labels citados em Brasil/EUA/Reino Unido pode ser feito sob demanda.
