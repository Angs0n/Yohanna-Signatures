import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function BestSellersPage() {
  const bestSellers = products.filter(p => p.category === 'Best Seller');
  
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-center mb-4">Best Sellers</h1>
        <p className="text-gray-600 text-center mb-12">Our most loved pieces</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}