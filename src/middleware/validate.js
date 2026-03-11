const config = require('../config');

/**
 * Input validation middleware for GET /api/posts
 * Validates: keyword (required), limit (1–100), days (1, 3, or 7)
 */
function validatePostsQuery(req, res, next) {
  const errors = [];

  // --- keyword (required, non-empty string) ---
  const keyword = req.query.keyword;
  if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
    errors.push('Query parameter "keyword" is required and must be a non-empty string.');
  }

  // --- limit (optional, integer 1–100, default 100) ---
  let limit = config.DEFAULT_LIMIT;
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1 || limit > config.MAX_LIMIT) {
      errors.push(`Query parameter "limit" must be an integer between 1 and ${config.MAX_LIMIT}.`);
    }
  }

  // --- days (optional, must be 1, 3, or 7, default 7) ---
  let days = config.DEFAULT_DAYS;
  if (req.query.days !== undefined) {
    days = parseInt(req.query.days, 10);
    if (!config.ALLOWED_DAYS.includes(days)) {
      errors.push(`Query parameter "days" must be one of: ${config.ALLOWED_DAYS.join(', ')}.`);
    }
  }

  // Return all validation errors at once
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors,
    });
  }

  // Attach validated & sanitized values to req for downstream use
  req.validatedQuery = {
    keyword: keyword.trim(),
    limit,
    days,
  };

  next();
}

module.exports = validatePostsQuery;
