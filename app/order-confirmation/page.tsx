import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function OrderConfirmationPage() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h1 className="font-serif text-4xl mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed. 
          You will receive an email confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/account" className="btn-secondary">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}