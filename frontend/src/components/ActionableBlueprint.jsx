import React from 'react';
import { Sparkles, Camera, Sun, Glasses, Shirt, UserCheck, ChevronRight } from 'lucide-react';

export default function ActionableBlueprint({ quantitative_metrics, qualitative_analysis, activeGoal }) {
  const quant = quantitative_metrics || {};
  const qual = qualitative_analysis || {};
  const fwhr = quant.fwhr_ratio || 1.85;
  const symmetry = quant.horizontal_symmetry_pct || 94.5;
  const jawRatio = quant.jaw_to_cheek_ratio || 0.78;

  // Compute 5 tailored action steps based on biometric metrics and active intent goal
  const recommendations = [
    {
      title: 'Optimal Camera Elevation & Pitch',
      icon: Camera,
      color: 'var(--accent-amber)',
      advice: fwhr >= 1.82
        ? 'Position camera at eye level (0° pitch). Your strong fWHR (1.85+) maintains peak natural authority without requiring downward camera tilt.'
        : 'Elevate camera 3° - 5° above eye level to sharpen jawline definition and lengthen vertical face proportions.',
      metricTag: `fWHR ${fwhr}`
    },
    {
      title: 'Lighting Key Direction & Fill',
      icon: Sun,
      color: 'var(--accent-emerald)',
      advice: symmetry >= 92.0
        ? 'Your face exhibits high bilateral symmetry (94%+). Use balanced dual key lights (45° left & right) to showcase natural structural balance.'
        : 'Use a single primary key light at 35° to create subtle shadow contouring along the non-dominant cheekbone.',
      metricTag: `Symmetry ${symmetry}%`
    },
    {
      title: 'Eyewear Frame Shape Match',
      icon: Glasses,
      color: 'var(--accent-cyan)',
      advice: fwhr >= 1.80
        ? 'Select oval, round, or teardrop Aviator frames to soften strong angular jawline proportions.'
        : 'Select structured rectangular or square Wayfarer frames to add definition to your face profile.',
      metricTag: `Jaw/Cheek ${jawRatio}`
    },
    {
      title: 'Wardrobe Collar & Neckline Geometry',
      icon: Shirt,
      color: 'var(--accent-pink)',
      advice: jawRatio >= 0.80
        ? 'Opt for medium spread or cutaway suit collars and open V-necklines to complement strong mandibular width.'
        : 'Opt for button-down or point collars with structured lapels to frame the neck and chin cap.',
      metricTag: `Mandibular Ratio`
    },
    {
      title: 'Postural Alignment & Gaze Tension',
      icon: UserCheck,
      color: 'var(--accent-purple)',
      advice: activeGoal === 'executive'
        ? 'Maintain direct center gaze with neutral orbicularis oculi tension to maximize perceived executive authority.'
        : 'Maintain relaxed cervical posture with chin parallel to floor for effortless aesthetic balance.',
      metricTag: `Perceived Authority`
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={22} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '1.1rem' }}>Personal Actionable AI Blueprint</h3>
        </div>
        <span className="badge-privacy" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
          Grounded In Your 3D Metrics
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '10px', marginTop: '0.1rem' }}>
                <Icon size={18} color={rec.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
                    {idx + 1}. {rec.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: rec.color, padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                    {rec.metricTag}
                  </span>
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {rec.advice}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
