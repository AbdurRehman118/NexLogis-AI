import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Truck, MapPin, Package, Upload, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Stats {
  total_rates: number; total_couriers: number; total_destinations: number;
  total_service_types: number; total_uploads: number;
  couriers: string[]; destinations: string[]; service_types: string[];
  recent_uploads: { courier_name: string; filename: string; added: number; updated: number; timestamp: string }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true); setError(null);
    axios.get(`${API}/stats`)
      .then(r => { setStats(r.data); setLoading(false); })
      .catch(() => { setError('Could not reach backend. Start the API server first.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: '5rem 0 6rem', minHeight: '100vh' }} className="animate-fade-in">
      <div className="container">
        <div className="reveal text-center" style={{ marginBottom: '3rem' }}>
          <div className="badge badge-info" style={{ marginBottom: '1rem' }}><BarChart3 size={13} /> System Dashboard</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.9rem' }}>
            Rate Database <span className="text-gradient">Overview</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            Live view of all courier rates, coverage, and upload history stored in the system.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', marginBottom: '2rem' }}>
            <AlertTriangle size={18} /><span>{error}</span>
            <button onClick={load} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display:'flex', alignItems:'center', gap:5 }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <RefreshCw size={40} color="var(--accent-primary)" className="animate-spin" style={{ opacity: 0.6 }} />
          </div>
        )}

        {stats && !loading && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Total Rates', value: stats.total_rates.toLocaleString(), icon: Package, color: '#00d1ff' },
                { label: 'Couriers', value: stats.total_couriers, icon: Truck, color: '#10b981' },
                { label: 'Destinations', value: stats.total_destinations, icon: MapPin, color: '#f59e0b' },
                { label: 'Service Types', value: stats.total_service_types, icon: Clock, color: '#8b5cf6' },
                { label: 'Rate Uploads', value: stats.total_uploads, icon: Upload, color: '#3b82f6' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card reveal" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                  <Icon size={28} color={color} style={{ margin: '0 auto 0.8rem' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Couriers */}
              <div className="glass-panel reveal stagger-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem' }}>
                  <Truck size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontWeight: 700 }}>Active Couriers</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {stats.couriers.map((c, i) => (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.8rem', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{c}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Uploads + Service Types */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-panel reveal stagger-2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem' }}>
                    <Upload size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontWeight: 700 }}>Recent Uploads</h3>
                  </div>
                  {stats.recent_uploads.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No uploads yet. Upload rate cards from the Rate Upload page.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {stats.recent_uploads.slice().reverse().map((u, i) => (
                        <div key={i} style={{ padding: '0.7rem 0.9rem', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: 2 }}>
                            <span>{u.courier_name}</span>
                            <span style={{ color: '#10b981', fontSize: '0.75rem' }}>+{u.added} added</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.filename} · {new Date(u.timestamp).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-panel reveal stagger-3">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem' }}>
                    <Clock size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontWeight: 700 }}>Service Types</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {stats.service_types.map(s => (
                      <span key={s} style={{ padding: '0.3rem 0.8rem', background: 'rgba(0,209,255,0.08)', border: '1px solid rgba(0,209,255,0.2)', borderRadius: 20, fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
