'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Building2, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '@/constants/appConfig';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Calendar },
  { name: 'Meetings', href: '/dashboard', icon: Users },
  { name: 'Hospitals', href: '/dashboard', icon: Building2 },
  { name: 'Settings', href: '/dashboard', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-surface/90 backdrop-blur-xl border-r border-border transition-transform duration-300 z-40
          w-60 shadow-xl-soft
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg-soft">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  {APP_NAME.split(' ')[0]}
                </h1>
                <p className="text-xs text-muted font-medium">Schedule Tracker</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-md-soft'
                        : 'text-foreground hover:bg-surface/60 font-medium'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="px-4 py-3 bg-surface rounded-xl border border-border">
              <p className="text-xs text-foreground font-medium">Version 1.0.0</p>
              <p className="text-xs text-muted mt-1">
                © 2025 Doctor Meeting Tracker
              </p>
            </div>
          </div>
        </div>
      </aside>

  {/* Spacer for desktop to prevent content from going under sidebar */}
  <div className="hidden lg:block w-60 flex-shrink-0" />
    </>
  );
}
