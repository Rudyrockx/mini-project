import { NextResponse, NextRequest } from "next/server";
import {auth} from '@/lib/auth';
import prisma from '@/lib/db';

export async function DELETE(
    request: NextRequest,
    { params }: {params: Promise<{id: string}>} )
    {
        try {
            const session = await auth();
            if(session?.user?.role !== 'admin' ){
                return NextResponse.json({error: 'Unauthorized'}, {status: 403})
            }
            const { id } = await params;

            const product = await prisma.product.delete({
                where: { id },
            });
            console.log('Product deleted', product.id);
            return NextResponse.json({
                success: true,
                message: 'Product deleted',
            });


        }
        catch (error) {
            console.error('error deleting product', error);
            return NextResponse.json(
                {error: 'Failed to delete product'},
                {status: 500}
            );
        }
    }