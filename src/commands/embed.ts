import { embeddingService } from "../container";

/**
 * Command line tool to generate embeddings for text input.
 * 
 * Usage:
 *   bun run embed "your text here"
 * 
 * Arguments:
 *   - text: The text to generate embeddings for
 * 
 * Output:
 *   - JSON output containing the generated embedding vector
 *   - If successful, returns the embedding object
 *   - If failed, prints an error message and exits with code 1
 */
async function main() {
  const text = process.argv[2];

  if (!text) {
    console.error("Error: Please provide a text to embed");
    console.error("Usage: bun run embed.ts \"your text here\"");
    process.exit(1);
  }

  try {
    const result = await embeddingService.createEmbedding(text);
    console.log(JSON.stringify(result, null, 2));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process embedding";
    console.error("Error:", errorMessage);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
