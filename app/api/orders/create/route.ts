import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency = 'INR', cartItems } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    // Create database order
    const dbOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice: amount,
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
          })),
        },
      },
    });

    console.log('✅ Order created:', dbOrder.id);
    return NextResponse.json({
      success: true,
      orderId: dbOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}