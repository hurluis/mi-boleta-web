import { describe, expect, it, vi } from "vitest";
import { LoginUser } from "@/application/usecases/auth/LoginUser";
import type { AuthRepository } from "@/domain/repositories/AuthRepository";
import type { TokenStorage } from "@/application/ports/TokenStorage";
import type { SessionStorage } from "@/application/ports/SessionStorage";
import type { PublicUser } from "@/domain/entities/User";

const user: PublicUser = {
  id: "u-1",
  name: "Juan",
  email: "juan@example.com",
  role: "user",
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

function makeDeps() {
  const repo: AuthRepository = {
    login: vi.fn().mockResolvedValue({ token: "tok-123", user }),
    register: vi.fn(),
  };
  const tokenStorage: TokenStorage = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  };
  const sessionStorage: SessionStorage = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  };
  return { repo, tokenStorage, sessionStorage };
}

describe("LoginUser", () => {
  it("autentica y persiste token + sesión", async () => {
    const { repo, tokenStorage, sessionStorage } = makeDeps();
    const useCase = new LoginUser(repo, tokenStorage, sessionStorage);

    const result = await useCase.execute({
      email: "juan@example.com",
      password: "secret123",
    });

    expect(repo.login).toHaveBeenCalledWith({
      email: "juan@example.com",
      password: "secret123",
    });
    expect(tokenStorage.set).toHaveBeenCalledWith("tok-123");
    expect(sessionStorage.set).toHaveBeenCalledWith(user);
    expect(result.token).toBe("tok-123");
    expect(result.user).toEqual(user);
  });

  it("no persiste nada si el repositorio falla", async () => {
    const { repo, tokenStorage, sessionStorage } = makeDeps();
    (repo.login as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Credenciales inválidas"),
    );
    const useCase = new LoginUser(repo, tokenStorage, sessionStorage);

    await expect(
      useCase.execute({ email: "x", password: "y" }),
    ).rejects.toThrow("Credenciales inválidas");

    expect(tokenStorage.set).not.toHaveBeenCalled();
    expect(sessionStorage.set).not.toHaveBeenCalled();
  });
});
