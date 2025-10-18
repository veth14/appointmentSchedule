'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Building2, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '@/constants/appConfig';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Calendar },
  { name: 'Meetings', href: '/meetings', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Hospitals', href: '/hospitals', icon: Building2 },
  { name: 'Settings', href: '/settings', icon: Settings },
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

      {/* Clean White Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40
          w-64 shadow-sm
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  Doctor
                </h1>
                <p className="text-xs text-gray-500">Medical Scheduler</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto relative">
            {/* Animated background indicator */}
            <div
              className="absolute left-4 right-4 bg-blue-500 rounded-xl shadow-lg pointer-events-none"
              style={{
                height: '48px',
                transform: `translateY(${navItems.findIndex(item => item.href === pathname) * 56}px)`,
                transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: navItems.some(item => item.href === pathname) ? 1 : 0,
              }}
            />
            
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl 
                    transition-all duration-300 ease-out z-10
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 ease-out ${
                    isActive 
                      ? 'text-white scale-110' 
                      : 'text-gray-500 group-hover:scale-110'
                  }`} />
                  <span className={`text-sm font-medium transition-all duration-300 ease-out ${
                    isActive ? 'translate-x-0.5' : ''
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Active indicator dot */}
                  <div className={`ml-auto transition-all duration-300 ease-out ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="font-medium">v1.0.0</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              © 2025 MedSchedule
            </p>
          </div>
        </div>
      </aside>

  {/* Spacer for desktop to prevent content from going under sidebar */}
  <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
