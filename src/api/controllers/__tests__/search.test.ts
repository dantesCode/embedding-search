import { expect, test } from "bun:test";
import type { Context } from 'hono';
import { SearchController } from "../search.controller";
import type { EmbeddingService } from "../../../core/services/embedding.service";

const createMockService = (shouldThrowError = false): EmbeddingService => {
  return {
    createEmbedding: async (text: string) => ({ text, embedding: [0] }),
    getEmbedding: async (text: string) => {
      if (shouldThrowError || text === "error-text") {
        throw new Error("Service error");
      }
      return [0];
    },
    searchSimilar: async (text: string) => {
      if (shouldThrowError) {
        throw new Error("Service error");
      }
      return [{ id: '1', text: 'Similar text', similarity: 0.9 }];
    }
  } as unknown as EmbeddingService;
};

const createTestContext = (body: object) => {
  const c = {
    req: {
      json: async () => body,
    },
    json: (data: unknown, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'content-type': 'application/json' }
      });
    }
  } as unknown as Context;

  return c;
};

test("SearchController - successfully searches embeddings", async () => {
  const controller = new SearchController(createMockService(false));
  const context = createTestContext({ text: "test text", limit: 10 });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(200);
  expect(result).toEqual({
    results: [{ id: '1', text: 'Similar text', similarity: 0.9 }]
  });
});

test("SearchController - handles missing text", async () => {
  const controller = new SearchController(createMockService(false));
  const context = createTestContext({});

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(400);
  expect(result).toEqual({ error: "Missing or invalid text" });
});

test("SearchController - handles invalid text type", async () => {
  const controller = new SearchController(createMockService(false));
  const context = createTestContext({ text: 123 });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(400);
  expect(result).toEqual({ error: "Missing or invalid text" });
});

test("SearchController - handles invalid limit", async () => {
  const controller = new SearchController(createMockService(false));
  const context = createTestContext({ text: "valid text", limit: 101 });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(400);
  expect(result).toEqual({ error: "Invalid limit. Must be a number between 1 and 100" });
});

test("SearchController - handles service error", async () => {
  const controller = new SearchController(createMockService(true));
  const context = createTestContext({ text: "any-text" });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(500);
  expect(result).toEqual({ error: "Service error" });
});
