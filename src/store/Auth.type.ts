import { AuthModel, UserModel } from "models/User";

export interface AuthState {
  auth: AuthModel | null;
  user: UserModel;
}

export interface AuthActions {
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
}
