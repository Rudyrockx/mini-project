import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET all rules
export async function GET() {
  try {
    const rules = await prisma.discountRule.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

// CREATE new rule
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { category, minPrice, maxPrice, discountPercent } = await request.json();

    const rule = await prisma.discountRule.create({
      data: {
        category,
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        discountPercentage: parseInt(discountPercent),
      },
    });

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
  }
}