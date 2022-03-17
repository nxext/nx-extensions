import { HttpRequest } from './http-request';
import { HTTPSettings } from './http-settings';

export interface Http<TBodyReader>
  extends AsyncIterable<HttpRequest<TBodyReader>> {
  close(): void;
}

export interface Connect<TBodyReader> {
  (httpSettings: HTTPSettings): Http<TBodyReader>;
}
