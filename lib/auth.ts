import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

export async function isAdmin() {
  const auth = await verifyAuth();
  return auth?.role === 'admin';
}
