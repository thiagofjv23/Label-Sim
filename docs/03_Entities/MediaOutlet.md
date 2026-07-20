Entidade MediaOutlet
{
  "id": "media_domingao_do_faustao",

  "type": "MediaOutlet",

  "name": "Domingão do Faustão",

  "description": "Programa dominical de auditório e variedades da TV Globo, apresentado por Fausto Silva. Em 2005, era um dos espaços de maior exposição nacional para artistas divulgarem músicas, álbuns e suas próprias carreiras.",

  "countryId": "country_brazil",

  "mediaType": "TelevisionProgram",

  "status": "Active",

  "activeFromYear": 1989,
  "activeToYear": 2021,

  "prestige": 98,

  "audienceReach": 97,

  "availability": {
    "frequency": "Weekly",
    "weekDays": [
      "Sunday"
    ],
    "monthDays": [],
    "months": [],
    "excludedDates": []
  },

  "editionCapacity": 2,

  "bookingRules": {
    "minimumArtistPrestige": 65,
    "minimumArtistPopularity": 70,
    "minimumLabelPrestige": 55,
    "bookingLeadDays": 15
  },

  "appearanceTypes": [
    "MusicalPerformance",
    "Interview",
    "ReleasePromotion",
    "CareerPromotion"
  ],

  "supportedEntityTypes": [
    "Artist",
    "Band"
  ]
}
Descrição dos campos
Identificação
id
Identificador único da MediaOutlet.
"id": "media_domingao_do_faustao"
type
Tipo da entidade dentro do sistema.
"type": "MediaOutlet"
name
Nome público do veículo, programa ou publicação.
"name": "Domingão do Faustão"
description
Descrição apenas para exibição na interface.
Não interfere diretamente nos cálculos da simulação.
Localização e classificação
countryId
Mercado principal onde a MediaOutlet produz impacto.
"countryId": "country_brazil"
Uma aparição no Domingão do Faustão influencia principalmente a popularidade no Brasil.
mediaType
Define o formato da MediaOutlet.
Valores iniciais recomendados:
type MediaType =
  | "TelevisionProgram"
  | "RadioProgram"
  | "Magazine"
  | "Newspaper"
  | "Website";
Exemplos:
Domingão do Faustão: TelevisionProgram
Programa do Ratinho: TelevisionProgram
Revista Capricho: Magazine
Jovem Pan: RadioProgram
O tipo pode ser usado para definir quais formatos de aparição são possíveis e como o impacto é distribuído ao longo do tempo.
Estado de atividade
status
Situação da MediaOutlet no período atual da simulação.
type MediaOutletStatus =
  | "Active"
  | "Inactive"
  | "Cancelled";
Para o início de 2005:
"status": "Active"
activeFromYear
Ano em que a MediaOutlet começou a funcionar.
"activeFromYear": 1989
activeToYear
Ano em que encerrou suas atividades.
"activeToYear": 2021
Quando o relógio da simulação ultrapassar esse ano, o sistema deverá impedir a criação de novas edições.
Caso a MediaOutlet ainda esteja ativa historicamente no período configurado, o campo pode ser null.
Atributos de importância
prestige
"prestige": 98
Valor de 0 a 100.
Representa o nível de importância, reconhecimento e dificuldade de acesso da MediaOutlet.
O prestígio da MediaOutlet deve ser cruzado com:
prestígio da label;
prestígio do artista ou banda;
popularidade do artista ou banda.
Quanto maior o prestígio da MediaOutlet, maior deverá ser o nível exigido para que uma label consiga reservar uma vaga.
O Domingão do Faustão recebe valor muito alto porque, em 2005, representava exposição nacional em um programa dominical consolidado da principal emissora brasileira.
audienceReach
"audienceReach": 97
Valor de 0 a 100.
Representa o alcance potencial da MediaOutlet dentro de seu mercado.
Esse atributo determina principalmente o tamanho do impacto promocional da aparição.
A diferença entre prestige e audienceReach é:
prestige: determina importância e dificuldade de acesso;
audienceReach: determina quantas pessoas podem ser impactadas.
Uma revista especializada pode ter prestígio alto e alcance moderado. Um programa popular pode ter alcance muito alto, ainda que seu prestígio institucional seja menor.
Disponibilidade no calendário
availability
"availability": {
  "frequency": "Weekly",
  "weekDays": [
    "Sunday"
  ],
  "monthDays": [],
  "months": [],
  "excludedDates": []
}
Define quando as edições da MediaOutlet devem ser criadas no calendário da simulação.
Cada data gerada representa uma edição disponível para agendamento.
frequency
Frequência de publicação ou transmissão.
Valores recomendados:
type MediaFrequency =
  | "Daily"
  | "Weekly"
  | "Biweekly"
  | "Monthly"
  | "Quarterly"
  | "Annual"
  | "Irregular";
