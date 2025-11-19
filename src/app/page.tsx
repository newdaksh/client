'use client';

import ThreeHero from '@/components/ThreeHero';
import Link from 'next/link';

const categories = [
  { name: 'Home Repair', icon: '🔧', color: 'bg-blue-100 text-blue-600' },
  { name: 'Cleaning', icon: '✨', color: 'bg-green-100 text-green-600' },
  { name: 'Moving', icon: '📦', color: 'bg-orange-100 text-orange-600' },
  { name: 'Gardening', icon: '🌱', color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Plumbing', icon: '🚰', color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Electrical', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ThreeHero />

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/listings?category=${category.name}`} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center border border-gray-100 h-full flex flex-col items-center justify-center group-hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 ${category.color}`}>
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
