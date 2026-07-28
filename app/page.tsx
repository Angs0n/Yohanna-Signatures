import Image from 'next/image';
import Link from 'next/link';
import { products, testimonials } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import { FaInstagram } from 'react-icons/fa';

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.category === 'Featured').slice(0, 4);
  const newArrivals = products.filter((p) => p.category === 'New Arrival').slice(0, 4);
  const bestSellers = products.filter((p) => p.category === 'Best Seller').slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"
            alt="Yohanna Signature Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
              Elegance Rooted In<br />Simplicity
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Thoughtfully crafted fashion pieces designed for the modern woman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="btn-primary text-lg">
                Shop Collection
              </Link>
              <Link href="/new-arrivals" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-gray-900 text-lg">
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">
            Discover our most coveted pieces, each designed to make you feel extraordinary.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">
            Be the first to discover our latest creations, fresh from the design studio.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] overflow-hidden rounded-sm">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e"
                alt="Yohanna Signature Story"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="animate-slide-up">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-gold-600 mb-8"></div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Yohanna Signature was founded to celebrate timeless elegance, confidence, and femininity 
                through carefully crafted fashion pieces. Each garment tells a story of artistry, 
                passion, and dedication to the modern woman who knows her worth.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                From the finest fabrics to the most intricate details, every Yohanna Signature piece 
                is a testament to the belief that true luxury lies in the perfect balance of 
                sophistication and simplicity.
              </p>
              <Link href="/about" className="btn-primary">
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging Section */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">The Yohanna Experience</h2>
          <p className="section-subtitle text-lg">
            Every Yohanna Signature order arrives beautifully packaged with care and attention to detail. 
            Because we believe the luxury experience begins the moment you receive your package.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-sm shadow-sm">
              <div className="text-gold-600 text-4xl mb-4">🎁</div>
              <h3 className="font-serif text-xl mb-3">Premium Packaging</h3>
              <p className="text-gray-600">Each order is wrapped in our signature packaging with tissue paper, ribbon, and a personalized note.</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm">
              <div className="text-gold-600 text-4xl mb-4">✨</div>
              <h3 className="font-serif text-xl mb-3">Quality Assurance</h3>
              <p className="text-gray-600">Every piece undergoes rigorous quality checks to ensure it meets our exacting standards before shipping.</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm">
              <div className="text-gold-600 text-4xl mb-4">💝</div>
              <h3 className="font-serif text-xl mb-3">Personal Touch</h3>
              <p className="text-gray-600">We include care instructions and styling tips to help you cherish your Yohanna piece for years to come.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Loved by our community. These are the pieces our customers can&apos;t stop talking about.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Real stories from real women who wear Yohanna Signature.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-sm shadow-sm text-center">
                <div className="text-gold-500 text-2xl mb-4">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-gray-600 italic mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-serif text-lg">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Follow Us on Instagram</h2>
          <p className="section-subtitle">
            @yohannasignature — Tag us to be featured
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer">
                <Image
                  src={`https://images.unsplash.com/photo-${1550000000 + i * 10000}`}
                  alt={`Instagram post ${i}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaInstagram size={30} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}