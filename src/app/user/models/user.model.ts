export interface User {
  _id?: string;
  __V?: number;
  email: string;
  username?: string;
  password?: string;
  verified?: boolean;
  acces_token?: string;
  token_expire_time?: number;
}
