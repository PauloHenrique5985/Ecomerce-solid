import { ProductFactory } from '../domain/ProductFactory';
import { IProductRepository } from '../repositories/IProductRepository';
import { IOrderRepository, OrderItemRecord } from '../repositories/IOrderRepository';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { PaymentDetails } from '../payments/IPaymentMethod';
import { NotificationService } from './NotificationService';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface PlaceOrderInput {
  customer: string;
  items: OrderItemInput[];
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
}

export interface PlaceOrderResult {
  orderId: number;
  emailPreview?: string;
}

/**
 * Orquestra o fluxo do pedido: Valida -> Calcula -> Paga -> Salva -> Notifica.
 * Só depende de abstrações (DIP): não conhece Prisma, Nodemailer nem Express.
 */
export class OrderService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly paymentMethods: PaymentMethodRegistry,
    private readonly notificationService: NotificationService
  ) {}

  async placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
    // 1. Validação
    this.validate(input);
    const paymentMethod = this.paymentMethods.get(input.paymentMethod);

    // 2. Cálculo de preço (polimorfismo: cada produto sabe seu frete)
    const { items, total } = await this.buildItems(input.items);

    // 3. Pagamento
    await paymentMethod.process(total, input.paymentDetails);

    // 4. Persistência
    const order = await this.orderRepository.create({
      customer: input.customer,
      items,
      total,
      status: 'confirmed',
    });

    // 5. Notificação (o pedido já foi pago e salvo: falha no e-mail não derruba o pedido)
    let emailPreview: string | undefined;
    try {
      emailPreview = await this.notificationService.sendOrderConfirmation(order);
    } catch (error: any) {
      logger.error(`Pedido #${order.id} salvo, mas o e-mail falhou: ${error.message}`);
    }

    return { orderId: order.id, emailPreview };
  }

  private validate(input: PlaceOrderInput): void {
    if (!Array.isArray(input.items) || input.items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new AppError('Carrinho vazio', 400);
    }

    if (typeof input.customer !== 'string' || !input.customer.includes('@')) {
      throw new AppError('E-mail do cliente inválido', 400);
    }

    for (const item of input.items) {
      if (!Number.isInteger(item?.productId) || !Number.isInteger(item?.quantity) || item.quantity <= 0) {
        throw new AppError('Item inválido: informe productId e quantity (inteiro maior que zero)', 400);
      }
    }
  }

  private async buildItems(inputItems: OrderItemInput[]): Promise<{ items: OrderItemRecord[]; total: number }> {
    let total = 0;
    const items: OrderItemRecord[] = [];

    for (const item of inputItems) {
      const data = await this.productRepository.findById(item.productId);
      if (!data) {
        throw new AppError(`Produto ${item.productId} não encontrado`, 400);
      }

      const product = ProductFactory.createProduct(data);

      // Sem if/else por tipo: físico cobra frete, digital retorna 0.
      total += product.price * item.quantity + product.calculateFreight();

      items.push({
        id: product.id,
        name: product.name,
        type: product.type,
        price: product.price,
        quantity: item.quantity,
      });
    }

    return { items, total };
  }
}
