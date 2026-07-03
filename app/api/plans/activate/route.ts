import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planName, duration, stripePaymentId } = await request.json();

    if (!planName) {
      return NextResponse.json({ error: 'Plan name is required' }, { status: 400 });
    }

    // Find or create pricing plan
    let plan = await prisma.pricingPlan.findFirst({
      where: { name: planName },
    });

    if (!plan) {
      plan = await prisma.pricingPlan.create({
        data: {
          name: planName,
          price: planName.toLowerCase() === 'free' ? 0.0 : 999.0,
          durationHours: duration || (planName.toLowerCase() === 'free' ? 1 : 30),
        },
      });
    }

    // Set expiry
    const activatedAt = new Date();
    const expiresAt = new Date(activatedAt.getTime() + plan.durationHours * 60 * 60 * 1000);

    // Deactivate previous active subscriptions
    await prisma.userSubscription.updateMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Create subscription
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        stripePaymentId: stripePaymentId || null,
        activatedAt,
        expiresAt,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Plan activation error:', error);
    return NextResponse.json({ error: 'Failed to activate plan' }, { status: 500 });
  }
}
