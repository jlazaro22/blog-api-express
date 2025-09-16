import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute max
  standardHeaders: 'draft-8', // use the latest standard rate limit headers
  legacyHeaders: false, // Disable deprecated `X-RateLimit-*` headers
  message: {
    error:
      'You have sent too many requests in a short period, please try again later.',
  },
});

export default rateLimiter;
