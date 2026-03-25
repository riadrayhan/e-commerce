'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartJSON = localStorage.getItem('cart');
    if (cartJSON) {
      setCart(JSON.parse(cartJSON));
    }
    setLoading(false);
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading cart...</p>
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
        </div>
      </header>

      {/* Back Button */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some products to get started
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    {!item.imageUrl && (
                      <div className="w-24 h-24 bg-secondary rounded flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-grow">
                      <h3 className="font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-lg">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="px-3 py-1 hover:bg-secondary"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-l border-r border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="px-3 py-1 hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item._id)}
                          className="ml-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold mb-3"
                >
                  Proceed to Checkout
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

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
