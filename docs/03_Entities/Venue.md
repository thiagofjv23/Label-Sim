Entidade Venue

A entidade "Venue" representa um local físico onde podem ocorrer shows, festivais, premiações e eventos promocionais.

Deve armazenar apenas características permanentes do local. Agenda, público, receita, eventos realizados e disponibilidade de datas pertencem a outros sistemas.

---

Exemplo canônico — Maracanã

{
  "id": "venue_maracana",

  "type": "Venue",

  "name": "Maracanã",

  "description": "Estádio localizado no Rio de Janeiro, utilizado para grandes apresentações musicais e eventos de escala nacional e internacional.",

  "venueType": "Stadium",

  "countryId": "country_brazil",
  "state": "Rio de Janeiro",
  "city": "Rio de Janeiro",

  "openedYear": 1950,
  "closedYear": null,

  "capacity": {
    "concert": 70000,
    "seatedConcert": 50000
  },

  "stage": {
    "builtIn": false,
    "maxStageSize": "Mega",
    "roof": false,
    "acousticQuality": 68
  },

  "facilities": 88,

  "allowedEventTypes": [
    "Concert",
    "Festival",
    "Award",
    "Promotional"
  ],

  "genreAffinityIds": [],

  "marketImportance": 98,

  "prestige": 97,

  "operatingCost": 94,

  "bookingDifficulty": 92,

  "defaultTicketPriceMultiplier": 1.1,

  "indoor": false,

  "active": true
}

---

Contrato da entidade

id

id: string

Identificador único.

Padrão recomendado:

venue_nome_do_local

Exemplo:

"id": "venue_maracana"

---

type

type: "Venue"

Valor fixo da entidade.

"type": "Venue"

---

name

name: string

Nome principal do local.

"name": "Maracanã"

---

description

description?: string

Descrição curta utilizada apenas na interface.

Não deve participar dos cálculos da simulação.

---

venueType

venueType:
  | "Stadium"
  | "Arena"
  | "Theater"
  | "Club"
  | "ConcertHall"
  | "ConventionCenter"
  | "OutdoorPark"
  | "Amphitheater"
  | "TVStudio"
  | "Casino"
  | "Ballroom"
  | "University"
  | "CulturalCenter"

Classificação estrutural do local.

Pode ser utilizada como modificador-base para:

- prestígio;
- custos;
- capacidade;
- tipos de evento;
- expectativa de produção;
- adequação a determinados formatos de show.

---

Localização

countryId

countryId: string

Referência obrigatória para uma entidade "Country".

"countryId": "country_brazil"

Utilizado para acessar dados econômicos e comerciais do mercado.

---

state

state: string | null

Estado, província ou subdivisão administrativa.

"state": "Rio de Janeiro"

Pode ser "null" quando não aplicável.

---

city

city: string

Cidade onde o venue está localizado.

"city": "Rio de Janeiro"

Utilizado por:

- planejamento de turnês;
- deslocamento;
- popularidade local;
- demanda;
- saturação de shows;
- custos logísticos.

A cidade permanece como texto enquanto não existir uma entidade "City".

---

Período de funcionamento

openedYear

openedYear: number

Ano em que o venue iniciou suas operações.

"openedYear": 1950

O venue não pode ser utilizado quando:

currentYear < openedYear

---

closedYear

closedYear: number | null

Ano de fechamento permanente.

"closedYear": null

O venue não pode ser utilizado quando:

closedYear !== null && currentYear > closedYear

---

Capacity

capacity: {
  concert: number
  seatedConcert: number
}

Define as capacidades máximas para shows.

"capacity": {
  "concert": 70000,
  "seatedConcert": 50000
}

concert

concert: number

Capacidade máxima em configuração de show com público em pé e sentado.

Utilizada para:

- limite máximo de ingressos;
- cálculo de lotação;
- seleção de venue;
- projeção de receita.

---

