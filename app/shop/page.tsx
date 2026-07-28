import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';

export default function ShopPage() {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl text-center mb-4">Shop</h1>
        <p className="text-gray-600 text-center mb-12">
          Explore our complete collection of luxury pieces
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      <Newsletter />
    </div>
  );
}