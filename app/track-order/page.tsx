'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Search, Package, Bell, CheckCircle2, Truck, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{ productName?: string; productId?: string; price: number; quantity: number }>;
  total_amount: number;
  status: string;
  status_message: string;
  created_at: string;
  updated_at?: string;
}

interface Notification {
  id: string;
  order_id: string;
  order_number?: string;
  message: string;
  is_read: number;
  created_at: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
  confirmed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
  delivered: { icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const [ordersRes, notifsRes] = await Promise.all([
        fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}`),
        fetch(`/api/notifications?phone=${encodeURIComponent(phone)}`),
      ]);

      if (ordersRes.ok) {
        const result = await ordersRes.json();
        setOrders(result.data || []);
      }

      if (notifsRes.ok) {
        const result = await notifsRes.json();
        const notifs = result.data || [];
        setNotifications(notifs);

        // Show toast for unread notifications
        const unread = notifs.filter((n: Notification) => !n.is_read);
        if (unread.length > 0) {
          unread.forEach((n: Notification) => {
            toast.success(n.message, { duration: 6000 });
          });
          // Mark as read
          await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch order details');
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
            <span className="text-xl font-bold text-foreground hidden sm:inline">DailyMart</span>
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Back */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Package className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your phone number to view your orders and notifications
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="tel"
                placeholder="Enter your phone number (e.g., 01712345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="h-12 text-base"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 px-6">
              {loading ? 'Searching...' : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </h2>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border ${notif.is_read ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'}`}
                >
                  <p className="text-foreground font-medium">{notif.message}</p>
                  <div className="flex justify-between mt-2">
                    {notif.order_number && (
                      <p className="text-xs text-muted-foreground">Order: {notif.order_number}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {searched && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No orders found for this phone number</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure you entered the same phone number used during checkout
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Your Orders ({orders.length})
                </h2>
                <div className="space-y-4">
                  {orders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <Card key={order.id} className="border-border">
                        <CardContent className="pt-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-bold text-foreground text-lg">{order.order_number}</h3>
                                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${config.bg} ${config.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {order.status}
                                </span>
                              </div>

                              {/* Status message from admin */}
                              {order.status_message && (
                                <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                  <p className="text-sm font-medium text-foreground">{order.status_message}</p>
                                </div>
                              )}

                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Items: {(order.items || []).map((item, i) => (
                                  <span key={i}>
                                    {item.productName || item.productId} x{item.quantity}
                                    {i < (order.items || []).length - 1 ? ', ' : ''}
                                  </span>
                                ))}</p>
                                <p>Delivery: {order.customer_address}</p>
                                <p className="text-xs">
                                  Ordered: {new Date(order.created_at).toLocaleString()}
                                  {order.updated_at && ` | Updated: ${new Date(order.updated_at).toLocaleString()}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">
                                TK {order.total_amount?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-2">© 2025 DailyMart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
