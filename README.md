# Facebook Posts Scraper API

A Node.js + Express API that scrapes Facebook posts by keyword using the [Apify Facebook Posts Scraper](https://apify.com/apify/facebook-posts-scraper) actor.

## Features

- **Keyword search** — search Facebook posts by any keyword
- **Date filtering** — filter posts to the last 1, 3, or 7 days
- **In-memory caching** — 5-minute cache per unique query (via `node-cache`)
- **Rate limiting** — 10 requests/minute per IP (via `express-rate-limit`)
- **Input validation** — clear 400 errors for invalid parameters
- **Synchronous response** — request → immediate JSON result

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Apify API token:

```
APIFY_TOKEN=your_apify_api_token_here
PORT=3000
```

Get your token at [https://console.apify.com/account/integrations](https://console.apify.com/account/integrations).

### 3. Start the server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## API Reference

### `GET /api/posts`

| Parameter | Type   | Required | Default | Description                          |
|-----------|--------|----------|---------|--------------------------------------|
| `keyword` | string | ✅       | —       | Search keyword                       |
| `limit`   | int    | ❌       | 100     | Max posts to return (1–100)          |
| `days`    | int    | ❌       | 7       | Filter to last N days (1, 3, or 7)   |

### Example Requests

```bash
# Basic search
curl "http://localhost:3000/api/posts?keyword=artificial+intelligence"

# With limit and days
curl "http://localhost:3000/api/posts?keyword=tech+news&limit=10&days=3"

# Minimal — just keyword
curl "http://localhost:3000/api/posts?keyword=openai&limit=5&days=1"
```

### Success Response (200)

```json
{
  "keyword": "artificial intelligence",
  "count": 15,
  "fetched_at": "2026-03-11T10:00:00.000Z",
  "posts": [
    {
      "id": "pfbid02abc...",
      "text": "Exciting developments in AI...",
      "timestamp": "2026-03-10T14:30:00.000Z",
      "likes": 142,
      "comments": 23,
      "url": "https://www.facebook.com/...",
      "author": "TechNews"
    }
  ]
}
```

### Error Responses

**400 — Validation Error**
```json
{
  "error": "Validation Error",
  "messages": [
    "Query parameter \"keyword\" is required and must be a non-empty string."
  ]
}
```

**429 — Rate Limit Exceeded**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Maximum 10 requests per minute per IP."
}
```

**500 — Scraper Error**
```json
{
  "error": "Scraper Error",
  "message": "An unexpected error occurred while fetching posts."
}
```

### `GET /health`

```bash
curl http://localhost:3000/health
# → { "status": "ok", "timestamp": "..." }
```

## Project Structure

```
├── .env.example          # Environment variable template
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── app.js             # Express app setup
    ├── config.js           # Centralized configuration
    ├── server.js           # Entry point
    ├── middleware/
    │   ├── rateLimiter.js  # Rate limiting (10 req/min/IP)
    │   └── validate.js     # Input validation
    ├── routes/
    │   └── posts.js        # GET /api/posts route
    └── services/
        └── apifyService.js # Apify actor integration
```

## License

MIT
