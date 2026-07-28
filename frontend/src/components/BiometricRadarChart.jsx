import React from 'react';
import { Activity } from 'lucide-react';

export default function BiometricRadarChart({ quantitative_metrics, qualitative_analysis, beauty_harmony_score }) {
  const quant = quantitative_metrics || {};
  const beauty = beauty_harmony_score || {};

  // Calculate 5 core normalized axis values (0 to 100)
  const symmetry = Math.min(100, Math.max(0, quant.horizontal_symmetry_pct || 94.5));
  const goldenRatio = Math.min(100, Math.max(0, quant.golden_ratio_harmony_pct || 95.2));
  
  // fWHR score normalized (ideal 1.70 - 1.95 -> 100)
  const fwhr = quant.fwhr_ratio || 1.85;
  const fwhrScore = Math.min(100, Math.max(60, 100 - Math.abs(1.85 - fwhr) * 120));

  // Mandibular Jaw Dominance score normalized (ideal jaw-to-cheek ratio 0.75 - 0.85)
  const jawRatio = quant.jaw_to_cheek_ratio || 0.78;
  const jawScore = Math.min(100, Math.max(60, 100 - Math.abs(0.80 - jawRatio) * 150));

  // Harmony Tier score
  const harmonyScore = Math.min(100, (beauty.score_5_scale || 3.85) * 20);

  const axes = [
    { label: 'Bilateral Symmetry', value: symmetry, color: '#10B981' },
    { label: 'Golden Ratio (Φ)', value: goldenRatio, color: '#F43F5E' },
    { label: 'fWHR Proportions', value: fwhrScore, color: '#F59E0B' },
    { label: 'Mandibular Dominance', value: jawScore, color: '#06B6D4' },
    { label: 'Overall Harmony Tier', value: harmonyScore, color: '#8B5CF6' }
  ];

  // SVG Radar Layout Math
  const size = 320;
  const center = size / 2;
  const radius = 110;
  const numAxes = axes.length;

  const getCoordinates = (index, valuePct) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (valuePct / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points for data fill
  const polyPoints = axes.map((a, i) => {
    const { x, y } = getCoordinates(i, a.value);
    return `${x},${y}`;
  }).join(' ');

  // Outer web grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem' }}>Facial Harmony Radar Vector</h3>
        </div>
        <span className="badge-privacy" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
          5-Axis Biometric Index
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flex: 1 }}>
        {/* SVG Radar Chart Canvas */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} style={{ overflow: 'visible' }}>
            {/* Grid Rings */}
            {gridLevels.map((lvl, idx) => {
              const gridPts = axes.map((_, i) => {
                const { x, y } = getCoordinates(i, lvl * 100);
                return `${x},${y}`;
              }).join(' ');
              return (
                <polygon
                  key={idx}
                  points={gridPts}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray={lvl === 1 ? 'none' : '3,3'}
                />
              );
            })}

            {/* Axis Lines from Center */}
            {axes.map((_, i) => {
              const { x, y } = getCoordinates(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data Polygon Fill */}
            <polygon
              points={polyPoints}
              fill="url(#radarGradient)"
              stroke="var(--accent-cyan)"
              strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))' }}
            />

            {/* Gradient definition */}
            <defs>
              <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.45)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.15)" />
              </radialGradient>
            </defs>

            {/* Data Points */}
            {axes.map((a, i) => {
              const { x, y } = getCoordinates(i, a.value);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill={a.color} stroke="#FFF" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend & Breakdown Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '200px', flex: 1 }}>
          {axes.map((a, idx) => (
            <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '0.6rem 0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: a.color, display: 'inline-block' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.label}</span>
              </div>
              <strong style={{ fontSize: '0.9rem', color: '#FFF', fontFamily: 'var(--font-heading)' }}>
                {a.value.toFixed(1)}%
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
