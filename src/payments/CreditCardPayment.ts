import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod {
  readonly name = 'credit_card';

  async process(amount: number, details?: PaymentDetails): Promise<void> {
    const cardNumber = details?.cardNumber;
    const cvv = details?.cvv;

    if (typeof cardNumber !== 'string' || typeof cvv !== 'string') {
      throw new AppError('Dados do cartão inválidos', 400);
    }

    logger.info(`Processando cartão final ${cardNumber.slice(-4)}`);

    // Simulação de gateway
    if (cvv === '000') {
      throw new AppError('Cartão recusado', 402);
    }
  }
}
