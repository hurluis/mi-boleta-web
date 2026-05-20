export class DomainError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(message: string, code = "DOMAIN_ERROR", statusCode = 500) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Sesión inválida o expirada") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "No tienes permisos para esta acción") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Recurso no encontrado") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message = "Conflicto con el estado actual del recurso") {
    super(message, "CONFLICT", 409);
    this.name = "ConflictError";
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Datos inválidos") {
    super(message, "VALIDATION", 400);
    this.name = "ValidationError";
  }
}

export class NetworkError extends DomainError {
  constructor(message = "No se pudo conectar con el servidor") {
    super(message, "NETWORK", 0);
    this.name = "NetworkError";
  }
}
