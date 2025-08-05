"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold font-display text-gray-900"
            >
              Nutri<span className="gradient-text">Vision</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/predict"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Try Now
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth" className="btn btn-outline">
              Log In
            </Link>
            <Link href="/auth?signup=true" className="btn btn-primary">
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/predict"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                Try Now
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/auth" className="btn btn-outline">
                  Log In
                </Link>
                <Link href="/auth?signup=true" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
