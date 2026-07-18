import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Entity } from "../entities/Entity.js";
import type { World } from "./World.js";

/**
 * Carregador de dados semente.
 *
 * Le os arquivos JSON canonicos de `database/` (artistas, musicas, gravadoras,
 * etc.) e os insere no {@link World}. A carga e deterministica: os arquivos sao
 * ordenados por `id` antes da insercao, de modo que a ordem do sistema de
 * arquivos nunca afeta o resultado da simulacao.
 */

/** Extensao dos arquivos de dados reconhecidos. */
const JSON_EXTENSION = ".json";

/** Le e valida todas as entidades JSON de um diretorio, recursivamente. */
export function readEntitiesFromDir(rootDir: string): Entity[] {
  const files = collectJsonFiles(rootDir).sort();
  const entities = files.map((file) => parseEntity(file));
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
      result.push(...collectJsonFiles(fullPath));
    } else if (name.endsWith(JSON_EXTENSION)) {
      result.push(fullPath);
    }
  }
  return result;
}

/** Le e valida minimamente um arquivo de entidade. */
function parseEntity(file: string): Entity {
  const raw = JSON.parse(readFileSync(file, "utf-8")) as Partial<Entity>;
  if (typeof raw.id !== "string" || typeof raw.type !== "string") {
    throw new Error(`Entidade invalida em ${file}: 'id' e 'type' sao obrigatorios`);
  }
  return raw as Entity;
}
