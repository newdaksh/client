'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ThreeNavbarBackground from './ThreeNavbarBackground';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        // Check for user in localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const is3DPage = ['/services', '/about', '/contact', '/dashboard'].includes(pathname);

    return (
        <nav
            className={cn(
                'fixed w-full z-50 transition-all duration-300',
                isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md border-b border-white/20' : 'bg-transparent'
            )}
        >
            {/* 3D Background - Only visible when not scrolled and not on 3D pages */}
            {!isScrolled && !is3DPage && (
                <div className="absolute inset-0 -z-10 opacity-50">
                    <ThreeNavbarBackground />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                N
                            </div>
                            <span className={cn("font-bold text-xl", isScrolled ? "text-gray-900" : "text-white")}>
                                NeighbourCare
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-blue-500',
                                    pathname === link.href
                                        ? 'text-blue-600'
                                        : isScrolled ? 'text-gray-700' : 'text-gray-200'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard">
                                    <button className={cn("flex items-center gap-2 px-4 py-2 rounded-full transition-colors", isScrolled ? "bg-gray-100 hover:bg-gray-200 text-gray-900" : "bg-white/10 hover:bg-white/20 text-white")}>
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={cn("p-2 rounded-full transition-colors", isScrolled ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-white")}
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/auth/login"
                                    className={cn("text-sm font-medium hover:text-blue-500 transition-colors", isScrolled ? "text-gray-700" : "text-white")}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn("p-2 rounded-md focus:outline-none", isScrolled ? "text-gray-700" : "text-white")}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    'block px-3 py-2 rounded-md text-base font-medium',
                                    pathname === link.href
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 my-2 pt-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
