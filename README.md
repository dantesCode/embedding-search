# Embeddings Project

This project integrates Bun.js, TypeScript, Hono, and Supabase to test embeddings using the OpenAI API.

## Project Structure

```
src/
├── api/
│   └── controllers/
│       ├── __tests__/
│       │   └── embedding.test.ts
│       └── embedding.controller.ts
├── commands/
│   └── embed.ts
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
├── types/
│   └── index.ts
├── app.ts
└── container.ts
```

## Security Features

This project includes comprehensive security measures implemented through a global middleware architecture:

### Global Security Middleware
- **Centralized Security**: All security measures are applied globally through `src/middleware/global.middleware.ts`
- **Rate Limiting**: Prevents abuse by limiting requests per IP address
- **CORS Protection**: Configurable Cross-Origin Resource Sharing policies
- **Security Headers**: Implements security headers to prevent common attacks:
  - X-XSS-Protection
  - X-Content-Type-Options
  - X-Frame-Options
  - Strict-Transport-Security
  - Content-Security-Policy
  - Referrer-Policy

### Input Validation & Sanitization
- **JSON Validation**: Ensures requests contain valid JSON
- **Text Sanitization**: Removes potentially dangerous content like script tags
- **Input Size Limits**: Prevents oversized payloads (max 10KB text)
- **Parameter Validation**: Validates search limits and other parameters

### Architecture Benefits
- **DRY Principle**: Security logic is centralized and not repeated in each controller
- **Consistency**: All endpoints receive the same security treatment
- **Maintainability**: Security updates only need to be made in one place
- **Testability**: Security middleware can be tested independently

### Middleware Structure
```
src/middleware/
├── global.middleware.ts        # Global security wrapper
├── security.middleware.ts      # Individual security functions
└── __tests__/                 # Comprehensive security tests
```

### Environment-based Configuration
- **Development Mode**: More lenient rate limits and CORS policies
- **Production Mode**: Strict security headers and rate limiting
- **Configurable Origins**: Set allowed origins via `ALLOWED_ORIGINS` environment variable

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_api_key_here

# Application Configuration
NODE_ENV=development
PORT=3000

# Security Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd embedding-project
   ```

2. **Install dependencies:**
   ```
   bun install
   ```

3. **Configure Supabase:**
   - Create a Supabase project and obtain your API keys.
   - Update the `src/infrastructure/database/supabase.client.ts` file with your Supabase URL and API key.

4. **Set up OpenAI API:**
   - Sign up for an OpenAI account and get your API key.
   - Update the `src/infrastructure/ai/openai.client.ts` file with your OpenAI API key.

## Project Architecture

The project follows clean architecture principles with a clear separation of concerns:

- **api/**: Contains HTTP controllers and route handlers
- **commands/**: CLI tools for interacting with the application
- **core/**: Contains business logic and interfaces
  - **interfaces/**: Core business interfaces
  - **services/**: Implementation of business logic
- **infrastructure/**: External service implementations
  - **ai/**: AI service implementations (OpenAI)
  - **database/**: Database implementations (Supabase)
- **types/**: Shared TypeScript type definitions

## Usage

### HTTP API

To start the HTTP server, run:

```bash
bun run start
```

### CLI Tools

To generate embeddings via command line:

```bash
bun run embed "your text here"
```

To search for similar texts:

```bash
bun run search "your search query" [limit]
```
The `limit` parameter is optional and defaults to 5. The search results will display:
- The matched text
- A color-coded similarity score (higher scores appear in green, lower scores in yellow/red)
- Results are ordered by similarity, with the most similar texts appearing first

### API Endpoints

#### Create Embedding
POST `/embed`
```json
{
  "text": "Your text to embed"
}
```

Response:
```json
{
  "embedding": [0.123, 0.456, ...]
}
```

#### Search Similar Texts
POST `/search`
```json
{
  "text": "Your search query",
  "limit": 5
}
```

Response:
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

## Test Examples

Here are some example texts to test semantic similarity search with embeddings:

### Technology and Programming
1. "JavaScript is a high-level programming language primarily used for web development"
2. "Python is known for its simplicity and readability in software development"
3. "Web browsers execute JavaScript code to create interactive websites"
4. "TypeScript adds static typing to JavaScript for better development"

### Nature and Environment
1. "Rainforests are crucial for maintaining Earth's biodiversity"
2. "Climate change affects global weather patterns and ecosystems"
3. "The Amazon rainforest produces significant amounts of oxygen"
4. "Deforestation impacts local wildlife and global climate"

### Food and Cooking
1. "Italian cuisine is known for pasta and fresh ingredients"
2. "Traditional sushi requires specially prepared rice and fresh fish"
3. "Mediterranean diet includes olive oil and fresh vegetables"
4. "French cooking techniques influence modern gastronomy"

Try searching with variations of these texts to see how the embeddings capture semantic relationships. For example:
- Search "web programming languages" should return JavaScript-related texts
- Search "environmental conservation" should match rainforest texts
- Search "culinary traditions" should match cooking-related texts

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.