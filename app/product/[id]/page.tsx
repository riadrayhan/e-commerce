'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  image_url?: string;
  images?: string[];
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const result = await response.json();
        const productData = result.data || result;
        setProduct(productData);
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

    const productId = product._id || product.id;
    const productImage = product.images?.[0] || product.image_url || product.imageUrl;

    // Check if product already in cart
    const existingItem = cart.find((item: any) => item._id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        _id: productId,
        name: product.name,
        price: product.price,
        imageUrl: productImage,
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
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="flex items-center justify-center relative">
              {(() => {
                const allImages = product.images && product.images.length > 0
                  ? product.images
                  : product.image_url
                    ? [product.image_url]
                    : product.imageUrl
                      ? [product.imageUrl]
                      : [];

                if (allImages.length > 0) {
                  return (
                    <>
                      <img
                        src={allImages[selectedImageIndex] || allImages[0]}
                        alt={product.name}
                        className="max-w-full h-auto max-h-[450px] rounded-lg object-contain"
                      />
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                            disabled={selectedImageIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full p-1 disabled:opacity-30"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(Math.min(allImages.length - 1, selectedImageIndex + 1))}
                            disabled={selectedImageIndex === allImages.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full p-1 disabled:opacity-30"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </>
                  );
                }

                return (
                  <div className="w-full h-96 bg-secondary rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                  </div>
                );
              })()}
            </div>

            {/* Thumbnails */}
            {(() => {
              const allImages = product.images && product.images.length > 0
                ? product.images
                : product.image_url
                  ? [product.image_url]
                  : product.imageUrl
                    ? [product.imageUrl]
                    : [];

              if (allImages.length > 1) {
                return (
                  <div className="flex gap-2 justify-center">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index
                            ? 'border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                TK {product.price}
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
