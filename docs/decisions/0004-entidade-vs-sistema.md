# 0004 — Entidade vs. Sistema (identidade estática vs. resultado dinâmico)

- **Status:** Aceita
- **Data:** 2026-07-18

## Contexto

A documentação da entidade Album deixou explícito o que **não** deve ser
armazenado na entidade (vendas, charts, certificações, etc.). O princípio é
geral e merece ser elevado a documento canônico de arquitetura, aplicável a
todas as entidades.

## Decisão

Adotar como princípio canônico:

> «Entidades armazenam identidade, características próprias e relações
> estruturais. Resultados produzidos pela passagem do tempo e pela simulação
> devem ser armazenados e processados pelos sistemas responsáveis.»

O detalhamento — dados próprios de entidade, dados dinâmicos de sistema, e a
distinção entre "estático" e "imutável" (dado de entidade pode mudar, mas só por
ação explícita do domínio) — está em:

`docs/02_Arquitetura/01_entidade_vs_sistema.md`.

## Consequências

- Modelagem de novas entidades deve conferir esta separação antes de adicionar
  campos.
- Campos de resultado dinâmico (vendas, charts, popularidade atual, receita,
  certificações, históricos) ficam fora dos contratos de `src/entities` e dos
  JSON de `database/`.
