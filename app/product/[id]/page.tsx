'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/data/products';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import Newsletter from '@/components/Newsletter';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === parseInt(id));
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to cart! ✨`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    window.location.href = '/checkout';
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-sm ${
                    selectedImage === index ? 'ring-2 ring-gold-600' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="font-serif text-4xl mb-2">{product.name}</h1>
            <p className="text-2xl text-gold-800 font-semibold mb-6">
              {formatPrice(product.price)}
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-sm transition-all ${
                        selectedColor === color
                          ? 'border-gold-600 bg-gold-50 text-gold-800'
                          : 'border-gray-300 hover:border-gold-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-sm transition-all ${
                      selectedSize === size
                        ? 'border-gold-600 bg-gold-50 text-gold-800'
                        : 'border-gray-300 hover:border-gold-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-sm w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <FiMinus size={16} />
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-sm font-medium hover:bg-gold-600 transition-all duration-300"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-8 space-y-6">
              <div>
                <h3 className="font-serif text-lg mb-2">Product Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Materials:</strong> {product.materials}</li>
                  <li><strong>Care:</strong> {product.care}</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FiTruck size={18} />
                  <span>Free shipping on orders over ₦100,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield size={18} />
                  <span>Quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}