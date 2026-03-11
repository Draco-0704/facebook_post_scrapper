const app = require('./app');
const config = require('./config');

// Validate required configuration
if (!config.APIFY_TOKEN) {
  console.error('ERROR: APIFY_TOKEN is not set. Please create a .env file (see .env.example).');
  process.exit(1);
}

app.listen(config.PORT, () => {
  console.log(`🚀 Facebook Posts Scraper API running at http://localhost:${config.PORT}`);
  console.log(`   Health check: http://localhost:${config.PORT}/health`);
  console.log(`   Posts endpoint: http://localhost:${config.PORT}/api/posts?keyword=YOUR_KEYWORD`);
});
