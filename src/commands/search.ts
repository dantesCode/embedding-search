import { embeddingService } from "../container";
import { format, getSimilarityColor } from "../utils/colors";

/**
 * Command line tool to search for semantically similar texts using embeddings.
 * 
 * Usage:
 *   bun run search "your search text" [limit]
 * 
 * Arguments:
 *   - text: The text to search for similar matches
 *   - limit: (Optional) Maximum number of results to return (default: 5)
 * 
 * Output Format:
 *   - Lists matched texts with their similarity scores
 *   - Similarity scores are color coded:
 *     - Green: High similarity (>80%)
 *     - Yellow: Medium similarity (50-80%)
 *     - Red: Low similarity (<50%)
 */
async function main() {
  const text = process.argv[2];
  const limit = process.argv[3] ? parseInt(process.argv[3], 10) : 5;

  if (!text) {
    console.error(format.error("Error: Please provide a text to search"));
    console.error(format.warning("Usage: bun run search.ts \"your search text\" [limit]"));
    process.exit(1);
  }

  try {
    const results = await embeddingService.searchSimilar(text, limit);
    console.log(`\n${format.bold(format.info("Search results for:"))}`, text);
    console.log(`\n${format.success("Found")}`, results.length, `${format.success("matches:")}\n`);
    
    results.forEach((result, index) => {
      const similarityScore = (result.similarity * 100).toFixed(2);
      const scoreColor = getSimilarityColor(result.similarity);
      
      console.log(`${format.bold(format.info(`${index + 1}.`))} Text: "${format.bold(result.text)}"`);
      console.log(`   Similarity: ${scoreColor}${similarityScore}%\x1b[0m\n`);
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to search embeddings";
    console.error("Error:", errorMessage);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
