export interface SearchResult {
  text: string;
  similarity: number;
}

export interface DatabaseClientInterface {
  saveEmbedding(text: string, embedding: number[]): Promise<void>;
  getEmbedding(id: string): Promise<number[]>;
  searchSimilar(embedding: number[], limit?: number): Promise<SearchResult[]>;
}
