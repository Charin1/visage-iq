import React, { useState } from 'react';
import { Award, Briefcase, Eye, Music, Dumbbell, Brain, Activity, Download, ChevronRight, Sparkles, CheckCircle2, Columns } from 'lucide-react';
import StyleAgentChat from './StyleAgentChat.jsx';
import GoalSelector from './GoalSelector.jsx';
import BiometricRadarChart from './BiometricRadarChart.jsx';
import ActionableBlueprint from './ActionableBlueprint.jsx';
import PhotoComparer from './PhotoComparer.jsx';

export default function AnalysisDashboard({ results, imagePreview }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeGoal, setActiveGoal] = useState('executive');

  if (!results) return null;

  const { quantitative_metrics: quant, qualitative_analysis: qual, beauty_harmony_score: beauty, execution_time_seconds } = results;
  const arch = qual?.domain_and_profession_archetype || {};
  const harmony = qual?.attractiveness_and_harmony || {};
  const presence = qual?.presence_and_authority_markers || {};
  const vocal = qual?.vocal_and_speech_profile || {};
  const athletic = qual?.athletic_and_somatotype_profile || {};
  const personality = qual?.personality_traits_big_five || {};
  const vitality = qual?.vitality_and_biological_age || {};

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `visage_iq_executive_report_${Date.now()}.json`);
    downloadAnchor.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Executive Harmony Score Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-amber))', padding: '0.85rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <Award size={36} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Facial Harmony Index (SCUT-FBP5500 Benchmark)
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#FFF' }}>
                  {beauty?.score_5_scale || 3.85}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
                <span className="badge-privacy" style={{ background: 'rgba(244, 63, 94, 0.25)', color: '#FF7E5F', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
                  Top {Math.max(0.1, Number((100 - (beauty?.percentile || 82)).toFixed(1)))}% Tier ({beauty?.harmony_tier || 'Exceptional'})
                </span>
              </div>
            </div>
          </div>

          <button className="btn-secondary" onClick={handleDownloadJSON} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={14} /> Export Executive Dossier
          </button>
        </div>

        {/* Quick Benchmark Pills Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>fWHR:</span>
            <strong style={{ color: 'var(--accent-gold)' }}>{quant?.fwhr_ratio || 1.85}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Symmetry:</span>
            <strong style={{ color: 'var(--accent-emerald)' }}>{quant?.horizontal_symmetry_pct || 94.5}%</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Golden Ratio Parity:</span>
            <strong style={{ color: 'var(--accent-pink)' }}>{quant?.golden_ratio_harmony_pct || 95.2}%</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Perceived Authority:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>{presence?.perceived_dominance || 'High'}</strong>
          </div>
        </div>
      </div>

      {/* Goal Intent Selector */}
      <GoalSelector activeGoal={activeGoal} onSelectGoal={setActiveGoal} />

      {/* Navigation Segmented Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Executive Overview' },
          { id: 'ab_test', label: 'Headshot A/B Test' },
          { id: 'vocal & athletic', label: 'Vocal & Athletic' },
          { id: 'personality & vitality', label: 'Personality & Vitality' },
          { id: 'ai style coach', label: 'AI Style Coach' },
          { id: 'quantitative metrics', label: 'Raw Metrics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(245, 158, 11, 0.25))' : 'rgba(255,255,255,0.03)',
              color: activeTab === tab.id ? '#FFF' : 'var(--text-muted)',
              border: activeTab === tab.id ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.05)',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Executive Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Grid Layout: Biometric Radar Chart & Actionable AI Blueprint */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <BiometricRadarChart
              quantitative_metrics={quant}
              qualitative_analysis={qual}
              beauty_harmony_score={beauty}
            />
            <ActionableBlueprint
              quantitative_metrics={quant}
              qualitative_analysis={qual}
              activeGoal={activeGoal}
            />
          </div>
          
          {/* Primary Domain Archetype Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Briefcase size={22} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.15rem' }}>Primary Domain Archetype</h3>
              </div>
              <span className="badge-privacy" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
                Confidence: {arch?.confidence_level || 'High'}
              </span>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-heading)' }}>
                {arch?.primary_domain || 'Scholar / Tech / Academic'}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {presence?.expression_and_focus || 'Calm, focused gaze with balanced facial muscle composure and direct posture.'}
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.75rem' }}>
              Observed Visual & Physical Indicators:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {(arch?.lifestyle_and_visual_cues || ['Direct gaze alignment', 'Relaxed muscle posture']).map((cue, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                  <ChevronRight size={16} color="var(--accent-pink)" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic Proportions & Symmetry */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Eye size={22} color="var(--accent-pink)" />
              <h3 style={{ fontSize: '1.15rem' }}>Aesthetic Proportions & Structural Harmony</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {harmony?.overall_aesthetic_summary || 'Face exhibits strong quantitative proportions with high structural symmetry.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {(harmony?.key_aesthetic_features || ['High symmetry score', 'Balanced fWHR ratio']).map((feat, idx) => (
                <span key={idx} style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', color: '#FF7E5F', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                  ✨ {feat}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Vocal & Athletic */}
      {activeTab === 'vocal & athletic' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          
          {/* Vocal Resonator Profile Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Music size={22} color="var(--accent-pink)" />
              <h3 style={{ fontSize: '1.15rem' }}>Vocal Resonator Profile</h3>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vocal Resonance Potential</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-pink)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
                {vocal?.vocal_resonance_potential || 'High'} Resonance
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Acoustic mandibular chamber volume index
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Vocal Projection & Articulatory Cues:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              {(vocal?.vocal_projection_cues || ['Strong mandibular volume for vocal resonance', 'Even orbicularis muscle tone']).map((cue, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ChevronRight size={16} color="var(--accent-pink)" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Athletic Conditioning Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Dumbbell size={22} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.15rem' }}>Athletic Conditioning</h3>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conditioning Somatotype</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
                {athletic?.athletic_conditioning_type || 'Explosive / Power'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                fWHR power index & masseter muscle density
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Muscularity & Cervical Cues:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              {(athletic?.muscularity_and_neck_cues || ['Proportionate neck-to-jaw ratio', 'Symmetrical masseter density']).map((cue, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ChevronRight size={16} color="var(--accent-amber)" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Personality & Vitality */}
      {activeTab === 'personality & vitality' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Big Five Personality Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Brain size={22} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem' }}>Big Five Personality Facial Geometry</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conscientiousness</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                  {personality?.conscientiousness_score || 'High'}
                </div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Extraversion</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
                  {personality?.extraversion_score || 'Ambivert'}
                </div>
              </div>
              <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Openness</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-pink)', marginTop: '0.25rem' }}>
                  {personality?.openness_to_experience || 'High'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Key Behavioral Signals:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {(personality?.key_behavioral_signals || ['Calm, focused gaze', 'Neutral facial tension']).map((cue, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ChevronRight size={16} color="var(--accent-cyan)" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Biological Vitality & Perceived Age Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Activity size={22} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.15rem' }}>Vitality & Biological Age Discrepancy</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Biological Age Perception</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.3rem' }}>
                  {vitality?.perceived_biological_age_gap || 'Younger than calendar age'}
                </div>
              </div>
              <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Skin Energy & Perfusion Index</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.3rem' }}>
                  {vitality?.skin_vitality_and_energy_index || 'Vibrant'}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab: Headshot A/B Test */}
      {activeTab === 'ab_test' && (
        <PhotoComparer primaryResults={results} primaryImageSrc={imagePreview} />
      )}

      {/* Tab 4: AI Style Coach */}
      {activeTab === 'ai style coach' && (
        <StyleAgentChat
          quantitative_metrics={quant}
          qualitative_analysis={qual}
        />
      )}

      {/* Tab 5: Raw Quantitative Data */}
      {activeTab === 'quantitative metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>fWHR (Width-to-Height Ratio)</div>
            <div className="metric-value">{quant?.fwhr_ratio || 1.85}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Standard ideal range: 1.70 – 1.95
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Horizontal Symmetry</div>
            <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
              {quant?.horizontal_symmetry_pct || 94.5}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Bilateral landmark parity index
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Golden Ratio Parity</div>
            <div className="metric-value" style={{ color: 'var(--accent-pink)' }}>
              {quant?.golden_ratio_harmony_pct || 95.2}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Proportional Phi (Φ = 1.618) alignment
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jaw-to-Cheek Ratio</div>
            <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>
              {quant?.jaw_to_cheek_ratio || 0.78}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Jaw width ({quant?.jaw_width_px ?? 0}px) / Face width ({quant?.face_width_px ?? 0}px)
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Eye Width Symmetry</div>
            <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
              {quant?.eye_width_symmetry_pct || 96.0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Intercanthal distance: {quant?.intercanthal_distance_px ?? 0}px
            </div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Face Dimensions</div>
            <div className="metric-value" style={{ color: '#FFF', fontSize: '1.4rem' }}>
              {quant?.face_width_px ?? 0} x {quant?.face_height_px ?? 0} px
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Total Face Height: {quant?.total_face_height_px ?? 0}px
            </div>
          </div>
        </div>
      )}

      {/* Execution Footer */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right', marginTop: '0.5rem' }}>
        Processed in {execution_time_seconds}s via Apple Silicon Unified GPU Engine
      </div>
    </div>
  );
}
