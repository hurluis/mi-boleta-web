import { RegisterUser } from "@/application/usecases/auth/RegisterUser";
import { LoginUser } from "@/application/usecases/auth/LoginUser";
import { LogoutUser } from "@/application/usecases/auth/LogoutUser";
import { GetCurrentSession } from "@/application/usecases/auth/GetCurrentSession";
import { ListTickets } from "@/application/usecases/tickets/ListTickets";
import { GetTicketById } from "@/application/usecases/tickets/GetTicketById";
import { CreateTicket } from "@/application/usecases/tickets/CreateTicket";
import { UpdateTicket } from "@/application/usecases/tickets/UpdateTicket";
import { DeleteTicket } from "@/application/usecases/tickets/DeleteTicket";
import { ListAllTicketsAdmin } from "@/application/usecases/tickets/ListAllTicketsAdmin";

import { HttpAuthRepository } from "@/infrastructure/repositories/HttpAuthRepository";
import { HttpTicketRepository } from "@/infrastructure/repositories/HttpTicketRepository";
import { HttpAdminTicketRepository } from "@/infrastructure/repositories/HttpAdminTicketRepository";

import { localTokenStorage } from "@/infrastructure/storage/LocalTokenStorage";
import { localSessionStorage } from "@/infrastructure/storage/LocalSessionStorage";

const authRepository = new HttpAuthRepository();
const ticketRepository = new HttpTicketRepository();
const adminTicketRepository = new HttpAdminTicketRepository();

export const tokenStorage = localTokenStorage;
export const sessionStorage = localSessionStorage;

export const useCases = {
  registerUser: new RegisterUser(authRepository),
  loginUser: new LoginUser(authRepository, tokenStorage, sessionStorage),
  logoutUser: new LogoutUser(tokenStorage, sessionStorage),
  getCurrentSession: new GetCurrentSession(tokenStorage, sessionStorage),
  listTickets: new ListTickets(ticketRepository),
  getTicket: new GetTicketById(ticketRepository),
  createTicket: new CreateTicket(ticketRepository),
  updateTicket: new UpdateTicket(ticketRepository),
  deleteTicket: new DeleteTicket(ticketRepository),
  listAdminTickets: new ListAllTicketsAdmin(adminTicketRepository),
} as const;
