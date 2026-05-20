import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
} from "@/presentation/lib/validation/auth.schemas";

describe("loginSchema", () => {
  it("rechaza un email inválido", () => {
    const result = loginSchema.safeParse({ email: "x", password: "12345678" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["email"]);
    }
  });

  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({
      email: "a@b.com",
      password: "x",
    });
    expect(result.success).toBe(true);
  });
});

describe("registerSchema", () => {
  it("rechaza contraseñas que no coinciden", () => {
    const result = registerSchema.safeParse({
      name: "Juan",
      email: "j@x.com",
      password: "12345678",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmIssue = result.error.issues.find((i) =>
        i.path.includes("confirmPassword"),
      );
      expect(confirmIssue?.message).toMatch(/no coinciden/i);
    }
  });

  it("rechaza contraseñas con menos de 8 caracteres", () => {
    const result = registerSchema.safeParse({
      name: "Juan",
      email: "j@x.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("acepta datos válidos", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "secret123",
      confirmPassword: "secret123",
    });
    expect(result.success).toBe(true);
  });
});
