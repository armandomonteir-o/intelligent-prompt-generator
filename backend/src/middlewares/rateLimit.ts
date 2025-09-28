import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export const minuteLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60000, // 1 minuto
  limit: 3,
  message: {
    error:
      "Você atingiu o limite de requisições por minuto. Por favor, aguarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite diário
export const dayLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  limit: 15,
  message: { error: "Você atingiu o limite diário de requisições." },
  standardHeaders: true,
  legacyHeaders: false,
});
