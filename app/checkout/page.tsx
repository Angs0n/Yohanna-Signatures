'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { FormData } from '@/types';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<number>(1);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    state: '',
    city: '',
    address: '',
    paymentMethod: 'card',
  });

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaystackPayment = () => {
    const totalInKobo = getTotal() * 100;
    
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_your_paystack_public_key',
      email: formData.email,
      amount: totalInKobo,
      currency: 'NGN',
      ref: `YOH-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: formData.name,
          },
        ],
      },
      callback: function(response: any) {
        toast.success('Payment successful! Thank you for your order. ✨');
        clearCart();
        router.push('/order-confirmation');
      },
      onClose: function() {
        toast.error('Payment cancelled. Please try again.');
      },
    });
    
    handler.openIframe();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    if (formData.paymentMethod === 'card') {
      handlePaystackPayment();
    } else {
      toast.success('Order placed! Please check your email for bank transfer details.');
      clearCart();
      router.push('/order-confirmation');
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-4">No items to checkout</h1>
          <p className="text-gray-600">Please add items to your cart first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl mb-8">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-gold-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl mb-6">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Address */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl mb-6">Payment Method</h2>
              
              {/* Order Summary */}
              <div className="bg-cream-50 p-6 rounded-sm mb-8">
                <h3 className="font-serif text-xl mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-sm hover:border-gold-400 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-medium">Pay with Card</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, Verve</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-sm hover:border-gold-400 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleInputChange}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-gray-500">You&apos;ll receive account details after placing order</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                Back
              </button>
            )}
            <button type="submit" className="btn-primary ml-auto">
              {step === 3 ? 'Complete Purchase' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}