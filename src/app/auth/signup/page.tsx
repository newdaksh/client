'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthBackground from '@/components/AuthBackground';
import api from '@/lib/api';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/signup', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/');
            // Force reload to update navbar state
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <AuthBackground />
            <div className="relative z-10 max-w-md w-full space-y-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
                <div>
                    <h2 className="mt-2 text-center text-4xl font-extrabold text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Join our community today
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 sm:text-sm backdrop-blur-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 sm:text-sm backdrop-blur-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 sm:text-sm backdrop-blur-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="sr-only">
                                I want to
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 sm:text-sm backdrop-blur-sm [&>option]:bg-gray-900 [&>option]:text-white"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="user">Find Services</option>
                                <option value="provider">Provide Services</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-200 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02] shadow-lg"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link href="/auth/login" className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200">
                        Already have an account? <span className="underline decoration-blue-300/30 underline-offset-4">Sign in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
