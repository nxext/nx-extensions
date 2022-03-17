import { HttpRequest } from '@nxextjs/httpd';

export interface MiddlewareReturn {
  serverRequest: HttpRequest<unknown>;
  repsonse: Response;
}

export interface Middleware {
  pre?(request: HttpRequest<unknown>, response: Response): MiddlewareReturn;
  post?(request: HttpRequest<unknown>, response: Response): MiddlewareReturn;
  catch?(request: HttpRequest<unknown>, response: Response): MiddlewareReturn;
}
