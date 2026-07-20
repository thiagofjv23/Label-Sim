export type EntityRecord = {
  id: string;
  type: string;
  name?: string;
  title?: string;
  stageName?: string;
  description?: string;
  [key: string]: unknown;
};

const rawModules = import.meta.glob(
  // templates/ e scaffolding, nao dado de jogo (alinhado ao SeedLoader / decisao 0015).
  ["../../database/**/*.json", "!../../database/templates/**"],
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
) as Record<string, string>;

function isEntity(value: unknown): value is EntityRecord {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "type" in value &&
      typeof (value as EntityRecord).id === "string",
  );
}

export const entities: EntityRecord[] = Object.entries(rawModules).flatMap(([path, raw]) => {
  try {
    const parsed: unknown = JSON.parse(raw);
    const values = Array.isArray(parsed) ? parsed : [parsed];
    return values.filter(isEntity).map((entity) => ({ ...entity, __source: path }));
  } catch {
    return [];
  }
});

export const byType = (type: string) => entities.filter((entity) => entity.type === type);
export const byId = (id: unknown) => entities.find((entity) => entity.id === id);

export function entityName(entity?: EntityRecord): string {
  if (!entity) return "Registro não localizado";
  return entity.stageName ?? entity.name ?? entity.title ?? entity.id;
}

export function resolveName(id: unknown): string {
  return typeof id === "string" ? entityName(byId(id)) : "—";
}

export function formatNumber(value: unknown): string {
  if (typeof value !== "number") return String(value ?? "—");
  return new Intl.NumberFormat("pt-BR", { notation: value >= 1_000_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

export function formatMoney(value: unknown): string {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export const entityLabels: Record<string, string> = {
  Artist: "Artista",
  Band: "Banda",
  Album: "Álbum",
  Song: "Música",
  Label: "Gravadora",
  Country: "Mercado",
  Chart: "Chart",
  Genre: "Gênero",
  Theme: "Tema",
  RecordingStudio: "Estúdio",
  Venue: "Venue",
};
