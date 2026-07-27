import React, { useState } from 'react';
import { Eye, ShieldCheck, Sparkles, Loader2, RefreshCw, Cpu, Code2 } from 'lucide-react';
import ImageUploader from './components/ImageUploader.jsx';
import FacialHUD from './components/FacialHUD.jsx';
import AnalysisDashboard from './components/AnalysisDashboard.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [showHUDMesh, setShowHUDMesh] = useState(true);

  const handleImageSelected = async (file, previewUrl) => {
    setSelectedFile(file);
    setImagePreview(previewUrl);
    setAnalysisResults(null);
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Analysis request failed');
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      console.error("API error:", err);
      setError(`Backend Connection Error: ${err.message}. Ensure backend is running on http://localhost:8000`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunDemo = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/demo`);
      if (!response.ok) {
        throw new Error('Failed to execute demo analysis');
      }
      const data = await response.json();
      setAnalysisResults(data);
      // Generate synthetic face preview for display
      setImagePreview('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%231E1914"/><ellipse cx="300" cy="300" rx="140" ry="190" fill="%23D2B4A0"/><circle cx="240" cy="260" r="22" fill="%23FFFFFF"/><circle cx="360" cy="260" r="22" fill="%23FFFFFF"/><circle cx="240" cy="260" r="10" fill="%23503214"/><circle cx="360" cy="260" r="10" fill="%23503214"/><line x1="300" y1="280" x2="300" y2="330" stroke="%23A07864" stroke-width="4"/><ellipse cx="300" cy="380" rx="60" ry="25" fill="%238C3C50"/></svg>');
    } catch (err) {
      console.error("Demo error:", err);
      setError(`Demo Execution Error: ${err.message}. Make sure python backend is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setAnalysisResults(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="app-header">
        <div className="brand-logo">
          <div className="brand-logo-icon">
            <Eye size={22} color="#FFF" />
          </div>
          <div>
            Visage<span className="gradient-text">IQ</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="badge-privacy">
            <ShieldCheck size={14} /> 100% Offline & Private
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-container" style={{ flex: 1 }}>
        <section className="hero-section">
          <h1 className="hero-title">
            Facial Intelligence & <span className="gradient-text">Domain Archetype</span> Analysis
          </h1>
        </section>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <span>⚠️ {error}</span>
            <button className="btn-secondary" onClick={handleRunDemo} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Try Synthetic Demo
            </button>
          </div>
        )}

        {!imagePreview ? (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <ImageUploader
              onImageSelected={handleImageSelected}
              onRunDemo={handleRunDemo}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Left Column: Image Preview & Canvas HUD */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Facial Mesh HUD</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowHUDMesh(!showHUDMesh)}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    {showHUDMesh ? 'Hide Mesh Points' : 'Show Mesh Points'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleReset}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <RefreshCw size={12} /> Reset
                  </button>
                </div>
              </div>

              <FacialHUD
                imageSrc={imagePreview}
                meshPoints={analysisResults?.quantitative_metrics?.hud_mesh_points}
                showMesh={showHUDMesh}
              />

              {isLoading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.75rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '1rem',
                  borderRadius: '10px',
                  color: 'var(--accent-purple)',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  <Loader2 className="animate-spin" size={20} />
                  Running MediaPipe 468 Landmark Mesh & Vision AI Reasoning...
                </div>
              )}
            </div>

            {/* Right Column: Analysis Dashboard */}
            <div>
              {analysisResults ? (
                <AnalysisDashboard results={analysisResults} />
              ) : (
                <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={36} color="var(--accent-purple)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Analyzing Facial Features...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Calculating 468 3D landmarks, fWHR ratios, horizontal symmetry, and domain archetype cues locally.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
