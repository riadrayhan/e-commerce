import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, data: products }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, images, imageUrl, imageData, stock } = body;

    if (!name || price === undefined || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Support both new (images array) and old (imageUrl/imageData) formats
    const imageList = Array.isArray(images) ? images : (imageUrl || imageData ? [imageUrl || imageData] : []);

    const product = await createProduct(
      name,
      parseFloat(price),
      description,
      imageList,
      parseInt(stock) || 100
    );

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
