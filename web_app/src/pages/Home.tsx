import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingDown, BarChart3, CloudUpload, Calculator, ChevronRight, Truck } from 'lucide-react';

const FEATURES = [
  { icon: Calculator, title: 'AI Rate Comparison', desc: 'Enter your shipment requirements — origin, destination, weight, and priority. The AI ranks every available courier option instantly.', to: '/aggregator', cta: 'Compare Rates' },
  { icon: CloudUpload, title: 'Rate Card Ingestion', desc: 'Upload courier rate sheets as Excel or PDF. The parser normalizes formats and integrates them into the live calculator.', to: '/upload', cta: 'Upload Rates' },
  { icon: BarChart3, title: 'Live Dashboard', desc: 'Monitor all active couriers, destinations, service types, and upload history from a single operations view.', to: '/dashboard', cta: 'View Dashboard' },
];

const PRIORITIES = [
  { icon: TrendingDown, label: 'Cheapest', color: '#f59e0b', desc: 'Minimizes total cost including COD and insurance' },
  { icon: Zap, label: 'Fastest', color: '#3b82f6', desc: 'Prioritizes delivery speed above all else' },
  { icon: Shield, label: 'Reliable', color: '#8b5cf6', desc: 'Chooses the most dependable courier network' },
  { icon: BarChart3, label: 'Balanced', color: '#10b981', desc: 'Optimal blend of cost, speed, and reliability' },
];

const Home: React.FC = () => (
  <div className="animate-fade-in">
    {/* Hero */}
    <section style={{ padding: '8rem 0 6rem', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 450, height: 450, background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', zIndex: -1, filter: 'blur(80px)' }} />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="reveal">
            <div className="badge badge-info animate-float" style={{ marginBottom: '1.2rem' }}>
              <Zap size={13} /> AI Courier Rate Aggregator
            </div>
            <h1 style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.2rem' }}>
              Compare Courier Rates.<br />
              <span className="text-gradient">Powered by AI.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 480, lineHeight: 1.7 }}>
              Get real-time rate comparisons across all major Pakistani courier services. Upload rate cards in any format — Excel or PDF — and let AI find you the best option.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/aggregator" className="btn btn-primary">
                Compare Rates Now <ArrowRight size={18} />
              </Link>
              <Link to="/upload" className="btn btn-secondary">
                Upload Rate Cards
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              {[['8+', 'Courier Partners'], ['14', 'Cities Covered'], ['5', 'Service Types']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{v}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="reveal stagger-2">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
                Live Rate Comparison Sample
              </div>
              {[
                { courier: 'TCS Express', service: 'Next Day', price: 'Rs 892', score: 87, tag: '🏆 Top Pick', tagColor: '#10b981' },
                { courier: 'BlueEx', service: 'Next Day', price: 'Rs 754', score: 79, tag: '💰 Best Value', tagColor: '#f59e0b' },
                { courier: 'M&P Express', service: 'Express', price: 'Rs 634', score: 71, tag: '⚡ Fastest', tagColor: '#3b82f6' },
                { courier: 'Leopards', service: 'Standard', price: 'Rs 410', score: 62, tag: '', tagColor: '' },
              ].map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', borderRadius: 10, marginBottom: 8,
                  background: i === 0 ? 'rgba(16,185,129,0.07)' : 'var(--bg-tertiary)',
                  border: i === 0 ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border-color)',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#10b981' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: i === 0 ? '#fff' : 'var(--text-muted)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{r.courier}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.service}</div>
                  </div>
                  {r.tag && <span style={{ fontSize: '0.68rem', fontWeight: 700, color: r.tagColor, background: `${r.tagColor}18`, padding: '2px 7px', borderRadius: 20 }}>{r.tag}</span>}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{r.price}</div>
                    <div style={{ fontSize: '0.68rem', color: r.score >= 80 ? '#10b981' : r.score >= 65 ? '#f59e0b' : 'var(--text-muted)' }}>Score: {r.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: '7rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="reveal text-center" style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            Everything You Need to <span className="text-gradient">Ship Smarter</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>Three integrated modules covering the full rate management lifecycle.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {FEATURES.map(({ icon: Icon, title, desc, to, cta }, i) => (
            <div key={title} className={`card reveal stagger-${i + 1}`}>
              <div style={{ width: 48, height: 48, background: 'rgba(0,209,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Icon size={24} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem' }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{desc}</p>
              <Link to={to} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {cta} <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Priority Modes */}
    <section style={{ padding: '7rem 0' }}>
      <div className="container">
        <div className="reveal text-center" style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            AI Ranks By <span className="text-gradient">Your Priority</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            Tell the engine what matters most. It adjusts weighting across cost, speed, and reliability to surface the best match.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.2rem' }}>
          {PRIORITIES.map(({ icon: Icon, label, color, desc }, i) => (
            <div key={label} className={`card reveal stagger-${i + 1}`} style={{ textAlign: 'center', padding: '2rem 1.2rem' }}>
              <div style={{ width: 52, height: 52, background: `${color}18`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', color }}>{label}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/aggregator" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            <Truck size={20} /> Start Comparing Rates
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
