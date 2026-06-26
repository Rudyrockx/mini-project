import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';


export async function POST (request: NextRequest) {
    try{
    const session = await auth()

   

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Unauthenticated'}, {status: 401})
    }
    const { planName, price, duration } = await request.json();

    const mockCheckoutURL = `/mock-payment?plan=${planName}&price=${price}&duration=${duration}`;

    return NextResponse.json({
        success: true,
        checkoutUrl: mockCheckoutURL
    });
    }
    catch (error) {
        console.error('Error in checkout route:', error)
        return NextResponse.json({error: 'Failed to process payment'}, {status: 500})
    }
}
