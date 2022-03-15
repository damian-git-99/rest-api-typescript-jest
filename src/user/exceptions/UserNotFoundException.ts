export class UserNotFoundException {
  message: string;
  status: number;
  constructor() {
    this.status = 404;
    this.message = 'user_not_found';
  }
}
