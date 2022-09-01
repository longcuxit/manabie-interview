import { UserPreferencesModel } from "./User.config";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  CONFIRM = "CONFIRM",
}

export interface AuthModel {
  accessToken: string;
  refreshToken: string;
}

export interface UserModel {
  config: UserPreferencesModel;
  username: string;
  created_date: string;
  status: UserStatus;
  id: string;
}
