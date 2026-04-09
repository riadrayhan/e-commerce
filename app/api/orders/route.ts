import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const orders = await getOrders(100);
    return NextResponse.json({ success: true, data: orders }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
    } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await createOrder(
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      'pending'
    );

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
