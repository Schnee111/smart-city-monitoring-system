'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  Settings, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Clock,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

// Real-time clock component
function RealtimeClock({ isOpen }: { isOpen: boolean }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <div className="px-3 py-2">
      <div className={`flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-800/50 ${isOpen ? '' : 'justify-center'}`}>
        <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-white font-mono text-sm font-medium">{formatTime(time)}</span>
            <span className="text-slate-500 text-xs">{formatDate(time)}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Mobile clock component (simpler version)
function MobileClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <div className="flex flex-col">
      <span className="text-white font-mono text-sm font-medium">{formatTime(time)}</span>
      <span className="text-slate-500 text-xs">{formatDate(time)}</span>
    </div>
  );
}

export default function Sidebar({ isOpen, onToggle, isMobile, mobileMenuOpen, onMobileMenuToggle }: SidebarProps) {
  const pathname = usePathname();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Map, label: 'Peta Sensor', href: '/map' },
    { icon: Cpu, label: 'Manajemen Sensor', href: '/sensors' },
    { icon: BarChart3, label: 'Analitik', href: '/analytics' },
    { icon: Settings, label: 'Pengaturan', href: '/settings' },
  ];

  // Mobile Header Bar
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-[9999] h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SCEM</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Smart City Energy</p>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onMobileMenuToggle}
                className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
                style={{ top: '64px' }}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed left-0 right-0 z-[9999] bg-slate-900/98 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl"
                style={{ top: '64px' }}
              >
                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onMobileMenuToggle}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Clock in Mobile Menu */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <MobileClock />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:flex h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex-col"
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-lg font-bold text-white">SCEM</h1>
              <p className="text-xs text-slate-400">Smart City Energy</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Realtime Clock */}
      <RealtimeClock isOpen={isOpen} />

      {/* Toggle Button */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200"
        >
          {isOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Tutup Sidebar</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
