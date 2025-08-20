import type { DatabaseClientInterface, SearchResult } from "../interfaces/database.interface";
import type { AIClientInterface } from "../interfaces/ai.interface";

export class EmbeddingService {
  constructor(
    private readonly database: DatabaseClientInterface,
    private readonly ai: AIClientInterface,
  ) {}

  async createEmbedding(text: string): Promise<{text: string, embedding: number[]}> {
    const embedding = await this.ai.getEmbedding(text);
    if (!embedding) {
      throw new Error("Failed to create embedding");
    }

    await this.database.saveEmbedding(text, embedding);
    return { text, embedding };
  }

  async getEmbedding(id: string): Promise<number[]> {
    const data = this.database.getEmbedding(id);
    return data;
  }

  async searchSimilar(text: string, limit?: number): Promise<SearchResult[]> {
    const embedding = await this.ai.getEmbedding(text);
    return this.database.searchSimilar(embedding, limit);
  }
}
