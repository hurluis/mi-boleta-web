import { describe, expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { mapApiError } from "@/infrastructure/http/errors";
import {
  ConflictError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/domain/errors/DomainError";

function makeAxiosError(status: number, message: string) {
  const headers = new AxiosHeaders();
  const err = new AxiosError(
    `HTTP ${status}`,
    "ERR_BAD_REQUEST",
    { headers } as never,
    {},
    {
      status,
      statusText: "X",
      headers,
      data: { error: message },
      config: { headers } as never,
    },
  );
  return err;
}

describe("mapApiError", () => {
  it("mapea 400 a ValidationError", () => {
    const err = mapApiError(makeAxiosError(400, "Datos inválidos"));
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toBe("Datos inválidos");
  });

  it("mapea 401 a UnauthorizedError", () => {
    expect(mapApiError(makeAxiosError(401, "x"))).toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it("mapea 403 a ForbiddenError", () => {
    expect(mapApiError(makeAxiosError(403, "x"))).toBeInstanceOf(ForbiddenError);
  });

  it("mapea 404 a NotFoundError", () => {
    expect(mapApiError(makeAxiosError(404, "x"))).toBeInstanceOf(NotFoundError);
  });

  it("mapea 409 a ConflictError", () => {
    expect(mapApiError(makeAxiosError(409, "Email registrado"))).toBeInstanceOf(
      ConflictError,
    );
  });

  it("mapea errores sin response a NetworkError", () => {
    const err = new AxiosError("network");
    expect(mapApiError(err)).toBeInstanceOf(NetworkError);
  });
});
