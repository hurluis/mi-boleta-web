import { AxiosError } from "axios";
import {
  ConflictError,
  DomainError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/domain/errors/DomainError";

export function mapApiError(error: unknown): DomainError {
  if (error instanceof DomainError) return error;

  if (error instanceof AxiosError) {
    if (!error.response) {
      return new NetworkError(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    }

    const status = error.response.status;
    const payload = error.response.data as { error?: string } | undefined;
    const message = payload?.error ?? error.message;

    switch (status) {
      case 400:
        return new ValidationError(message);
      case 401:
        return new UnauthorizedError(message);
      case 403:
        return new ForbiddenError(message);
      case 404:
        return new NotFoundError(message);
      case 409:
        return new ConflictError(message);
      default:
        return new DomainError(message, "API_ERROR", status);
    }
  }

  const message =
    error instanceof Error ? error.message : "Ha ocurrido un error inesperado";
  return new DomainError(message);
}
