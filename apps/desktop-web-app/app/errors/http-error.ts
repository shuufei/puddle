export class HttpError {
  constructor(readonly statusCode: number, readonly errorMessage: string) {}
}
