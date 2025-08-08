"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Navigation items for main app pages
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/planner", label: "Planner" },
    { href: "/grocery", label: "Grocery" },
    { href: "/health-docs", label: "Health Docs" },
    { href: "/settings", label: "Settings" },
  ];

  // Check if a link is active
  const isActiveLink = (href) => pathname === href;

  // Get link classes based on active state
  const getLinkClasses = (href) => {
    const baseClasses = "transition-colors duration-200";
    if (isActiveLink(href)) {
      return `${baseClasses} text-primary-600 font-semibold border-b-2 border-primary-600`;
    }
    return `${baseClasses} text-gray-700 hover:text-primary-500`;
  };

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
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClasses(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/predict" className="btn btn-outline">
                  Predict Food
                </Link>
                <button onClick={logout} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            )}
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
        {isMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClasses(item.href)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="text-left text-red-600"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
