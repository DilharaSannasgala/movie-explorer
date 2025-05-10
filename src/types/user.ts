export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}