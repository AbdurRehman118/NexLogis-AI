import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Truck, LayoutDashboard, Calculator, CloudUpload, Info, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/',           label: 'Home',        icon: Truck },
  { to: '/aggregator', label: 'Rate Compare', icon: Calculator },
  { to: '/upload',     label: 'Upload Rates', icon: CloudUpload },
  { to: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/about',      label: 'About',       icon: Info },
];

const Layout: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { 
    document.documentElement.setAttribute('data-theme', theme); 
    // Add a class to body as well for global light-mode styling if needed
    document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
  }, [theme]);
  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'var(--accent-gradient)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-accent)' }}>
              <Truck size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              NexLogis<span className="text-gradient">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.45rem 0.9rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
                background: isActive(to) ? 'rgba(0,209,255,0.1)' : 'transparent',
                color: isActive(to) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: isActive(to) ? '1px solid rgba(0,209,255,0.2)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
                <Icon size={15} />{label}
              </Link>
            ))}
            <button className="theme-toggle" onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')} style={{ marginLeft: 8 }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          {/* Mobile toggle */}
          <button className="theme-toggle" onClick={() => setMobileOpen(p => !p)} style={{ display: 'none' }} id="mobile-menu-btn">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1rem', borderRadius: 10,
                color: isActive(to) ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem',
                background: isActive(to) ? 'rgba(0,209,255,0.08)' : 'transparent',
              }}>
                <Icon size={18} />{label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}><Outlet /></main>

      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Truck size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 700 }}>NexLogis.ai</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI-Powered Courier Rate Aggregator</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2026 NexLogis Industrial Systems · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
