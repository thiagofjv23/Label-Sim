# 0012 — `brandTag` em Label (base para subsidiárias)

- **Status:** Aceita
- **Data:** 2026-07-19

## Contexto

A mesma marca opera em vários países como empresas distintas (ex.: Sony Music no
Brasil, Sony Music Entertainment Japan no Japão). Precisamos correlacionar essas
gravadoras para, posteriormente, construir um **sistema de subsidiárias**
(matriz e filiais por país).

## Decisão

Adicionar à `Label` um campo opcional `brandTag: string | null`:

- gravadoras que compartilham a **mesma marca-mãe** recebem a **mesma**
  `brandTag` (slug em minúsculas, ex.: `sony`, `universal`);
- marcas isoladas (sem operação multi-país) ficam **sem** `brandTag` (`null`/ausente).

A `brandTag` é apenas o vínculo estrutural entre as gravadoras; a hierarquia
matriz↔filial e as regras de subsidiária serão de um sistema futuro.

## Aplicação inicial

| brandTag | labels |
|----------|--------|
| `sony` | `label_sony_music` (BR), `label_sony_music_entertainment_japan` (JP) |
| `universal` | `label_universal_music` (BR), `label_universal_music_japan` (JP) |

Sem tag (isoladas por enquanto): `label_abril_music`, `label_avex_group`.

## Consequências

- `src/entities/Label.ts`: campo `brandTag?: string | null`.
- Labels de Sony/Universal (BR e JP) marcadas.
- Teste `tests/labelBrand.test.ts` garante o agrupamento por `brandTag`.

## ToDo futuro

- Sistema de subsidiárias: matriz por marca, filiais por país, e regras
  (transferência de catálogo, orçamento, decisões locais vs. globais).
