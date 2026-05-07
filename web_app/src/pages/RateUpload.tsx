import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, X, CloudUpload, FileSpreadsheet, FilePlus } from 'lucide-react';

const API = 'http://localhost:8000';

interface UploadResult { message: string; courier: string; filename: string; added: number; updated: number; total_records: number; }

export default function RateUpload() {
  const [courierName, setCourierName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierName.trim()) { setError('Enter the courier name.'); return; }
    if (!file) { setError('Please select a file to upload.'); return; }
    setLoading(true); setError(null); setResult(null);
    const fd = new FormData();
    fd.append('courier_name', courierName.trim());
    fd.append('file', file);
    try {
      const { data } = await axios.post(`${API}/upload-rates`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(data);
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const isExcel = file?.name.endsWith('.xlsx') || file?.name.endsWith('.xls');
  const FileIcon = isExcel ? FileSpreadsheet : FileText;

  return (
    <div style={{ padding: '5rem 0 6rem', minHeight: '100vh' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="reveal text-center" style={{ marginBottom: '3rem' }}>
          <div className="badge badge-info" style={{ marginBottom: '1rem' }}>
            <CloudUpload size={13} /> Rate Card Manager
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.9rem' }}>
            Upload <span className="text-gradient">Rate Cards</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Upload courier rate sheets in Excel or PDF format. The AI engine will parse, normalize, and integrate them into the live rate calculator.
          </p>
        </div>

        <div className="glass-panel reveal stagger-1">
          <form onSubmit={handleSubmit}>
            {/* Courier Name */}
            <div className="form-group">
              <label className="form-label">Courier / Provider Name</label>
              <input className="form-input" type="text" placeholder="e.g. TCS Express, Leopards Courier..." value={courierName}
                onChange={e => setCourierName(e.target.value)} required />
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--accent-primary)' : file ? '#10b981' : 'var(--border-color)'}`,
                borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'rgba(0,209,255,0.04)' : file ? 'rgba(16,185,129,0.04)' : 'var(--bg-tertiary)',
                transition: 'all 0.2s', marginBottom: '1.5rem',
              }}>
              <input id="file-input" type="file" accept=".xlsx,.xls,.pdf" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              {file ? (
                <div>
                  <FileIcon size={40} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{file.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB · {isExcel ? 'Excel Spreadsheet' : 'PDF Document'}</div>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                    style={{ marginTop: '0.8rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.8rem' }}>
                    <X size={14} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Drag & drop or click to browse</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports .xlsx, .xls, and .pdf rate cards</div>
                </div>
              )}
            </div>

            {/* Supported Format Tips */}
            <div style={{ background: 'rgba(0,209,255,0.05)', border: '1px solid rgba(0,209,255,0.15)', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: 8, display:'flex', alignItems:'center', gap:6 }}>
                <FilePlus size={14} /> Expected Column Format (Excel)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {['service_type', 'destination', 'base_rate_rs', 'per_kg_rate_rs', 'estimated_days', 'cod_available', 'insurance_pct', 'reliability_pct'].map(col => (
                  <code key={col} style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '3px 7px', borderRadius: 5, color: 'var(--text-secondary)' }}>{col}</code>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><CloudUpload size={18} /> Upload & Parse Rate Card</>}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{ marginTop: '1.2rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444' }}>
              <AlertTriangle size={18} /><span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          {/* Success */}
          {result && (
            <div className="animate-fade-in" style={{ marginTop: '1.2rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={22} color="#10b981" />
                <span style={{ fontWeight: 700, color: '#10b981' }}>Rate Card Imported Successfully</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  ['Courier', result.courier],
                  ['File', result.filename],
                  ['Records Added', result.added],
                  ['Records Updated', result.updated],
                  ['Total in DB', result.total_records],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: '0.6rem 0.9rem' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
