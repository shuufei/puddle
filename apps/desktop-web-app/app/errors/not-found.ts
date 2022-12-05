import { HttpError } from './http-error';

export class NotFound extends HttpError {
  constructor() {
    super(404, 'NotFound');
  }
}
