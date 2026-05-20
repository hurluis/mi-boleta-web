import type {
  AuthRepository,
  LoginInput,
  LoginResult,
} from "@/domain/repositories/AuthRepository";
import type { TokenStorage } from "@/application/ports/TokenStorage";
import type { SessionStorage } from "@/application/ports/SessionStorage";

export class LoginUser {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStorage: TokenStorage,
    private readonly sessionStorage: SessionStorage,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const result = await this.authRepository.login(input);
    this.tokenStorage.set(result.token);
    this.sessionStorage.set(result.user);
    return result;
  }
}
