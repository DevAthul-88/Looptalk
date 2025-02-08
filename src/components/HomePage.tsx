"use client";

import React from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { motion } from "motion/react"
import FeatureSections from './HomeSections';
import Link from 'next/link';
import Logo from '../../public/Group 4.png'
import Image from 'next/image';
import backgroundImage from '../../public/bg.jpg'
import { useAuth } from '@/app/contexts/AuthContextNormal';

function HomePage() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);


  return (
    <div className="min-h-screen bg-[#0B0B14] text-white">

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

      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />

        <div className="hero-content container mx-auto px-4 sm:px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Find your community
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              LoopTalk is the chat app that's<br className="hidden sm:block" />truly built with you in mind.
            </motion.p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {currentUser ? <>
                <Link href="/app/me">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary group w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Open Web App
                    </span>
                  </motion.button>
                </Link>
              </> : <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary group w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Get Started
                  </span>
                </motion.button>
              </Link>}
              <a href="#" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary w-full sm:w-auto"
                >
                  <span>Open Source</span>
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureSections />

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-12">
              That's the website,<br />you can't scroll further.
            </h2>
            <div className="flex justify-center gap-4">
              {currentUser ? <>
                <Link href="/app/me">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary group w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Open Web App
                    </span>
                  </motion.button>
                </Link>
              </> : <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary group w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Get Started
                  </span>
                </motion.button>
              </Link>}
              <a href="#">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                >
                  <span>Open Source</span>
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-bold mb-4 text-[#FF4654]">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="inline-block hover:text-white transition-all">Home</Link></li>
                <li><Link href="/login" className="inline-block hover:text-white transition-all">Login</Link></li>
                <li><Link href="/register" className="inline-block hover:text-white transition-all">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#FF4654]">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy-policy" className="inline-block hover:text-white transition-all">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="inline-block hover:text-white transition-all">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#FF4654]">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="mailto:devathulvinod@gmail.com" className="inline-block hover:text-white transition-all">Support Email</Link></li>
                <li><Link href="#" className="inline-block hover:text-white transition-all">Open Source</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 LoopTalk. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;