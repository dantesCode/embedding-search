# Embedding Search

A modern semantic search application built with Bun.js, TypeScript, and OpenAI embeddings. This project provides both a RESTful API and CLI tools for generating embeddings and performing semantic similarity searches.

## Features

- **Semantic Search**: Search for content based on meaning, not just keywords
- **RESTful API**: HTTP endpoints for embedding generation and similarity search
- **CLI Tools**: Command-line interface for quick searches and embedding generation
- **Environment-based Configuration**: Different settings for development and production

## Project Structure

```
src/
├── api/
│   └── controllers/
│       ├── embedding.controller.ts
│       ├── search.controller.ts
│       └── __tests__/
├── commands/
│   ├── embed.ts        # CLI tool for generating embeddings
│   └── search.ts       # CLI tool for semantic search
├── core/
│   ├── interfaces/
│   │   ├── ai.interface.ts
│   │   └── database.interface.ts
│   └── services/
│       └── embedding.service.ts
├── infrastructure/
│   ├── ai/
│   │   └── openai.client.ts
│   └── database/
│       └── supabase.client.ts
├── middleware/
│   └── security.middleware.ts
├── utils/
│   ├── colors.ts
│   └── response.utils.ts
├── app.ts
└── container.ts
```

## Quick Start

1. **Clone and Install:**
   ```bash
   git clone https://github.com/dantesCode/embedding-search.git
   cd embedding-search
   bun install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   NODE_ENV=development
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

3. **Start the Server:**
   ```bash
   bun run start
   ```

## CLI Usage

### Generate Embeddings
```bash
bun run embed "your text here"
```
Outputs the embedding vector for the provided text.

### Search Similar Texts
```bash
bun run search "your search query" [limit]
```
Example:
```bash
bun run search "web development" 5
```
Displays up to 5 most similar texts with color-coded similarity scores:
- 🟢 Green: High similarity (>80%)
- 🟡 Yellow: Medium similarity (50-80%)
- 🔴 Red: Low similarity (<50%)

## API Endpoints

### Create Embedding
```http
POST /embed
Content-Type: application/json

{
  "text": "Your text to embed"
}
```
Returns:
```json
{
  "embedding": [/* vector of numbers */]
}
```

### Search Similar Texts
```http
POST /search
Content-Type: application/json

{
  "text": "Your search query",
  "limit": 5
}
```
Returns:
```json
{
  "results": [
    {
      "text": "Similar text 1",
      "similarity": 0.89
    },
    {
      "text": "Similar text 2",
      "similarity": 0.76
    }
  ]
}
```

### Health Check
```http
GET /health
```
Returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-20T10:00:00.000Z"
}
```

## Security Features

The application includes several security measures:
- Rate limiting
- Security headers (CORS, XSS protection, etc.)
- JSON content validation
- Environment-based security configurations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