Exemplos:
Domingão do Faustão: Weekly
Programa do Ratinho: Daily
Revista Capricho: Monthly
premiação anual de televisão: Annual
weekDays
Dias da semana em que a MediaOutlet está disponível.
"weekDays": [
  "Sunday"
]
No Domingão do Faustão, o sistema deve gerar uma edição em cada domingo válido.
Para um programa de segunda a sexta:
"weekDays": [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
]
Para publicações mensais, o campo fica vazio.
monthDays
Dias do mês utilizados para publicações mensais ou anuais.
"monthDays": []
Exemplo hipotético de revista publicada no dia 15:
"frequency": "Monthly",
"weekDays": [],
"monthDays": [
  15
]
No dia definido, a edição é considerada publicada e os efeitos de marketing são calculados.
Não é necessário simular o período de produção física da revista. A data cadastrada representa o momento em que a edição chega ao público.
months
Limita a disponibilidade a meses específicos.
No Domingão, o campo fica vazio porque o programa possui edições durante todo o ano:
"months": []
Exemplo de uma publicação trimestral:
"frequency": "Quarterly",
"monthDays": [
  10
],
"months": [
  3,
  6,
  9,
  12
]
excludedDates
Datas específicas nas quais uma edição não será realizada.
"excludedDates": []
Esse campo pode representar:
férias do programa;
edição cancelada;
mudança excepcional na programação;
interrupção temporária.
Exemplo:
"excludedDates": [
  "2005-12-25"
]
As datas históricas não precisam estar preenchidas inicialmente. O campo apenas prepara a entidade para exceções futuras.
Capacidade por edição
editionCapacity
"editionCapacity": 2
Quantidade máxima de artistas ou bandas que podem ser agendados na mesma edição.
Cada artista ou banda ocupa uma vaga, independentemente da quantidade de integrantes.
Exemplos:
programa de entrevista individual: 1;
Domingão do Faustão: 2;
programa musical com várias atrações: 5;
revista mensal com diversas matérias: 8;
festival televisivo especial: 12.
Para o Domingão do Faustão, 2 é uma estimativa de balanceamento para representar que uma edição poderia ter mais de uma atração musical, mas ainda possuía espaço limitado por também apresentar quadros, entrevistas e outras atrações.
O valor não precisa reproduzir exatamente cada edição histórica. Ele representa a capacidade média disponível para a simulação.
Regras de agendamento
bookingRules
"bookingRules": {
  "minimumArtistPrestige": 65,
  "minimumArtistPopularity": 70,
  "minimumLabelPrestige": 55,
  "bookingLeadDays": 21
}
Define os requisitos básicos para uma label tentar reservar uma vaga.
Esses valores não significam que todos os requisitos precisam obrigatoriamente ser atingidos de maneira isolada. Eles podem formar a base para uma pontuação combinada.
minimumArtistPrestige
"minimumArtistPrestige": 65
Prestígio mínimo de referência do artista ou banda.
Artistas muito populares, mas com baixo prestígio, ainda podem compensar parcialmente essa deficiência por meio da pontuação combinada.
minimumArtistPopularity
"minimumArtistPopularity": 70
Popularidade mínima de referência dentro do país da MediaOutlet.
Deve ser utilizada a popularidade no mercado definido por countryId, e não uma popularidade mundial genérica.
Para o Domingão do Faustão, deve ser considerada a popularidade do artista no Brasil.
minimumLabelPrestige
"minimumLabelPrestige": 55
Prestígio mínimo de referência da label responsável pelo agendamento.
Labels maiores possuem:
melhores contatos;
maior capacidade de negociação;
maior credibilidade;
maior facilidade para garantir espaço aos seus artistas.
Uma label prestigiosa pode ajudar um artista ainda em crescimento a entrar em uma MediaOutlet relevante.
bookingLeadDays
"bookingLeadDays": 15
Quantidade mínima de dias de antecedência necessária para fazer a reserva, será sempre igual para todas as mediasOutlet para melhor compreensão do jogador, após essa data manter a mediaOutlet visível no calendário mas escurecida para que mostre para o jogador que já não é mais possível marcar alguma aparição nesta mediaOutlet na data em que estiver a simulação. 
Com valor 21, uma label precisa solicitar a vaga pelo menos três semanas antes da edição.
O sistema deve bloquear solicitações feitas após esse prazo.
Verificação de acesso
A reserva deve usar uma pontuação combinada, evitando que um único atributo decida completamente o resultado.
Pontuação sugerida da candidatura
bookingScore =
  labelPrestige * 0.30 +
  artistPrestige * 0.30 +
  localArtistPopularity * 0.40;
