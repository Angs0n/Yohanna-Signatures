import Link from 'next/link';
import { FiMail, FiPhone } from 'react-icons/fi';
import { FaInstagram, FaWhatsapp, FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-2xl text-gold-400 mb-4">
              Yohanna<span className="text-gold-500">.</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Elegance Rooted In Simplicity. Thoughtfully crafted fashion pieces designed for the modern woman.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors" aria-label="Pinterest">
                <FaPinterest size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-gold-400 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-gray-400 hover:text-gold-400 transition-colors">Shop</Link></li>
              <li><Link href="/collections" className="text-gray-400 hover:text-gold-400 transition-colors">Collections</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-gold-400 transition-colors">About</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-400 hover:text-gold-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="text-gray-400 hover:text-gold-400 transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-serif text-lg text-gold-400 mb-4">Customer Support</h3>
            <ul className="space-y-3">
              <li><Link href="/shipping" className="text-gray-400 hover:text-gold-400 transition-colors">Shipping Information</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-gold-400 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-gold-400 transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-gold-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg text-gold-400 mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400">
                <FiMail size={18} />
                <span>hello@yohannasignature.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiPhone size={18} />
                <span>+234 800 000 0000</span>
              </li>
              <li>
                <h4 className="text-sm text-gray-300 mb-2 mt-4">Payment Methods</h4>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="border border-gray-600 px-2 py-1 rounded">Visa</span>
                  <span className="border border-gray-600 px-2 py-1 rounded">Mastercard</span>
                  <span className="border border-gray-600 px-2 py-1 rounded">Verve</span>
                  <span className="border border-gray-600 px-2 py-1 rounded">Bank Transfer</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Yohanna Signature. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}