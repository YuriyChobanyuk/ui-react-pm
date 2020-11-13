export interface IUser {
  name: string;
  id: string;
  email: string;
  img_path?: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
