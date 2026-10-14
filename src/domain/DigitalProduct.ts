import { Product } from './IProduct';

export class DigitalProduct implements Product {
  readonly type = 'digital' as const;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number
  ) {}

  // Produto digital não é enviado, logo não tem frete.
  calculateFreight(): number {
    return 0;
  }
}
