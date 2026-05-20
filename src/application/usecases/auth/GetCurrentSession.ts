import type { PublicUser } from "@/domain/entities/User";
import type { TokenStorage } from "@/application/ports/TokenStorage";
import type { SessionStorage } from "@/application/ports/SessionStorage";

export type CurrentSession = {
  token: string;
  user: PublicUser;
} | null;

export class GetCurrentSession {
  constructor(
    private readonly tokenStorage: TokenStorage,
    private readonly sessionStorage: SessionStorage,
  ) {}

  execute(): CurrentSession {
    const token = this.tokenStorage.get();
    const user = this.sessionStorage.get();
    if (!token || !user) return null;
    return { token, user };
  }
}
