'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  stock: number;
  created_at?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      const products = result.data || result || [];
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Daily Essentials, Just a Click Away
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Fresh products delivered to your doorstep. Shopping made simple.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-card border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No products found
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Check back soon for available products'}
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm('')}
                className="bg-primary hover:bg-primary/90"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {searchTerm ? `Search Results (${filteredProducts.length})` : 'Featured Products'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all h-full flex flex-col cursor-pointer">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    {!product.imageUrl && (
                      <div className="w-full h-40 bg-secondary flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">
                          ₹{product.price}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
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
