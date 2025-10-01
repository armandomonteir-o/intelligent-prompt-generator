import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Erro capturado no middleware central:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Ocorreu um erro inesperado no servidor",
  });
};
