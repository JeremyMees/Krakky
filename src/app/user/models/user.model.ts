export interface User {
  _id?: string;
  __V?: number;
  email: string;
  username?: string;
  password?: string;
  img?: string;
  img_query?: string;
  verified?: boolean;
  marketing: boolean;
  acces_token?: string;
  token_expire_time?: number;
}
