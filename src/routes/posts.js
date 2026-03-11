const express = require('express');
const NodeCache = require('node-cache');
const validatePostsQuery = require('../middleware/validate');
const { fetchPosts } = require('../services/apifyService');
const config = require('../config');

const router = express.Router();

// In-memory cache — 5-minute TTL per unique query
const cache = new NodeCache({ stdTTL: config.CACHE_TTL_SECONDS, checkperiod: 60 });

/**
 * GET /api/posts
 * Query params: keyword (required), limit (default 100), days (1|3|7, default 7)
 */
router.get('/', validatePostsQuery, async (req, res) => {
  const { keyword, limit, days } = req.validatedQuery;

  // Build a unique cache key
  const cacheKey = `${keyword.toLowerCase()}:${limit}:${days}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const posts = await fetchPosts(keyword, limit, days);

    const result = {
      keyword,
      count: posts.length,
      fetched_at: new Date().toISOString(),
      posts,
    };

    // Store in cache
    cache.set(cacheKey, result);

    return res.json(result);
  } catch (err) {
    console.error('[Scraper Error]', err.message);

    const statusCode = err.response?.status || 500;
    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      error: 'Scraper Error',
      message:
        err.response?.data?.error?.message ||
        err.message ||
        'An unexpected error occurred while fetching posts.',
    });
  }
});

module.exports = router;
