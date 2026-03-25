'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Search, Truck, Shield, Clock, Leaf, Star, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_data?: Buffer;
  stock: number;
  created_at?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartCount(JSON.parse(savedCart).length);
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
      const result = await response.json();
      const productsData = result.data || result || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('[v0] Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
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

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
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
                className="w-full pl-10 pr-4 text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 sm:py-24 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ Fresh Daily Deliveries
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                  Quality Essentials, Delivered Fast
                </h1>
                <p className="text-lg text-muted-foreground text-balance">
                  Shop from thousands of daily necessities. Trusted by thousands. Same-day delivery available.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="#products">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <ShoppingCart className="w-5 h-5" />
                    Start Shopping
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Fast Delivery</div>
                </div>
              </div>
            </div>

            {/* Right - Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, title: 'Fast Delivery', desc: 'Same day delivery' },
                { icon: Shield, title: 'Secure', desc: 'Safe checkout' },
                { icon: Clock, title: '24/7 Support', desc: 'Always available' },
                { icon: Star, title: 'Quality', desc: 'Premium products' },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card key={idx} className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              OUR COLLECTION
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              {searchQuery ? 'Search Results' : 'Featured Products'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {searchQuery
                ? `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching your search`
                : 'Discover our carefully curated selection of daily essentials'}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full h-48 bg-muted/50 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-muted/50 rounded w-full animate-pulse" />
                      <div className="h-3 bg-muted/50 rounded w-2/3 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer">
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Product Image */}
                      <div className="relative w-full h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                        {product.image_data ? (
                          <img
                            src={`data:image/jpeg;base64,${Buffer.from(product.image_data).toString('base64')}`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                            <p className="text-xs text-muted-foreground">No image</p>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Stock */}
                        <div className="mt-4 space-y-3 border-t border-border/30 pt-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">
                              ₹{product.price.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            {product.stock > 0 ? (
                              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                In Stock ({product.stock})
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                                Out of Stock
                              </span>
                            )}
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                if (product.stock > 0) {
                                  addToCart(product);
                                }
                              }}
                              disabled={product.stock === 0}
                              className="gap-1 h-8"
                            >
                              <ShoppingCart className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms or browse all products</p>
              <Button onClick={() => setSearchQuery('')} className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {filteredProducts.length > 0 && !searchQuery && (
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border/30 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Ready to Order?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse through our complete collection and enjoy fast, reliable delivery to your doorstep.
            </p>
            <Link href="/cart">
              <Button size="lg" className="gap-2">
                <ShoppingCart className="w-5 h-5" />
                Go to Cart
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border/30 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Follow</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">
              © 2024 DailyMart. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Your trusted source for fresh daily essentials delivered fast and fresh.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
