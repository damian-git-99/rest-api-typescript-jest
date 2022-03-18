export class EmailInUseException {
  message: string;
  status: number;
  constructor() {
    this.status = 400;
    this.message = 'E-mail in use';
  }
}