import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe, Cpu, BarChart3, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        padding: '10rem 0 8rem', 
        position: 'relative', 
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Background Gradients */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          zIndex: -1,
          filter: 'blur(100px)'
        }} />
        
        <div className="container">
          <div className="grid grid-cols-2 gap-12 items-center lg-grid-cols-1">
            <div className="reveal">
              <div className="badge badge-info mb-6 animate-float">
                <Zap size={14} /> Intelligent Logistics Protocol v4.0
              </div>
              <h1 className="text-6xl mb-6">
                Next-Gen <span className="text-gradient">Logistics</span> <br /> 
                Driven by MLOps.
              </h1>
              <p className="text-xl text-secondary mb-10" style={{ maxWidth: '500px' }}>
                Harnessing high-fidelity predictive models to streamline global supply chains with surgical precision.
              </p>
              <div className="flex gap-4 md-flex-col">
                <Link to="/calculator" className="btn btn-primary">
                  Start Prediction Engine <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn btn-secondary">
                  Explore Network
                </Link>
              </div>
              
              <div className="flex gap-8 mt-12 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-xs text-muted uppercase font-bold tracking-widest">Inference Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">120ms</div>
                  <div className="text-xs text-muted uppercase font-bold tracking-widest">API Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">14M+</div>
                  <div className="text-xs text-muted uppercase font-bold tracking-widest">Training Params</div>
                </div>
              </div>
            </div>

            <div className="reveal stagger-2 flex justify-center">
               <div className="glass-panel" style={{ 
                 position: 'relative', 
                 padding: '3rem', 
                 width: '100%', 
                 maxWidth: '500px',
                 boxShadow: 'var(--shadow-lg)',
                 border: '1px solid rgba(255,255,255,0.1)'
               }}>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f5f' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                    <span className="text-xs text-muted font-bold tracking-widest uppercase">System_Overview.sh</span>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <div style={{ width: 44, height: 44, background: 'rgba(0, 209, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Cpu size={24} color="var(--accent-primary)" />
                       </div>
                       <div>
                         <div className="text-sm font-bold">Inference Node 01</div>
                         <div className="text-xs text-secondary">Active - 42% Load</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div style={{ width: 44, height: 44, background: 'rgba(112, 0, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Globe size={24} color="var(--accent-secondary)" />
                       </div>
                       <div>
                         <div className="text-sm font-bold">Global Route Cluster</div>
                         <div className="text-xs text-secondary">Optimizing 4,281 paths</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div style={{ width: 44, height: 44, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <BarChart3 size={24} color="#10b981" />
                       </div>
                       <div>
                         <div className="text-sm font-bold">Efficiency Metric</div>
                         <div className="text-xs text-secondary">+12.4% vs Baseline</div>
                       </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '2.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                       <span className="text-muted">Model Sync Status</span>
                       <span style={{ color: '#10b981' }}>Synchronized</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                       <div style={{ width: '100%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '2px' }} />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl mb-4">Industrial-Grade <span className="text-gradient">ML Stack</span></h2>
            <p className="text-secondary max-w-2xl mx-auto">Providing a robust foundational layer for modern supply chain engineering.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 lg-grid-cols-1">
            <div className="card reveal stagger-1">
               <div style={{ marginBottom: '1.5rem' }}><Cpu size={32} color="var(--accent-primary)" /></div>
               <h3 className="text-xl mb-4">Predictive Routing</h3>
               <p className="text-sm text-secondary mb-6">Autonomous path optimization using real-time traffic, weather, and infrastructural data streams.</p>
               <Link to="/services" className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                 Learn More <ChevronRight size={14} />
               </Link>
            </div>
            
            <div className="card reveal stagger-2">
               <div style={{ marginBottom: '1.5rem' }}><Shield size={32} color="var(--accent-primary)" /></div>
               <h3 className="text-xl mb-4">Verified Security</h3>
               <p className="text-sm text-secondary mb-6">Cryptographically secure shipment verification and multi-factor tracking protocols.</p>
               <Link to="/services" className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                 Learn More <ChevronRight size={14} />
               </Link>
            </div>
            
            <div className="card reveal stagger-3">
               <div style={{ marginBottom: '1.5rem' }}><Globe size={32} color="var(--accent-primary)" /></div>
               <h3 className="text-xl mb-4">Global Resilience</h3>
               <p className="text-sm text-secondary mb-6">Distributed node network ensuring 99.9% uptime for critical logistics operations worldwide.</p>
               <Link to="/services" className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                 Learn More <ChevronRight size={14} />
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
