/**
 * Erro "esperado" da aplicação (validação, pagamento recusado, etc.).
 * Carrega o status HTTP para que o Controller saiba como responder,
 * sem que as camadas de negócio precisem conhecer Express.
 */
export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}
