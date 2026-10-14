/** Item do pedido como fica gravado (snapshot do produto no momento da compra). */
export interface OrderItemRecord {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

export interface NewOrder {
  customer: string;
  items: OrderItemRecord[];
  total: number;
  status: string;
}

export interface SavedOrder extends NewOrder {
  id: number;
}

export interface IOrderRepository {
  create(order: NewOrder): Promise<SavedOrder>;
}
