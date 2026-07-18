# Arquitetura — Motor de Simulacao (MVP)

Status: rascunho inicial do MVP. Foco desta fase: **motor de simulacao e tempo**.

## Principio central

> A interface nunca toma decisoes. Ela apenas mostra.
> Toda decisao pertence a simulacao.

Consequencia arquitetural: existe uma unica autoridade sobre a progressao do
jogo — o **Engine**. A UI le o estado (`World`, `Clock`) e o renderiza; ela nao
chama sistemas nem avanca o tempo.

## Camadas

```
UI  (observa)      ->  le World / Clock
Engine (autoridade) -> avanca o tempo e executa os Sistemas
Systems (regras)    -> leem e escrevem o World a cada tick
World  (estado)     -> entidades indexadas por ID
Utils               -> Rng deterministico, IdFactory
```

## Modelo de tempo

- O tempo avanca em **ticks** discretos. No MVP, `1 tick = 1 dia`
  (`Clock.daysPerTick`).
- `GameDate` representa datas de calendario via indice de dias em UTC, o que
  torna a aritmetica de datas deterministica e independente do fuso do host.
- `Clock` mantem o contador de ticks e deriva a data atual a partir da data de
  inicio. Nao decide nada — apenas reporta o tempo.

## Ciclo de um tick (`Engine.step`)

1. `Clock.advance(1)` — avanca o tempo em um tick.
2. Para cada `System` registrado, na ordem de registro, chama `update(context)`.

O `TickContext` entregue aos sistemas reune: `world`, `clock`, `rng` e o numero
do `tick`. Sistemas nao guardam estado global; recebem tudo explicitamente.

## Determinismo

A simulacao inteira deve ser reprodutivel:

- **Rng** (mulberry32 semeado) e a unica fonte de aleatoriedade. Mesmo seed +
  mesma sequencia de chamadas => mesmo resultado.
- **IdFactory** gera IDs por contador monotonico por tipo (`artist_000001`),
  estaveis entre execucoes.
- Ambos expoem estado serializavel, base para a futura camada de save
  (`src/save`).

## Diretrizes de codigo aplicadas

- Composicao > heranca: entidades sao dados (`Entity` = `{ id, type }`);
  comportamento vive nos sistemas.
- Toda entidade possui ID unico (`IdFactory`).
- Sem numeros magicos: constantes nomeadas em cada modulo.
- Funcoes publicas documentadas.

## Proximos passos (fora deste MVP inicial)

- Camada de save/load serializando `World` + `Clock` + `Rng` + `IdFactory`.
- Primeiras entidades de dominio (Artist, Song, Label) em `database/` (JSON) e
  `src/entities`.
- Sistemas do core loop: descoberta, contrato, producao, lancamento, charts,
  receita.
