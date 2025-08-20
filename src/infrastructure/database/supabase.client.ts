import { createClient } from "@supabase/supabase-js";
import type { DatabaseClientInterface, SearchResult } from "../../core/interfaces/database.interface";

export class SupabaseClient implements DatabaseClientInterface {
  private readonly supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async saveEmbedding(text: string, embedding: number[]): Promise<void> {
    await this.supabase.from("embeddings").insert([{ text, embedding }]);
  }

  async getEmbedding(id: string): Promise<number[]> {
    const { data, error } = await this.supabase
      .from("embeddings")
      .select("embedding")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Embedding not found");

    return data.embedding;
  }

  async searchSimilar(embedding: number[], limit: number = 5): Promise<SearchResult[]> {
    const { data, error } = await this.supabase.rpc('match_embeddings', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit
    });

    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => ({
      text: item.text,
      similarity: item.similarity
    }));
  }
}
