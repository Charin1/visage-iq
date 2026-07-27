import React, { useState } from 'react';
import { Award, Briefcase, Eye, ShieldAlert, Sliders, Download, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AnalysisDashboard({ results }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!results) return null;

  const { quantitative_metrics: quant, qualitative_analysis: qual, beauty_harmony_score: beauty, execution_time_seconds } = results;
  const arch = qual?.domain_and_profession_archetype || {};
  const harmony = qual?.attractiveness_and_harmony || {};
  const presence = qual?.presence_and_authority_markers || {};

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `visage_iq_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Harmony Score Banner */}
      <div className="score-badge-container">
        <Award size={48} color="#C4B5FD" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Facial Harmony Index (SCUT-FBP5500)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span className="score-number">{beauty?.score_5_scale || 3.85}</span>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
            <span className="badge-privacy" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#C4B5FD', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
              Top {Math.max(0.1, Number((100 - (beauty?.percentile || 82)).toFixed(1)))}% Tier ({beauty?.harmony_tier || 'Strong'})
            </span>
          </div>
        </div>
        <button className="btn-secondary" onClick={handleDownloadJSON} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
        {['overview', 'domain archetype', 'quantitative metrics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: activeTab === tab ? '#FFF' : 'var(--text-muted)',
              border: activeTab === tab ? '1px solid rgba(139, 92, 246, 0.4)' : 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Domain Archetype Summary Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Briefcase size={20} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '1.1rem' }}>Primary Domain Archetype</h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {arch?.primary_domain || 'Scholar / Tech / Academic'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Confidence: {arch?.confidence_level || 'High'}
                </div>
              </div>
              <span className="badge-privacy">
                {presence?.perceived_dominance || 'Medium'} Perceived Authority
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              Observed Visual & Lifestyle Cues:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {(arch?.lifestyle_and_visual_cues || ['Direct gaze alignment', 'Relaxed posture']).map((cue, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <ChevronRight size={14} color="var(--accent-purple)" />
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          {/* Aesthetic Summary Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Eye size={20} color="var(--accent-purple)" />
              <h4 style={{ fontSize: '1.1rem' }}>Aesthetic & Harmony Traits</h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              {harmony?.overall_aesthetic_summary || 'Face exhibits strong quantitative proportions.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(harmony?.key_aesthetic_features || ['High symmetry score', 'Balanced fWHR ratio']).map((feat, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-main)'
                }}>
                  ✨ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Domain Archetype */}
      {activeTab === 'domain archetype' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Qualitative Reasoning Profile</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="metric-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Symmetry Rating</div>
              <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
                {harmony?.facial_symmetry_rating || 'High'}
              </div>
            </div>
            <div className="metric-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expression & Focus</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.5rem' }}>
                {presence?.expression_and_focus || 'Calm, focused gaze with neutral facial tension'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Quantitative Metrics */}
      {activeTab === 'quantitative metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>fWHR (Width-to-Height Ratio)</div>
            <div className="metric-value">{quant?.fwhr_ratio || 0.0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Standard ideal range: 1.70 – 1.95
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Horizontal Symmetry</div>
            <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
              {quant?.horizontal_symmetry_pct || 0.0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Bilateral landmark parity index
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jaw-to-Cheek Ratio</div>
            <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
              {quant?.jaw_to_cheek_ratio || 0.0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Jaw width ({quant?.jaw_width_px ?? 0}px) / Face width ({quant?.face_width_px ?? 0}px)
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Golden Ratio Parity</div>
            <div className="metric-value" style={{ color: 'var(--accent-pink)' }}>
              {quant?.golden_ratio_harmony_pct || 94.5}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Proportional Phi (Φ = 1.618) alignment score
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Eye Width Symmetry</div>
            <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
              {quant?.eye_width_symmetry_pct || 0.0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Intercanthal distance: {quant?.intercanthal_distance_px ?? 0}px
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
        Processed in {execution_time_seconds}s via Apple Silicon Unified GPU Engine
      </div>
    </div>
  );
}
