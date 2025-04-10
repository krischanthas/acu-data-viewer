'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { HiOutlineCube } from 'react-icons/hi';

const Navbar = () => {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-[var(--customBlue)] p-4 text-white flex justify-between items-center relative">
            <div className="flex justify-center items-center">
                {/* Hamburger Menu Button */}
                <button onClick={toggleMenu} className="text-white focus:outline-none cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* App Title */}
                <div className="mx-4">
                    <Link href="/" className="text-lg font-bold">
                        ACU Data Viewer
                    </Link>
                </div>
            </div>

            {/* Profile Dropdown */}
            {status === 'authenticated' && (
                <div className="relative flex items-center">
                    <button onClick={toggleDropdown} className="flex items-center space-x-2 text-white focus:outline-none cursor-pointer">
                        <svg
                            className="w-8 h-8 rounded-full bg-white text-[var(--customBlue)] p-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 2a5 5 0 100 10 5 5 0 000-10zm0 13c-2.28 0-4.27 1.19-5.44 3H15.44c-1.17-1.81-3.16-3-5.44-3z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{session.user?.name}</span>
                    </button>
                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg z-50">
                            <button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Sidebar Navigation */}
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={() => setIsMenuOpen(false)}
            >
                <div className="flex justify-end p-4">
                    <button onClick={toggleMenu} className="text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-center space-y-6 mt-12">

                    <Link href="/stock" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-all">
                        <HiOutlineCube className="w-6 h-6 text-white" />
                        <span>Stock Check</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
