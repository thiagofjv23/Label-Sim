import { describe, it, expect } from "vitest";
import { resolveChartPeriod } from "../src/systems/chartPeriod.js";
import { GameDate } from "../src/engine/time/GameDate.js";

describe("resolveChartPeriod", () => {
  it("semana: de segunda a domingo contendo a data (quarta-feira)", () => {
    // 2003-01-01 foi uma quarta-feira.
    const period = resolveChartPeriod("Weekly", GameDate.fromCalendar(2003, 1, 1));
    expect(period.start.toISO()).toBe("2002-12-30"); // segunda
    expect(period.end.toISO()).toBe("2003-01-05"); // domingo
  });

  it("semana: numa segunda-feira, o periodo comeca no proprio dia", () => {
    // 2003-01-06 foi uma segunda-feira.
    const period = resolveChartPeriod("Weekly", GameDate.fromCalendar(2003, 1, 6));
    expect(period.start.toISO()).toBe("2003-01-06");
    expect(period.end.toISO()).toBe("2003-01-12");
  });

  it("semana: num domingo, o periodo termina no proprio dia", () => {
    // 2003-01-05 foi um domingo.
    const period = resolveChartPeriod("Weekly", GameDate.fromCalendar(2003, 1, 5));
    expect(period.start.toISO()).toBe("2002-12-30");
    expect(period.end.toISO()).toBe("2003-01-05");
  });

  it("mes: do dia 1 ao ultimo dia (fevereiro nao bissexto)", () => {
    const period = resolveChartPeriod("Monthly", GameDate.fromCalendar(2003, 2, 15));
    expect(period.start.toISO()).toBe("2003-02-01");
    expect(period.end.toISO()).toBe("2003-02-28");
  });

  it("mes: dezembro vira para o ultimo dia do ano", () => {
    const period = resolveChartPeriod("Monthly", GameDate.fromCalendar(2003, 12, 10));
    expect(period.start.toISO()).toBe("2003-12-01");
    expect(period.end.toISO()).toBe("2003-12-31");
  });
});