Onde:
labelPrestige: prestígio atual da label;
artistPrestige: prestígio atual do artista ou banda;
localArtistPopularity: popularidade no país da MediaOutlet.
Exigência da MediaOutlet
requiredScore = mediaOutlet.prestige;
A reserva é permitida quando:
bookingScore >= requiredScore
Para o Domingão do Faustão:
requiredScore = 98
Porém, usar diretamente o prestígio como exigência tornaria o programa praticamente inacessível. Por isso, o ideal é converter o prestígio da MediaOutlet em uma exigência de agendamento:
requiredBookingScore =
  20 + mediaOutlet.prestige * 0.70;
No exemplo:
requiredBookingScore =
  20 + 98 * 0.70
  = 88.6
Portanto:
bookingScore >= 88.6
A label poderá reservar a vaga caso também exista disponibilidade na edição.
Exemplo de cálculo
Uma grande label tenta agendar um artista:
Prestígio da label: 90
Prestígio do artista: 85
Popularidade no Brasil: 95
bookingScore =
90 × 0,30 +
85 × 0,30 +
95 × 0,40

bookingScore =
27 +
25,5 +
38

bookingScore = 90,5
Como a exigência do programa é 88,6, o agendamento é permitido.
Agora uma label menor tenta agendar um artista em crescimento:
Prestígio da label: 45
Prestígio do artista: 50
Popularidade no Brasil: 75
bookingScore =
45 × 0,30 +
50 × 0,30 +
75 × 0,40

bookingScore =
13,5 +
15 +
30

bookingScore = 58,5
A solicitação é recusada porque o artista ainda não possui força suficiente para ocupar uma vaga nesse programa.
Tipos de aparição
appearanceTypes
"appearanceTypes": [
  "MusicalPerformance",
  "Interview",
  "ReleasePromotion",
  "CareerPromotion"
]
Define quais ações promocionais podem ser agendadas naquela MediaOutlet.
Valores iniciais recomendados:
type MediaAppearanceType =
  | "MusicalPerformance"
  | "Interview"
  | "ReleasePromotion"
  | "CareerPromotion";
MusicalPerformance
O artista ou banda apresenta uma música.
O principal beneficiado é:
música apresentada;
artista ou banda;
álbum relacionado à música, em menor escala.
Interview
A participação é centrada no artista ou banda.
O principal beneficiado é:
popularidade do artista;
prestígio do artista;
reconhecimento público.
ReleasePromotion
Divulgação específica de um lançamento.
Pode estar vinculada a:
música;
single;
álbum.
CareerPromotion
Divulgação geral da entidade Artist ou Band, sem necessidade de lançamento ativo.
É útil para:
recuperação de popularidade;
fortalecimento de imagem;
divulgação de turnê;
manutenção de relevância.
Entidades aceitas
supportedEntityTypes
"supportedEntityTypes": [
  "Artist",
  "Band"
]
Define quais entidades podem ocupar uma vaga.
Inicialmente, a MediaOutlet deve aceitar apenas:
Artist;
Band.
A label realiza o agendamento, mas a vaga pertence ao artista ou banda selecionado.
Entidade dinâmica da edição
A MediaOutlet representa o programa ou publicação. Cada ocorrência no calendário deve ser uma entidade dinâmica separada, como MediaEdition.
Exemplo de uma edição gerada automaticamente:
{
  "id": "media_edition_domingao_do_faustao_2005_01_02",

  "type": "MediaEdition",

  "mediaOutletId": "media_domingao_do_faustao",

  "date": "2005-01-02",

  "status": "Open",

  "capacity": 2,

  "bookingIds": []
}
Depois de duas reservas:
{
  "id": "media_edition_domingao_do_faustao_2005_01_02",

  "type": "MediaEdition",

  "mediaOutletId": "media_domingao_do_faustao",

  "date": "2005-01-02",

  "status": "Full",

  "capacity": 2,

  "bookingIds": [
    "media_booking_artist_a_2005_01_02",
    "media_booking_band_b_2005_01_02"
  ]
}
A disponibilidade restante deve ser calculada:
availableSlots =
  mediaEdition.capacity -
  mediaEdition.bookingIds.length;
