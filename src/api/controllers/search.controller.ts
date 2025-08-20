import type { Context } from 'hono';
import type { EmbeddingService } from "../../core/services/embedding.service";
import { securityMiddleware } from "../../middleware/security.middleware";
import { createResponse } from "../../utils/response.utils";

export interface SearchRequest {
  text: string;
  limit?: number;
}

export class SearchController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  async handle(c: Context): Promise<Response> {
    try {
      const body = await c.req.json() as Partial<SearchRequest>;
      const { text, limit } = body;

      if (!text || typeof text !== "string") {
        return createResponse(c, { error: "Missing or invalid text" }, 400);
      }

      // Validate limit parameter
      if (limit !== undefined && (typeof limit !== "number" || limit < 1 || limit > 100)) {
        return createResponse(c, { 
          error: "Invalid limit. Must be a number between 1 and 100" 
        }, 400);
      }

      const sanitizedText = securityMiddleware.sanitizeText(text);
      
      const results = await this.embeddingService.searchSimilar(sanitizedText, limit);
      
      return createResponse(c, { results }, 200);
    } catch (err: unknown) {
      console.error("Search error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search embeddings";
      return createResponse(c, { error: errorMessage }, 500);
    }
  }
}
