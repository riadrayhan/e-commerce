import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByPhone } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get('phone');
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const orders = await getOrdersByPhone(phone);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
