'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Get existing cart from localStorage
    const cartJSON = localStorage.getItem('cart');
    const cart = cartJSON ? JSON.parse(cartJSON) : [];

    // Check if product already in cart
    const existingItem = cart.find((item: any) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${product.name} added to cart`);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">
            Product not found
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              DailyMart
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full h-auto rounded-lg object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-secondary rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                ₹{product.price}
              </span>
              <div className="mt-2">
                {product.stock > 0 ? (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Description
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.stock > 0 && (
              <div className="border-t border-border pt-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="px-4 py-2 border border-border rounded hover:bg-secondary"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-foreground w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stock, quantity + 1)
                        )
                      }
                      className="px-4 py-2 border border-border rounded hover:bg-secondary"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-2">
            © 2025 DailyMart. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Your trusted source for daily essentials
          </p>
        </div>
      </footer>
    </div>
  );
}
