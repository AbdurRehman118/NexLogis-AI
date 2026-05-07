import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Package, Clock, Truck, Activity, Info } from 'lucide-react';

const TrackShipment: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearched(true);
    }
  };

  const steps = [
    { status: 'Shipment Delivered', location: 'Islamabad HQ Hub', time: '02:45 PM', date: 'May 06', completed: true },
    { status: 'Out for Delivery', location: 'Local Distribution Node', time: '09:30 AM', date: 'May 06', completed: true },
    { status: 'Hub Sort Complete', location: 'Rawalpindi Transit Hub', time: '11:15 PM', date: 'May 05', completed: true },
    { status: 'In Transit', location: 'Lahore Processing Center', time: '04:20 AM', date: 'May 05', completed: true },
    { status: 'System Entry / Pickup', location: 'Lahore Collection Node', time: '06:00 PM', date: 'May 04', completed: true },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 0' }}>
      <div className="reveal mb-12 text-center">
        <div className="badge badge-info mb-4">Real-time Telemetry</div>
        <h1 className="text-5xl mb-4">Asset <span className="text-gradient">Tracking</span></h1>
        <p className="text-secondary max-w-xl mx-auto">Visualize the movement of physical goods through our optimized neural grid.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-16 reveal stagger-1">
        <form onSubmit={handleSearch} className="flex gap-4 p-2 glass-panel" style={{ borderRadius: '20px' }}>
          <div className="flex items-center gap-3 px-4" style={{ flex: 1 }}>
            <Search size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Enter Tracking ID (NX-8842-ML)" 
              className="form-input" 
              style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0.5rem 0' }}
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px' }}>
            Query System
          </button>
        </form>
      </div>

      {searched && (
        <div className="grid grid-cols-3 gap-12 lg-grid-cols-1 reveal stagger-2">
          <div className="col-span-2 glass-panel">
            <div className="flex justify-between items-center mb-10 pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-4">
                 <div style={{ width: 48, height: 48, background: 'rgba(0, 209, 255, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={24} color="var(--accent-primary)" />
                 </div>
                 <div>
                    <div className="text-xs text-muted font-bold uppercase tracking-widest mb-1">Asset Reference</div>
                    <div className="text-xl font-bold">{trackingId}</div>
                 </div>
              </div>
              <div className="text-right">
                <div className="badge badge-success mb-2">Ahead of Schedule</div>
                <div className="text-xs text-muted font-bold uppercase">Estimated: Today, 17:00</div>
              </div>
            </div>

            <div className="flex flex-col gap-0 relative" style={{ paddingLeft: '2rem' }}>
              <div style={{ 
                position: 'absolute', 
                left: '7px', 
                top: '10px', 
                bottom: '10px', 
                width: '2px', 
                background: 'linear-gradient(to bottom, var(--accent-primary), var(--bg-tertiary))',
                zIndex: 0
              }} />

              {steps.map((step, index) => (
                <div key={index} className="flex gap-8 mb-10 relative" style={{ zIndex: 1 }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    background: step.completed ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    border: '4px solid var(--bg-primary)',
                    boxShadow: step.completed ? 'var(--shadow-accent)' : 'none',
                    marginTop: '4px'
                  }} />
                  <div className="flex justify-between items-start" style={{ flex: 1 }}>
                    <div>
                      <h4 className={`text-base font-bold ${step.completed ? '' : 'text-muted'}`}>{step.status}</h4>
                      <p className="text-xs text-secondary font-medium uppercase tracking-wider mt-1">{step.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold">{step.date}</div>
                      <div className="text-xs text-muted">{step.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <Activity size={24} className="text-accent mb-4" />
              <h4 className="text-sm font-bold mb-3">AI Diagnostics</h4>
              <p className="text-sm text-secondary leading-relaxed">
                Path-optimization analysis shows a 99.2% probability of delivery within the current time-window based on sectoral throughput data.
              </p>
            </div>
            <div className="card">
               <div className="flex items-center gap-2 mb-4">
                 <Info size={18} className="text-muted" />
                 <h4 className="text-sm font-bold">System Integrity</h4>
               </div>
               <div className="flex flex-col gap-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-muted">Signature Sync</span>
                    <span style={{ color: '#10b981' }}>Verified</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-muted">GPS Accuracy</span>
                    <span>&lt; 5m</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-muted">Hash Protocol</span>
                    <span>AES-256</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;
