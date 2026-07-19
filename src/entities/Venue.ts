import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Local fisico onde ocorrem shows, festivais, premiacoes e eventos promocionais.
 *
 * Contrato de dados que espelha os JSON de `database/venues`. Guarda apenas
 * caracteristicas PERMANENTES do local. Agenda, publico, receita, eventos
 * realizados e disponibilidade de datas pertencem a outros sistemas
 * (`Concert`, `Tour`, `Booking`, ...). Ver `docs/03_Entities/Venue.md` e a
 * decisao 0015.
 */
export interface Venue extends Entity {
  readonly type: "Venue";

  /** Nome principal do local. */
  name: string;

  /** Classificacao estrutural do local. */
  venueType: VenueType;

  /** Pais do venue (referencia a `Country`). Acessa dados do mercado. */
  countryId: EntityId;
  /** Estado/provincia, ou `null` quando nao aplicavel. */
  state: string | null;
  /** Cidade (texto ate existir uma entidade `City`). */
  city: string;

  /** Ano de inicio de operacao. */
  openedYear: number;
  /** Ano de fechamento permanente, ou `null` se ativo. */
  closedYear: number | null;

  capacity: VenueCapacity;
  stage: VenueStage;

  /** Qualidade geral da infraestrutura [0, 100]. */
  facilities: number;

  /** Tipos de evento aceitos pelo local. */
  allowedEventTypes: VenueEventType[];

  /** Afinidade de genero (referencias opcionais a `Genre`). Modificador pequeno. */
  genreAffinityIds: EntityId[];

  /** Importancia comercial e midiatica no mercado [0, 100]. */
  marketImportance: number;
  /** Importancia historica, cultural e simbolica [0, 100]. */
  prestige: number;
  /** Indice relativo de custo-base de uso [0, 100] (nao e valor monetario). */
  operatingCost: number;
  /** Dificuldade-base de reservar o venue [0, 100]. */
  bookingDifficulty: number;

  /** Multiplicador-base do preco dos ingressos (> 0; 1 = padrao). */
  defaultTicketPriceMultiplier: number;

  /** Espaco principal fechado (descreve o venue como um todo). */
  indoor: boolean;
  /** Habilitado na base (ver `isVenueAvailable`). */
  active: boolean;
}

/** Classificacao estrutural do venue. */
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
  | "CulturalCenter";

/** Maior tamanho de producao suportado (ordem: Small < Medium < Large < Mega). */
export type VenueStageSize = "Small" | "Medium" | "Large" | "Mega";

/** Tipos de evento que um venue pode aceitar. */
export type VenueEventType =
  | "Concert"
  | "Festival"
  | "Award"
  | "Promotional"
  | "TV"
  | "Corporate";

/** Capacidades maximas por configuracao de show. */
export interface VenueCapacity {
  /** Publico em pe e sentado. */
  concert: number;
  /** Configuracao exclusivamente sentada (<= `concert`). */
  seatedConcert: number;
}

/** Caracteristicas permanentes da estrutura de apresentacao. */
export interface VenueStage {
  /** Possui palco permanente. */
  builtIn: boolean;
  maxStageSize: VenueStageSize;
  /** Area principal coberta (ver tambem `indoor`). */
  roof: boolean;
  /** Qualidade acustica [0, 100]. */
  acousticQuality: number;
}
