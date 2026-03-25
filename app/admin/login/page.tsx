'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            Admin Panel
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Manage your daily essentials store
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Admin Password
              </label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Contact your administrator for password
          </p>
        </div>
      </div>
    </div>
  );
}
