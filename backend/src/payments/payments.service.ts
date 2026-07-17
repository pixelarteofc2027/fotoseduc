import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPreference(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new Error('Order not found');

    const items = order.items.map((it) => ({
      title: `Foto #${it.photoId}`,
      quantity: it.quantity,
      unit_price: it.priceCents / 100
    }));

    const token = process.env.MERCADO_PAGO_TOKEN;
    if (!token) throw new Error('MERCADO_PAGO_TOKEN not set');

    const resp = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items,
        back_urls: { success: `${process.env.APP_URL || 'http://localhost:3000'}/checkout/success`, failure: `${process.env.APP_URL || 'http://localhost:3000'}/checkout/failure` },
        notification_url: `${process.env.APP_URL || 'http://localhost:3001'}/api/payments/webhook`
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // create payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        provider: 'mercadopago',
        providerId: resp.data.id,
        amountCents: order.totalCents,
        status: 'pending',
        method: 'mercadopago'
      }
    });

    return { init_point: resp.data.init_point, sandbox_init_point: resp.data.sandbox_init_point };
  }

  async handleWebhook(body: any) {
    // MercadoPago sends various events; fetch payment info if needed
    // For simplicity, assume body contains type 'payment' and id" (preference)
    console.log('Webhook payload', body);
    const { type, data } = body;
    if (type === 'payment') {
      // data.id is payment id; fetch details
      const token = process.env.MERCADO_PAGO_TOKEN;
      const paymentId = data && data.id;
      const resp = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${token}` } });
      const paymentInfo = resp.data;
      const preferenceId = paymentInfo.preference_id;
      // find payment by providerId
      const payment = await this.prisma.payment.findFirst({ where: { providerId: preferenceId } });
      if (payment) {
        // mark payment as approved
        await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'approved' } });
        // mark order as paid
        await this.prisma.order.update({ where: { id: payment.orderId }, data: { status: 'paid' } });
        // As part of delivery: remove watermark flag for items' photos
        const items = await this.prisma.orderItem.findMany({ where: { orderId: payment.orderId } });
        for (const it of items) {
          await this.prisma.photo.updateMany({ where: { id: it.photoId }, data: { watermarked: false } });
        }
      }
    }
    return true;
  }
}