Não deve ser armazenada como dado independente.
Entidade dinâmica do agendamento
Cada reserva pode gerar uma entidade MediaBooking.
{
  "id": "media_booking_roberto_carlos_domingao_2005_01_02",

  "type": "MediaBooking",

  "mediaEditionId": "media_edition_domingao_do_faustao_2005_01_02",

  "labelId": "label_sony_music_brazil",

  "participantId": "artist_roberto_carlos",

  "participantType": "Artist",

  "appearanceType": "MusicalPerformance",

  "promotedEntityType": "Song",

  "promotedEntityId": "song_example",

  "bookingDate": "2004-12-10",

  "status": "Scheduled"
}
Responsabilidades da MediaBooking
Ela registra:
qual label realizou o agendamento;
qual artista ou banda participará;
qual edição será utilizada;
qual será o tipo de aparição;
qual música ou álbum será promovido;
quando a reserva foi feita;
situação atual da participação.
Valores recomendados para status:
type MediaBookingStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Rejected";
Fluxo do sistema
1. O calendário gera as futuras MediaEditions.

2. A label procura uma MediaOutlet adequada.

3. A label seleciona:
   - artista ou banda;
   - edição disponível;
   - tipo de aparição;
   - lançamento promovido, quando aplicável.

4. O sistema verifica:
   - se a MediaOutlet está ativa;
   - se a edição está aberta;
   - se ainda existem vagas;
   - se o prazo de antecedência foi respeitado;
   - se Artist ou Band é aceito;
   - se o tipo de aparição é permitido;
   - se a pontuação combinada alcança a exigência.

5. Se aprovado, uma MediaBooking é criada.

6. A vaga da edição é ocupada.

7. Na data da edição, os efeitos promocionais são calculados.

8. A MediaBooking muda para Completed.
Estrutura recomendada
A implementação deve separar três responsabilidades:
MediaOutlet
    Define as características permanentes do programa ou publicação.

MediaEdition
    Representa cada edição disponível no calendário.

MediaBooking
    Representa a participação marcada pela label.
Essa separação evita armazenar dados dinâmicos dentro da entidade permanente e permite que programas diários, semanais e revistas mensais utilizem exatamente o mesmo sistema.

---

## Modelagem aplicada (implementação)

- **Contrato:** `src/entities/MediaOutlet.ts` — `MediaOutlet` + tipos aninhados
  (`MediaAvailability`, `MediaBookingRules`) e uniões (`MediaType`,
  `MediaOutletStatus`, `MediaFrequency`, `WeekDay`, `MediaAppearanceType`,
  `MediaSupportedEntity`). Inclui também as entidades **dinâmicas** `MediaEdition`
  e `MediaBooking` (geradas pelo sistema; não são dado semente).
- **Sistema (agendamento):** `src/systems/media.ts`:
  - `bookingScore` = `labelPrestige*0.30 + artistPrestige*0.30 + localArtistPopularity*0.40`;
  - `requiredBookingScore` = `20 + prestige*0.70` (evita que o prestígio bruto
    torne o veículo inacessível);
  - `meetsBookingRequirement`, `isMediaOutletActive`, `availableSlots`,
    `isBookingWindowOpen` (antecedência mínima), `validateMediaOutlet`.
- **Validação de referências:** `MediaOutlet.countryId → Country`.
- **Estático vs. dinâmico (0004):** `MediaOutlet` é permanente; edições e reservas
  (agenda, vagas, resultados) vivem em `MediaEdition`/`MediaBooking`, calculadas
  pelos sistemas. `availableSlots` é derivado, nunca armazenado.
- **Instância:** `database/media/MediaOutlet Exemplo - Domingão do Faustão.json`.

## Suporte na UI

A UI já suporta a MediaOutlet:

- `entityLabels.MediaOutlet = "Mídia"`; grupo **Mídia** na página **Estrutura**
  (ícone de TV); tipo de mídia exibido em PT (`mediaTypeLabels`).
- Painel de detalhes (Inspector) mostra todos os campos, com rótulos em PT
  (`prestige→Prestígio`, `availability→Disponibilidade`, `frequency→Frequência`,
  etc.) e referências resolvidas.
- Ajuste geral: `entityName` passou a usar `display.name` para `Country`
  (referências de mercado deixam de aparecer como `country_brazil` e mostram o
  nome do país). Beneficia todas as entidades.

## ToDo — a explorar posteriormente

1. **Sistema de edições/reservas:** gerar `MediaEdition` no calendário conforme
   `availability`; fluxo de `MediaBooking` (verificar ativo, vaga, prazo, tipo,
   pontuação) e cálculo dos efeitos promocionais na data.
2. **Calendário/Agenda na UI:** edições futuras; comportamento "escurecida"
   quando a antecedência mínima já passou (não é mais possível reservar).
3. **`bookingLeadDays` uniforme:** a spec sugere o mesmo valor para todas as
   MediaOutlets (clareza ao jogador) — avaliar torná-lo constante global.
4. **Localização de valores enum** (ex.: `TelevisionProgram`, `Weekly`, `Sunday`)
   na UI — hoje as chaves estão em PT, os valores permanecem em inglês (comum a
   todas as entidades; ligado à padronização de apresentação).
