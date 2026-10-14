import { PrismaClient } from '@prisma/client';
import { IProductRepository } from './IProductRepository';
import { ProductData } from '../domain/ProductFactory';

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<ProductData | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
    };
  }
}
