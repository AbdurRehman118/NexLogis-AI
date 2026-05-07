import React from 'react';
import { Cpu, Activity, Rocket, Search, Database, FileText } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 0' }}>
      <div className="reveal mb-16 text-center">
        <div className="badge badge-info mb-4">System Protocol v2.0</div>
        <h1 className="text-5xl mb-4">The <span className="text-gradient">NexLogis Protocol</span></h1>
        <p className="text-secondary max-w-xl mx-auto">Engineering a deterministic physical layer for the future of global logistics and rate optimization.</p>
      </div>

      <div className="grid grid-cols-2 gap-16 lg-grid-cols-1 items-start mb-24 reveal stagger-1">
        <div>
          <h2 className="text-3xl mb-8">Redefining <span className="text-gradient">Certainty</span></h2>
          <p className="text-lg text-secondary mb-8">
            Logistics has traditionally been a game of averages. We've changed the rules by treating every delivery rate as a high-fidelity data point.
          </p>
          <p className="text-secondary mb-10 leading-relaxed">
            Our platform sits at the intersection of heavy industrial operations and advanced data science. By deploying specialized AI models to normalize disparate rate cards from PDF and Excel, we ensure that your supply chain is not just active, but optimized at a molecular level.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
             <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div className="text-3xl font-bold mb-1">560+</div>
                <div className="text-xs text-muted uppercase font-bold tracking-widest">Active Rates</div>
             </div>
             <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div className="text-3xl font-bold mb-1">99.8%</div>
                <div className="text-xs text-muted uppercase font-bold tracking-widest">Parser Accuracy</div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <Database size={24} className="text-accent mb-4" />
              <h3 className="text-lg mb-2">Automated Ingestion</h3>
              <p className="text-sm text-secondary">Our neural parsing engine extracts tabular data from complex courier rate cards, supporting PDF and Excel formats with zero manual entry.</p>
           </div>
           <div className="card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
              <Search size={24} className="text-accent-secondary mb-4" />
              <h3 className="text-lg mb-2">Multi-Criteria Search</h3>
              <p className="text-sm text-secondary">Dynamic ranking across cost, speed, and reliability ensures that every shipment is matched with the optimal provider based on your unique priorities.</p>
           </div>
        </div>
      </div>

      <div className="reveal stagger-2">
        <h2 className="text-2xl mb-12 text-center uppercase tracking-widest font-bold">Technological Pillars</h2>
        <div className="grid grid-cols-4 gap-8 lg-grid-cols-2 md-grid-cols-1">
          <div className="card text-center items-center flex flex-col">
            <Cpu size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">AI Scoring</h4>
            <p className="text-xs text-muted">Advanced heuristic models weighting cost, speed, and courier reliability metrics.</p>
          </div>
          <div className="card text-center items-center flex flex-col">
            <FileText size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">OCR Parsing</h4>
            <p className="text-xs text-muted">High-precision table extraction from PDF and Excel rate sheets.</p>
          </div>
          <div className="card text-center items-center flex flex-col">
            <Activity size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Live Monitor</h4>
            <p className="text-xs text-muted">Real-time tracking of database health and system throughput.</p>
          </div>
          <div className="card text-center items-center flex flex-col">
            <Rocket size={32} color="var(--accent-primary)" className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Velocity</h4>
            <p className="text-xs text-muted">Optimized search performance with sub-100ms API response latency.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
