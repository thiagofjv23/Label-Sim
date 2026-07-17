import type { Entity } from "../entities/Entity.js";
import type { EntityId } from "../utils/IdFactory.js";
import { IdFactory } from "../utils/IdFactory.js";

/**
 * Contêiner de todo o estado da simulacao.
 *
 * O mundo guarda as entidades indexadas por ID e a fabrica de IDs. Ele nao
 * contem regras de jogo: apenas armazena e recupera dados. As regras vivem nos
 * sistemas ({@link System}), que leem e escrevem o mundo a cada tick.
 */
export class World {
  private readonly entities: Map<EntityId, Entity>;
  private readonly idFactory: IdFactory;

  constructor(idFactory?: IdFactory) {
    this.entities = new Map();
    this.idFactory = idFactory ?? new IdFactory();
  }

  /** Gera um novo ID unico para um tipo de entidade. */
  nextId(type: string): EntityId {
    return this.idFactory.next(type);
  }

  /**
   * Adiciona uma entidade ao mundo.
   * @throws Se ja existir uma entidade com o mesmo ID.
   */
  add<T extends Entity>(entity: T): T {
    if (this.entities.has(entity.id)) {
      throw new Error(`Entidade duplicada: ${entity.id}`);
    }
    this.entities.set(entity.id, entity);
    return entity;
  }

  /** Recupera uma entidade pelo ID, ou `undefined` se nao existir. */
  get(id: EntityId): Entity | undefined {
    return this.entities.get(id);
  }

  /** Remove uma entidade pelo ID. Retorna `true` se algo foi removido. */
  remove(id: EntityId): boolean {
    return this.entities.delete(id);
  }

  /** Lista todas as entidades de um dado tipo. */
  ofType<T extends Entity>(type: string): T[] {
    const result: T[] = [];
    for (const entity of this.entities.values()) {
      if (entity.type === type) {
        result.push(entity as T);
      }
    }
    return result;
  }

  /** Numero total de entidades no mundo. */
  count(): number {
    return this.entities.size;
  }

  /** Acesso a fabrica de IDs (usado pela camada de save). */
  getIdFactory(): IdFactory {
    return this.idFactory;
  }
}
