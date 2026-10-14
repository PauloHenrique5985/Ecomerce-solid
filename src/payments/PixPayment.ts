import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

/**
 * Prova do OCP: o Pix foi adicionado SEM alterar o OrderService.
 * Só foi criada esta classe e ela foi registrada no app.ts.
 */
export class PixPayment implements IPaymentMethod {
  readonly name = 'pix';

  async process(amount: number): Promise<void> {
    logger.info(`Processando Pix no valor de R$ ${amount.toFixed(2)}...`);
    // Geração/confirmação do Pix (simulada)
  }
}
