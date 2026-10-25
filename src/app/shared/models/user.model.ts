export interface DbUser {
  id: string;
  cognito_sub: string;
  username: string;
  email: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckUserResponse {
  user: DbUser;
  created: boolean;
}
