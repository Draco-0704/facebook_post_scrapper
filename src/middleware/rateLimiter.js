const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiter: 10 requests per minute per IP
 * Returns JSON error on limit exceeded
 */
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable `X-RateLimit-*` headers
  message: {
    error: 'Too Many Requests',
    message: `Rate limit exceeded. Maximum ${config.RATE_LIMIT_MAX} requests per minute per IP.`,
  },
});

module.exports = limiter;
