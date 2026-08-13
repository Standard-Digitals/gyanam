import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';
import { getRazorpayClient, isRazorpayConfigured } from '@/lib/razorpay';

const PROMO_CODES: Record<string, { discountPercent: number; maxDiscount: number }> = {
  GYANM20: { discountPercent: 20, maxDiscount: 300 },
  WELCOME100: { discountPercent: 15, maxDiscount: 200 },
};

const bodySchema = z.object({
  items: z.array(z.object({
    resourceId: z.string(),
    format: z.enum(['Paperback Edition', 'Hardcover Edition', 'Digital E-Book']),
    quantity: z.number().int().positive(),
  })).min(1),
  promoCode: z.string().optional(),
  deliverySpeed: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cod', 'upi', 'card', 'netbanking']),
  address: z.object({
    fullName: z.string().min(1),
    mobile: z.string().regex(/^\d{10}$/),
    email: z.string().email(),
    addressLine: z.string().min(1),
    pincode: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
  }),
});

function computeUnitPrice(basePrice: number, format: string): number {
  if (format === 'Digital E-Book') return Math.max(49, basePrice - 50);
  if (format === 'Hardcover Edition') return basePrice + 80;
  return basePrice;
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Login required to place an order' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { items, promoCode, deliverySpeed, paymentMethod, address } = parsed.data;

  const resourceIds = items.map((i) => i.resourceId);
  const resources = await prisma.freeResource.findMany({ where: { id: { in: resourceIds } } });
  const resourceMap = new Map(resources.map((r) => [r.id, r]));

  const orderItems: { resourceId: string; title: string; format: string; quantity: number; unitPrice: number }[] = [];
  let subtotal = 0;

  for (const item of items) {
    const resource = resourceMap.get(item.resourceId);
    if (!resource) {
      return NextResponse.json({ error: `Resource ${item.resourceId} not found` }, { status: 400 });
    }
    const unitPrice = computeUnitPrice(resource.price || 199, item.format);
    subtotal += unitPrice * item.quantity;
    orderItems.push({ resourceId: resource.id, title: resource.title, format: item.format, quantity: item.quantity, unitPrice });
  }

  let promoDiscount = 0;
  const normalizedPromo = promoCode?.trim().toUpperCase();
  if (normalizedPromo && PROMO_CODES[normalizedPromo]) {
    const { discountPercent, maxDiscount } = PROMO_CODES[normalizedPromo];
    promoDiscount = Math.min(Math.round((subtotal * discountPercent) / 100), maxDiscount);
  }

  const shippingFee = deliverySpeed === 'express' ? 99 : subtotal > 499 ? 0 : 49;
  const grandTotal = Math.max(0, subtotal - promoDiscount + shippingFee);
  const orderNumber = `GYN-${Math.floor(100000 + Math.random() * 900000)}`;

  const isOnlinePayment = paymentMethod !== 'cod';
  if (isOnlinePayment && !isRazorpayConfigured()) {
    return NextResponse.json({ error: 'Online payments are not live yet. Please select Cash on Delivery for now.' }, { status: 503 });
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.userId,
      items: orderItems,
      subtotal,
      promoCode: normalizedPromo && PROMO_CODES[normalizedPromo] ? normalizedPromo : undefined,
      promoDiscount,
      shippingFee,
      grandTotal,
      deliverySpeed,
      paymentMethod,
      paymentStatus: isOnlinePayment ? 'PENDING' : 'COD_PENDING',
      orderStatus: 'PLACED',
      ...address,
    },
  });

  if (!isOnlinePayment) {
    return NextResponse.json({ success: true, order });
  }

  const amountPaise = grandTotal * 100;
  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `bookstore_${order.id}`,
  });

  await prisma.payment.create({
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      purpose: 'BOOKSTORE_ORDER',
      referenceId: order.id,
      userId: session.userId,
    },
  });

  return NextResponse.json({
    success: true,
    order,
    razorpayOrderId: razorpayOrder.id,
    amount: amountPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
