import { Product } from './IProduct';

export class PhysicalProduct implements Product {
  readonly type = 'physical' as const;

  // Frete fixo simples (mesma regra do código legado: R$ 10,00 por item do pedido)
  private static readonly FIXED_FREIGHT = 10;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number
  ) {}

  calculateFreight(): number {
    return PhysicalProduct.FIXED_FREIGHT;
  }
}
