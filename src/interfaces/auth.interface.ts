import { IUser, UserRole } from './user.interface';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
};

export interface AccessTokenPayload {
  exp: number;
  iat: number;
  name: string;
  role: UserRole;
  userId: string;
}

export type AuthResponse = { token: string; data: { user: IUser } };
