import { Observable } from '@nxext/i-observable';
import { HttpRequest } from '@nxextjs/httpd';
import { Middleware } from './middlware/middleware';

type ClassType = { new (...args: any[]): any };

export interface IServer {
  isOnline: boolean;
  isOnline$: Observable;

  listen(port: number | string): Promise<number | string | boolean | void>;

  close(): boolean;

  addMiddleware(middleware: Middleware): IServer;

  addController(classType: ClassType): IServer;

  addRoute<TBody>(
    path: string,
    handler: (request: HttpRequest<TBody>, response: Response) => void
  ): void;
}
