import { describe, expect, it } from "vitest";
import type { Ticket } from "@/domain/entities/Ticket";
import {
  buildLotteryVerifierSummary,
  normalizeNumber,
  selectLotteryResultDates,
  verifyTicketAgainstDraws,
  type LotteryDraw,
} from "@/presentation/lib/lotteryVerifier";

function makeTicket(overrides: Partial<Ticket>): Ticket {
  return {
    id: "ticket-1",
    userId: "user-1",
    title: "Chance nocturno",
    gameType: "Lotería",
    gameNumber: "3777",
    gameDate: new Date("2026-05-20T20:00:00.000Z"),
    amount: 5000,
    place: "Bogota",
    status: "Pendiente",
    notes: null,
    createdAt: new Date("2026-05-19T12:00:00.000Z"),
    updatedAt: new Date("2026-05-19T12:00:00.000Z"),
    ...overrides,
  };
}

const draw: LotteryDraw = {
  lottery: "VALLE",
  slug: "valle",
  date: "2026-05-20",
  result: "3777",
  series: "054",
};

describe("lottery verifier", () => {
  it("normalizes user-entered ticket numbers", () => {
    expect(normalizeNumber("# 03-777")).toBe("03777");
  });

  it("detects exact matches against official draws", () => {
    const verification = verifyTicketAgainstDraws(makeTicket({}), [draw]);

    expect(verification.kind).toBe("Exacta");
    expect(verification.confidence).toBe(100);
    expect(verification.matchedDraw?.lottery).toBe("VALLE");
  });

  it("detects last two digit matches", () => {
    const verification = verifyTicketAgainstDraws(
      makeTicket({ gameNumber: "9077" }),
      [draw],
    );

    expect(verification.kind).toBe("Últimos 2");
    expect(verification.matchedDraw?.result).toBe("3777");
  });

  it("selects today plus due ticket dates for external queries", () => {
    const dates = selectLotteryResultDates(
      [
        makeTicket({ id: "due", gameDate: new Date("2026-05-20T20:00:00.000Z") }),
        makeTicket({
          id: "future",
          gameDate: new Date("2026-06-08T20:00:00.000Z"),
        }),
      ],
      new Date("2026-05-21T12:00:00.000Z"),
    );

    expect(dates).toEqual(["2026-05-21", "2026-05-20"]);
  });

  it("summarizes verified and future watch tickets", () => {
    const summary = buildLotteryVerifierSummary(
      [
        makeTicket({ id: "due" }),
        makeTicket({
          id: "future",
          gameDate: new Date("2026-06-08T20:00:00.000Z"),
        }),
      ],
      [{ date: "2026-05-20", results: [draw] }],
      new Date("2026-05-21T12:00:00.000Z"),
    );

    expect(summary.dueCount).toBe(1);
    expect(summary.futureWatchCount).toBe(1);
    expect(summary.strongMatchCount).toBe(1);
  });
});
