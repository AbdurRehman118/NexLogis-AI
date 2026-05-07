import React from 'react';
import { Package, Shield, Globe, Zap, ArrowRight, BarChart, Truck, Cpu } from 'lucide-react';

const Services: React.FC = () => {
  const tiers = [
    {
      title: 'E-Commerce Fusion',
      desc: 'Deep-integrated logistics for digital storefronts. Real-time stock visibility and autonomous COD management.',
      icon: <Package size={32} color="var(--accent-primary)" />,
      tag: 'Scale'
    },
    {
      title: 'Enterprise Protocol',
      desc: 'Industrial-grade logistics architecture for large-scale operations. Custom ML model deployment per vertical.',
      icon: <Cpu size={32} color="var(--accent-secondary)" />,
      tag: 'Prime'
    },
    {
      title: 'Global Bridge',
      desc: 'Seamless international express networking with automated customs forecasting and air-bridge optimization.',
      icon: <Globe size={32} color="#10b981" />,
      tag: 'Connect'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 0' }}>
      <div className="reveal mb-16 text-center">
        <div className="badge badge-info mb-4">Core Capabilities</div>
        <h1 className="text-5xl mb-4">Logistics <span className="text-gradient">Solutions</span></h1>
        <p className="text-secondary max-w-xl mx-auto">Scalable infrastructure designed for the next generation of global asset movement.</p>
      </div>

      <div className="grid grid-cols-3 gap-8 lg-grid-cols-1 mb-20 reveal stagger-1">
        {tiers.map((tier, idx) => (
          <div key={idx} className="card flex flex-col items-center text-center">
            <div className="badge badge-info mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              {tier.tag}
            </div>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '2rem',
              border: '1px solid var(--border-color)'
            }}>
              {tier.icon}
            </div>
            <h3 className="text-2xl mb-4">{tier.title}</h3>
            <p className="text-sm text-secondary mb-8">{tier.desc}</p>
            <button className="btn btn-secondary w-full">Learn More <ArrowRight size={16} /></button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-12 lg-grid-cols-1 items-center reveal stagger-2">
         <div className="glass-panel" style={{ padding: '4rem' }}>
            <h2 className="text-3xl mb-6">Neural <span className="text-gradient">Network Fleet</span></h2>
            <p className="text-secondary mb-8">
              Our fleet isn't just a collection of vehicles—it's a high-concurrency node network that learns and adapts with every kilometer traveled.
            </p>
            <div className="flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="badge badge-info"><Zap size={14} /></div>
                  <span className="text-sm font-semibold">22% Fuel Efficiency Increase</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="badge badge-info"><BarChart size={14} /></div>
                  <span className="text-sm font-semibold">Real-time Path Optimization</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="badge badge-info"><Truck size={14} /></div>
                  <span className="text-sm font-semibold">Autonomous Load Balancing</span>
               </div>
            </div>
         </div>
         <div className="flex justify-center">
            <div style={{ 
              width: '100%', 
              height: '400px', 
              background: 'linear-gradient(135deg, rgba(0,209,255,0.1), rgba(112,0,255,0.1))', 
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={120} color="var(--accent-primary)" style={{ opacity: 0.2 }} className="animate-float" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Services;
