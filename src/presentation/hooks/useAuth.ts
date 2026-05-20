"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import { useCases } from "@/infrastructure/di/container";
import type {
  LoginInput,
  RegisterInput,
} from "@/domain/repositories/AuthRepository";

export function useAuth() {
  const router = useRouter();
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await useCases.loginUser.execute(input);
      setSession(result.token, result.user);
      return result;
    },
    [setSession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const user = await useCases.registerUser.execute(input);
      const session = await useCases.loginUser.execute({
        email: input.email,
        password: input.password,
      });
      setSession(session.token, session.user);
      return user;
    },
    [setSession],
  );

  const logout = useCallback(() => {
    useCases.logoutUser.execute();
    clearSession();
    qc.clear();
    router.replace("/login");
  }, [clearSession, qc, router]);

  return {
    token,
    user,
    hydrated,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };
}