seatedConcert

seatedConcert: number

Capacidade máxima em configuração exclusivamente sentada.

Utilizada em formatos como:

- shows acústicos;
- apresentações formais;
- premiações;
- eventos televisionados;
- cerimônias.

A capacidade efetivamente disponibilizada em cada evento deve ser armazenada em "Concert" ou na entidade responsável pelo evento.

---

Stage

stage: {
  builtIn: boolean
  maxStageSize: "Small" | "Medium" | "Large" | "Mega"
  roof: boolean
  acousticQuality: number
}

Agrupa as características permanentes relacionadas à estrutura de apresentação.

---

builtIn

builtIn: boolean

Indica se o venue possui palco permanente.

"builtIn": false

Pode influenciar:

- custo de montagem;
- tempo de preparação;
- necessidade de estruturas temporárias;
- eficiência logística.

---

maxStageSize

maxStageSize: "Small" | "Medium" | "Large" | "Mega"

Maior tamanho de produção que o venue comporta.

"maxStageSize": "Mega"

Escala:

Small
Medium
Large
Mega

O sistema deve impedir a realização de uma produção maior que o limite do venue.

Exemplo:

if (tourStageSize > venue.stage.maxStageSize) {
  bookingAllowed = false
}

A comparação deve utilizar uma ordem numérica interna:

const stageSizeOrder = {
  Small: 1,
  Medium: 2,
  Large: 3,
  Mega: 4
}

---

roof

roof: boolean

Indica se a área principal da apresentação possui cobertura estrutural.

"roof": false

Não será utilizado para eventos meteorológicos.

Pode contribuir como modificador para:

- prestígio estrutural;
- qualidade acústica efetiva;
- adequação para gravação ao vivo;
- percepção de qualidade do venue.

O efeito deve ser pequeno e complementar aos valores principais de "prestige" e "acousticQuality".

---

acousticQuality

acousticQuality: number

Valor de 0 a 100.

"acousticQuality": 68

Deve possuir duas aplicações principais.

Qualidade do show

Contribui para o cálculo da qualidade final da apresentação.

Exemplo conceitual:

showQuality =
  artistPerformanceQuality +
  productionQuality +
  venueAcousticModifier

O valor do venue deve funcionar como modificador, não como fator dominante.

---

Gravação de álbum ao vivo

Quando um "Concert" for utilizado como fonte para um álbum do tipo "Live", o campo deve contribuir para a qualidade técnica das gravações.

Exemplo conceitual:

liveRecordingQuality =
  concertPerformanceQuality +
  recordingProductionQuality +
  venueAcousticModifier

O resultado também pode considerar:

- qualidade da apresentação;
- produtor;
- orçamento de gravação;
- equipe técnica;
- capacidade da gravadora;
- pós-produção.

Validação:

0 <= acousticQuality && acousticQuality <= 100

---

facilities

facilities: number

Valor de 0 a 100.

"facilities": 88

Representa de forma abstrata a qualidade geral da infraestrutura disponível.

Pode contribuir para:

- custos adicionais de produção;
- eficiência de montagem;
- logística;
- qualidade geral do evento;
- risco operacional;
- adequação a grandes produções.

O sistema não deve armazenar separadamente camarins, estacionamento, docas, áreas VIP ou outros itens estruturais.

Validação:

0 <= facilities && facilities <= 100

Um valor baixo pode gerar custos adicionais.

Exemplo conceitual:

additionalInfrastructureCost =
  baseProductionCost * facilitiesPenalty

---

allowedEventTypes

allowedEventTypes: VenueEventType[]

Tipos de evento aceitos pelo local.

type VenueEventType =
  | "Concert"
  | "Festival"
  | "Award"
  | "Promotional"
  | "TV"
  | "Corporate"

Exemplo:

"allowedEventTypes": [
  "Concert",
  "Festival",
  "Award",
  "Promotional"
]

