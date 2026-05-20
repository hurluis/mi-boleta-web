import type { SessionStorage } from "@/application/ports/SessionStorage";
import type { PublicUser } from "@/domain/entities/User";

const USER_KEY = "mi-boleta.user";

export class LocalSessionStorage implements SessionStorage {
  get(): PublicUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PublicUser & { createdAt: string | Date };
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
      };
    } catch {
      return null;
    }
  }

  set(user: PublicUser): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      /* noop */
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch {
      /* noop */
    }
  }
}

export const localSessionStorage = new LocalSessionStorage();
