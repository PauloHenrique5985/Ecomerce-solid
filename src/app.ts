import express from 'express';
import { prisma } from './lib/prisma';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { PaymentMethodRegistry } from './payments/PaymentMethodRegistry';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

// ---- Composition Root: único lugar que escolhe as implementações concretas ----
const productRepository = new PrismaProductRepository(prisma);
const orderRepository = new PrismaOrderRepository(prisma);

// Para adicionar um novo meio de pagamento: criar a classe e incluir aqui.
const paymentMethods = new PaymentMethodRegistry([
  new CreditCardPayment(),
  new DebitCardPayment(),
  new PixPayment(),
]);

const notificationService = new NotificationService(new EtherealMailProvider());
const orderService = new OrderService(productRepository, orderRepository, paymentMethods, notificationService);
const orderController = new OrderController(orderService);

// ---- Express ----
const app = express();
app.use(express.json());

app.post('/orders', orderController.processOrder);

export default app;
