import { NextRequest, NextResponse } from 'next/server';
import { getNotificationsByPhone, markNotificationsRead } from '@/lib/db';

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

    const notifications = await getNotificationsByPhone(phone);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    await markNotificationsRead(phone);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
