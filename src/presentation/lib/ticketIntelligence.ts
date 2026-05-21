import { differenceInCalendarDays, isSameDay } from "date-fns";
import type { Ticket } from "@/domain/entities/Ticket";
import type { ColombiaHoliday } from "@/presentation/hooks/useColombiaHolidays";

export type PriorityLevel = "Alta" | "Media" | "Baja";

export type TicketInsight = {
  ticket: Ticket;
  score: number;
  level: PriorityLevel;
  daysLeft: number;
  holidayName: string | null;
  reasons: string[];
};

export type TicketIntelligence = {
  insights: TicketInsight[];
  urgentCount: number;
  holidayCollisionCount: number;
  overdueCount: number;
  pendingAmount: number;
  exportableTickets: Ticket[];
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function levelFromScore(score: number): PriorityLevel {
  if (score >= 60) return "Alta";
  if (score >= 35) return "Media";
  return "Baja";
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function findHoliday(date: Date, holidays: ColombiaHoliday[]): ColombiaHoliday | null {
  return (
    holidays.find((holiday) => {
      const holidayDate = new Date(`${holiday.date}T00:00:00`);
      return isSameDay(holidayDate, date);
    }) ?? null
  );
}

function formatIcsDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    "T",
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    "Z",
  ].join("");
}

function escapeIcsText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

export function buildTicketIntelligence(
  tickets: Ticket[],
  holidays: ColombiaHoliday[],
  now: Date = new Date(),
): TicketIntelligence {
  const pendingTickets = tickets.filter((ticket) => ticket.status === "Pendiente");
  const amounts = pendingTickets
    .map((ticket) => ticket.amount ?? 0)
    .filter((amount) => amount > 0)
    .sort((a, b) => a - b);
  const highAmount = amounts.length > 0 ? amounts[Math.floor(amounts.length * 0.75)] : 0;
  const today = normalizeDate(now);

  const insights = pendingTickets.map<TicketInsight>((ticket) => {
    const gameDate = normalizeDate(ticket.gameDate);
    const daysLeft = differenceInCalendarDays(gameDate, today);
    const holiday = findHoliday(gameDate, holidays);
    const amount = ticket.amount ?? 0;
    const reasons: string[] = [];
    let score = 20;

    if (daysLeft < 0) {
      score += 45;
      reasons.push("resultado vencido");
    } else if (daysLeft === 0) {
      score += 42;
      reasons.push("sortea hoy");
    } else if (daysLeft <= 2) {
      score += 34;
      reasons.push("sortea muy pronto");
    } else if (daysLeft <= 7) {
      score += 24;
      reasons.push("esta semana");
    } else if (daysLeft <= 30) {
      score += 12;
      reasons.push("seguimiento cercano");
    }

    if (holiday) {
      score += 16;
      reasons.push(`festivo: ${holiday.localName}`);
    }

    if (amount > 0 && amount >= highAmount) {
      score += 14;
      reasons.push("monto alto");
    } else if (amount > 0) {
      score += 7;
      reasons.push("monto registrado");
    }

    if (!ticket.gameNumber) {
      score += 6;
      reasons.push("sin número");
    }

    if (!ticket.place) {
      score += 4;
      reasons.push("sin lugar");
    }

    const finalScore = clampScore(score);

    return {
      ticket,
      score: finalScore,
      level: levelFromScore(finalScore),
      daysLeft,
      holidayName: holiday?.localName ?? null,
      reasons: reasons.slice(0, 3),
    };
  });

  const sortedInsights = insights.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.ticket.gameDate.getTime() - b.ticket.gameDate.getTime();
  });

  const exportableTickets = pendingTickets
    .filter((ticket) => ticket.gameDate.getTime() >= today.getTime())
    .sort((a, b) => a.gameDate.getTime() - b.gameDate.getTime());

  return {
    insights: sortedInsights,
    urgentCount: sortedInsights.filter((insight) => insight.level === "Alta").length,
    holidayCollisionCount: sortedInsights.filter((insight) => insight.holidayName).length,
    overdueCount: sortedInsights.filter((insight) => insight.daysLeft < 0).length,
    pendingAmount: pendingTickets.reduce((sum, ticket) => sum + (ticket.amount ?? 0), 0),
    exportableTickets,
  };
}

export function buildTicketsCalendar(tickets: Ticket[], now: Date = new Date()): string {
  const stamp = formatIcsDate(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mi Boleta//Radar Inteligente//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  tickets.forEach((ticket) => {
    const start = ticket.gameDate;
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const description = [
      `Tipo: ${ticket.gameType}`,
      ticket.gameNumber ? `Número: ${ticket.gameNumber}` : null,
      ticket.amount ? `Apostado: ${ticket.amount}` : null,
      ticket.notes ? `Notas: ${ticket.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${ticket.id}@mi-boleta.local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(`Revisar ${ticket.title}`)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `LOCATION:${escapeIcsText(ticket.place ?? "Sin lugar registrado")}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(`Revisar resultado de ${ticket.title}`)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
