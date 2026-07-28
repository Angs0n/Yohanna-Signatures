export default function ReturnsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl mb-8">Returns & Exchanges</h1>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <section>
            <h2 className="text-2xl font-serif mb-4">Return Policy</h2>
            <p className="text-gray-600">We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have all original tags attached.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Contact our customer service team</li>
              <li>Receive a return authorization number</li>
              <li>Package items securely with original packaging</li>
              <li>Ship to our return address</li>
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-4">Refunds</h2>
            <p className="text-gray-600">Refunds are processed within 5-7 business days after we receive and inspect the returned items.</p>
          </section>
        </div>
      </div>
    </div>
  );
}