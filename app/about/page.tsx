import Image from 'next/image';
import Newsletter from '@/components/Newsletter';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-96">
        <Image
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e"
          alt="About Yohanna Signature"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="font-serif text-5xl text-white">Our Story</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"
                alt="Our Vision"
                fill
                className="object-cover rounded-sm"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Yohanna Signature was born from a passion for timeless elegance and a deep appreciation 
                for the artistry of fashion. Our vision is to empower women through clothing that 
                celebrates their strength, beauty, and individuality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each piece in our collection is thoughtfully designed and meticulously crafted using 
                the finest materials, ensuring that every woman who wears Yohanna Signature feels 
                confident, beautiful, and extraordinary.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-serif text-2xl mb-3">Craftsmanship</h3>
              <p className="text-gray-600">
                Every stitch, every detail is executed with precision and care by skilled artisans.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="font-serif text-2xl mb-3">Quality</h3>
              <p className="text-gray-600">
                We source only the finest fabrics and materials to create pieces that last.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="font-serif text-2xl mb-3">Elegance</h3>
              <p className="text-gray-600">
                Our designs embody sophistication, grace, and timeless beauty.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}