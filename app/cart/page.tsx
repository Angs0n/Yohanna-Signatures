'use client';

import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import Newsletter from '@/components/Newsletter';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 bg-white p-6 rounded-sm shadow-sm">
                <div className="relative w-32 h-40 flex-shrink-0">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    Size: {item.selectedSize} | Color: {item.selectedColor}
                  </p>
                  
                  <p className="text-gold-800 font-semibold mb-4">
                    {formatPrice(item.price)}
                  </p>
                  
                  <div className="flex items-center border border-gray-300 rounded-sm w-32">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="flex-1 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-sm shadow-sm sticky top-24">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
              
              <Link href="/checkout" className="block w-full text-center btn-primary mb-4">
                Proceed to Checkout
              </Link>
              
              <Link href="/shop" className="block text-center text-gold-600 hover:text-gold-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Newsletter />
    </div>
  );
}
