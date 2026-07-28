'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAdminStore from '@/data/adminStore';
import { AdminProduct, Order } from '@/types';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiBell, FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'notifications'>('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  
  const { orders, getOrders } = useCartStore();
  const { products: adminProducts, addProduct, updateProduct, deleteProduct, notifications, addNotification, markNotificationRead } = useAdminStore();

  const [newProduct, setNewProduct] = useState<Partial<AdminProduct>>({
    name: '',
    price: 0,
    description: '',
    category: 'Featured',
    images: [''],
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    materials: '',
    care: '',
    quantity: 0,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Change this password
      setIsAuthenticated(true);
      toast.success('Welcome to Admin Panel');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: AdminProduct = {
      id: Date.now(),
      name: newProduct.name || '',
      price: newProduct.price || 0,
      description: newProduct.description || '',
      category: newProduct.category || 'Featured',
      images: newProduct.images || [],
      sizes: newProduct.sizes || [],
      colors: newProduct.colors || [],
      materials: newProduct.materials || '',
      care: newProduct.care || '',
      quantity: newProduct.quantity || 0,
      createdAt: new Date().toISOString(),
    };
    addProduct(product);
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      category: 'Featured',
      images: [''],
      sizes: ['S', 'M', 'L'],
      colors: ['Black'],
      materials: '',
      care: '',
      quantity: 0,
    });
    toast.success('Product added successfully!');
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted!');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (editingProduct) {
          const newImages = [...editingProduct.images];
          newImages[index] = imageUrl;
          setEditingProduct({ ...editingProduct, images: newImages });
        } else {
          const newImages = [...(newProduct.images || [])];
          newImages[index] = imageUrl;
          setNewProduct({ ...newProduct, images: newImages });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-serif text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="input-field mb-4"
              required
            />
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
          <h2 className="text-2xl font-serif mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded transition-colors ${activeTab === 'dashboard' ? 'bg-gold-600' : 'hover:bg-gray-800'}`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 rounded transition-colors ${activeTab === 'products' ? 'bg-gold-600' : 'hover:bg-gray-800'}`}
            >
              📦 Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded transition-colors ${activeTab === 'orders' ? 'bg-gold-600' : 'hover:bg-gray-800'}`}
            >
              🛍️ Orders
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded transition-colors ${activeTab === 'notifications' ? 'bg-gold-600' : 'hover:bg-gray-800'}`}
            >
              🔔 Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-serif mb-8">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <FiPackage className="text-4xl text-gold-600" />
                    <div>
                      <p className="text-gray-500">Total Products</p>
                      <p className="text-3xl font-bold">{adminProducts.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <FiDollarSign className="text-4xl text-green-600" />
                    <div>
                      <p className="text-gray-500">Total Orders</p>
                      <p className="text-3xl font-bold">{orders.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <FiBell className="text-4xl text-blue-600" />
                    <div>
                      <p className="text-gray-500">Notifications</p>
                      <p className="text-3xl font-bold">{notifications.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Products</h1>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiPlus /> Add Product
                </button>
              </div>

              {/* Add/Edit Product Form */}
              {(showAddProduct || editingProduct) && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h2 className="text-2xl font-serif mb-6">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <input
                          type="text"
                          value={editingProduct ? editingProduct.name : newProduct.name}
                          onChange={(e) => editingProduct 
                            ? setEditingProduct({...editingProduct, name: e.target.value})
                            : setNewProduct({...newProduct, name: e.target.value})
                          }
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Price (₦)</label>
                        <input
                          type="number"
                          value={editingProduct ? editingProduct.price : newProduct.price}
                          onChange={(e) => editingProduct
                            ? setEditingProduct({...editingProduct, price: Number(e.target.value)})
                            : setNewProduct({...newProduct, price: Number(e.target.value)})
                          }
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={editingProduct ? editingProduct.description : newProduct.description}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({...editingProduct, description: e.target.value})
                          : setNewProduct({...newProduct, description: e.target.value})
                        }
                        className="input-field"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          value={editingProduct ? editingProduct.category : newProduct.category}
                          onChange={(e) => editingProduct
                            ? setEditingProduct({...editingProduct, category: e.target.value})
                            : setNewProduct({...newProduct, category: e.target.value})
                          }
                          className="input-field"
                        >
                          <option value="Featured">Featured</option>
                          <option value="New Arrival">New Arrival</option>
                          <option value="Best Seller">Best Seller</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Quantity</label>
                        <input
                          type="number"
                          value={editingProduct ? editingProduct.quantity : newProduct.quantity}
                          onChange={(e) => editingProduct
                            ? setEditingProduct({...editingProduct, quantity: Number(e.target.value)})
                            : setNewProduct({...newProduct, quantity: Number(e.target.value)})
                          }
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Materials</label>
                        <input
                          type="text"
                          value={editingProduct ? editingProduct.materials : newProduct.materials}
                          onChange={(e) => editingProduct
                            ? setEditingProduct({...editingProduct, materials: e.target.value})
                            : setNewProduct({...newProduct, materials: e.target.value})
                          }
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Images</label>
                      <div className="space-y-2">
                        {[0, 1].map((index) => (
                          <div key={index}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              className="input-field"
                            />
                            {(editingProduct?.images?.[index] || newProduct.images?.[index]) && (
                              <img
                                src={editingProduct?.images?.[index] || newProduct.images?.[index]}
                                alt={`Preview ${index + 1}`}
                                className="mt-2 h-20 object-cover rounded"
                              />
                            )}
                          </div>
                        ))}
                        <p className="text-sm text-gray-500">Or enter image URLs:</p>
                        <input
                          type="text"
                          placeholder="Image URL 1"
                          value={editingProduct ? editingProduct.images?.[0] || '' : newProduct.images?.[0] || ''}
                          onChange={(e) => {
                            const images = [...(editingProduct?.images || newProduct.images || [])];
                            images[0] = e.target.value;
                            editingProduct
                              ? setEditingProduct({...editingProduct, images})
                              : setNewProduct({...newProduct, images});
                          }}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Image URL 2"
                          value={editingProduct ? editingProduct.images?.[1] || '' : newProduct.images?.[1] || ''}
                          onChange={(e) => {
                            const images = [...(editingProduct?.images || newProduct.images || [])];
                            images[1] = e.target.value;
                            editingProduct
                              ? setEditingProduct({...editingProduct, images})
                              : setNewProduct({...newProduct, images});
                          }}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button type="submit" className="btn-primary">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProduct(false);
                          setEditingProduct(null);
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover mr-3"
                              />
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4">₦{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">{product.quantity}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="text-3xl font-serif mb-8">Orders</h1>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 text-sm">{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4">{order.customerName}</td>
                        <td className="px-6 py-4">₦{order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div>
              <h1 className="text-3xl font-serif mb-8">Notifications</h1>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white p-4 rounded-lg shadow flex items-center justify-between ${
                      notification.read ? 'opacity-50' : ''
                    }`}
                  >
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationRead(notification.id)}
                        className="text-gold-600 hover:text-gold-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}