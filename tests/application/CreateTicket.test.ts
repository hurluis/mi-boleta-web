import { describe, expect, it, vi } from "vitest";
import { CreateTicket } from "@/application/usecases/tickets/CreateTicket";
import type { TicketRepository } from "@/domain/repositories/TicketRepository";
import type { Ticket } from "@/domain/entities/Ticket";

const sampleTicket: Ticket = {
  id: "t-1",
  userId: "u-1",
  title: "Lotería de Medellín",
  gameType: "Lotería",
  gameNumber: "1234",
  gameDate: new Date("2026-06-15T20:00:00Z"),
  amount: 5000,
  place: "Tienda La Esquina",
  status: "Pendiente",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CreateTicket", () => {
  it("delega en el repositorio con los datos exactos", async () => {
    const repo: TicketRepository = {
      list: vi.fn(),
      getById: vi.fn(),
      create: vi.fn().mockResolvedValue(sampleTicket),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const useCase = new CreateTicket(repo);

    const input = {
      title: "Lotería de Medellín",
      gameType: "Lotería" as const,
      gameNumber: "1234",
      gameDate: new Date("2026-06-15T20:00:00Z"),
      amount: 5000,
      place: "Tienda La Esquina",
      status: "Pendiente" as const,
      notes: null,
    };

    const result = await useCase.execute(input);

    expect(repo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(sampleTicket);
  });
});
