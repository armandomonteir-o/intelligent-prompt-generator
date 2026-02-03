import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
  code?: number;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Erro capturado no middleware central:", error);

  if (res.headersSent) {
    return next(error);
  }

  // Check for rate limit errors from Gemini API (status 429)
  const statusCode = error.status || error.code;
  if (statusCode === 429) {
    return res.status(429).json({
      error: "Limite de requisições excedido",
      message:
        "A API do Gemini atingiu o limite de requisições. Tente novamente mais tarde.",
    });
  }

  // Check for API key errors (401/403)
  if (statusCode === 401 || statusCode === 403) {
    return res.status(statusCode).json({
      error: "Erro de autenticação",
      message: "Problema com a chave de API. Verifique as configurações.",
    });
  }

  // Default to 500 for unknown errors
  res.status(500).json({
    error: "Ocorreu um erro inesperado no servidor",
  });
};
