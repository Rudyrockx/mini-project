import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { category: true, price: true },
    });

    if (!product) {
      return NextResponse.json({ discount: 0 });
    }

    // Find matching discount rule
    const rule = await prisma.discountRule.findFirst({
      where: {
        isActive: true,
        category: product.category,
        minPrice: { lte: product.price },
        maxPrice: { gte: product.price },
      },
    });

    return NextResponse.json({ 
      discount: rule?.discountPercentage || 0 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ discount: 0 });
  }
}