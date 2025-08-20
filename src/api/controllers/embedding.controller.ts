import type { Context } from 'hono';
import type { EmbeddingRequest } from "../../types";
import type { EmbeddingService } from "../../core/services/embedding.service";
import { securityMiddleware } from "../../middleware/security.middleware";
import { createResponse } from "../../utils/response.utils";

export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  async handle(c: Context): Promise<Response> {
    try {
      const body = await c.req.json() as Partial<EmbeddingRequest>;
      const text = body?.text;

      if (!text || typeof text !== "string") {
        return createResponse(c, { error: "Missing or invalid text" }, 400);
      }

      // Sanitize input text
      const sanitizedText = securityMiddleware.sanitizeText(text);
      
      await this.embeddingService.createEmbedding(sanitizedText);
      
      return createResponse(c, { success: true }, 200);
    } catch (err: unknown) {
      console.error("Embedding error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process embedding";
      return createResponse(c, { error: errorMessage }, 500);
    }
  }
}
