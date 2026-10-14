import { IPaymentMethod } from './IPaymentMethod';
import { AppError } from '../errors/AppError';

/** Guarda os meios de pagamento disponíveis e entrega o correto pelo nome. */
export class PaymentMethodRegistry {
  private readonly methods = new Map<string, IPaymentMethod>();

  constructor(methods: IPaymentMethod[] = []) {
    methods.forEach((method) => this.register(method));
  }

  register(method: IPaymentMethod): void {
    this.methods.set(method.name, method);
  }

  get(name: string): IPaymentMethod {
    const method = this.methods.get(name);
    if (!method) {
      throw new AppError('Método de pagamento não suportado', 400);
    }
    return method;
  }
}
