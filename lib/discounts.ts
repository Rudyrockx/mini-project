import prisma from './db';

export async function getProductDiscount(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true, price: true },
    });

    if (!product) return 0;

    // Find matching discount rule
    const rule = await prisma.discountRule.findFirst({
      where: {
        isActive: true,
        category: product.category,
        minPrice: { lte: product.price },
        maxPrice: { gte: product.price },
      },
    });

    return rule?.discountPercentage || 0;
  } catch (error) {
    console.error('Error calculating discount:', error);
    return 0;
  }
}