O sistema deve validar o tipo antes de confirmar uma reserva.

venue.allowedEventTypes.includes(event.type)

---

genreAffinityIds

genreAffinityIds: string[]

Referências opcionais para entidades "Genre".

"genreAffinityIds": []

Exemplo:

"genreAffinityIds": [
  "genre_rock",
  "genre_metal"
]

Pode gerar um modificador pequeno em:

- demanda;
- prestígio do evento;
- satisfação do público;
- repercussão especializada.

Não deve impedir shows de outros gêneros.

O nome do campo deve utilizar o sufixo "Ids", pois armazena referências de entidades.

---

marketImportance

marketImportance: number

Valor de 0 a 100.

"marketImportance": 98

Representa a importância comercial e midiática do venue dentro do mercado.

Pode influenciar:

- impacto promocional;
- atenção da mídia;
- exposição do artista;
- interesse de patrocinadores;
- ganho de popularidade;
- relevância comercial do evento.

Validação:

0 <= marketImportance && marketImportance <= 100

---

prestige

prestige: number

Valor de 0 a 100.

"prestige": 97

Representa a importância histórica, cultural e simbólica do local.

Pode influenciar:

- reputação do artista;
- reputação da gravadora;
- moral do artista;
- repercussão do show;
- valor histórico do evento;
- interesse em álbuns ao vivo;
- percepção de importância da turnê.

Validação:

0 <= prestige && prestige <= 100

"prestige" e "marketImportance" são atributos diferentes.

marketImportance = importância comercial e midiática
prestige = importância histórica e simbólica

---

operatingCost

operatingCost: number

Índice relativo de custo, de 0 a 100.

"operatingCost": 94

Não deve representar um valor monetário fixo.

O custo financeiro real deve ser calculado dinamicamente.

Exemplo conceitual:

venueCost =
  countryBaseCost *
  operatingCostModifier *
  eventTypeModifier *
  attendanceCapacityModifier *
  productionSizeModifier *
  facilitiesModifier

Pode representar de forma abstrata:

- aluguel;
- equipe local;
- limpeza;
- segurança;
- energia;
- montagem básica;
- serviços obrigatórios.

Validação:

0 <= operatingCost && operatingCost <= 100

---

Relação entre facilities e operatingCost

Os dois campos não devem ser fundidos.

facilities

Representa a qualidade da infraestrutura.

operatingCost

Representa o custo-base de utilização.

Um venue pode possuir:

facilities alto + operatingCost alto
facilities baixo + operatingCost baixo
facilities baixo + operatingCost alto
facilities alto + operatingCost moderado

"facilities" pode gerar redução ou aumento de custos adicionais, enquanto "operatingCost" define o custo-base.

---

bookingDifficulty

bookingDifficulty: number

Valor de 0 a 100.

"bookingDifficulty": 92

Representa a dificuldade-base de reservar o venue.

Pode influenciar:

- antecedência necessária;
- chance de aprovação;
- exigência de popularidade mínima;
- custo de negociação;
- prioridade entre artistas;
- disponibilidade de datas relevantes.

A agenda real não deve ser armazenada nesta entidade.

Validação:

0 <= bookingDifficulty && bookingDifficulty <= 100

---

defaultTicketPriceMultiplier

defaultTicketPriceMultiplier: number

Multiplicador-base do preço dos ingressos.

"defaultTicketPriceMultiplier": 1.1

Exemplos:

0.80 = abaixo do padrão
1.00 = padrão
1.10 = 10% acima do padrão
1.25 = venue premium

Exemplo conceitual:

finalTicketPrice =
  marketBaseTicketPrice *
  venue.defaultTicketPriceMultiplier *
  artistPopularityModifier *
  eventDemandModifier

O valor deve ser maior que zero.

defaultTicketPriceMultiplier > 0

---

indoor

indoor: boolean

Indica se o espaço principal do venue é fechado.

"indoor": false

