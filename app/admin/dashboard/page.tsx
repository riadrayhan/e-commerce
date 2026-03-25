'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminProtected } from '@/components/admin-protected';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, LogOut } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  stock: number;
}

function AdminDashboardContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    stock: '100',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrl: formData.imageUrl,
        stock: parseInt(formData.stock),
      };

      if (editingId) {
        const response = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success('Product updated successfully');
          setEditingId(null);
          fetchProducts();
        } else {
          toast.error('Failed to update product');
        }
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success('Product added successfully');
          fetchProducts();
        } else {
          toast.error('Failed to add product');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl || '',
      stock: product.stock.toString(),
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Product deleted');
          fetchProducts();
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      stock: '100',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    document.cookie =
      'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Products</h2>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Fresh Milk"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stock
                    </label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <Textarea
                    placeholder="Product description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {editingId ? 'Update' : 'Add'} Product
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product._id} className="border-border">
              <CardContent className="pt-4">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-semibold text-foreground mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.description.substring(0, 60)}...
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-primary">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products yet</p>
            <p className="text-muted-foreground mb-4">
              Start adding products to your store
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Add First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProtected>
      <AdminDashboardContent />
    </AdminProtected>
  );
}
