'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      icon: '✨',
    });
  };

  return (
    <div
      className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Quick Actions */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="bg-white p-3 rounded-full hover:bg-gold-600 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Add to cart"
          >
            <FiShoppingBag size={20} />
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white hover:bg-gold-600 hover:text-white'
            }`}
            aria-label="Add to wishlist"
          >
            <FiHeart size={20} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="bg-white p-3 rounded-full hover:bg-gold-600 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Quick view"
          >
            <FiEye size={20} />
          </Link>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-gold-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg mb-1 text-gray-900 hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gold-800 font-semibold">{formatPrice(product.price)}</p>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-gray-900 text-white py-2 rounded-sm text-sm uppercase tracking-wider hover:bg-gold-600 transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}