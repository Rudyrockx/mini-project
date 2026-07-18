import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { wishlist: false } } },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
        include: { items: true },
      });
    }

    // Fetch products for wishlist items
    const items = await Promise.all(
      wishlist.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return { ...item, product };
      })
    );

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}