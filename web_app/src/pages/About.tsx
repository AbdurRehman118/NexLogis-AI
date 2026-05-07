import React from 'react';
import { Terminal, Cpu, Activity, ShieldCheck, Target, Users, Rocket } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 0' }}>
      <div className="reveal mb-16 text-center">
        <div className="badge badge-info mb-4">Infrastructure Log</div>
        <h1 className="text-5xl mb-4">The <span className="text-gradient">MLOps Protocol</span></h1>
        <p className="text-secondary max-w-xl mx-auto">Engineering a deterministic physical layer for the future of global logistics.</p>
      </div>

      <div className="grid grid-cols-2 gap-16 lg-grid-cols-1 items-start mb-24 reveal stagger-1">
        <div>
          <h2 className="text-3xl mb-8">Redefining <span className="text-gradient">Certainty</span></h2>
          <p className="text-lg text-secondary mb-8">
            Logistics has traditionally been a game of averages. We've changed the rules by treating every delivery as a high-fidelity data stream.
          </p>
          <p className="text-secondary mb-10 leading-relaxed">
            Our platform sits at the intersection of heavy industrial operations and advanced data science. By deploying specialized models to manage everything from path-finding to data drift, we ensure that your supply chain is not just active, but optimized at a molecular level.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
             <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div className="text-3xl font-bold mb-1">124ms</div>
                <div className="text-xs text-muted uppercase font-bold tracking-widest">Avg Latency</div>
             </div>
             <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div className="text-3xl font-bold mb-1">0.984</div>
                <div className="text-xs text-muted uppercase font-bold tracking-widest">F1 Score</div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <Terminal size={24} className="text-accent mb-4" />
              <h3 className="text-lg mb-2">Automated Pipelines</h3>
              <p className="text-sm text-secondary">Continuous integration and deployment of ML models ensure that our system adapts to market volatility in real-time.</p>
           </div>
           <div className="card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
              <ShieldCheck size={24} className="text-accent-secondary mb-4" />
              <h3 className="text-lg mb-2">Immutable Security</h3>
              <p className="text-sm text-secondary">Every shipment is verified against a neural fingerprint, ensuring total transparency across the custody chain.</p>
           </div>
        </div>
      </div>

      <div className="reveal stagger-2">
        <h2 className="text-2xl mb-12 text-center uppercase tracking-widest font-bold">Technological Pillars</h2>
        <div className="grid grid-cols-4 gap-8 lg-grid-cols-2 md-grid-cols-1">
          <div className="card text-center items-center flex flex-col">
            <Cpu size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Neural Hubs</h4>
            <p className="text-xs text-muted">Edge-compute clusters deployed at every major transit node.</p>
          </div>
          <div className="card text-center items-center flex flex-col">
            <Target size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Precision</h4>
            <p className="text-xs text-muted">Sub-meter accuracy for real-time asset localization and routing.</p>
          </div>
          <div className="card text-center items-center flex flex-col">
            <Activity size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Live Ops</h4>
            <p className="text-xs text-muted">24/7 autonomous monitoring for system anomalies and drift.</p>
          </div>
          <div className="card text-center items-center flex flex-col">
            <Rocket size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Velocity</h4>
            <p className="text-xs text-muted">Accelerated logistics throughput via predictive bottleneck analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
