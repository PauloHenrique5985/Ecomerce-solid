import { ProductData } from '../domain/ProductFactory';

export interface IProductRepository {
  findById(id: number): Promise<ProductData | null>;
}
