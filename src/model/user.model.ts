export class RegisterRequest {
  username: string;
  password: string;
  name: string;
}

export class UserResponse {
  id: number;
  username: string;
  name: string;
  token?: string;
}
