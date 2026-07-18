import type { Entity } from "./Entity.js";
import type { EntityId } from "../utils/IdFactory.js";

/**
 * Pais / mercado da simulacao.
 *
 * Contrato de dados que espelha os JSON de `database/countries`. Um pais
 * descreve um mercado musical: seu tamanho, preferencias culturais, forca de
 * midia e canais (radios, charts, gravadoras ativas). E o pano de fundo do
 * "mercado vivo" — os sistemas leem estes atributos para dimensionar audiencia,
 * receita e alcance.
 */
export interface Country extends Entity {
  readonly type: "Country";

  /**
   * Camada de apresentacao (somente UI, nao participa da simulacao).
   * Sera padronizada entre entidades futuramente — ver
   * `docs/03_Entities/Country.md` e o TODO de padronizacao de apresentacao.
   */
  display: CountryDisplay;

  officialName: string;
  /** Codigo ISO 3166-1 alpha-3, ex.: `BRA`. */
  isoCode: string;

  continent: string;
  capital: string;

  population: number;
  language: string;
  currency: string;

  /** Tamanho do mercado musical [0, 100]. */
  marketSize: number;
  /** Forca economica geral [0, 100]. */
  economicStrength: number;
  /** Peso da cultura musical local [0, 100]. */
  musicCulture: number;
  /** Forca dos veiculos de midia [0, 100]. */
  mediaStrength: number;
  /** Infraestrutura para turnes/shows [0, 100]. */
  tourInfrastructure: number;
  /** Nivel de pirataria [0, 100]. */
  piracyLevel: number;
  /** Adocao digital [0, 100]. */
  digitalAdoption: number;

  /** Afinidade do publico por genero (nome do genero -> [0, 100]). */
  genreAffinity: Record<string, number>;

  /** Influencia de cada canal na formacao de gosto [0, 100]. */
  radioInfluence: number;
  tvInfluence: number;
  internetInfluence: number;

  /** Preferencia por musica nacional vs. internacional [0, 100]. */
  domesticMusicPreference: number;
  internationalMusicPreference: number;

  /** Demanda por formato de consumo [0, 100]. */
  liveMusicDemand: number;
  physicalMediaDemand: number;
  digitalStreamingDemand: number;

  /** Cultura de festivais [0, 100]. */
  festivalCulture: number;
  /** Prestigio de premiacoes [0, 100]. */
  awardPrestige: number;

  /** Gravadoras ativas no mercado (referencias a `Label`). */
  activeLabels: EntityId[];
  /** Principais paradas do pais (referencias a `Chart`). */
  mainCharts: EntityId[];
  /** Principais redes de radio (referencias a `RadioStation`). */
  mainRadioNetworks: EntityId[];
}

/**
 * Dados de exibicao do pais (apenas UI).
 *
 * Mantido local a `Country` de proposito: a padronizacao de uma camada
 * `display` comum a varias entidades e trabalho posterior, para evitar
 * decisoes prematuras de UI enquanto o dominio se consolida.
 */
export interface CountryDisplay {
  name: string;
  shortName: string;
  /** Gentilico, ex.: `Brazilian`. */
  adjective: string;
  /** Emoji da bandeira. */
  flag: string;
  /** Cor tematica em hexadecimal, ex.: `#009739`. */
  color: string;
}
