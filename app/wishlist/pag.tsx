'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { products } from '@/data/products';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(products.slice(0, 4));
  const addToCart = useCartStore((state) => state.addToCart);

  const removeFromWishlist = (productId: number) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
    toast.success('Removed from wishlist');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl mb-4">My Wishlist</h1>
        <p className="text-gray-600 mb-8">Your saved favorites</p>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your wishlist is empty</p>
            <Link href="/shop" className="btn-primary mt-4 inline-block">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="relative aspect-[3/4] mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-serif text-lg mb-2">{product.name}</h3>
                <p className="text-gold-600 font-bold mb-4">{formatPrice(product.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success('Added to cart!');
                    }}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    <FiShoppingBag size={16} /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="px-3 py-2 border border-red-300 text-red-500 rounded hover:bg-red-50"
                  >
                    <FiHeart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}