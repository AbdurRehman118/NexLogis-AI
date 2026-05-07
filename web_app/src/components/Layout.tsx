import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Box, Activity, Map, Truck, Mail } from 'lucide-react';

const Layout: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'var(--glass-bg)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" className="flex items-center gap-3">
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'var(--accent-gradient)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-accent)'
            }}>
              <Box size={24} color="#fff" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              NexLogis<span className="text-gradient">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center gap-8 md-flex-col" style={{ display: 'flex' }} id="desktop-nav">
             <div className="flex items-center gap-8 md-flex-col" style={{ display: 'contents' }}>
                <Link to="/" className={`text-sm font-semibold hover-text-accent ${isActive('/') ? 'text-gradient' : 'text-secondary'}`}>Home</Link>
                <Link to="/calculator" className={`text-sm font-semibold hover-text-accent ${isActive('/calculator') ? 'text-gradient' : 'text-secondary'}`}>Calculator</Link>
                <Link to="/track" className={`text-sm font-semibold hover-text-accent ${isActive('/track') ? 'text-gradient' : 'text-secondary'}`}>Tracking</Link>
                <Link to="/services" className={`text-sm font-semibold hover-text-accent ${isActive('/services') ? 'text-gradient' : 'text-secondary'}`}>Services</Link>
                <Link to="/about" className={`text-sm font-semibold hover-text-accent ${isActive('/about') ? 'text-gradient' : 'text-secondary'}`}>About</Link>
             </div>
             
             <div className="flex items-center gap-4">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Get Started</button>
             </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--bg-secondary)', 
        padding: '5rem 0 3rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-12 lg-grid-cols-2 md-grid-cols-1 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Box size={24} color="var(--accent-primary)" />
                <span className="text-xl font-bold">NexLogis</span>
              </div>
              <p className="text-secondary text-sm mb-6">
                Redefining the logistics landscape through advanced machine learning and predictive analytics.
              </p>
              <div className="flex gap-4">
                <a href="#" className="theme-toggle" style={{ width: '36px', height: '36px' }}><Activity size={18} /></a>
                <a href="#" className="theme-toggle" style={{ width: '36px', height: '36px' }}><Map size={18} /></a>
                <a href="#" className="theme-toggle" style={{ width: '36px', height: '36px' }}><Truck size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold mb-6">Capabilities</h4>
              <ul className="flex flex-col gap-4 text-sm text-secondary">
                <li><Link to="/calculator">AI Rate Estimation</Link></li>
                <li><Link to="/track">Smart Inventory Hub</Link></li>
                <li><Link to="/services">Enterprise Fleet Ops</Link></li>
                <li><Link to="/services">Global Bridge Link</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold mb-6">Resources</h4>
              <ul className="flex flex-col gap-4 text-sm text-secondary">
                <li><Link to="/about">System Documentation</Link></li>
                <li><Link to="/about">API Access</Link></li>
                <li><Link to="/about">Privacy Policy</Link></li>
                <li><Link to="/about">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold mb-6">Newsletter</h4>
              <p className="text-sm text-secondary mb-4">Stay updated with our latest model deployments.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Email" className="form-input" style={{ flex: 1, padding: '0.6rem 1rem' }} />
                <button className="btn btn-primary" style={{ padding: '0.6rem' }}><Mail size={18} /></button>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
            <p className="text-center text-sm text-muted">
              &copy; 2026 NexLogis.ai Industrial Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
