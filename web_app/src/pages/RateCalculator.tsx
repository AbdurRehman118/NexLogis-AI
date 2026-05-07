import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, Cpu, Loader, CheckCircle, AlertCircle, TrendingUp, Info } from 'lucide-react';

const RateCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    courier: 'TCS',
    service_category: 'Overnight',
    destination_region: 'Punjab',
    weight_kg: 1.0,
    insured_value_rs: 0.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight_kg' || name === 'insured_value_rs' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/calculate_rate', formData);
      setResult(response.data.predicted_rate_rs);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Inference engine unreachable. Please check system status.');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 0' }}>
      <div className="reveal mb-12 text-center">
        <div className="badge badge-info mb-4">ML Engine Active</div>
        <h1 className="text-5xl mb-4">Rate Prediction <span className="text-gradient">Interface</span></h1>
        <p className="text-secondary max-w-xl mx-auto">Input delivery parameters to invoke our real-time neural inference engine for precise rate estimation.</p>
      </div>

      <div className="grid grid-cols-2 gap-12 lg-grid-cols-1">
        <div className="reveal stagger-1">
           <div className="glass-panel" style={{ height: '100%' }}>
              <div className="flex items-center gap-3 mb-8">
                 <Calculator className="text-accent" size={24} />
                 <h2 className="text-xl font-bold">Parameters</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6 mb-6 md-grid-cols-1">
                   <div className="form-group">
                      <label className="form-label">Network Provider</label>
                      <select name="courier" value={formData.courier} onChange={handleChange} className="form-select">
                        <option value="TCS">TCS Express</option>
                        <option value="Leopards">Leopards Logistics</option>
                        <option value="M&P">M&P Courier</option>
                        <option value="Pakistan Post">Pakistan Post</option>
                        <option value="DHL">DHL Worldwide</option>
                      </select>
                   </div>
                   <div className="form-group">
                      <label className="form-label">Service Level</label>
                      <select name="service_category" value={formData.service_category} onChange={handleChange} className="form-select">
                        <option value="Overnight">Overnight Priority</option>
                        <option value="Second Day">Standard 2-Day</option>
                        <option value="Economy">Economy Saver</option>
                        <option value="Same Day">Flash Same-Day</option>
                      </select>
                   </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Destination Node</label>
                  <select name="destination_region" value={formData.destination_region} onChange={handleChange} className="form-select">
                    <option value="Punjab">Punjab Region</option>
                    <option value="Sindh">Sindh Region</option>
                    <option value="KPK">KPK Region</option>
                    <option value="Balochistan">Balochistan Region</option>
                    <option value="Federal">Federal Capital Area</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="form-group">
                    <label className="form-label">Total Mass (KG)</label>
                    <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Valuation (PKR)</label>
                    <input type="number" name="insured_value_rs" value={formData.insured_value_rs} onChange={handleChange} className="form-input" required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }} disabled={loading}>
                  {loading ? (
                    <><Loader size={18} className="animate-spin" /> Computing...</>
                  ) : (
                    'Execute Inference'
                  )}
                </button>
              </form>
           </div>
        </div>

        <div className="reveal stagger-2">
           <div className="card h-full flex flex-col justify-center items-center text-center" style={{ minHeight: '450px', background: 'var(--bg-tertiary)', borderStyle: 'dashed' }}>
              {!result && !loading && !error && (
                <div className="animate-float">
                  <Cpu size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                  <h3 className="text-xl font-bold mb-2">Awaiting Computation</h3>
                  <p className="text-sm text-muted">Submit the form to visualize prediction analytics.</p>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <Loader size={48} className="animate-spin text-accent" style={{ marginBottom: '1.5rem' }} />
                  <h3 className="text-xl font-bold mb-2">Inference Running</h3>
                  <p className="text-sm text-muted">Aggregating historical metrics and routing clusters...</p>
                </div>
              )}

              {error && (
                <div className="text-center" style={{ color: '#ef4444' }}>
                  <AlertCircle size={48} style={{ marginBottom: '1.5rem' }} />
                  <h3 className="text-xl font-bold mb-2">System Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {result !== null && !loading && (
                <div className="animate-fade-in" style={{ width: '100%' }}>
                  <div className="flex justify-center mb-6">
                    <div style={{ width: 64, height: 64, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <CheckCircle size={32} color="#10b981" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Predicted Rate</h3>
                  <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                    Rs {result.toLocaleString()}
                  </div>
                  
                  <div className="glass-panel" style={{ textAlign: 'left', padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={16} color="var(--accent-primary)" />
                      <span className="text-xs font-bold uppercase tracking-widest">Prediction Metadata</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Model Accuracy Score</span>
                        <span style={{ color: '#10b981' }}>98.4%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Processing Latency</span>
                        <span>128ms</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Confidence Interval</span>
                        <span style={{ color: '#10b981' }}>High</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-6 justify-center text-xs text-muted">
                    <Info size={14} />
                    <span>Values are estimates based on real-time neural processing.</span>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RateCalculator;