Não será utilizado para eventos climáticos.

Pode funcionar como modificador estrutural para:

- acústica;
- prestígio;
- custos;
- adequação a determinados formatos de produção;
- gravações ao vivo.

O campo "indoor" descreve o venue como um todo.

O campo "stage.roof" descreve especificamente a cobertura da área de apresentação.

---

active

active: boolean

Indica se o venue está habilitado na database.

"active": true

A disponibilidade deve considerar:

function isVenueAvailable(
  venue: Venue,
  currentYear: number
): boolean {
  if (!venue.active) return false
  if (currentYear < venue.openedYear) return false

  if (
    venue.closedYear !== null &&
    currentYear > venue.closedYear
  ) {
    return false
  }

  return true
}

---

Campo de propriedade

A entidade não deve possuir um campo genérico "owner".

Caso seja criado futuramente um sistema no qual uma gravadora possa possuir ou controlar um venue, a relação deverá utilizar uma referência explícita:

labelOwnerId?: string | null

Esse campo não deve ser incluído na primeira versão da entidade enquanto o sistema de propriedade de venues não existir.

---

Dados que não pertencem à entidade Venue

Não armazenar:

agenda
datas disponíveis
eventos futuros
eventos anteriores
público acumulado
receita acumulada
ingressos vendidos
ocupação atual
preço atual de aluguel
histórico de artistas
álbuns gravados no local
estado temporário do venue

Esses dados devem pertencer a entidades ou sistemas como:

Concert
Tour
Festival
Award
Booking
LiveAlbum
EventHistory

---

Relações

Venue → Country

countryId: string

Referência obrigatória para "Country".

---

Venue → Genre

genreAffinityIds: string[]

Referências opcionais para "Genre".

---

Concert → Venue

A entidade "Concert" deve armazenar:

venueId: string

Exemplo:

"venueId": "venue_maracana"

---

Live Album

Um álbum ao vivo deve referenciar os shows utilizados como fonte.

"sourceConcertIds": [
  "concert_roberto_carlos_maracana_2005"
]

O venue deve ser obtido por meio do "venueId" armazenado em cada "Concert".

O álbum não precisa duplicar diretamente o "venueId".

---

Interface TypeScript sugerida

export type VenueType =
  | "Stadium"
  | "Arena"
  | "Theater"
  | "Club"
  | "ConcertHall"
  | "ConventionCenter"
  | "OutdoorPark"
  | "Amphitheater"
  | "TVStudio"
  | "Casino"
  | "Ballroom"
  | "University"
  | "CulturalCenter"

export type VenueStageSize =
  | "Small"
  | "Medium"
  | "Large"
  | "Mega"

export type VenueEventType =
  | "Concert"
  | "Festival"
  | "Award"
  | "Promotional"
  | "TV"
  | "Corporate"

export interface VenueCapacity {
  concert: number
  seatedConcert: number
}

export interface VenueStage {
  builtIn: boolean
  maxStageSize: VenueStageSize
  roof: boolean
  acousticQuality: number
}

export interface Venue {
  id: string
  type: "Venue"

  name: string
  description?: string

  venueType: VenueType

  countryId: string
  state: string | null
  city: string

  openedYear: number
  closedYear: number | null

  capacity: VenueCapacity

  stage: VenueStage

  facilities: number

  allowedEventTypes: VenueEventType[]

  genreAffinityIds: string[]

  marketImportance: number
  prestige: number
  operatingCost: number
  bookingDifficulty: number

  defaultTicketPriceMultiplier: number

  indoor: boolean
  active: boolean
}

---

Validações mínimas

A validação da entidade deve garantir:

venue.type === "Venue"

venue.id.startsWith("venue_")

venue.name.length > 0

venue.countryId.length > 0

venue.city.length > 0

venue.openedYear > 0

venue.closedYear === null ||
venue.closedYear >= venue.openedYear

