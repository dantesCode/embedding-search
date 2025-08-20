import { expect, test } from "bun:test";
import { OpenAIClient } from "../openai.client";

test("OpenAIClient - should get embeddings for text", async () => {
  const mockOpenAI = {
    embeddings: {
      create: async () => ({
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
          },
        ],
      }),
    },
  };

  // Mock the OpenAI instance
  const client = new OpenAIClient();
  (client as any).openai = mockOpenAI;

  const embedding = await client.getEmbedding("test text");

  expect(Array.isArray(embedding)).toBe(true);
  expect(embedding).toEqual([0.1, 0.2, 0.3]);
});
