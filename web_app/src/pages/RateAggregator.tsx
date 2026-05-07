import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package, MapPin, Weight, DollarSign, Zap, Shield, Clock,
  TrendingDown, AlertTriangle, CheckCircle, Loader2,
  ChevronDown, ChevronUp, Filter, BarChart3, Award, Truck, RefreshCw
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface RateResult {
  courier: string;
  service_type: string;
  destination: string;
  estimated_days: string;
  calculated_total_rs: number;
  breakdown: { shipping_rs: number; cod_fee_rs: number; insurance_rs: number };
  score_breakdown: { cost_score: number; speed_score: number; reliability_score: number };
  ai_score: number;
  reliability_pct: number;
  coverage: string;
  warnings: string[];
  tags: string[];
  recommended: boolean;
  best_value: boolean;
  fastest: boolean;
}

interface CompareResponse {
  total_options: number;
  results: RateResult[];
  ai_recommendation: { top_pick: string; service_type: string; total_rs: number; ai_score: number; reason: string };
  summary: { cheapest_rs: number; most_expensive_rs: number; avg_cost_rs: number; fastest_delivery: string; options_in_budget: number };
}

const PRIORITIES = [
  { value: 'balanced', label: 'Balanced', icon: BarChart3, desc: 'Best overall value' },
  { value: 'cheapest', label: 'Cheapest', icon: TrendingDown, desc: 'Minimize cost' },
  { value: 'fastest', label: 'Fastest', icon: Zap, desc: 'Quickest delivery' },
  { value: 'reliable', label: 'Reliable', icon: Shield, desc: 'Most dependable' },
];

const SERVICE_TYPES = ['Any', 'Same Day', 'Next Day', 'Express (2-3D)', 'Standard', 'Economy'];

