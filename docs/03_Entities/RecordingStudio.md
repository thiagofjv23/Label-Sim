Entidade RecordingStudio
Representa um estúdio profissional no qual músicas podem ser gravadas, mixadas ou masterizadas.

Exemplo de RecordingStudio
{
  "id": "recording_studio_mosh",
  "type": "RecordingStudio",

  "name": "Mosh Studios",
  "description": "Estúdio profissional brasileiro de gravação, mixagem e masterização.",

  "location": {
    "city": "São Paulo",
    "state": "São Paulo",
    "countryId": "country_brazil"
  },

  "activeFromYear": 1979,
  "activeToYear": null,

  "quality": 88,
  "facilities": 84,
  "prestige": 82,

  "technology": "Hybrid",

  "services": [
    "Recording",
    "Mixing",
    "Mastering"
  ],

  "dailyCost": {
    "amount": 8000,
    "currency": "BRL"
  }
}

Definição dos campos
Campo
Tipo
Regra
id
string
Identificador único
type
"RecordingStudio"
Tipo fixo da entidade
name
string
Nome comercial do estúdio
description
string opcional
Texto apenas para interface
location
object
Cidade, estado e mercado ao qual pertence
activeFromYear
number
Ano em que o estúdio começa a operar
activeToYear
number | null
Ano de encerramento permanente
quality
number
Qualidade técnica geral, de 0 a 100
facilities
number
Estrutura, conforto e capacidade operacional, de 0 a 100
prestige
number
Reputação do estúdio na indústria, de 0 a 100
technology
string
Analog, Digital ou Hybrid
services
string[]
Etapas de produção disponíveis
dailyCost
object
Custo-base por dia de utilização
Campo quality
quality concentra em uma única nota:
acústica das salas;
qualidade dos equipamentos;
capacidade de captação;
estrutura técnica de gravação;
qualidade técnica disponível para mixagem e masterização.
Ele representa apenas o potencial oferecido pelo estúdio. A nota não substitui a competência do produtor, dos músicos ou de outros profissionais envolvidos.

studioQualityContribution =
  recordingStudio.quality × studioQualityWeight

A contribuição efetiva ainda pode ser limitada por:
competência do produtor;
desempenho do artista;
orçamento disponível;
duração das sessões;
qualidade original da composição.
Regras de implementação
Todos os atributos de avaliação usam escala de 0 a 100.
quality não deve mudar a cada gravação.
Resultados específicos devem ser registrados na futura RecordingSession.
dailyCost representa o valor-base em 2005 e pode sofrer alterações econômicas durante a simulação.
O proprietário somente deve ser armazenado quando o estúdio pertencer a uma Label.
Como o Mosh Studios não pertence a uma gravadora do jogo, o exemplo não possui ownerLabelId.
Disponibilidade, reservas e ocupação não pertencem à entidade permanente; são estados dinâmicos administrados pelo sistema de sessões.

---

## Modelagem aplicada (implementação)

- **Contrato:** `src/entities/RecordingStudio.ts` (`RecordingStudio`,
  `StudioLocation`, `StudioTechnology`, `StudioService`, `StudioDailyCost`).
  `description` é herdado da base `Entity` (opcional, apenas UI).
- **Comportamento (lado sistema):** `src/systems/recordingStudio.ts`:
  - `isStudioActive(studio, currentYear)` — dentro de `activeFromYear`..`activeToYear`;
  - `studioOffersService(studio, service)`;
  - `validateRecordingStudio(studio)` — faixas [0,100], anos, `dailyCost.amount > 0`,
    prefixo do id, serviços não vazios.
- **Validação de referências:** `location.countryId → Country` e (quando presente)
  `ownerLabelId → Label`.
- **`ownerLabelId` opcional:** só existe quando o estúdio pertence a uma `Label`.
  O Mosh Studios é independente — não possui o campo.
- **Instância:** `database/studios/Estudio Exemplo - Mosh Studios.json`
  (`recording_studio_mosh`).
- **Estático vs. dinâmico (0004):** `quality` é potencial permanente e não muda a
  cada gravação; resultados por sessão pertencem à futura `RecordingSession`.

## ToDo — a explorar posteriormente

1. **`RecordingSession`** — sessões de gravação/mixagem/masterização que consomem
   o estúdio; resultados por sessão (qualidade obtida, custo real) vivem aqui.
2. **Fórmula de contribuição** `quality × studioQualityWeight`, limitada por
   produtor, artista, orçamento e duração — no sistema de produção musical.
3. **Custo dinâmico:** `dailyCost` é base de 2005; um sistema econômico pode
   ajustá-lo ao longo do tempo.
4. **Propriedade por gravadora** via `ownerLabelId` quando surgirem estúdios de
   Label.
