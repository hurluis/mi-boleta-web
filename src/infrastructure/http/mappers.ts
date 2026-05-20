import type {
  Ticket,
  TicketWithOwner,
} from "@/domain/entities/Ticket";
import type { PublicUser } from "@/domain/entities/User";

type RawTicket = Omit<Ticket, "gameDate" | "createdAt" | "updatedAt" | "amount"> & {
  gameDate: string;
  createdAt: string;
  updatedAt: string;
  amount: number | string | null;
};

type RawTicketWithOwner = RawTicket & {
  owner: TicketWithOwner["owner"];
};

type RawPublicUser = Omit<PublicUser, "createdAt"> & {
  createdAt: string;
};

export function reviveTicket(raw: RawTicket): Ticket {
  return {
    ...raw,
    gameDate: new Date(raw.gameDate),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    amount: raw.amount === null ? null : Number(raw.amount),
  };
}

export function reviveTicketWithOwner(raw: RawTicketWithOwner): TicketWithOwner {
  return {
    ...reviveTicket(raw),
    owner: raw.owner,
  };
}

export function revivePublicUser(raw: RawPublicUser): PublicUser {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
  };
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key as keyof T] = value as T[keyof T];
    }
  }
  return out;
}
