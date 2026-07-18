# Entidade: Country (Pais / Mercado)

Arquivo de dados: `database/countries/` — exemplo: `Country Example - Brazil.json`.
Contrato TypeScript: `src/entities/Country.ts`.

Um `Country` descreve um mercado musical: tamanho, preferencias culturais, forca
de midia e canais (radios, charts, gravadoras ativas). E o pano de fundo do
"mercado vivo" que os sistemas leem para dimensionar audiencia, receita e alcance.

## ToDo — design a explorar posteriormente

> Itens levantados por esta entidade. Nao decidir agora; consolidar quando o
> modelo de dominio estiver mais maduro.

1. **Campo `type` obrigatorio.** O exemplo veio sem `type` (adicionado como
   `"Country"` na ingestao). Reforca a necessidade de **templates canonicos** em
   `database/templates/` e/ou validacao de schema por tipo, para toda entidade
   nova nascer com `id` + `type`.

2. **Camada `display` (apresentacao).** Padronizar depois, entre varias
   entidades, conforme o TODO de padronizacao de apresentacao (na main). Nao
   participa da simulacao — apenas nomes/cores/icones para a UI.

3. **[ENCAMINHADO — `decisions/0005`]** `genreAffinity` usa nomes de genero como
   chave (strings). Genre passa a ser entidade e tudo referencia por `genreId`;
   este mapa deve migrar para chaves por `genreId`. Alem disso, afinidade de genero
   **por pais/mercado** e, na pratica, popularidade por mercado — pertence a um
   futuro **sistema de tendencias de mercado**, nao a entidade `Genre` (pendencia
   registrada na decisao 0005). Nao implementar agora.

4. **Convencao de ID nas referencias.** `activeLabels` traz `sony_music_brazil`,
   mas a Label existente tem `id = label_sony_music`. `mainCharts`
   (`hot100_brazil`) e `mainRadioNetworks` (`jovem_pan_fm`) nao usam prefixo de
   familia. Padronizar prefixos (`label_`, `chart_`, `radio_`) e reconciliar os
   exemplos. **Por isso `activeLabels`/`mainCharts`/`mainRadioNetworks` ainda NAO
   foram ligados a `validateReferences`** — evitar ruido enquanto a convencao nao
   se resolve.

5. **Entidades-alvo ainda nao modeladas:** `Chart` e `RadioStation`, ja
   referenciadas aqui. Modelar quando forem criados exemplos.

6. **Valores dependentes de epoca.** `digitalAdoption: 18`,
   `digitalStreamingDemand: 4`, `internetInfluence: 12` refletem ~1990-2000. Como
   a simulacao atravessa decadas, atributos de mercado provavelmente devem
   **evoluir no tempo** (curvas/sistema temporal), nao ficar estaticos. Decidir:
   estatico vs dinamico, e onde a curva historica mora.

7. **Semantica dos atributos 0-100.** Muitos drivers (`marketSize`, `piracyLevel`,
   influencias de radio/tv/internet, demandas de formato, `festivalCulture`,
   `awardPrestige`). Documentar **quais sistemas consomem cada um** (receita,
   alcance de radio, charts, turnes) em `docs/04_Simulacao` / `docs/05_Economia`.

8. **`population` absoluto vs `marketSize` (0-100).** Ha redundancia potencial —
   definir se um deriva do outro ou se sao eixos independentes.

9. **Pares de preferencia/demanda nao somam 100** (`domestic 90` / `international
   55`; `physical 96` / `digital 4` / `live 88`). Definir se sao independentes
   (cada um 0-100) ou fracoes de um todo que deveriam normalizar.

## Convencao (para as proximas entidades)

A partir de agora, cada entidade canonica adicionada ganha um documento proprio
em `docs/03_Entities/<Entidade>.md` com uma secao **ToDo** capturando as questoes
de design que ela levanta.
