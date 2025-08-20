import { expect, test } from "bun:test";
import { EmbeddingService } from "../embedding.service";
import type { AIClientInterface } from "../../interfaces/ai.interface";
import type { DatabaseClientInterface, SearchResult } from "../../interfaces/database.interface";

const createMockClients = (errorType?: 'ai' | 'db') => {
  const mockAI: AIClientInterface = {
    getEmbedding: async (text: string) => {
      if (errorType === 'ai') {
        throw new Error("AI service error");
      }
      return [0.1, 0.2, 0.3];
    },
  };

  const mockDB: DatabaseClientInterface = {
    saveEmbedding: async (text: string, embedding: number[]) => {
      if (errorType === 'db') {
        throw new Error("Database error");
      }
    },
    getEmbedding: async (id: string) => {
      if (errorType === 'db') {
        throw new Error("Database error");
      }
      return [0.1, 0.2, 0.3];
    },
    searchSimilar: async (embedding: number[], limit?: number): Promise<SearchResult[]> => {
      if (errorType === 'db') {
        throw new Error("Database error");
      }
      return [
        { text: "similar text", similarity: 0.85 },
        { text: "another text", similarity: 0.75 }
      ];
    }
  };

  return { mockAI, mockDB };
};

test("EmbeddingService - createEmbedding success", async () => {
  const { mockAI, mockDB } = createMockClients();
  const service = new EmbeddingService(mockDB, mockAI);

  const result = await service.createEmbedding("test text");

  expect(result).toEqual({
    text: "test text",
    embedding: [0.1, 0.2, 0.3]
  });
});

test("EmbeddingService - getEmbedding success", async () => {
  const { mockAI, mockDB } = createMockClients();
  const service = new EmbeddingService(mockDB, mockAI);

  const embedding = await service.getEmbedding("test-id");

  expect(embedding).toEqual([0.1, 0.2, 0.3]);
});

test("EmbeddingService - searchSimilar success", async () => {
  const { mockAI, mockDB } = createMockClients();
  const service = new EmbeddingService(mockDB, mockAI);

  const results = await service.searchSimilar("search text", 2);

  expect(results).toEqual([
    { text: "similar text", similarity: 0.85 },
    { text: "another text", similarity: 0.75 }
  ]);
});

test("EmbeddingService - handles AI service error", async () => {
  const { mockAI, mockDB } = createMockClients('ai');
  const service = new EmbeddingService(mockDB, mockAI);

  await expect(service.createEmbedding("test text")).rejects.toThrow("AI service error");
});

test("EmbeddingService - handles database error in save", async () => {
  const { mockAI, mockDB } = createMockClients('db');
  const service = new EmbeddingService(mockDB, mockAI);

  await expect(service.createEmbedding("test text")).rejects.toThrow("Database error");
});

test("EmbeddingService - handles database error in get", async () => {
  const { mockAI, mockDB } = createMockClients('db');
  const service = new EmbeddingService(mockDB, mockAI);

  await expect(service.getEmbedding("test-id")).rejects.toThrow("Database error");
});

test("EmbeddingService - handles database error in search", async () => {
  const { mockAI, mockDB } = createMockClients('db');
  const service = new EmbeddingService(mockDB, mockAI);

  await expect(service.searchSimilar("search text")).rejects.toThrow("Database error");
});
