const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
const postsRouter = require('./routes/posts');

const app = express();

// --- Global middleware ---
app.use(express.json());
app.use(rateLimiter);

// --- Routes ---
app.use('/api/posts', postsRouter);

// --- Health check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.',
  });
});

// --- Global error handler ---
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred.',
  });
});

module.exports = app;
