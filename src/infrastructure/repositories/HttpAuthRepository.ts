import type {
  AuthRepository,
  LoginInput,
  LoginResult,
  RegisterInput,
} from "@/domain/repositories/AuthRepository";
import type { PublicUser } from "@/domain/entities/User";
import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiSuccess } from "@/infrastructure/http/types";
import { revivePublicUser } from "@/infrastructure/http/mappers";

type RawLogin = {
  token: string;
  user: Parameters<typeof revivePublicUser>[0];
};

export class HttpAuthRepository implements AuthRepository {
  async register(input: RegisterInput): Promise<PublicUser> {
    const { data } = await httpClient.post<ApiSuccess<Parameters<typeof revivePublicUser>[0]>>(
      "/auth/register",
      input,
    );
    return revivePublicUser(data.data);
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const { data } = await httpClient.post<ApiSuccess<RawLogin>>(
      "/auth/login",
      input,
    );
    return {
      token: data.data.token,
      user: revivePublicUser(data.data.user),
    };
  }
}
