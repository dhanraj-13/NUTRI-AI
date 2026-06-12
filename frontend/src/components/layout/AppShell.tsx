import { useState, useEffect } from 'react';
import {
  Home, Bot, Salad, UtensilsCrossed, Droplets, BarChart3,
  Calendar, Target, User, Settings, Bell, Upload, Monitor,
  Menu, X, LogOut, ChevronRight, MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppPage } from '../../types';
import { api } from '../../lib/api';
import { BrandLogo } from '../shared/BrandLogo';

const NAV_ITEMS: { icon: typeof Home; label: string; page: AppPage; badge?: string }[] = [
  { icon: Home, label: 'Dashboard', page: 'dashboard' },
  { icon: Bot, label: 'AI Assistant', page: 'ai-chat' },
  { icon: Salad, label: 'Nutrition', page: 'nutrition' },
  { icon: UtensilsCrossed, label: 'Meals', page: 'meals' },
  { icon: Droplets, label: 'Hydration', page: 'hydration' },
  { icon: BarChart3, label: 'Analytics', page: 'analytics' },
  { icon: Calendar, label: 'Planner', page: 'planner' },
  { icon: Target, label: 'Goals', page: 'goals' },
  { icon: User, label: 'Profile', page: 'profile' },
  { icon: Settings, label: 'Settings', page: 'settings' },
  { icon: Bell, label: 'Reminders', page: 'reminders' },
  { icon: Upload, label: 'Uploads', page: 'uploads' },
  { icon: Monitor, label: 'Monitoring', page: 'monitoring' },
];

const MOBILE_TABS: { icon: typeof Home; label: string; page: AppPage }[] = [
  { icon: Home, label: 'Home', page: 'dashboard' },
  { icon: Salad, label: 'Nutrition', page: 'nutrition' },
  { icon: Droplets, label: 'Hydrate', page: 'hydration' },
  { icon: BarChart3, label: 'Analytics', page: 'analytics' },
  { icon: User, label: 'Profile', page: 'profile' },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { state, navigate, logout, toggleSidebar } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    api.get('/health').then(res => {
      setBackendStatus(res.status === 200 || res.data !== null ? 'online' : 'offline');
    }).catch(() => setBackendStatus('offline'));
  }, []);

  const page = state.page;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060A08' }}>
      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: state.sidebarCollapsed ? 72 : 240,
          background: 'rgba(10,15,12,0.95)',
          borderRight: '1px solid rgba(24,184,154,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ height: 64, borderBottom: '1px solid rgba(24,184,154,0.06)' }}>
          <BrandLogo collapsed={state.sidebarCollapsed} size="sm" />
          <button
            onClick={toggleSidebar}
            className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: '#5A7A68', flexShrink: 0 }}
          >
            <ChevronRight size={14} style={{ transform: state.sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 300ms' }} />
          </button>
        </div>

        {/* User badge */}
        {!state.sidebarCollapsed && state.user && (
          <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(24,184,154,0.06)', border: '1px solid rgba(24,184,154,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#18B89A,#0E9B81)', color: '#fff' }}>
                {state.user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: '#E8F2ED' }}>{state.user.name}</div>
                <div className="text-xs truncate" style={{ color: '#5A7A68' }}>Pro Member</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
          <div className="space-y-0.5 px-2">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = page === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                  style={{
                    background: isActive ? 'rgba(24,184,154,0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(24,184,154,0.2)' : 'transparent'}`,
                    color: isActive ? '#18B89A' : '#5A7A68',
                  }}
                  title={state.sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={17} style={{ flexShrink: 0, transition: 'color 200ms' }} />
                  {!state.sidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap" style={{ color: isActive ? '#E8F2ED' : '#9AB8A8' }}>
                      {item.label}
                    </span>
                  )}
                  {isActive && !state.sidebarCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" style={{ background: '#18B89A' }} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(24,184,154,0.06)' }}>
          {/* Backend status */}
          {!state.sidebarCollapsed && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-dot"
                style={{ background: backendStatus === 'online' ? '#8FD081' : backendStatus === 'offline' ? '#E07070' : '#EBD5A5' }} />
              <span className="text-xs" style={{ color: '#5A7A68' }}>
                Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-500/10"
            style={{ color: '#5A7A68' }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!state.sidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ========== MOBILE HEADER ========== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(6,10,8,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(24,184,154,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" />
        </div>
        <button onClick={() => setMobileMenuOpen(v => !v)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', color: '#9AB8A8' }}>
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(6,10,8,0.8)', backdropFilter: 'blur(8px)' }} />
          <div
            className="absolute top-0 right-0 bottom-0 w-72 animate-slide-right"
            style={{ background: 'rgba(10,15,12,0.98)', borderLeft: '1px solid rgba(24,184,154,0.1)', paddingTop: 64 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = page === item.page;
                return (
                  <button key={item.page} onClick={() => { navigate(item.page); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: isActive ? 'rgba(24,184,154,0.1)' : 'transparent',
                      color: isActive ? '#18B89A' : '#9AB8A8',
                    }}>
                    <Icon size={18} />
                    <span className="text-sm font-medium" style={{ color: isActive ? '#E8F2ED' : '#9AB8A8' }}>{item.label}</span>
                  </button>
                );
              })}
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-4" style={{ color: '#E07070' }}>
                <LogOut size={18} /><span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-y-auto" style={{ paddingTop: 0 }}>
        {/* Topbar (desktop) */}
        <div
          className="hidden lg:flex sticky top-0 z-30 items-center justify-between px-8 py-4"
          style={{
            background: 'rgba(6,10,8,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(24,184,154,0.06)',
            height: 64,
          }}
        >
          <h1 className="font-display font-semibold text-lg" style={{ color: '#E8F2ED' }}>
            {NAV_ITEMS.find(n => n.page === page)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('ai-chat')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.18)', color: '#18B89A' }}
            >
              <MessageSquare size={15} /> Ask AI
            </button>
            <button onClick={() => navigate('profile')} className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#18B89A,#0E9B81)', color: '#fff' }}>
              {state.user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="page-enter" style={{ paddingBottom: 80 }}>
          {children}
        </div>
      </main>

      {/* ========== MOBILE BOTTOM NAV ========== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ background: 'rgba(6,10,8,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(24,184,154,0.08)' }}>
        <div className="flex items-center justify-around py-2 px-2">
          {MOBILE_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = page === tab.page;
            return (
              <button key={tab.page} onClick={() => navigate(tab.page)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
                style={{ color: isActive ? '#18B89A' : '#5A7A68' }}>
                <Icon size={20} />
                <span className="text-xs font-medium" style={{ color: isActive ? '#E8F2ED' : '#5A7A68' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating AI Button (mobile) */}
      <button
        onClick={() => navigate('ai-chat')}
        className="lg:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl flex items-center justify-center animate-glow"
        style={{
          background: 'linear-gradient(135deg,#18B89A,#0E9B81)',
          boxShadow: '0 4px 20px rgba(24,184,154,0.4)',
        }}
      >
        <Bot size={22} color="#fff" />
      </button>
    </div>
  );
}
