export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model?: string;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  success: true;
  embedding: number[];
}

export interface Database {
  public: {
    Tables: {
      embeddings: {
        Row: {
          id: string;
          text: string;
          embedding: number[];
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["embeddings"]["Row"],
          "id" | "created_at"
        >;
      };
    };
  };
}
