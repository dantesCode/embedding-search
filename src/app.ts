import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { validateEnvironment } from "./config/environment.config";
import { securityMiddleware } from "./middleware/security.middleware";
import { EmbeddingController } from "./api/controllers/embedding.controller";
import { SearchController } from "./api/controllers/search.controller";
import { embeddingService } from "./container";

try {
  const config = validateEnvironment();
  console.log(`🔧 Environment validated. Running in ${config.NODE_ENV} mode`);
} catch (error) {
  console.error("❌ Environment validation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}

const embeddingController = new EmbeddingController(embeddingService);
const searchController = new SearchController(embeddingService);

const app = new Hono();

app.use('*', logger());
app.use('*', cors());
app.use('*', securityMiddleware.createSecurityHeadersMiddleware());
app.use('*', securityMiddleware.createRateLimitMiddleware());


const validateJsonContent = securityMiddleware.createJsonContentTypeMiddleware();
app.use('/embed', validateJsonContent);
app.use('/search', validateJsonContent);

// Routes
app.post('/embed', async (c) => {
  return embeddingController.handle(c);
});

app.post('/search', async (c) => {
  return searchController.handle(c);
});

app.get('/health', (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

const port = parseInt(process.env.PORT || "3000", 10);
console.log(`🚀 Server starting on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch
};
