import { HTTP_METHODS } from '../enums/http-methods';

export interface HttpRequest<TBody> {
  url: string;
  method: HTTP_METHODS;
  headers: Headers;
  proto: string;
  respond(R: Response): Promise<void>;
  body(): TBody;
}
