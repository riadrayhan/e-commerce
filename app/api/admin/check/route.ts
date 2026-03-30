import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key').trim();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ authenticated: true }, { status: 200 });
    } catch (verifyError) {
      // Token invalid - clear cookie
      const response = NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
      response.cookies.delete('adminToken');
      return response;
    }
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
