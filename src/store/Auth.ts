import { AuthModel, UserModel, UserStatus } from "models/User";
import Service from "service";
import { createLocalStorage } from "utils";
import { Store } from "utils/Store";

export interface AuthState {
  auth: AuthModel | null;
  user: UserModel;
}

const questUser: UserModel = {
  username: "Quest",
  id: "Quest",
  status: UserStatus.ACTIVE,
  created_date: "",
};

const authStorage = createLocalStorage<AuthModel | null>("AUTH", null);

const initialState: AuthState = { auth: authStorage.get(), user: questUser };

const store = new Store(initialState, ({ set, get, partial }) => ({
  async login(username: string, password: string) {
    const auth = await Service.login(username, password);
    authStorage.set(auth);
    partial({ auth });
  },

  async logout() {
    authStorage.set(null);
    partial({ auth: null, user: questUser });
  },
}));

export const useAuth = store.createHook();

export const useAuthAction = store.createHookAction();
