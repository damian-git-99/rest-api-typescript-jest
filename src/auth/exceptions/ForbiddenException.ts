export class ForbiddenException {
  status: number;
  message: string;
  constructor() {
    this.status = 403;
    this.message = 'Forbidden user';
  }
}
