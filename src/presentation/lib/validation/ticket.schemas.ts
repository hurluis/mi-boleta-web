import { z } from "zod";
import { GAME_TYPES, TICKET_STATUSES } from "@/domain/entities/Ticket";

export const ticketSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(120, "El título debe tener entre 1 y 120 caracteres"),

  gameType: z.enum(GAME_TYPES),

  gameNumber: z
    .string()
    .max(50, "gameNumber no puede superar 50 caracteres")
    .optional()
    .transform((v) => (v == null || v.trim() === "" ? undefined : v)),

  gameDate: z
    .string()
    .min(1, "La fecha del sorteo es obligatoria")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),

  amount: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    })
    .pipe(z.number().min(0, "El valor no puede ser negativo").optional()),

  place: z
    .string()
    .max(120, "place no puede superar 120 caracteres")
    .optional()
    .transform((v) => (v == null || v.trim() === "" ? undefined : v)),

  status: z.enum(TICKET_STATUSES),

  notes: z
    .string()
    .max(1000, "notes no puede exceder 1000 caracteres")
    .optional()
    .transform((v) => (v == null || v.trim() === "" ? undefined : v)),
});

export type TicketFormInput = z.input<typeof ticketSchema>;
export type TicketFormValues = z.output<typeof ticketSchema>;
