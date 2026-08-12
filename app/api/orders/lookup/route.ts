import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query')?.trim();
  if (!query) {
    return NextResponse.json({ found: false, error: 'Enter an order ID or mobile number' }, { status: 400 });
  }

  const isOrderNumber = /^GYN-/i.test(query);

  const order = isOrderNumber
    ? await prisma.order.findUnique({ where: { orderNumber: query.toUpperCase() } })
    : await prisma.order.findFirst({ where: { mobile: query }, orderBy: { createdAt: 'desc' } });

  if (!order) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    order: {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      grandTotal: order.grandTotal,
      createdAt: order.createdAt,
    },
  });
}
