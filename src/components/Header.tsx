"use client";

import React from 'react'
import Link from 'next/link';
import Logo from '../../public/Group 4.png'
import Image from 'next/image';
import { motion } from "motion/react"
import { Menu } from 'lucide-react';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    return (
        <nav className="absolute top-0 left-0 right-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-between">

                    <Link href={"/"}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="logo-text"
                        >
                            <Image src={Logo.src} width={120} height={64} alt='Logo' className="w-24 sm:w-32" />
                        </motion.span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Desktop Navigation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden md:flex space-x-8"
                    >
                        <a href="#" className="nav-link">Open Source</a>
                        <Link href="mailto:athulvinod@gmail.com" className="nav-link">Support</Link>
                        <Link href="/login" className="nav-link">Get Started</Link>
                    </motion.div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-4 bg-gray-900/95 rounded-lg p-4"
                    >
                        <div className="flex flex-col space-y-4">
                            <a href="#" className="nav-link block">Open Source</a>
                            <Link href="mailto:athulvinod@gmail.com" className="nav-link block">Support</Link>
                            <Link href="/login" className="nav-link block">Get Started</Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    )
}

export default Header