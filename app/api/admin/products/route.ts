import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, description, price, category, image, rating, reviews, inStock } = await request.json();

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        image: image || '',
        rating: parseFloat(rating) || 0,
        reviews: parseInt(reviews) || 0,
        inStock: inStock !== false,
      },
    });

    console.log('✅ Product created:', product.id);
    return NextResponse.json({
      success: true,
      message: 'Product created',
      product,
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
