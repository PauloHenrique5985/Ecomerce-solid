import { PrismaClient } from '@prisma/client';
import { IOrderRepository, NewOrder, SavedOrder } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(order: NewOrder): Promise<SavedOrder> {
    const saved = await this.prisma.order.create({
      data: {
        customer: order.customer,
        // Detalhe de persistência: no banco os itens ficam como JSON string.
        items: JSON.stringify(order.items),
        total: order.total,
        status: order.status,
      },
    });

    return { ...order, id: saved.id };
  }
}
