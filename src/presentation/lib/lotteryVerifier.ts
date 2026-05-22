import type { Ticket } from "@/domain/entities/Ticket";

export type LotteryDraw = {
  lottery: string;
  slug: string;
  date: string;
  result: string;
  series: string | null;
};

export type LotteryResultDay = {
  date: string;
  results: LotteryDraw[];
};

export type LotteryMatchKind =
  | "Exacta"
  | "Últimos 3"
  | "Últimos 2"
  | "Casi"
  | "Sin coincidencia"
  | "Sin resultados";

export type LotteryVerification = {
  ticket: Ticket;
  date: string;
  kind: LotteryMatchKind;
  confidence: number;
  matchedDraw: LotteryDraw | null;
  explanation: string;
};

export type LotteryVerifierSummary = {
  verifications: LotteryVerification[];
  latestDraws: LotteryDraw[];
  dueCount: number;
  futureWatchCount: number;
  checkedCount: number;
  strongMatchCount: number;
  queriedDates: string[];
};

export function toDateKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function normalizeNumber(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((start.getTime() - end.getTime()) / 86400000);
}

function isOneDigitAway(ticketNumber: string, resultNumber: string): boolean {
  if (ticketNumber.length < 2) return false;
  const comparable = resultNumber.slice(-ticketNumber.length);
  if (comparable.length !== ticketNumber.length) return false;
  let misses = 0;

  for (let i = 0; i < ticketNumber.length; i += 1) {
    if (ticketNumber[i] !== comparable[i]) misses += 1;
    if (misses > 1) return false;
  }

  return misses === 1;
}

export function selectLotteryResultDates(
  tickets: Ticket[],
  now: Date = new Date(),
): string[] {
  const today = toDateKey(now);
  const dueDates = tickets
    .filter((ticket) => ticket.status === "Pendiente")
    .filter((ticket) => normalizeNumber(ticket.gameNumber).length >= 2)
    .filter((ticket) => daysBetween(ticket.gameDate, now) <= 0)
    .map((ticket) => toDateKey(ticket.gameDate));

  return unique([today, ...dueDates])
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7);
}

export function verifyTicketAgainstDraws(
  ticket: Ticket,
  draws: LotteryDraw[],
): LotteryVerification {
  const ticketNumber = normalizeNumber(ticket.gameNumber);
  const date = toDateKey(ticket.gameDate);

  if (draws.length === 0) {
    return {
      ticket,
      date,
      kind: "Sin resultados",
      confidence: 0,
      matchedDraw: null,
      explanation: "La API aún no publicó resultados para esta fecha.",
    };
  }

  const candidates = draws
    .map((draw) => ({ draw, resultNumber: normalizeNumber(draw.result) }))
    .filter((item) => item.resultNumber.length > 0);

  const exact = candidates.find((item) => item.resultNumber.endsWith(ticketNumber));
  if (exact) {
    return {
      ticket,
      date,
      kind: "Exacta",
      confidence: 100,
      matchedDraw: exact.draw,
      explanation: `Tu número coincide con ${exact.draw.lottery}.`,
    };
  }

  const last3 = ticketNumber.length >= 3
    ? candidates.find((item) => item.resultNumber.endsWith(ticketNumber.slice(-3)))
    : undefined;
  if (last3) {
    return {
      ticket,
      date,
      kind: "Últimos 3",
      confidence: 78,
      matchedDraw: last3.draw,
      explanation: `Coinciden los últimos 3 dígitos con ${last3.draw.lottery}.`,
    };
  }

  const last2 = ticketNumber.length >= 2
    ? candidates.find((item) => item.resultNumber.endsWith(ticketNumber.slice(-2)))
    : undefined;
  if (last2) {
    return {
      ticket,
      date,
      kind: "Últimos 2",
      confidence: 52,
      matchedDraw: last2.draw,
      explanation: `Coinciden los últimos 2 dígitos con ${last2.draw.lottery}.`,
    };
  }

  const near = candidates.find((item) => isOneDigitAway(ticketNumber, item.resultNumber));
  if (near) {
    return {
      ticket,
      date,
      kind: "Casi",
      confidence: 35,
      matchedDraw: near.draw,
      explanation: `Quedó a un dígito de ${near.draw.lottery}.`,
    };
  }

  return {
    ticket,
    date,
    kind: "Sin coincidencia",
    confidence: 0,
    matchedDraw: null,
    explanation: "No se encontraron coincidencias contra los resultados publicados.",
  };
}

export function buildLotteryVerifierSummary(
  tickets: Ticket[],
  resultDays: LotteryResultDay[],
  now: Date = new Date(),
): LotteryVerifierSummary {
  const resultMap = new Map(resultDays.map((day) => [day.date, day.results]));
  const dueTickets = tickets
    .filter((ticket) => ticket.status === "Pendiente")
    .filter((ticket) => normalizeNumber(ticket.gameNumber).length >= 2)
    .filter((ticket) => daysBetween(ticket.gameDate, now) <= 0)
    .sort((a, b) => b.gameDate.getTime() - a.gameDate.getTime());

  const futureWatchCount = tickets
    .filter((ticket) => ticket.status === "Pendiente")
    .filter((ticket) => normalizeNumber(ticket.gameNumber).length >= 2)
    .filter((ticket) => daysBetween(ticket.gameDate, now) > 0).length;

  const verifications = dueTickets
    .map((ticket) => {
      const date = toDateKey(ticket.gameDate);
      return verifyTicketAgainstDraws(ticket, resultMap.get(date) ?? []);
    })
    .sort((a, b) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence;
      return b.ticket.gameDate.getTime() - a.ticket.gameDate.getTime();
    });

  const latestDraws = resultDays
    .flatMap((day) => day.results)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const strongMatchKinds: LotteryMatchKind[] = ["Exacta", "Últimos 3", "Últimos 2"];

  return {
    verifications,
    latestDraws,
    dueCount: dueTickets.length,
    futureWatchCount,
    checkedCount: verifications.filter((item) => item.kind !== "Sin resultados").length,
    strongMatchCount: verifications.filter((item) =>
      strongMatchKinds.includes(item.kind),
    ).length,
    queriedDates: resultDays.map((day) => day.date),
  };
}
