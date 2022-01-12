export interface AuthData {
  _id: string;
  __v: number;
  email: string;
  username: string;
  verified: boolean;
  marketing: boolean;
  valid_token?: boolean;
  img?: string;
  img_query?: string;
  acces_token: string;
  token_expire_time: number;
}
