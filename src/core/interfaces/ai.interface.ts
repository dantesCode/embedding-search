export interface AIClientInterface {
  getEmbedding(text: string): Promise<number[]>;
}
