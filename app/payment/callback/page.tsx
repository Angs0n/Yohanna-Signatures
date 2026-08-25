'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useCartStore from '@/store/cartStore';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const [message, setMessage] = useState('Confirming your payment…');
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference) { setMessage('We could not find your payment reference. Please contact us if you were charged.'); return; }
    fetch(`/api/payments/verify/${encodeURIComponent(reference)}`).then(async (response) => ({ response, result: await response.json() })).then(({ response, result }) => {
      if (!response.ok || !result.success || !result.data.paid) throw new Error(result.message || 'Payment was not completed');
      clearCart(); router.replace(`/order-confirmation?reference=${encodeURIComponent(reference)}`);
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'We could not verify your payment.'));
  }, [clearCart, router, searchParams]);
  return <div className="min-h-screen pt-32 text-center px-4"><h1 className="font-serif text-3xl mb-4">Payment status</h1><p>{message}</p></div>;
}
