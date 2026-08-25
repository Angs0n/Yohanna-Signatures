'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import useCartStore from '@/store/cartStore';
import { FormData } from '@/types';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', country: 'Nigeria', state: '', city: '', address: '', paymentMethod: 'card' });
  const formatPrice = (price: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const startPayment = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout/initialize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: { name: formData.name, email: formData.email, phone: formData.phone, country: formData.country, state: formData.state, city: formData.city, address: formData.address }, items: items.map((item) => ({ id: item.id, quantity: item.cartQuantity })) }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Could not start payment');
      window.location.assign(result.data.authorizationUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not start payment');
      setIsSubmitting(false);
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 3) return setStep((current) => current + 1);
    if (formData.paymentMethod !== 'card') return toast.error('Bank transfer is not configured yet. Please choose card payment.');
    void startPayment();
  };

  if (!items.length) return <div className="pt-32 min-h-screen text-center"><h1 className="font-serif text-4xl mb-4">No items to checkout</h1><p className="text-gray-600">Please add items to your cart first.</p></div>;
  const inputClass = 'input-field';
  return <div className="pt-20"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="font-serif text-4xl mb-8">Checkout</h1>
    <div className="flex items-center mb-12">{[1, 2, 3].map((number) => <div key={number} className="flex-1 flex items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= number ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{number}</div>{number < 3 && <div className={`flex-1 h-1 mx-2 ${step > number ? 'bg-gold-600' : 'bg-gray-200'}`} />}</div>)}</div>
    <form onSubmit={submit}>
      {step === 1 && <section className="space-y-4"><h2 className="font-serif text-2xl mb-6">Customer Information</h2><input className={inputClass} name="name" value={formData.name} onChange={update} placeholder="Full name" required /><input className={inputClass} name="email" type="email" value={formData.email} onChange={update} placeholder="Email address" required /><input className={inputClass} name="phone" value={formData.phone} onChange={update} placeholder="Phone number" required /></section>}
      {step === 2 && <section className="space-y-4"><h2 className="font-serif text-2xl mb-6">Shipping Address</h2><select className={inputClass} name="country" value={formData.country} onChange={update}><option>Nigeria</option><option>Ghana</option><option>Kenya</option><option>South Africa</option></select><input className={inputClass} name="state" value={formData.state} onChange={update} placeholder="State" required /><input className={inputClass} name="city" value={formData.city} onChange={update} placeholder="City" required /><textarea className={inputClass} name="address" value={formData.address} onChange={update} placeholder="Street address" rows={3} required /></section>}
      {step === 3 && <section><h2 className="font-serif text-2xl mb-6">Payment</h2><div className="bg-cream-50 p-6 rounded-sm mb-8"><h3 className="font-serif text-xl mb-4">Order Summary</h3>{items.map((item) => <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm py-1"><span>{item.name} × {item.cartQuantity}</span><span>{formatPrice(item.price * item.cartQuantity)}</span></div>)}<div className="border-t mt-2 pt-2 flex justify-between font-semibold"><span>Total</span><span>{formatPrice(getTotal())}</span></div></div><label className="flex items-center p-4 border rounded-sm cursor-pointer"><input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={update} className="mr-4" /><span><b>Pay with Card</b><br /><small>Secure payment powered by Paystack</small></span></label></section>}
      <div className="flex justify-between mt-8">{step > 1 && <button type="button" onClick={() => setStep((current) => current - 1)} className="btn-secondary">Back</button>}<button type="submit" disabled={isSubmitting} className="btn-primary ml-auto disabled:opacity-60">{step === 3 ? (isSubmitting ? 'Starting payment…' : 'Complete Purchase') : 'Continue'}</button></div>
    </form>
  </div></div>;
}
