import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 12; // Products per page

    const where: any = {};
    

    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minRating) where.rating = { gte: parseFloat(minRating) };

    // Get total count
    const total = await prisma.product.count({ where });

    // product search
    const search = searchParams.get('search');
    if(search){
      where.OR = [
        {name: {
          contains: search,
          mode: "insensitive"
        }},
        {description: {
          contains: search,
          mode: "insensitive"
        }},
        {category: {
          contains: search,
          mode: "insensitive"
        }}
      ];
    }


    // Get products for current page
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    // Get all unique categories from database for the filters
    const allCategories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    const categories = allCategories.map(c => c.category);

    return NextResponse.json({
      success: true,
      products,
      categories,
      pagination: {
        total,
        pageSize,
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}