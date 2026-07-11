import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.pricingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
  }
}