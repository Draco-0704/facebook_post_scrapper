const axios = require('axios');
const config = require('../config');

/**
 * Calls the Apify Facebook Posts Scraper actor synchronously and returns
 * mapped, filtered, and sorted posts.
 *
 * @param {string} keyword  - Search keyword
 * @param {number} limit    - Maximum number of posts to return
 * @param {number} days     - Filter posts to within this many days
 * @returns {Promise<Object[]>} Array of mapped post objects
 */
async function fetchPosts(keyword, limit, days) {
  const url = `${config.APIFY_BASE_URL}/acts/${config.APIFY_ACTOR_ID}/run-sync-get-dataset-items`;

  const response = await axios.post(
    url,
    {
      searchKeyword: keyword,
      maxPosts: limit,
    },
    {
      params: { token: config.APIFY_TOKEN },
      headers: { 'Content-Type': 'application/json' },
      timeout: 120_000, // 2-minute timeout for sync actor run
    }
  );

  const rawPosts = Array.isArray(response.data) ? response.data : [];

  // Calculate the cutoff date
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Map, filter, and sort
  const posts = rawPosts
    .map((post) => ({
      id: post.postId || '',
      text: post.text || '',
      timestamp: post.time || '',
      likes: typeof post.likes === 'number' ? post.likes : 0,
      comments: typeof post.comments === 'number' ? post.comments : 0,
      url: post.url || '',
      author: post.pageName || post.profileName || '',
    }))
    .filter((post) => {
      if (!post.timestamp) return false;
      const postDate = new Date(post.timestamp);
      return !isNaN(postDate.getTime()) && postDate >= cutoffDate;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);

  return posts;
}

module.exports = { fetchPosts };
