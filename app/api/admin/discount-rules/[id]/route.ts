import { NextRequest, NextResponse } from 'next/server';
import { auth } from  '@/lib/auth';
import prisma from '@/lib/db';


export async function PATCH(request: NextRequest, { params }: {params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error:'Unauthorized'}, { status: 403});
        }

         const { id } = await params;
    const { category, minPrice, maxPrice, discountPercent, isActive } = await request.json();

    const rule = await prisma.discountRule.update({
      where: { id },
      data: {
        ...(category && { category }),
        ...(minPrice && { minPrice: parseFloat(minPrice) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
        ...(discountPercent && { discountPercent: parseInt(discountPercent) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}

// DELETE rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.discountRule.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });

    }

}