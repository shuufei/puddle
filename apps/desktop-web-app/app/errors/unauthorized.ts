import { HttpError } from './http-error';

export class Unauthorized extends HttpError {
  constructor() {
    super(401, 'Unauthorized');
  }
}
