"use client";

import { Search } from "lucide-react";
import { GAME_TYPES, TICKET_STATUSES } from "@/domain/entities/Ticket";
import type { GameType, TicketStatus } from "@/domain/entities/Ticket";
import { Input } from "@/presentation/components/ui/Input";
import { Select } from "@/presentation/components/ui/Select";
import { Label } from "@/presentation/components/ui/Label";

export type TicketFilterValues = {
  q: string;
  status: TicketStatus | "";
  gameType: GameType | "";
};

type Props = {
  value: TicketFilterValues;
  onChange: (next: TicketFilterValues) => void;
  searchPlaceholder?: string;
};

export function TicketFiltersBar({
  value,
  onChange,
  searchPlaceholder = "Buscar por título o número…",
}: Props) {
  return (
    <div className="grid gap-3 rounded-lg border border-soft bg-surface/90 p-4 shadow-card sm:grid-cols-[1fr_180px_180px]">
      <div className="relative">
        <Label htmlFor="filter-q" className="sr-only">
          Buscar
        </Label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <Input
          id="filter-q"
          type="search"
          placeholder={searchPlaceholder}
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          className="pl-9"
        />
      </div>
      <div>
        <Label htmlFor="filter-status" className="sr-only">
          Filtrar por estado
        </Label>
        <Select
          id="filter-status"
          value={value.status}
          onChange={(e) =>
            onChange({ ...value, status: e.target.value as TicketStatus | "" })
          }
        >
          <option value="">Todos los estados</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-gameType" className="sr-only">
          Filtrar por tipo de juego
        </Label>
        <Select
          id="filter-gameType"
          value={value.gameType}
          onChange={(e) =>
            onChange({
              ...value,
              gameType: e.target.value as GameType | "",
            })
          }
        >
          <option value="">Todos los tipos</option>
          {GAME_TYPES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
