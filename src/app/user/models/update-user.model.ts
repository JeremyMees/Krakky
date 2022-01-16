export interface UpdateUser {
  email?: string;
  password: string;
  _id: string;
  new_password?: string;
  username?: string;
  verified?: boolean;
  marketing?: boolean;
}
