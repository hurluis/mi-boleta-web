import type { PublicUser } from "@/domain/entities/User";
import type {
  AuthRepository,
  RegisterInput,
} from "@/domain/repositories/AuthRepository";

export class RegisterUser {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(input: RegisterInput): Promise<PublicUser> {
    return this.authRepository.register(input);
  }
}
