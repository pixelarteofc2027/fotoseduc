import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  async create(@Body() body: { orderId: number }) {
    const result = await this.paymentsService.createPreference(body.orderId);
    return result;
  }

  // MercadoPago webhook endpoint
  @Post('webhook')
  async webhook(@Req() req: Request, @Res() res: Response) {
    try {
      await this.paymentsService.handleWebhook(req.body);
      res.status(200).send('ok');
    } catch (err) {
      console.error('Webhook error', err);
      res.status(500).send('error');
    }
  }
}
