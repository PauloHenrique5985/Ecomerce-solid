import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';

/** Camada HTTP: recebe a request, chama o OrderService e devolve a response. */
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Arrow function para manter o `this` quando passada direto para o Express.
  processOrder = async (req: Request, res: Response) => {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const result = await this.orderService.placeOrder({
        customer,
        items,
        paymentMethod,
        paymentDetails,
      });

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview, // Link do Ethereal para facilitar o teste
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        logger.warn(`Pedido recusado: ${error.message}`);
        return res.status(error.statusCode).json({ error: error.message });
      }

      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}
