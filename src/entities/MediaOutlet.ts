import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Veiculo de midia (programa de TV/radio, revista, jornal, site) no qual
 * artistas e bandas podem se apresentar ou se promover.
 *
 * Contrato de dados que espelha os JSON de `database/media`. `MediaOutlet` guarda
 * apenas as caracteristicas PERMANENTES do veiculo. Cada ocorrencia no calendario
 * e uma `MediaEdition` (dinamica) e cada participacao e uma `MediaBooking`
 * (dinamica) — ambas geradas pelos sistemas, nunca armazenadas aqui
 * (principio 0004). Ver `docs/03_Entities/MediaOutlet.md` e a decisao 0017.
 */
export interface MediaOutlet extends Entity {
  readonly type: "MediaOutlet";

  /** Nome publico do veiculo/programa/publicacao. */
  name: string;

  /** Mercado principal onde produz impacto (referencia a `Country`). */
  countryId: EntityId;

  mediaType: MediaType;
  status: MediaOutletStatus;

  /** Ano em que comecou a funcionar. */
  activeFromYear: number;
  /** Ano de encerramento, ou `null` se ainda ativo no periodo. */
  activeToYear: number | null;

  /** Importancia, reconhecimento e dificuldade de acesso [0, 100]. */
  prestige: number;
  /** Alcance potencial dentro do mercado (tamanho do impacto) [0, 100]. */
  audienceReach: number;

  /** Quando as edicoes devem ser geradas no calendario. */
  availability: MediaAvailability;

  /** Maximo de artistas/bandas por edicao (cada um ocupa uma vaga). */
  editionCapacity: number;

  /** Requisitos-base para uma label tentar reservar uma vaga. */
  bookingRules: MediaBookingRules;

  /** Acoes promocionais possiveis nesta MediaOutlet. */
  appearanceTypes: MediaAppearanceType[];

  /** Tipos de entidade que podem ocupar uma vaga (`Artist`, `Band`). */
  supportedEntityTypes: MediaSupportedEntity[];
}

/** Formato da MediaOutlet. */
export type MediaType =
  | "TelevisionProgram"
  | "RadioProgram"
  | "Magazine"
  | "Newspaper"
  | "Website";

/** Situacao da MediaOutlet no periodo atual. */
export type MediaOutletStatus = "Active" | "Inactive" | "Cancelled";

/** Frequencia de publicacao/transmissao. */
export type MediaFrequency =
  | "Daily"
  | "Weekly"
  | "Biweekly"
  | "Monthly"
  | "Quarterly"
  | "Annual"
  | "Irregular";

/** Dia da semana (para geracao de edicoes semanais). */
export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/** Tipo de aparicao promocional. */
export type MediaAppearanceType =
  | "MusicalPerformance"
  | "Interview"
  | "ReleasePromotion"
  | "CareerPromotion";

/** Entidades que podem ocupar uma vaga. */
export type MediaSupportedEntity = "Artist" | "Band";

/** Regra de disponibilidade no calendario. */
export interface MediaAvailability {
  frequency: MediaFrequency;
  /** Dias da semana (frequencias semanais). */
  weekDays: WeekDay[];
  /** Dias do mes (frequencias mensais/anuais). */
  monthDays: number[];
  /** Meses permitidos (1-12); vazio = todos. */
  months: number[];
  /** Datas ISO em que nao havera edicao (excecoes). */
  excludedDates: string[];
}

/**
 * Requisitos-base de agendamento (podem compor uma pontuacao combinada).
 *
 * A antecedencia minima de reserva NAO fica aqui: e uniforme para todas as
 * MediaOutlets (clareza ao jogador) e vive na constante global
 * `MEDIA_BOOKING_LEAD_DAYS` (`src/systems/media.ts`). Ver decisao 0017.
 */
export interface MediaBookingRules {
  /** Prestigio minimo de referencia do artista/banda [0, 100]. */
  minimumArtistPrestige: number;
  /** Popularidade minima de referencia no pais da MediaOutlet [0, 100]. */
  minimumArtistPopularity: number;
  /** Prestigio minimo de referencia da label [0, 100]. */
  minimumLabelPrestige: number;
}

/**
 * Edicao dinamica de uma MediaOutlet: cada ocorrencia no calendario, disponivel
 * para agendamento. Gerada pelo sistema; nao e dado semente.
 */
export interface MediaEdition extends Entity {
  readonly type: "MediaEdition";
  mediaOutletId: EntityId;
  /** Data da edicao (ISO `AAAA-MM-DD`). */
  date: string;
  status: MediaEditionStatus;
  capacity: number;
  /** Reservas confirmadas (referencias a `MediaBooking`). */
  bookingIds: EntityId[];
}

/** Situacao de uma edicao. */
export type MediaEditionStatus = "Open" | "Full" | "Closed" | "Cancelled";

/**
 * Reserva dinamica feita por uma label para um artista/banda em uma edicao.
 * Gerada pelo sistema; nao e dado semente.
 */
export interface MediaBooking extends Entity {
  readonly type: "MediaBooking";
  mediaEditionId: EntityId;
  labelId: EntityId;
  participantId: EntityId;
  participantType: MediaSupportedEntity;
  appearanceType: MediaAppearanceType;
  /** Tipo da entidade promovida (`Song`, `Album`, `Artist`, `Band`), se houver. */
  promotedEntityType: string | null;
  /** Entidade promovida, se houver. */
  promotedEntityId: EntityId | null;
  /** Data em que a reserva foi feita (ISO). */
  bookingDate: string;
  status: MediaBookingStatus;
}

/** Situacao de uma reserva. */
export type MediaBookingStatus = "Scheduled" | "Completed" | "Cancelled" | "Rejected";
