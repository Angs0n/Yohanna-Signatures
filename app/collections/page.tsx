import Image from 'next/image';
import Link from 'next/link';
import { collections } from '@/data/products';
import Newsletter from '@/components/Newsletter';

export default function CollectionsPage() {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl text-center mb-4">Collections</h1>
        <p className="text-gray-600 text-center mb-12">
          Explore our curated collections, each with its own story
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group relative overflow-hidden rounded-sm shadow-sm"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="font-serif text-2xl mb-2">{collection.name}</h2>
                  <p className="text-gray-200 mb-2">{collection.description}</p>
                  <p className="text-gold-400">{collection.productCount} Pieces</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Newsletter />
    </div>
  );
}