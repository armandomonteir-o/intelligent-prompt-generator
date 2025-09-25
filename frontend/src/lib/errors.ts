export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const networkMessageError =
  "Não foi possível conectar ao servidor. Verifique sua conexão.";

export class NetworkError extends Error {
  constructor(message: string = networkMessageError) {
    super(message);
    this.name = "NetworkError";
  }
}
