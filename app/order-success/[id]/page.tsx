'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check, Package } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
  }>;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">
            Order not found
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center items-center">
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-6 rounded-full">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Order Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Order Information
            </h2>

            <div className="space-y-3">
              <div className="pb-3 border-b border-border">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-lg font-semibold text-foreground">
                  {order.orderNumber}
                </p>
              </div>

              <div className="pb-3 border-b border-border">
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="pb-3 border-b border-border">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-yellow-600 capitalize">
                  {order.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Delivery Address
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">
                  {order.customer.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold text-foreground">
                  {order.customer.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold text-foreground">
                  {order.customer.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-semibold text-foreground">
                    {order.customer.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pincode</p>
                  <p className="font-semibold text-foreground">
                    {order.customer.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
                <div>
                  <p className="font-semibold text-foreground">
                    {item.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.price}/unit
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3">What's Next?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>You will receive a confirmation call on {order.customer.phone}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Your order will be processed within 24 hours</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Expected delivery: 3-5 business days</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>Payment will be collected at the time of delivery</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 h-11">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" className="h-11">
              Track Orders (Admin)
            </Button>
          </Link>
        </div>
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
