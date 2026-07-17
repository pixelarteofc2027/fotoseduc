import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() body: { items: { photoId: number; priceCents: number; quantity: number }[] }) {
    const order = await this.ordersService.createOrder(body.items);
    return { ok: true, order };
  }
}
