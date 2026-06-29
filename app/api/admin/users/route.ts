import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET (request: NextRequest) {
    try{
        const session = await auth()

        if (!session?.user?.id){
            return NextResponse.json({error:'Unauthorised'}, {status:401})
        }
        const admin = await prisma.user.findUnique({
            where:{id: session.user.id}
        })

        // Check if user is Admin
        if (admin?.role?.toLowerCase() !== 'admin'){
            return NextResponse.json({error:'Forbidden'}, {status:403})
        }

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search') || '';
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const where = search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users with subscriptions
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        subscriptions: {
          select: {
            plan: {
              select: {
                name: true,
                durationHours: true,
              },
            },
            isActive: true,
            expiresAt: true,
          },
          orderBy: { activatedAt: 'desc' as const },
          take: 1,
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' as const },
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