venue.capacity.concert > 0

venue.capacity.seatedConcert > 0

venue.capacity.seatedConcert <=
venue.capacity.concert

venue.facilities >= 0 &&
venue.facilities <= 100

venue.stage.acousticQuality >= 0 &&
venue.stage.acousticQuality <= 100

venue.marketImportance >= 0 &&
venue.marketImportance <= 100

venue.prestige >= 0 &&
venue.prestige <= 100

venue.operatingCost >= 0 &&
venue.operatingCost <= 100

venue.bookingDifficulty >= 0 &&
venue.bookingDifficulty <= 100

venue.defaultTicketPriceMultiplier > 0

Também devem ser validadas as referências:

countryId → Country existente
genreAffinityIds → Genres existentes

---

Estrutura final resumida

{
  "id": "venue_example",
  "type": "Venue",

  "name": "Example Venue",
  "description": "Descrição curta do local.",

  "venueType": "Arena",

  "countryId": "country_example",
  "state": null,
  "city": "Example City",

  "openedYear": 1980,
  "closedYear": null,

  "capacity": {
    "concert": 15000,
    "seatedConcert": 10000
  },

  "stage": {
    "builtIn": true,
    "maxStageSize": "Large",
    "roof": true,
    "acousticQuality": 80
  },

  "facilities": 85,

  "allowedEventTypes": [
    "Concert",
    "Festival",
    "Award",
    "Promotional"
  ],

  "genreAffinityIds": [],

  "marketImportance": 75,
  "prestige": 70,
  "operatingCost": 72,
  "bookingDifficulty": 68,

  "defaultTicketPriceMultiplier": 1,

  "indoor": true,
  "active": true
}

---

## Modelagem aplicada (implementação)

- **Contrato:** `src/entities/Venue.ts` — espelha a interface acima (`Venue`,
  `VenueType`, `VenueStageSize`, `VenueEventType`, `VenueCapacity`, `VenueStage`).
  `description` é herdado da base `Entity` (opcional, apenas UI).
- **Comportamento (lado sistema):** `src/systems/venue.ts`:
  - `isVenueAvailable(venue, currentYear)` — ativo e dentro de `openedYear`..`closedYear`;
  - `canHostStageSize(venue, required)` — compara pela ordem `STAGE_SIZE_ORDER`;
  - `venueAllowsEvent(venue, eventType)`;
  - `validateVenue(venue)` — validações estruturais mínimas (faixas [0,100],
    ordenação de capacidade, prefixo do id, datas, multiplicador > 0).
- **Validação de referências:** `Venue.countryId → Country` e
  `Venue.genreAffinityIds → Genre` (via `validateReferences`).
- **Sem campo `owner`:** conforme a spec, não incluído. Um futuro
  `labelOwnerId?` entra apenas quando existir o sistema de propriedade de venues.
- **Instância vs. template:** o Maracanã é uma entidade real em
  `database/venues/`; `database/templates/venue.template.json` é apenas
  scaffolding. O `SeedLoader` **ignora** o diretório `templates/` — templates
  nunca viram entidades vivas (decisão 0015).

## ToDo — a explorar posteriormente

1. **Entidades de evento** que consomem o Venue: `Concert` (`venueId`), `Tour`,
   `Festival`, `Award`, `Booking`, `LiveAlbum` (`sourceConcertIds`). Nada de
   agenda/receita/histórico na entidade Venue.
2. **`City` como entidade** (hoje `city` é texto) — planejamento de turnês,
   deslocamento, saturação de shows.
3. **Propriedade de venues** (`labelOwnerId?`) quando houver o sistema.
4. **Uso dos modificadores** (`acousticQuality`, `facilities`, `operatingCost`,
   `prestige`, `marketImportance`, `bookingDifficulty`, `defaultTicketPriceMultiplier`)
   pelos sistemas de turnê, receita, qualidade de show e gravação ao vivo.
