'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Star } from 'lucide-react';
import api from '@/lib/api';
import CategoryHero from '@/components/CategoryHero';

interface Listing {
    _id: string;
    title: string;
    category: string;
    description: string;
    pricePerHour: number;
    images: string[];
    providerId: {
        name: string;
        avatarUrl?: string;
        rating?: number;
    };
}

import { Suspense } from 'react';

function ListingsContent() {
    const searchParams = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchTerm) params.append('q', searchTerm);
                if (category) params.append('category', category);

                const res = await api.get(`/listings?${params.toString()}`);
                setListings(res.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [searchTerm, category]);

    // Check if the current category has a 3D hero configuration
    const hasPremiumHero = ['Home Repair', 'Cleaning', 'Moving', 'Gardening', 'Plumbing', 'Electrical'].includes(category);

    return (
        <div className="bg-gray-50 min-h-screen pb-8">
            {hasPremiumHero && <CategoryHero category={category} />}

            <div id="listings-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-8 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Home Repair">Home Repair</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Moving">Moving</option>
                                <option value="Gardening">Gardening</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Tuition">Tuition</option>
                                <option value="Pet Care">Pet Care</option>
                                <option value="Tailoring">Tailoring</option>
                                <option value="Delivery">Delivery</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <Link key={listing._id} href={`/listings/${listing._id}`} className="group">
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                        {listing.images && listing.images.length > 0 ? (
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="object-cover w-full h-48"
                                            />
                                        ) : (
                                            <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600">{listing.category}</p>
                                                <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                                                    {listing.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                <span className="text-sm font-medium text-yellow-700">
                                                    {listing.providerId.rating || 'New'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-base text-gray-500 line-clamp-2">{listing.description}</p>
                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{listing.providerId.name}</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">${listing.pricePerHour}/hr</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ListingsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ListingsContent />
        </Suspense>
    );
}
