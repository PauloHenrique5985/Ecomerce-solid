import { IMailProvider } from '../providers/IMailProvider';
import { SavedOrder } from '../repositories/IOrderRepository';
import logger from '../lib/logger';

/** Define O QUE enviar (assunto e corpo). O COMO enviar fica no IMailProvider. */
export class NotificationService {
  private static readonly SENDER = '"DevStore" <noreply@devstore.com>';

  constructor(private readonly mailProvider: IMailProvider) {}

  /** Retorna o link de preview do e-mail, quando o provider disponibiliza um. */
  async sendOrderConfirmation(order: SavedOrder): Promise<string | undefined> {
    const total = order.total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const { previewUrl } = await this.mailProvider.sendMail({
      from: NotificationService.SENDER,
      to: order.customer,
      subject: `Confirmação do Pedido #${order.id}`,
      text: `Olá, seu pedido #${order.id} no valor de R$ ${total} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${order.id}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${total}</strong></p>
        <ul>
          ${order.items.map((item) => `<li>${item.name} (x${item.quantity})</li>`).join('')}
        </ul>
      `,
    });

    logger.info(`Email enviado: ${previewUrl ?? '(sem preview)'}`);
    return previewUrl;
  }
}
