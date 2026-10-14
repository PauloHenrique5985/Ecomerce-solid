export type PaymentDetails = Record<string, unknown>;

/**
 * Estratégia de pagamento. Para suportar um novo meio de pagamento basta
 * criar uma nova classe que implemente esta interface e registrá-la
 * (OCP: aberto para extensão, fechado para modificação).
 */
export interface IPaymentMethod {
  /** Identificador recebido na requisição (ex.: "credit_card"). */
  readonly name: string;
  /** Lança AppError se o pagamento não puder ser concluído. */
  process(amount: number, details?: PaymentDetails): Promise<void>;
}
