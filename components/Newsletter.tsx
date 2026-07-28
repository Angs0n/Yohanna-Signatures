'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Welcome to the Yohanna family! ✨', {
      duration: 4000,
    });
    setEmail('');
  };

  return (
    <section className="bg-cream-100 py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Join Our Exclusive Community</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Subscribe to receive updates on new collections, exclusive offers, and style inspiration curated just for you.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
        
        <p className="text-gray-500 text-sm mt-4">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </section>
  );
}