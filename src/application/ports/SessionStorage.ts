import type { PublicUser } from "@/domain/entities/User";

export interface SessionStorage {
  get(): PublicUser | null;
  set(user: PublicUser): void;
  clear(): void;
}
