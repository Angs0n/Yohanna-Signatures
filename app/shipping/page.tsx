export default function ShippingPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl mb-8">Shipping Information</h1>
        <div className="prose max-w-none">
          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <section>
              <h2 className="text-2xl font-serif mb-4">Shipping Rates</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Lagos: Free shipping on orders over ₦50,000</li>
                <li>• Other Nigerian states: Flat rate of ₦3,000</li>
                <li>• International: Calculated at checkout</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-serif mb-4">Delivery Times</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Lagos: 1-2 business days</li>
                <li>• Other Nigerian states: 3-5 business days</li>
                <li>• International: 7-14 business days</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-serif mb-4">Tracking</h2>
              <p className="text-gray-600">Once your order ships, you will receive an email with tracking information.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}