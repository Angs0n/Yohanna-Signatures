import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function NewArrivalsPage() {
  const newArrivals = products.filter(p => p.category === 'New Arrival');
  
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-center mb-4">New Arrivals</h1>
        <p className="text-gray-600 text-center mb-12">Discover our latest pieces</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}