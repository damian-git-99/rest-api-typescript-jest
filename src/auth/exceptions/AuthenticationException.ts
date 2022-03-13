export class AuthenticationException {
  status: number;
  message: string;
  constructor() {
    this.status = 401;
    this.message = 'authentication failure';
  }
}
