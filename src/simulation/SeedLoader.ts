import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Entity } from "../entities/Entity.js";
import type { World } from "./World.js";

/**
 * Carregador de dados semente.
 *
 * Le os arquivos JSON canonicos de `database/` (artistas, musicas, gravadoras,
 * etc.) e os insere no {@link World}. Cada arquivo pode conter UMA entidade
 * (objeto) ou VARIAS (array de objetos) — util para agrupar entidades
 * relacionadas. A carga e deterministica: as entidades sao ordenadas por `id`
 * antes da insercao, de modo que a ordem do sistema de arquivos nunca afeta o
 * resultado da simulacao.
 */

/** Extensao dos arquivos de dados reconhecidos. */
const JSON_EXTENSION = ".json";

/**
 * Diretorios ignorados na carga. `templates` guarda scaffolding para criar
 * entidades (nao sao dados de jogo) e nunca deve virar entidade viva.
 */
const IGNORED_DIRS = new Set<string>(["templates"]);

/** Le e valida todas as entidades JSON de um diretorio, recursivamente. */
export function readEntitiesFromDir(rootDir: string): Entity[] {
  const files = collectJsonFiles(rootDir).sort();
  const entities = files.flatMap((file) => parseEntities(file));
  entities.sort((a, b) => a.id.localeCompare(b.id));
  return entities;
}

/**
 * Carrega os dados semente de `rootDir` para dentro do `world`.
 * @returns Quantidade de entidades carregadas.
 * @throws Se algum arquivo nao contiver `id`/`type` ou houver `id` duplicado
 *   (a verificacao de duplicidade e feita por {@link World.add}).
 */
export function loadSeedData(world: World, rootDir: string): number {
  const entities = readEntitiesFromDir(rootDir);
  for (const entity of entities) {
    world.add(entity);
  }
  return entities.length;
}

/** Coleta os caminhos de todos os arquivos `.json` sob `dir`, recursivamente. */
function collectJsonFiles(dir: string): string[] {
  const result: string[] = [];
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    if (statSync(fullPath).isDirectory()) {
      if (IGNORED_DIRS.has(name)) {
        continue;
      }
      result.push(...collectJsonFiles(fullPath));
    } else if (name.endsWith(JSON_EXTENSION)) {
      result.push(fullPath);
    }
  }
  return result;
}

/** Le um arquivo com uma entidade (objeto) ou varias (array) e as valida. */
function parseEntities(file: string): Entity[] {
  const raw = JSON.parse(readFileSync(file, "utf-8")) as unknown;
  const items = Array.isArray(raw) ? raw : [raw];
  return items.map((item, index) => validateEntity(item, file, index));
}

/** Valida minimamente uma entidade (presenca de `id` e `type`). */
function validateEntity(item: unknown, file: string, index: number): Entity {
  const entity = item as Partial<Entity>;
  if (typeof entity.id !== "string" || typeof entity.type !== "string") {
    throw new Error(
      `Entidade invalida em ${file} [${index}]: 'id' e 'type' sao obrigatorios`,
    );
  }
  return entity as Entity;
}
