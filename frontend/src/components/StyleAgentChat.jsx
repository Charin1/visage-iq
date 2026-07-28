import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function StyleAgentChat({ quantitative_metrics, qualitative_analysis }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Visage IQ AI Grooming & Style Specialist. Ask me anything about haircut recommendations, beard styles, or glasses frames suited to your facial geometry!"
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presetQuestions = [
    "✂️ What haircut suits my fWHR ratio?",
    "👓 Best glasses frame shape for my jawline?",
    "🧔 Beard style recommendation for my archetype",
    "✨ Overall grooming tips for my proportions"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: `session_${Date.now()}`,
          message: query,
          facial_metrics: quantitative_metrics,
          qualitative_profile: qualitative_analysis,
          history: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI style agent');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.latest_reply }
      ]);
    } catch (err) {
      console.error('Style agent chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "⚠️ Sorry, I ran into a connection issue with local Ollama. Please ensure Ollama is active on http://localhost:11434" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '520px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Bot size={22} color="var(--accent-pink)" />
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Grooming & Style Assistant (LangGraph Agent)</h4>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Stateful multi-turn agent grounded in your 3D facial metrics
          </div>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.4rem', marginBottom: '1rem' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '0.6rem',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{ background: 'rgba(244, 63, 94, 0.2)', padding: '0.4rem', borderRadius: '50%', height: '28px', width: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#FF7E5F" />
              </div>
            )}

            <div
              style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(245, 158, 11, 0.3))' : 'rgba(255, 255, 255, 0.05)',
                border: msg.role === 'user' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.88rem',
                lineHeight: '1.5',
                color: '#FFF',
                whiteSpace: 'pre-wrap'
              }}
            >
              <div>{msg.content}</div>
            </div>

            {msg.role === 'user' && (
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.4rem', borderRadius: '50%', height: '28px', width: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} color="#FBBF24" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
            <Loader2 className="animate-spin" size={16} />
            LangGraph Agent reasoning via local LLM...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI Style Coach about haircuts, beards, or glasses..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            color: '#FFF',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />
        <button
          className="btn-primary"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputMsg.trim()}
          style={{ padding: '0.65rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
