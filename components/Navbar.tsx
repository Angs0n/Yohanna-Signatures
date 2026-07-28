'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';
import { products } from '@/data/products';

interface NavLink {
  name: string;
  href: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Using your JPEG file */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative h-16 w-40">
                <Image
                  src="/Yohanna_Signature-removebg-preview.png" // Your logo file in the public folder
                  alt="Yohanna Signature"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Center Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium text-sm uppercase tracking-wider transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-gold-600'
                      : 'text-gray-700 hover:text-gold-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-gray-700 hover:text-gold-600 transition-colors" 
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
              <Link href="/account" className="text-gray-700 hover:text-gold-600 transition-colors">
                <FiUser size={20} />
              </Link>
              <Link href="/wishlist" className="text-gray-700 hover:text-gold-600 transition-colors">
                <FiHeart size={20} />
              </Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-gold-600 transition-colors">
                <FiShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-gold-600"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm uppercase tracking-wider ${
                    pathname === link.href
                      ? 'text-gold-600'
                      : 'text-gray-700 hover:text-gold-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-20">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-2xl p-6">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field flex-1"
                autoFocus
              />
              <button 
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }} 
                className="btn-secondary"
              >
                Close
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {products
                .filter(p => 
                  searchQuery && 
                  p.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded transition-colors"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-gold-600">₦{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))
              }
              {searchQuery && products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <p className="text-center text-gray-500 py-4">No products found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}