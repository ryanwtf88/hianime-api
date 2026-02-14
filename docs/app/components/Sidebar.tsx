'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const isActive = (path: string) => pathname === path;

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link
            href={href}
            className={`block px-4 py-3 rounded-lg text-sm transition-all duration-200 ${isActive(href)
                    ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 active:bg-gray-200'
                }`}
            onClick={() => setMobileMenuOpen(false)}
        >
            {children}
        </Link>
    );

    return (
        <>
            {/* Mobile menu button - Fixed position with better touch target */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-white border border-gray-300 shadow-md hover:shadow-lg active:shadow-sm transition-shadow"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
            >
                <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {mobileMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Overlay for mobile - with fade animation */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 animate-fadeIn"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          w-72 sm:w-80 lg:w-64 h-screen fixed left-0 top-0 overflow-y-auto 
          border-r border-gray-200 bg-white z-40
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-xl lg:shadow-none
        `}
            >
                <div className="p-6 lg:p-6">
                    {/* Logo - Improved spacing */}
                    <div className="mb-8 lg:mb-10">
                        <Link href="/" className="block group">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/logo.png"
                                        alt="HiAnime API Logo"
                                        width={48}
                                        height={48}
                                        className="rounded-lg group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        HiAnime API
                                    </h1>
                                    <p className="text-xs text-gray-500">Documentation</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation - Improved spacing and touch targets */}
                    <nav className="space-y-8">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                                Getting Started
                            </h3>
                            <div className="space-y-1">
                                <NavLink href="/">Introduction</NavLink>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                                Core Features
                            </h3>
                            <div className="space-y-1">
                                <NavLink href="/home">Home & Schedules</NavLink>
                                <NavLink href="/anime">Anime & Search</NavLink>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                                Streaming
                            </h3>
                            <div className="space-y-1">
                                <NavLink href="/streaming">Episodes & Servers</NavLink>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                                Metadata & Utils
                            </h3>
                            <div className="space-y-1">
                                <NavLink href="/metadata">Genres & Characters</NavLink>
                                <NavLink href="/utils">Utils (Random, W2G)</NavLink>
                            </div>
                        </div>

                        {/* Footer - Better mobile spacing */}
                        <div className="pt-8 mt-8 border-t border-gray-200">
                            <a
                                href="https://github.com/ryanwtf88/hianime-api"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all active:bg-gray-100"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="font-medium">View on GitHub</span>
                            </a>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
