import { describe, expect, it } from "vitest";
import type { Ticket } from "@/domain/entities/Ticket";
import type { ColombiaHoliday } from "@/presentation/hooks/useColombiaHolidays";
import {
  buildTicketIntelligence,
  buildTicketsCalendar,
} from "@/presentation/lib/ticketIntelligence";

function makeTicket(overrides: Partial<Ticket>): Ticket {
  return {
    id: "ticket-1",
    userId: "user-1",
    title: "Rifa especial",
    gameType: "Rifa",
    gameNumber: "0608",
    gameDate: new Date("2026-06-08T20:00:00.000Z"),
    amount: 5000,
    place: "Bogota",
    status: "Pendiente",
    notes: null,
    createdAt: new Date("2026-05-20T12:00:00.000Z"),
    updatedAt: new Date("2026-05-20T12:00:00.000Z"),
    ...overrides,
  };
}

describe("ticket intelligence", () => {
  it("prioritizes pending tickets close to holidays", () => {
    const holidays: ColombiaHoliday[] = [
      {
        date: "2026-06-08",
        localName: "Corpus Christi",
        name: "Corpus Christi",
        countryCode: "CO",
        global: true,
        types: ["Public"],
      },
    ];

    const result = buildTicketIntelligence(
      [
        makeTicket({ id: "holiday-ticket" }),
        makeTicket({
          id: "later-ticket",
          title: "Sorteo lejano",
          gameDate: new Date("2026-09-01T20:00:00.000Z"),
          amount: 1000,
        }),
      ],
      holidays,
      new Date("2026-06-06T12:00:00.000Z"),
    );

    expect(result.insights[0].ticket.id).toBe("holiday-ticket");
    expect(result.insights[0].level).toBe("Alta");
    expect(result.insights[0].holidayName).toBe("Corpus Christi");
    expect(result.holidayCollisionCount).toBe(1);
  });

  it("exports upcoming pending tickets as calendar events", () => {
    const calendar = buildTicketsCalendar(
      [makeTicket({ notes: "Revisar resultado" })],
      new Date("2026-05-21T12:00:00.000Z"),
    );

    expect(calendar).toContain("BEGIN:VCALENDAR");
    expect(calendar).toContain("BEGIN:VEVENT");
    expect(calendar).toContain("SUMMARY:Revisar Rifa especial");
    expect(calendar).toContain("BEGIN:VALARM");
  });
});
