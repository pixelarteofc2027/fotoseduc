import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(items: { photoId: number; priceCents: number; quantity: number }[]) {
    const total = items.reduce((s, it) => s + it.priceCents * it.quantity, 0);
    const order = await this.prisma.order.create({ data: { clientId: 1, totalCents: total, status: 'pending', items: { create: items.map((it) => ({ photoId: it.photoId, priceCents: it.priceCents, quantity: it.quantity })) } }, include: { items: true } });
    return order;
  }
}
