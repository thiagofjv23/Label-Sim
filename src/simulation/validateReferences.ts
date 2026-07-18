import type { Entity } from "../entities/Entity.js";
import type { EntityId } from "../utils/IdFactory.js";
import type { World } from "./World.js";

/**
 * Validacao de integridade referencial do mundo.
 *
 * Muitas entidades apontam para outras por ID (ex.: `Artist.labelId`,
 * `Song.genreIds`). Este modulo verifica, apos a carga, se cada referencia
 * aponta para uma entidade existente e do tipo esperado. Retorna uma lista de
 * problemas em vez de lancar excecao: durante o desenvolvimento os dados
 * semente podem estar incompletos, e o objetivo e avisar, nao interromper.
 */

/** Natureza de um problema de referencia. */
export type ReferenceIssueKind = "missing" | "type-mismatch";

/** Descreve uma referencia invalida encontrada no mundo. */
export interface ReferenceIssue {
  /** ID da entidade que contem a referencia. */
  readonly sourceId: EntityId;
  /** Caminho do campo de referencia, ex.: `labelId`, `genreIds[1]`. */
  readonly field: string;
  /** ID referenciado. */
  readonly targetId: EntityId;
  /** Tipo esperado do alvo. */
  readonly expectedType: string;
  /** `missing`: alvo inexistente. `type-mismatch`: existe, mas de outro tipo. */
  readonly kind: ReferenceIssueKind;
  /** Tipo real do alvo, presente apenas em `type-mismatch`. */
  readonly actualType?: string;
}

/**
 * Registro declarativo dos campos de referencia por tipo de entidade.
 *
 * Cada entrada mapeia um caminho de campo (suporta ponto para campos aninhados)
 * ao tipo de entidade esperado no alvo. O valor do campo pode ser um unico ID,
 * uma lista de IDs, ou `null`/ausente (ignorado).
 */
const REFERENCE_FIELDS: Record<string, Record<string, string>> = {
  Artist: {
    labelId: "Label",
    managerId: "Manager",
    "relationships.bands": "Band",
    "relationships.producers": "Producer",
    "relationships.collaborators": "Artist",
  },
  Song: {
    artistId: "Artist",
    albumId: "Album",
    writers: "Artist",
    performers: "Artist",
    genreIds: "Genre",
  },
  Label: {
    countryId: "Country",
    "relationships.artists": "Artist",
    "relationships.bands": "Band",
    "relationships.producers": "Producer",
  },
};

/**
 * Verifica todas as referencias entre entidades do mundo.
 * @returns Lista de problemas encontrados (vazia se tudo estiver integro).
 */
export function validateReferences(world: World): ReferenceIssue[] {
  const issues: ReferenceIssue[] = [];
  for (const entity of world.all()) {
    const spec = REFERENCE_FIELDS[entity.type];
    if (spec === undefined) {
      continue;
    }
    for (const [fieldPath, expectedType] of Object.entries(spec)) {
      collectFieldIssues(world, entity, fieldPath, expectedType, issues);
    }
  }
  return issues;
}

/** Formata um problema de referencia em uma linha legivel (para logs). */
export function formatReferenceIssue(issue: ReferenceIssue): string {
  if (issue.kind === "missing") {
    return `${issue.sourceId}.${issue.field} -> ${issue.targetId} (${issue.expectedType} inexistente)`;
  }
  return `${issue.sourceId}.${issue.field} -> ${issue.targetId} (esperado ${issue.expectedType}, encontrado ${issue.actualType})`;
}

/** Avalia um unico campo de referencia (string, lista de strings ou nulo). */
function collectFieldIssues(
  world: World,
  entity: Entity,
  fieldPath: string,
  expectedType: string,
  issues: ReferenceIssue[],
): void {
  const value = resolvePath(entity, fieldPath);
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      checkReference(world, entity.id, `${fieldPath}[${index}]`, item, expectedType, issues);
    });
    return;
  }
  checkReference(world, entity.id, fieldPath, value, expectedType, issues);
}

/** Registra um problema caso o alvo nao exista ou seja de outro tipo. */
function checkReference(
  world: World,
  sourceId: EntityId,
  field: string,
  targetId: unknown,
  expectedType: string,
  issues: ReferenceIssue[],
): void {
  // Referencias nulas/ausentes sao validas (ex.: artista sem gravadora).
  if (targetId === null || targetId === undefined) {
    return;
  }
  if (typeof targetId !== "string") {
    return;
  }
  const target = world.get(targetId);
  if (target === undefined) {
    issues.push({ sourceId, field, targetId, expectedType, kind: "missing" });
    return;
  }
  if (target.type !== expectedType) {
    issues.push({
      sourceId,
      field,
      targetId,
      expectedType,
      kind: "type-mismatch",
      actualType: target.type,
    });
  }
}

/** Resolve um caminho com pontos (ex.: `relationships.bands`) em um objeto. */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || typeof acc !== "object") {
      return undefined;
    }
    return (acc as Record<string, unknown>)[key];
  }, obj);
}
