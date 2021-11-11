export interface AuthData {
  _id: string;
  __v: number;
  email: string;
  username: string;
  verified: boolean;
  valid_token?: boolean;
  acces_token: string;
  token_expire_time: number;
}
