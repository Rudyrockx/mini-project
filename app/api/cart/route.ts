import { NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
    try{
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({erorr: 'Unauthorised'}, {status: 401});

        }

        const cart = await prisma.cart.findUnique({
              where: { userId: session.user.id },
              include: {
                    items: {
                    include: {
                        cart: false,
                    },
                    },
                },
            });


        if (!cart) {
            return NextResponse.json({ items: [], total: 0 });
    }

        // Calculate total
        const items = await Promise.all(
        cart.items.map(async (item) => {
            const product = await prisma.product.findUnique({
            where: { id: item.productId },
            });
            return {
            ...item,
            product,
            };
        })
        );

        const total = items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
        }, 0);

        return NextResponse.json({ items, total });
       } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
        { error: 'Failed to fetch cart' },
        { status: 500 }
        );
    
       }
}