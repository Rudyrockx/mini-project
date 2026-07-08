import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      // select: {
      //   id: true,
      //   name: true,
      //   email: true,
      //   avatarUrl: true,  // ← Add this
      //   address: true,
      //   latitude: true,
      //   longitude: true,
      //   role: true,
      //   },
      include: {
        subscriptions: {
          where: { isActive: true },
          include: { plan: true },
          orderBy: { expiresAt: 'desc' },
          take: 1,
        },
      },
        
      
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        role: user.role,
        createdAt: user.createdAt,
        activeSubscription: user.subscriptions[0] || null,
      },
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
