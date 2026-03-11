require('dotenv').config();

module.exports = {
  // Server
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // Apify
  APIFY_TOKEN: process.env.APIFY_TOKEN,
  APIFY_ACTOR_ID: 'apify~facebook-posts-scraper',
  APIFY_BASE_URL: 'https://api.apify.com/v2',

  // Cache
  CACHE_TTL_SECONDS: 300, // 5 minutes

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX: 10,              // 10 requests per window

  // Query defaults & limits
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 100,
  DEFAULT_DAYS: 7,
  ALLOWED_DAYS: [1, 3, 7],
  MAX_DAYS: 7,
};
