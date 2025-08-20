import type { MiddlewareHandler } from 'hono';

export class SecurityMiddleware {
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(clientIp: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;

    for (const [ip, data] of this.rateLimitStore.entries()) {
      if (now > data.resetTime) {
        this.rateLimitStore.delete(ip);
      }
    }

    const clientData = this.rateLimitStore.get(clientIp);
    
    if (!clientData) {
      this.rateLimitStore.set(clientIp, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }

    if (now > clientData.resetTime) {
      this.rateLimitStore.set(clientIp, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }

    if (clientData.count >= maxRequests) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000) 
      };
    }

    clientData.count++;
    return { allowed: true };
  }

  sanitizeText(text: string): string {
    if (typeof text !== "string") {
      throw new Error("Input must be a string");
    }

    const sanitized = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    if (sanitized.length > 10000) {
      throw new Error("Text too long. Maximum 10,000 characters allowed.");
    }

    return sanitized;
  }

  getSecurityHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }

  createRateLimitMiddleware(): MiddlewareHandler {
    return async (c, next) => {
      const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
      const check = this.checkRateLimit(clientIp);
      
      if (!check.allowed) {
        return c.json({
          error: "Too many requests",
          retryAfter: check.retryAfter
        }, 429);
      }
      
      await next();
    };
  }

  createSecurityHeadersMiddleware(): MiddlewareHandler {
    return async (c, next) => {
      const headers = this.getSecurityHeaders();
      Object.entries(headers).forEach(([key, value]) => {
        c.header(key, value);
      });
      await next();
    };
  }

  createTextSanitizerMiddleware(): MiddlewareHandler {
    return async (c, next) => {
      const contentType = c.req.header('content-type');
      if (contentType?.includes('application/json')) {
        try {
          const body = await c.req.json();
          if (typeof body === 'object') {
            Object.keys(body).forEach(key => {
              if (typeof body[key] === 'string') {
                body[key] = this.sanitizeText(body[key]);
              }
            });
            c.set('sanitizedBody', body);
          }
        } catch (error) {
          console.warn('Failed to sanitize request body:', error);
        }
      }
      await next();
    };
  }

  createJsonContentTypeMiddleware(): MiddlewareHandler {
    return async (c, next) => {
      if (c.req.method === 'POST') {
        const contentType = c.req.header('content-type');
        if (!contentType?.includes('application/json')) {
          return c.json({ error: 'Content-Type must be application/json' }, 400);
        }
      }
      await next();
    };
  }
}

export const securityMiddleware = new SecurityMiddleware();
