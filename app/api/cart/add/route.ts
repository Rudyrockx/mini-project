import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Cart add called');
    
    const session = await auth();
    console.log('📋 Session:', session);
    console.log('👤 User ID:', session?.user?.id);

    if (!session?.user?.id) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();
    console.log('📦 Adding product:', productId, 'quantity:', quantity);

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    console.log('✅ Added to cart successfully');
    return NextResponse.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart', details: String(error) },
      { status: 500 }
    );
  }
}