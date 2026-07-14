import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');

    console.log('Filter params received:', { category, minPrice, maxPrice, minRating });

    const where: any = {};

    if (category) {
      where.category = category;
      console.log('✅ Applied category filter:', category);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
      console.log('✅ Applied price filter:', where.price);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
      console.log('✅ Applied rating filter:', minRating);
    }

    console.log('📦 Where clause:', JSON.stringify(where));

    const products = await prisma.product.findMany({
      where,  // ← THIS WAS MISSING!
      orderBy: { createdAt: 'desc' },
    });

    console.log('✅ Found products:', products.length);

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}