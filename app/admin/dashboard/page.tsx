'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminProtected } from '@/components/admin-protected';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, LogOut, Package, Eye, Upload, X as XIcon, ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  images?: string[];
  stock: number;
  created_at?: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{ productName?: string; productId?: string; price: number; quantity: number }>;
  total_amount: number;
  status: string;
  created_at: string;
}

function AdminDashboardContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '100',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      const products = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      const orders = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
      setOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setUploading(true);

      // Upload new images if any
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadFormData = new FormData();
        imageFiles.forEach((file) => uploadFormData.append('files', file));

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const err = await uploadResponse.json();
          toast.error(err.error || 'Failed to upload images');
          setUploading(false);
          return;
        }

        const uploadResult = await uploadResponse.json();
        uploadedUrls = uploadResult.urls || [];
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...existingImages, ...uploadedUrls];

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        images: allImages,
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
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString(),
    });
    setExistingImages(product.images || (product.image_url ? [product.image_url] : []));
    setImageFiles([]);
    setImagePreviews([]);
    setEditingId(product.id);
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
      stock: '100',
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
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
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-2 font-semibold text-lg border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Package className="w-5 h-5" />
            Orders ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
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
                      Price (TK) *
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
                      Stock Quantity
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
                    Product Images (Max 4)
                  </label>

                  {/* Existing images (when editing) */}
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Current Images:</p>
                      <div className="flex gap-2 flex-wrap">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Existing ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setExistingImages(existingImages.filter((_, i) => i !== index));
                              }}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-2">New Images to Upload:</p>
                      <div className="flex gap-2 flex-wrap">
                        {imagePreviews.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = imageFiles.filter((_, i) => i !== index);
                                const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                setImageFiles(newFiles);
                                setImagePreviews(newPreviews);
                              }}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload button */}
                  {(existingImages.length + imageFiles.length) < 4 && (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload images ({existingImages.length + imageFiles.length}/4)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const totalAllowed = 4 - existingImages.length - imageFiles.length;
                          const newFiles = files.slice(0, totalAllowed);

                          if (files.length > totalAllowed) {
                            toast.error(`You can only add ${totalAllowed} more image(s)`);
                          }

                          // Generate previews
                          const previews: string[] = [];
                          newFiles.forEach((file) => {
                            previews.push(URL.createObjectURL(file));
                          });

                          setImageFiles([...imageFiles, ...newFiles]);
                          setImagePreviews([...imagePreviews, ...previews]);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: JPEG, PNG, WebP, GIF. Max 5MB per file.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Add')} Product
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={uploading}
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
            <Card key={product.id} className="border-border">
              <CardContent className="pt-4">
                {(product.images?.[0] || product.image_url) && (
                  <img
                    src={product.images?.[0] || product.image_url}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                {product.images && product.images.length > 1 && (
                  <p className="text-xs text-muted-foreground mb-2">
                    <ImageIcon className="w-3 h-3 inline mr-1" />
                    {product.images.length} images
                  </p>
                )}
                <h3 className="font-semibold text-foreground mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.description.substring(0, 60)}...
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-primary">
                    TK {product.price}
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
                    onClick={() => handleDelete(product.id)}
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
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Orders</h2>
              <Button variant="outline" size="sm" onClick={fetchOrders}>
                Refresh
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No orders yet</p>
                <p className="text-muted-foreground">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground text-lg">
                              {order.order_number}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">{order.customer_name}</span> — {order.customer_phone}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {order.customer_address}
                          </p>
                          <div className="text-sm text-muted-foreground">
                            {(order.items || []).map((item, i) => (
                              <span key={i}>
                                {item.productName || item.productId} x{item.quantity}
                                {i < (order.items || []).length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-xl font-bold text-primary">
                            TK {order.total_amount?.toFixed(2)}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {order.status === 'pending' && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                                  Confirm
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                                  Cancel
                                </Button>
                              </>
                            )}
                            {order.status === 'confirmed' && (
                              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'shipped')}>
                                Mark Shipped
                              </Button>
                            )}
                            {order.status === 'shipped' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                Mark Delivered
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
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
