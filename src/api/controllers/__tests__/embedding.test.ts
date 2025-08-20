import { expect, test } from "bun:test";
import type { Context } from 'hono';
import { EmbeddingController } from "../embedding.controller";
import type { EmbeddingService } from "../../../core/services/embedding.service";

const createMockService = (shouldThrowError = false): EmbeddingService => {
  return {
    createEmbedding: async (text: string) => {
      if (shouldThrowError || text === "error-text") {
        throw new Error("Service error");
      }
      return { text, embedding: [0] };
    },
    getEmbedding: async () => [0],
    searchSimilar: async () => []
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

test("EmbeddingController - successfully creates embedding", async () => {
  const controller = new EmbeddingController(createMockService(false));
  const context = createTestContext({ text: "test text" });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(200);
  expect(result).toEqual({ success: true });
});

test("EmbeddingController - handles missing text", async () => {
  const controller = new EmbeddingController(createMockService(false));
  const context = createTestContext({});

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(400);
  expect(result).toEqual({ error: "Missing or invalid text" });
});

test("EmbeddingController - handles invalid text type", async () => {
  const controller = new EmbeddingController(createMockService(false));
  const context = createTestContext({ text: 123 });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(400);
  expect(result).toEqual({ error: "Missing or invalid text" });
});

test("EmbeddingController - handles service error", async () => {
  const controller = new EmbeddingController(createMockService(true));
  const context = createTestContext({ text: "any-text" });

  const response = await controller.handle(context);
  const result = await response.json();

  expect(response.status).toBe(500);
  expect(result).toEqual({ error: "Service error" });
});
