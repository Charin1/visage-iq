import React, { useState } from 'react';
import { Columns, Upload, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function PhotoComparer({ primaryResults, primaryImageSrc }) {
  const [secondaryImageSrc, setSecondaryImageSrc] = useState(null);
  const [secondaryResults, setSecondaryResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleSecondImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSecondaryImageSrc(previewUrl);
    setIsComparing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setSecondaryResults(data);
      }
    } catch (err) {
      console.error("Comparison analysis error:", err);
    } finally {
      setIsComparing(false);
    }
  };

  const qA = primaryResults?.quantitative_metrics || {};
  const qB = secondaryResults?.quantitative_metrics || {};

  const symA = qA.horizontal_symmetry_pct || 94.5;
  const symB = qB.horizontal_symmetry_pct || 0;
  const symDelta = (symB - symA).toFixed(1);

  const fwhrA = qA.fwhr_ratio || 1.85;
  const fwhrB = qB.fwhr_ratio || 0;
  const fwhrDelta = (fwhrB - fwhrA).toFixed(2);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Columns size={22} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.15rem' }}>Side-by-Side Headshot A/B Comparer</h3>
        </div>
        <span className="badge-privacy" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD' }}>
          Quantify Lighting & Angle Deltas
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Headshot A (Primary) */}
        <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-pink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Headshot A (Primary)
          </div>
          <div style={{ height: '220px', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
            <img src={primaryImageSrc} alt="Headshot A" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Bilateral Symmetry:</span>
              <strong style={{ color: '#FFF' }}>{symA}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>fWHR Ratio:</span>
              <strong style={{ color: '#FFF' }}>{fwhrA}</strong>
            </div>
          </div>
        </div>

        {/* Headshot B (Secondary) */}
        <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Headshot B (Comparison)
          </div>

          {!secondaryImageSrc ? (
            <label style={{
              height: '220px',
              border: '2px dashed rgba(6, 182, 212, 0.4)',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              background: 'rgba(6, 182, 212, 0.04)',
              transition: 'all 0.2s ease'
            }}>
              <Upload size={24} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Upload Second Photo for A/B Test</span>
              <input type="file" accept="image/*" onChange={handleSecondImageUpload} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ height: '220px', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
              <img src={secondaryImageSrc} alt="Headshot B" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {secondaryResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Bilateral Symmetry:</span>
                <strong style={{ color: '#FFF' }}>{symB}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>fWHR Ratio:</span>
                <strong style={{ color: '#FFF' }}>{fwhrB}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Delta Results Banner */}
      {secondaryResults && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={24} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>A/B Delta Assessment</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Comparison between Headshot A & Headshot B</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem' }}>
              <span>Symmetry Delta: </span>
              <strong style={{ color: Number(symDelta) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
                {Number(symDelta) >= 0 ? `+${symDelta}%` : `${symDelta}%`}
              </strong>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem' }}>
              <span>fWHR Delta: </span>
              <strong style={{ color: 'var(--accent-amber)' }}>
                {Number(fwhrDelta) >= 0 ? `+${fwhrDelta}` : `${fwhrDelta}`}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
