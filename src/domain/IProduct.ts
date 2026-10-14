export type ProductType = 'physical' | 'digital';

/**
 * Contrato de produto. Qualquer produto (físico, digital, serviço, assinatura...)
 * sabe calcular o próprio frete, então o OrderService não precisa
 * checar o "tipo" com if/else (LSP + OCP).
 */
export interface Product {
  readonly id: number;
  readonly name: string;
  readonly type: ProductType;
  readonly price: number;
  calculateFreight(): number;
}
