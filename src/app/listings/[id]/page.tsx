'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Calendar, Clock, Check } from 'lucide-react';
import api from '@/lib/api';

interface Listing {
    _id: string;
    title: string;
    category: string;
    description: string;
    pricePerHour: number;
    images: string[];
    availability: string[];
    providerId: {
        _id: string;
        name: string;
        avatarUrl?: string;
        rating?: number;
    };
}

export default function ListingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [duration, setDuration] = useState(1);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listings/${params.id}`);
                setListing(res.data);
            } catch (error) {
                console.error('Error fetching listing:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchListing();
        }
    }, [params.id]);

    const handleBook = async () => {
        try {
            const startTime = new Date(`${bookingDate}T${bookingTime}`);
            const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

            await api.post('/bookings', {
                listingId: listing?._id,
                startTime,
                endTime,
            });

            alert('Booking request sent successfully!');
            setBookingModalOpen(false);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!listing) return <div className="text-center py-12">Listing not found</div>;

    return (
        <div className="bg-white min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Image Gallery */}
                    <div className="flex flex-col">
                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                            {listing.images && listing.images.length > 0 ? (
                                <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-full h-full object-center object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center bg-gray-100 text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Listing Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{listing.title}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900">${listing.pricePerHour}/hr</p>
                        </div>

                        <div className="mt-3">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <Star
                                            key={rating}
                                            className={`h-5 w-5 flex-shrink-0 ${(listing.providerId.rating || 0) > rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{listing.providerId.rating} out of 5 stars</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-base text-gray-700 space-y-6" dangerouslySetInnerHTML={{ __html: listing.description }} />
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Provided by {listing.providerId.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex">
                            <button
                                type="button"
                                onClick={() => setBookingModalOpen(true)}
                                className="max-w-xs flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500 sm:w-full"
                            >
                                Book Now
                            </button>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                            <div className="mt-4 prose prose-sm text-gray-500">
                                <ul role="list">
                                    {listing.availability.map((slot, index) => (
                                        <li key={index}>{slot}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {bookingModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setBookingModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                    <Calendar className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Book Service
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Select a date and time for your service.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 space-y-4">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            id="date"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                                        <input
                                            type="time"
                                            id="time"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={bookingTime}
                                            onChange={(e) => setBookingTime(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                                        <input
                                            type="number"
                                            id="duration"
                                            min="1"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={duration}
                                            onChange={(e) => setDuration(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                    onClick={handleBook}
                                >
                                    Confirm Booking
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => setBookingModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
