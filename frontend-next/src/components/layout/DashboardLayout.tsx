'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/src/components/ui/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change (handled by Sidebar)
  // Close mobile menu when clicking outside
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar - Desktop */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={false}
      />

      {/* Mobile Header */}
      {isMobile && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={true}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-16' : ''}`}>
        <div className="p-4 lg:p-6">
          {/* Header */}
          <header className="mb-4 lg:mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-slate-400 text-xs lg:text-sm mt-1">{subtitle}</p>
            )}
          </header>

          {/* Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
