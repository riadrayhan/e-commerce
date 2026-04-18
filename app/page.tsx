'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Search,
  Leaf,
  UtensilsCrossed,
  Watch,
  Shirt,
  Sparkles,
  LayoutGrid,
  Package,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  images?: string[];
  stock: number;
  category?: string;
  created_at?: string;
}

const CATEGORIES = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'food', label: 'Food', icon: UtensilsCrossed },
  { key: 'accessories', label: 'Accessories', icon: Watch },
  { key: 'dress', label: 'Dress', icon: Shirt },
  { key: 'cosmetics', label: 'Cosmetics', icon: Sparkles },
  { key: 'other', label: 'Other', icon: Package },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartCount(JSON.parse(savedCart).length);
      } catch {}
    }
  }, []);

  const fetchProducts = async (attempt = 1) => {
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      if (response.ok) {
        const result = await response.json();
        const productsData = result.data || result || [];
        if (Array.isArray(productsData) && productsData.length > 0) {
          setProducts(productsData);
          setLoading(false);
          return;
        }
      }
      if (attempt < 3) {
        setTimeout(() => fetchProducts(attempt + 1), 2000);
        return;
      }
    } catch (error) {
      console.error('[v0] Error fetching products:', error);
      if (attempt < 3) {
        setTimeout(() => fetchProducts(attempt + 1), 2000);
        return;
      }
    }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'all' ||
        (p.category || 'food').toLowerCase() === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Food first when on "All"
    if (activeCategory === 'all') {
      list = [...list].sort((a, b) => {
        const af = (a.category || 'food').toLowerCase() === 'food' ? 0 : 1;
        const bf = (b.category || 'food').toLowerCase() === 'food' ? 0 : 1;
        return af - bf;
      });
    }
    return list;
  }, [products, searchQuery, activeCategory]);

  const addToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const productId = (product as any)._id || product.id;
      const existing = cart.find((item: any) => item._id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          _id: productId,
          name: product.name,
          price: product.price,
          imageUrl:
            product.images?.[0] ||
            (product as any).image_url ||
            (product as any).imageUrl,
          quantity: 1,
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartCount(cart.length);
    } catch (error) {
      console.error('[v0] Error adding to cart:', error);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">
                Daily<span className="text-primary">Mart</span>
              </span>
            </Link>

            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 rounded-full border-orange-200 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/track-order" className="hidden md:block">
                <Button variant="ghost" size="sm">Track</Button>
              </Link>
              <Link href="/admin/login" className="hidden md:block">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
              <Link href="/cart" className="relative">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 rounded-full border-orange-200"
              />
            </div>
          </div>

          {/* Category Tab Bar */}
          <nav className="flex gap-1 sm:gap-2 overflow-x-auto pb-3 -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-foreground border-orange-100 hover:border-primary hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3">
              Fresh Picks, <span className="text-primary">Delivered Daily</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Food, fashion & essentials at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {activeCategory === 'all'
                ? 'All Products'
                : CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} items
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-orange-300 mx-auto mb-3" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const img = product.images?.[0] || product.image_url || '';
                return (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <Card className="group overflow-hidden border-orange-100 hover:border-primary hover:shadow-xl transition-all h-full flex flex-col cursor-pointer rounded-2xl py-0">
                      <div className="relative aspect-square bg-orange-50 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Leaf className="w-10 h-10 text-orange-200" />
                          </div>
                        )}
                        {product.category && (
                          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-primary text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <CardContent className="flex-1 p-3 sm:p-4 flex flex-col">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          <div className="font-bold text-primary text-lg">
                            ৳{product.price}
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white rounded-full h-8 w-8 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-50 border-t border-orange-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 DailyMart — Fresh & Fast Delivery</p>
        </div>
      </footer>
    </main>
  );
}
'u