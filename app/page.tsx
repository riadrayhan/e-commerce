'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Search, Truck, Shield, Clock, Leaf, Star, ArrowRight, Menu, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_data?: Buffer;
  stock: number;
  created_at?: string;
}

// Demo products for initial load
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Vegetables Bundle',
    price: 299,
    description: 'Assorted fresh vegetables - tomato, onion, carrot, potato',
    stock: 50,
  },
  {
    id: '2',
    name: 'Whole Wheat Flour',
    price: 149,
    description: '5kg premium whole wheat flour for daily use',
    stock: 100,
  },
  {
    id: '3',
    name: 'Cooking Oil Combo',
    price: 499,
    description: 'Mixed cooking oil - sunflower and mustard oil',
    stock: 30,
  },
  {
    id: '4',
    name: 'Milk & Dairy Pack',
    price: 199,
    description: 'Fresh milk and yogurt combo pack',
    stock: 75,
  },
  {
    id: '5',
    name: 'Rice - Basmati',
    price: 399,
    description: '2kg premium basmati rice',
    stock: 60,
  },
  {
    id: '6',
    name: 'Spice Blend',
    price: 89,
    description: 'Multi-purpose spice blend for cooking',
    stock: 120,
  },
  {
    id: '7',
    name: 'Household Essentials',
    price: 349,
    description: 'Soap, shampoo, and detergent combo',
    stock: 45,
  },
  {
    id: '8',
    name: 'Fresh Eggs Dozen',
    price: 99,
    description: '12 pieces of fresh farm eggs',
    stock: 40,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartCount(JSON.parse(savedCart).length);
      } catch (e) {
        console.error('[v0] Error parsing cart:', e);
      }
    }
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        const productsData = result.data || result || [];
        if (Array.isArray(productsData) && productsData.length > 0) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
      }
    } catch (error) {
      console.error('[v0] Error fetching products:', error);
      // Keep demo products as fallback
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartCount(cart.length);
    } catch (error) {
      console.error('[v0] Error adding to cart:', error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-foreground">DailyMart</div>
                <div className="text-xs text-muted-foreground">Fresh & Fast</div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 rounded-lg"
                />
              </div>
            </div>

            {/* Admin & Cart Links */}
            <div className="flex items-center gap-3">
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
              <Link href="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 rounded-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
                Fresh Essentials, Right to Your Door
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Shop daily necessities with the best prices. Fast delivery, guaranteed quality, and 24/7 customer support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Delivery Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Quality Guarantee</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl h-96 flex items-center justify-center">
                <ShoppingCart className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-12 sm:py-20 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DailyMart?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Same-day delivery in select areas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">100% Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Safe payment & data protection
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Always here to help you
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Carefully selected products
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-background py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">
              {searchQuery ? 'Search Results' : 'Featured Products'}
            </h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} products available
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try searching for something else</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="hover:shadow-lg hover:border-primary transition-all h-full flex flex-col cursor-pointer">
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 h-40 flex items-center justify-center rounded-t-lg">
                      <div className="text-center">
                        <Leaf className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Product Image</p>
                      </div>
                    </div>
                    <CardContent className="flex-1 pt-4 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            ₹{product.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Stock: {product.stock}
                          </div>
                        </div>
                        <Button
                          size="sm"
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-lg mb-4">DailyMart</div>
              <p className="text-sm text-muted-foreground">
                Your trusted daily essentials store
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Products</Link></li>
                <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
                <li><Link href="/" className="hover:text-foreground">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="/" className="hover:text-foreground">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/" className="hover:text-foreground">Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DailyMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
