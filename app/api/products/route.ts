import { connectToDatabase, Product } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).select('-imageId');
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const product = new Product({
      name: body.name,
      price: body.price,
      description: body.description,
      imageUrl: body.imageUrl,
      stock: body.stock || 100,
      category: body.category || 'Daily Essentials',
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
