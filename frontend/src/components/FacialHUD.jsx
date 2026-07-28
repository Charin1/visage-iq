import React, { useEffect, useRef, useState } from 'react';
import { Sliders } from 'lucide-react';

export default function FacialHUD({ imageSrc, meshPoints, showMesh = true }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Mesh customization options
  const [meshMode, setMeshMode] = useState('dots'); // 'dots' | 'wireframe' | 'minimal'
  const [dotSize, setDotSize] = useState(0.85); // Micro pinpoint size
  const [meshOpacity, setMeshOpacity] = useState(0.55);

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    const renderOverlay = () => {
      // Handle High-DPI / Retina resolution scaling
      const dpr = window.devicePixelRatio || 1;
      const rect = img.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const hasMesh = meshPoints && meshPoints.length > 0;

      // --- 1. Facial Symmetry Center Axis ---
      if (showMesh) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${meshOpacity * 0.4})`;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- 2. Micro-Pinpoint Facial Mesh & Wireframe ---
      if (showMesh && hasMesh) {
        // Draw Wireframe Connections if enabled
        if (meshMode === 'wireframe') {
          ctx.strokeStyle = `rgba(6, 182, 212, ${meshOpacity * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          for (let i = 0; i < meshPoints.length - 1; i += 3) {
            const p1 = meshPoints[i];
            const p2 = meshPoints[i + 1];
            const p3 = meshPoints[i + 2] || meshPoints[0];
            ctx.moveTo(p1.x * w, p1.y * h);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.lineTo(p3.x * w, p3.y * h);
          }
          ctx.stroke();
        }

        // Draw Micro-Pinpoint Dots
        if (meshMode === 'dots' || meshMode === 'wireframe') {
          ctx.fillStyle = `rgba(6, 182, 212, ${meshOpacity})`;
          meshPoints.forEach((pt) => {
            const x = pt.x * w;
            const y = pt.y * h;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
            ctx.fill();
          });
        }

        // Highlight Key Landmark Anchor Nodes with subtle glowing ring
        const keyLandmarkIds = [33, 263, 1, 61, 291, 152, 234, 454, 10, 168];
        meshPoints.forEach((pt) => {
          if (keyLandmarkIds.includes(pt.id)) {
            const x = pt.x * w;
            const y = pt.y * h;

            // Outer glow ring
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(x, y, 2.8, 0, 2 * Math.PI);
            ctx.stroke();

            // Core neon point
            ctx.fillStyle = '#DDD6FE';
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }

      ctx.restore();
    };

    if (img.complete) {
      renderOverlay();
    } else {
      img.onload = renderOverlay;
    }

    window.addEventListener('resize', renderOverlay);
    return () => window.removeEventListener('resize', renderOverlay);
  }, [imageSrc, meshPoints, showMesh, meshMode, dotSize, meshOpacity]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Canvas HUD Display */}
      <div className="hud-canvas-wrapper" style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <img ref={imageRef} src={imageSrc} alt="Portrait face analysis" style={{ width: '100%', display: 'block', borderRadius: '14px' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      </div>

      {/* Futuristic Mesh Fine-Tuning Control Bar */}
      {showMesh && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.65rem 1rem',
          borderRadius: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
            <Sliders size={14} />
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>HUD Mesh Controls</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            {/* Mesh Mode Selector */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '8px' }}>
              {[
                { id: 'dots', label: 'Micro Dots' },
                { id: 'wireframe', label: 'Sci-Fi Wireframe' },
                { id: 'minimal', label: 'Key Nodes' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMeshMode(m.id)}
                  style={{
                    background: meshMode === m.id ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                    color: meshMode === m.id ? '#FFF' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    fontWeight: meshMode === m.id ? 600 : 400
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dot Size Adjustment */}
            {meshMode === 'dots' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <span>Dot Size:</span>
                {[
                  { size: 0.6, label: 'Fine' },
                  { size: 0.9, label: 'Med' },
                  { size: 1.4, label: 'Bold' }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setDotSize(s.size)}
                    style={{
                      background: dotSize === s.size ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.05)',
                      color: dotSize === s.size ? '#FFF' : 'var(--text-muted)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


