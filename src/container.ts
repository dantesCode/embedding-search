import { EmbeddingService } from "./core/services/embedding.service";
import { OpenAIClient } from "./infrastructure/ai/openai.client";
import { SupabaseClient } from "./infrastructure/database/supabase.client";

const openAIClient = new OpenAIClient();
const supabaseClient = new SupabaseClient();

export const embeddingService = new EmbeddingService(
  supabaseClient,
  openAIClient,
);
