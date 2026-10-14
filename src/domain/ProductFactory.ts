import { Product } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

/** Formato "cru" do produto, como vem do banco de dados. */
export interface ProductData {
  id: number;
  name: string;
  type: string;
  price: number;
}

/**
 * Converte os dados do banco em objetos ricos de domínio.
 * Este é o ÚNICO lugar que conhece os tipos de produto existentes.
 */
export class ProductFactory {
  static createProduct(data: ProductData): Product {
    switch (data.type) {
      case 'physical':
        return new PhysicalProduct(data.id, data.name, data.price);
      case 'digital':
        return new DigitalProduct(data.id, data.name, data.price);
      default:
        throw new Error(`Tipo de produto desconhecido: ${data.type}`);
    }
  }
}
