import { describe, expect, it } from "vitest";
import { ticketSchema } from "@/presentation/lib/validation/ticket.schemas";

describe("ticketSchema", () => {
  it("acepta un ticket válido con campos opcionales en blanco", () => {
    const result = ticketSchema.safeParse({
      title: "Lotería de Medellín",
      gameType: "Lotería",
      gameNumber: "",
      gameDate: "2026-06-15T20:00:00",
      amount: "",
      place: "",
      status: "Pendiente",
      notes: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gameNumber).toBeUndefined();
      expect(result.data.amount).toBeUndefined();
      expect(result.data.place).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
    }
  });

  it("rechaza un gameType inválido", () => {
    const result = ticketSchema.safeParse({
      title: "X",
      gameType: "Otro",
      gameDate: "2026-06-15T20:00:00",
      status: "Pendiente",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza un amount negativo", () => {
    const result = ticketSchema.safeParse({
      title: "X",
      gameType: "Lotería",
      gameDate: "2026-06-15T20:00:00",
      amount: -10,
      status: "Pendiente",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza fechas inválidas", () => {
    const result = ticketSchema.safeParse({
      title: "X",
      gameType: "Lotería",
      gameDate: "no-es-fecha",
      status: "Pendiente",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza un título de más de 120 caracteres", () => {
    const result = ticketSchema.safeParse({
      title: "x".repeat(121),
      gameType: "Lotería",
      gameDate: "2026-06-15T20:00:00",
      status: "Pendiente",
    });
    expect(result.success).toBe(false);
  });
});
