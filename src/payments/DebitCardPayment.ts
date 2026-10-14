import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class DebitCardPayment implements IPaymentMethod {
  readonly name = 'debit_card';

  async process(): Promise<void> {
    logger.info('Processando débito...');
    // Lógica de débito (simulada)
  }
}
