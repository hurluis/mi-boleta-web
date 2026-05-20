import type { TokenStorage } from "@/application/ports/TokenStorage";
import type { SessionStorage } from "@/application/ports/SessionStorage";

export class LogoutUser {
  constructor(
    private readonly tokenStorage: TokenStorage,
    private readonly sessionStorage: SessionStorage,
  ) {}

  execute(): void {
    this.tokenStorage.clear();
    this.sessionStorage.clear();
  }
}
