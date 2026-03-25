import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, data: products });
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
    const { name, price, description, imageData, stock } = body;

    if (!name || price === undefined || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert base64 image to Buffer if provided
    let imageBuffer = null;
    if (imageData && typeof imageData === 'string') {
      try {
        imageBuffer = Buffer.from(imageData, 'base64');
      } catch (e) {
        console.warn('Invalid image data provided');
      }
    }

    const product = await createProduct(
      name,
      parseFloat(price),
      description,
      imageBuffer,
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
