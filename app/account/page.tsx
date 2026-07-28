'use client';

import { useState } from 'react';
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const { orders } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-gold-600" size={24} />
                </div>
                <div>
                  <p className="font-medium">Welcome</p>
                  <p className="text-sm text-gray-500">My Account</p>
                </div>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'orders' ? 'bg-gold-50 text-gold-600' : 'hover:bg-gray-50'}`}
                >
                  <FiPackage size={18} /> My Orders
                </button>
                <Link
                  href="/wishlist"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'wishlist' ? 'bg-gold-50 text-gold-600' : 'hover:bg-gray-50'}`}
                >
                  <FiHeart size={18} /> Wishlist
                </Link>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'settings' ? 'bg-gold-50 text-gold-600' : 'hover:bg-gray-50'}`}
                >
                  <FiSettings size={18} /> Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-serif mb-6">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link href="/shop" className="btn-primary">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x {item.cartQuantity}</span>
                              <span>{formatPrice(item.price * item.cartQuantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-serif mb-6">Account Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input type="text" className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" className="input-field" placeholder="Your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" className="input-field" placeholder="Your phone" />
                  </div>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}