import OpenAI from "openai";
import type { AIClientInterface } from "../../core/interfaces/ai.interface";

export class OpenAIClient implements AIClientInterface {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
  }

  async getEmbedding(text: string): Promise<number[]> {
    const res = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return res.data[0].embedding as number[];
  }
}
