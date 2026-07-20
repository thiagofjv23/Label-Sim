import { describe, it, expect } from "vitest";
import { Engine } from "../src/engine/Engine.js";
import { Clock } from "../src/engine/time/Clock.js";
import { GameDate } from "../src/engine/time/GameDate.js";
import type { System, TickContext } from "../src/engine/System.js";
import { Rng } from "../src/utils/Rng.js";
import { IdFactory } from "../src/utils/IdFactory.js";

describe("GameDate", () => {
  it("converte calendario de ida e volta", () => {
    const date = GameDate.fromCalendar(1990, 1, 1);
    expect(date.toCalendar()).toEqual({ year: 1990, month: 1, day: 1 });
    expect(date.toISO()).toBe("1990-01-01");
  });

  it("soma dias atravessando o fim do mes", () => {
    const date = GameDate.fromCalendar(1990, 1, 31).addDays(1);
    expect(date.toISO()).toBe("1990-02-01");
  });
});

describe("Clock", () => {
  it("avanca ticks e reporta a data correspondente", () => {
    const clock = new Clock({ start: GameDate.fromCalendar(2000, 1, 1) });
    clock.advance(10);
    expect(clock.getTick()).toBe(10);
    expect(clock.getDate().toISO()).toBe("2000-01-11");
  });

  it("serializa e restaura o estado", () => {
    const clock = new Clock({ start: GameDate.fromCalendar(2000, 1, 1) });
    clock.advance(5);
    const restored = Clock.fromState(clock.getState());
    expect(restored.getDate().toISO()).toBe(clock.getDate().toISO());
  });
});

describe("IdFactory", () => {
  it("gera ids unicos e sequenciais por tipo", () => {
    const factory = new IdFactory();
    expect(factory.next("artist")).toBe("artist_000001");
    expect(factory.next("artist")).toBe("artist_000002");
    expect(factory.next("song")).toBe("song_000001");
  });
});

describe("Rng", () => {
  it("e deterministico para o mesmo seed", () => {
    const a = new Rng(123);
    const b = new Rng(123);
    const seqA = [a.nextFloat(), a.nextFloat(), a.nextFloat()];
    const seqB = [b.nextFloat(), b.nextFloat(), b.nextFloat()];
    expect(seqA).toEqual(seqB);
  });
});

describe("Engine", () => {
  it("executa sistemas a cada tick na ordem de registro", () => {
    const order: string[] = [];
    const makeSystem = (name: string): System => ({
      name,
      update: (_ctx: TickContext) => order.push(name),
    });
    const engine = new Engine({
      clock: new Clock({ start: GameDate.fromCalendar(1990, 1, 1) }),
      seed: 1,
    });
    engine.register(makeSystem("a")).register(makeSystem("b"));
    engine.run(2);
    expect(order).toEqual(["a", "b", "a", "b"]);
    expect(engine.getClock().getTick()).toBe(2);
  });
});
