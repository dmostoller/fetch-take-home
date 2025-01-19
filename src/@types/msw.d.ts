declare module "msw/lib/node" {
  import { RequestHandler } from "msw";
  export function setupServer(...handlers: RequestHandler[]): {
    listen(): void;
    close(): void;
    resetHandlers(): void;
    use(...handlers: RequestHandler[]): void;
  };
}
