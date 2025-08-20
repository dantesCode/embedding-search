import { expect, test } from "bun:test";
import { SupabaseClient } from "../supabase.client";

const mockSupabaseClient = {
  from: () => ({
    insert: async () => ({ data: null, error: null }),
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: { embedding: [0.1, 0.2, 0.3] },
          error: null,
        }),
      }),
    }),
  }),
  rpc: () => ({
    data: [
      { text: "similar text", similarity: 0.85 },
      { text: "another text", similarity: 0.75 }
    ],
    error: null
  }),
};

test("SupabaseClient - saveEmbedding", async () => {
  const client = new SupabaseClient();
  // @ts-expect-error - Mocking private property
  client.supabase = mockSupabaseClient;
  
  await expect(
    client.saveEmbedding("test text", [0.1, 0.2, 0.3]),
  ).resolves.toBeUndefined();
});

test("SupabaseClient - getEmbedding", async () => {
  const client = new SupabaseClient();
  // @ts-expect-error - Mocking private property
  client.supabase = mockSupabaseClient;

  const embedding = await client.getEmbedding("test-id");

  expect(Array.isArray(embedding)).toBe(true);
  expect(embedding).toEqual([0.1, 0.2, 0.3]);
});

test("SupabaseClient - searchSimilar", async () => {
  const client = new SupabaseClient();
  // @ts-expect-error - Mocking private property
  client.supabase = mockSupabaseClient;

  const results = await client.searchSimilar([0.1, 0.2, 0.3], 2);

  expect(Array.isArray(results)).toBe(true);
  expect(results).toEqual([
    { text: "similar text", similarity: 0.85 },
    { text: "another text", similarity: 0.75 }
  ]);
});