export default function RateAggregator() {
  const [destinations, setDestinations] = useState<{ name: string; zone: string }[]>([]);
  const [form, setForm] = useState({
    origin: 'Lahore',
    destination: '',
    weight_kg: 1.0,
    declared_value_rs: 0,
    cod_required: false,
    service_preference: 'Any',
    priority: 'balanced',
    max_budget_rs: '',
    package_type: 'Parcel',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCourier, setFilterCourier] = useState('All');

  useEffect(() => {
    axios.get(`${API}/destinations`).then(r => setDestinations(r.data)).catch(() => {});
  }, []);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination) { setError('Please select a destination city.'); return; }
    setLoading(true); setError(null); setResponse(null);
    try {
      const payload = {
        ...form,
        weight_kg: parseFloat(String(form.weight_kg)) || 0.5,
        declared_value_rs: parseFloat(String(form.declared_value_rs)) || 0,
        max_budget_rs: form.max_budget_rs ? parseFloat(String(form.max_budget_rs)) : null,
      };
      const { data } = await axios.post(`${API}/compare-rates`, payload);
      setResponse(data);
      setFilterCourier('All');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Could not reach the API. Ensure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const couriers = response ? ['All', ...Array.from(new Set(response.results.map(r => r.courier)))] : ['All'];
  const displayed = response
    ? (filterCourier === 'All' ? response.results : response.results.filter(r => r.courier === filterCourier))
    : [];

  const tagColor: Record<string, string> = {
    'AI Recommended': '#10b981',
    'Best Value': '#f59e0b',
    'Fastest': '#3b82f6',
    'Most Reliable': '#8b5cf6',
  };

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '5rem 0 6rem', minHeight: '100vh' }} className="animate-fade-in">
      <div className="container">

        {/* Header */}
        <div className="reveal text-center" style={{ marginBottom: '3.5rem' }}>
          <div className="badge badge-info" style={{ marginBottom: '1rem' }}>
            <Zap size={13} /> AI Rate Aggregator v2
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Find the <span className="text-gradient">Best Courier Rate</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Enter your shipment requirements. Our AI engine will compare rates across all courier services and recommend the best option based on your priorities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* ── Requirements Form ── */}
          <div className="glass-panel reveal stagger-1" style={{ position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.8rem' }}>
              <Package size={22} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Customer Requirements</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Destination */}
              <div className="form-group">
                <label className="form-label"><MapPin size={13} style={{ display:'inline', marginRight:5 }} />Destination City</label>
                <select className="form-select" value={form.destination} onChange={e => set('destination', e.target.value)} required>
                  <option value="">Select city...</option>
                  {destinations.map(d => (
                    <option key={d.name} value={d.name}>{d.name} — {d.zone}</option>
                  ))}
                </select>
              </div>

              {/* Weight & Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label"><Weight size={13} style={{ display:'inline', marginRight:5 }} />Weight (kg)</label>
                  <input className="form-input" type="number" step="0.1" min="0.1" value={form.weight_kg}
                    onChange={e => set('weight_kg', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><DollarSign size={13} style={{ display:'inline', marginRight:5 }} />Value (PKR)</label>
                  <input className="form-input" type="number" min="0" value={form.declared_value_rs}
                    onChange={e => set('declared_value_rs', e.target.value)} />
                </div>
              </div>

              {/* Max Budget */}
              <div className="form-group">
                <label className="form-label">Max Budget (PKR) — optional</label>
                <input className="form-input" type="number" min="0" placeholder="e.g. 1500"
                  value={form.max_budget_rs} onChange={e => set('max_budget_rs', e.target.value)} />
              </div>

              {/* Service Preference */}
              <div className="form-group">
                <label className="form-label"><Clock size={13} style={{ display:'inline', marginRight:5 }} />Service Type</label>
                <select className="form-select" value={form.service_preference} onChange={e => set('service_preference', e.target.value)}>
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Package type */}
              <div className="form-group">
                <label className="form-label"><Truck size={13} style={{ display:'inline', marginRight:5 }} />Package Type</label>
                <select className="form-select" value={form.package_type} onChange={e => set('package_type', e.target.value)}>
                  {['Parcel', 'Document', 'Fragile', 'Bulk'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* COD */}
              <div className="form-group" style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="cod" checked={form.cod_required} onChange={e => set('cod_required', e.target.checked)}
                  style={{ width:18, height:18, accentColor:'var(--accent-primary)', cursor:'pointer' }} />
                <label htmlFor="cod" style={{ fontSize:'0.875rem', fontWeight:500, cursor:'pointer' }}>Cash on Delivery (COD)</label>
              </div>

              {/* Priority */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom:'0.75rem' }}>AI Priority Mode</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                  {PRIORITIES.map(p => {
                    const Icon = p.icon;
                    const active = form.priority === p.value;
                    return (
                      <button key={p.value} type="button"
                        onClick={() => set('priority', p.value)}
                        style={{
                          padding:'0.65rem 0.5rem', borderRadius:10, cursor:'pointer', textAlign:'center',
                          border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          background: active ? 'rgba(0,209,255,0.08)' : 'var(--bg-tertiary)',
                          color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          transition:'all 0.2s',
                        }}>
                        <Icon size={16} style={{ margin:'0 auto 4px' }} />
                        <div style={{ fontSize:'0.72rem', fontWeight:700 }}>{p.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width:'100%', marginTop:'0.5rem' }} disabled={loading}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : <><BarChart3 size={18} /> Compare All Rates</>}
              </button>
            </form>
          </div>

          {/* ── Results Panel ── */}
          <div>
            {/* Error */}
            {error && (
              <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:14, padding:'1.2rem 1.5rem', color:'#ef4444', display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem' }}>
                <AlertTriangle size={20} /><span>{error}</span>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div style={{ textAlign:'center', padding:'5rem 2rem' }}>
                <div className="animate-float" style={{ marginBottom:'1.5rem' }}>
                  <BarChart3 size={56} color="var(--accent-primary)" style={{ opacity:0.7 }} />
                </div>
                <h3 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:8 }}>Analyzing {destinations.length > 0 ? destinations.length : ''} rate options...</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>AI engine scoring cost, speed, and reliability across all courier services</p>
              </div>
            )}

            {/* Idle State */}
            {!loading && !response && !error && (
              <div style={{ textAlign:'center', padding:'5rem 2rem', border:'2px dashed var(--border-color)', borderRadius:20 }}>
                <Truck size={60} color="var(--text-muted)" style={{ marginBottom:'1.5rem', opacity:0.3 }} />
                <h3 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:8, color:'var(--text-secondary)' }}>Ready to Compare</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Fill in your shipment requirements and click "Compare All Rates"</p>
              </div>
            )}

            {/* Results */}
            {response && !loading && (
              <div className="animate-fade-in">
                {/* AI Recommendation Banner */}
                <div style={{
                  background:'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(0,209,255,0.08) 100%)',
                  border:'1px solid rgba(16,185,129,0.3)', borderRadius:16, padding:'1.4rem 1.8rem', marginBottom:'1.5rem'
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <Award size={20} color="#10b981" />
                    <span style={{ fontWeight:700, color:'#10b981', fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>AI Recommendation</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                    <div>
                      <div style={{ fontSize:'1.3rem', fontWeight:800 }}>{response.ai_recommendation.top_pick}</div>
                      <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{response.ai_recommendation.service_type} · Rs {response.ai_recommendation.total_rs?.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'2rem', fontWeight:800, color:'#10b981' }}>{response.ai_recommendation.ai_score}<span style={{ fontSize:'1rem', fontWeight:500 }}>/100</span></div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>AI Score</div>
                    </div>
                  </div>
                  <p style={{ marginTop:10, fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.5 }}>{response.ai_recommendation.reason}</p>
                </div>

                {/* Summary Bar */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  {[
                    { label:'Total Options', value: response.total_options, icon: Filter },
                    { label:'Cheapest', value: `Rs ${response.summary.cheapest_rs.toLocaleString()}`, icon: TrendingDown },
                    { label:'Fastest', value: response.summary.fastest_delivery, icon: Zap },
                    { label:'In Budget', value: response.summary.options_in_budget, icon: CheckCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:12, padding:'0.9rem 1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                        <Icon size={14} color="var(--accent-primary)" />
                        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase' }}>{label}</span>
                      </div>
                      <div style={{ fontSize:'1.1rem', fontWeight:800 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Filter */}
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.2rem' }}>
                  {couriers.map(c => (
                    <button key={c} onClick={() => setFilterCourier(c)} style={{
                      padding:'0.35rem 0.9rem', borderRadius:20, fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                      border: filterCourier === c ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: filterCourier === c ? 'rgba(0,209,255,0.1)' : 'var(--bg-secondary)',
                      color: filterCourier === c ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      transition:'all 0.15s',
                    }}>{c}</button>
                  ))}
                </div>

                {/* Result Cards */}
                <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                  {displayed.map((r, i) => {
                    const key = `${r.courier}-${r.service_type}`;
                    const isOpen = expandedId === key;
                    return (
                      <div key={key} style={{
                        background:'var(--bg-secondary)', border: r.recommended ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                        borderRadius:14, overflow:'hidden', transition:'all 0.2s',
                        boxShadow: r.recommended ? '0 0 20px rgba(16,185,129,0.1)' : 'none'
                      }}>
                        {/* Card Header — always visible */}
                        <div style={{ padding:'1.1rem 1.3rem', display:'flex', alignItems:'center', gap:'1rem', cursor:'pointer' }}
                          onClick={() => setExpandedId(isOpen ? null : key)}>
                          {/* Rank */}
                          <div style={{
                            width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                            background: i === 0 ? 'linear-gradient(135deg,#10b981,#00d1ff)' : 'var(--bg-tertiary)',
                            color: i === 0 ? '#fff' : 'var(--text-muted)', fontWeight:800, fontSize:'0.85rem'
                          }}>#{i + 1}</div>

                          {/* Courier info */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                              <span style={{ fontWeight:700, fontSize:'0.97rem' }}>{r.courier}</span>
                              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', background:'var(--bg-tertiary)', padding:'2px 8px', borderRadius:8 }}>{r.service_type}</span>
                              {r.tags.map(t => (
                                <span key={t} style={{ fontSize:'0.68rem', fontWeight:700, padding:'2px 7px', borderRadius:20, background:`${tagColor[t]}18`, color: tagColor[t], border:`1px solid ${tagColor[t]}44` }}>{t}</span>
                              ))}
                            </div>
                            <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:3 }}>
                              {r.estimated_days} · {r.reliability_pct}% reliable · {r.coverage}
                            </div>
                          </div>

                          {/* Price */}
                          <div style={{ textAlign:'right', flexShrink:0 }}>
                            <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--text-primary)' }}>
                              Rs {r.calculated_total_rs.toLocaleString()}
                            </div>
                            <div style={{ fontSize:'0.72rem', color: scoreColor(r.ai_score), fontWeight:700 }}>
                              Score: {r.ai_score}/100
                            </div>
                          </div>

                          {/* Expand */}
                          <div style={{ color:'var(--text-muted)', flexShrink:0 }}>
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {/* Expanded Detail */}
                        {isOpen && (
                          <div style={{ borderTop:'1px solid var(--border-color)', padding:'1.1rem 1.3rem', background:'var(--bg-tertiary)' }}>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1rem' }}>
                              {/* Cost Breakdown */}
                              <div>
                                <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Cost Breakdown</div>
                                {[
                                  ['Shipping', `Rs ${r.breakdown.shipping_rs.toLocaleString()}`],
                                  ['COD Fee', `Rs ${r.breakdown.cod_fee_rs}`],
                                  ['Insurance', `Rs ${r.breakdown.insurance_rs}`],
                                ].map(([l, v]) => (
                                  <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:4 }}>
                                    <span style={{ color:'var(--text-secondary)' }}>{l}</span>
                                    <span style={{ fontWeight:600 }}>{v}</span>
                                  </div>
                                ))}
                                <div style={{ borderTop:'1px solid var(--border-color)', paddingTop:6, marginTop:6, display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:'0.9rem' }}>
                                  <span>Total</span><span style={{ color:'var(--accent-primary)' }}>Rs {r.calculated_total_rs.toLocaleString()}</span>
                                </div>
                              </div>
                              {/* Score Breakdown */}
                              <div>
                                <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>AI Score Breakdown</div>
                                {[
                                  ['Cost Score', r.score_breakdown.cost_score],
                                  ['Speed Score', r.score_breakdown.speed_score],
                                  ['Reliability', r.score_breakdown.reliability_score],
                                ].map(([l, v]) => (
                                  <div key={l} style={{ marginBottom:8 }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', marginBottom:3 }}>
                                      <span style={{ color:'var(--text-secondary)' }}>{l}</span>
                                      <span style={{ fontWeight:600 }}>{Number(v).toFixed(0)}</span>
                                    </div>
                                    <div style={{ height:5, background:'var(--border-color)', borderRadius:3 }}>
                                      <div style={{ height:'100%', width:`${Math.min(100, Number(v))}%`, background:'var(--accent-gradient)', borderRadius:3, transition:'width 0.5s' }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* Courier Info */}
                              <div>
                                <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Courier Details</div>
                                {[
                                  ['Delivery', r.estimated_days],
                                  ['Reliability', `${r.reliability_pct}%`],
                                  ['Coverage', r.coverage],
                                  ['Service', r.service_type],
                                ].map(([l, v]) => (
                                  <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:4 }}>
                                    <span style={{ color:'var(--text-secondary)' }}>{l}</span>
                                    <span style={{ fontWeight:600 }}>{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Warnings */}
                            {r.warnings.length > 0 && (
                              <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:8, padding:'0.7rem 1rem' }}>
                                {r.warnings.map(w => (
                                  <div key={w} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', color:'#f59e0b' }}>
                                    <AlertTriangle size={13} />{w}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Reset */}
                <div style={{ textAlign:'center', marginTop:'2rem' }}>
                  <button className="btn btn-secondary" onClick={() => { setResponse(null); setError(null); }}
                    style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                    <RefreshCw size={16} /> Start New Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
