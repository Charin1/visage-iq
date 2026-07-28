import React from 'react';
import { Briefcase, Eye, Scissors, CheckCircle2 } from 'lucide-react';

export default function GoalSelector({ activeGoal, onSelectGoal }) {
  const goals = [
    {
      id: 'executive',
      title: 'Executive Presence & Authority',
      desc: 'Optimize headshots, boardroom dominance, and media positioning.',
      icon: Briefcase,
      color: 'var(--accent-amber)',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.35)'
    },
    {
      id: 'harmony',
      title: 'Aesthetic & Structural Harmony',
      desc: 'Analyze bilateral symmetry, Phi (Φ) golden ratio, and biological age gap.',
      icon: Eye,
      color: 'var(--accent-pink)',
      bg: 'rgba(244, 63, 94, 0.12)',
      border: 'rgba(244, 63, 94, 0.35)'
    },
    {
      id: 'grooming',
      title: 'Grooming & Frame Proportions',
      desc: 'Get exact recommendations for glasses shapes, haircuts, and collar cuts.',
      icon: Scissors,
      color: 'var(--accent-cyan)',
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.35)'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Select Analysis Intent & Focus Goal:
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        {goals.map((g) => {
          const Icon = g.icon;
          const isSelected = activeGoal === g.id;
          return (
            <div
              key={g.id}
              onClick={() => onSelectGoal(g.id)}
              style={{
                background: isSelected ? g.bg : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? `1.5px solid ${g.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem' }}>
                  <CheckCircle2 size={16} color={g.color} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '8px' }}>
                  <Icon size={18} color={g.color} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFF' }}>{g.title}</div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {g.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
