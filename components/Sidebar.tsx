'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Building2, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '@/constants/appConfig';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Calendar },
  { name: 'Meetings', href: '/dashboard', icon: Users },
  { name: 'Calendar', href: '/dashboard', icon: Settings },
  { name: 'Hospitals', href: '/dashboard', icon: Building2 },
  { name: 'Settings', href: '/dashboard', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Enhanced Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-5 left-5 z-50 p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl border border-gray-200/60 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Enhanced Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fade-in"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Modern Light Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-50 via-gray-100/50 to-gray-50 border-r border-gray-200 transition-all duration-300 z-40
          w-64 shadow-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {APP_NAME.split(' ')[0]}
                </h1>
                <p className="text-xs text-gray-500">Medical Scheduler</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200/60 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="px-3 py-3 bg-gray-100 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <p className="text-xs text-gray-600 font-medium">v1.0.0</p>
              </div>
              <p className="text-xs text-gray-500">
                © 2025 MedSchedule
              </p>
            </div>
          </div>
        </div>
      </aside>

  {/* Spacer for desktop to prevent content from going under sidebar */}
  <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
