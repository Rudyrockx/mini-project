import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      orderId,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Signature mismatch');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ Signature verified');

    // Get plan
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create subscription
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + plan.durationHours);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: session.user.id,
        planId,
        stripePaymentId: razorpay_payment_id,
        expiresAt,
        isActive: true,
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // Clear cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    console.log('✅ Payment verified and cart cleared');
    
    
    console.log('✅ Subscription created:', subscription.id);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription created',
      subscription,
    });
    

    

    

  } catch (error) {
    console.error('❌ Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed', details: String(error) },
      { status: 500 }
    );
  }
}
