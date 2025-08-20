import type { Context } from 'hono';

type ResponseData = {
  success?: boolean;
  error?: string;
  results?: unknown;
  status?: string;
  timestamp?: string;
  [key: string]: unknown;
};

type ValidStatus = 200 | 201 | 400 | 401 | 403 | 404 | 429 | 500;

export function createResponse(c: Context, data: ResponseData, status: ValidStatus = 200): Response {
  return c.json(data, status);
}
