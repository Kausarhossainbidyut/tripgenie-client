import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/ai.service';
import type { AIChatResponse } from '../../types';
import { FiSend, FiUser, FiCpu, FiGlobe, FiZap } from 'react-icons/fi';

const T = { grad: 'linear-gradient(135deg, #0d9488, #06b6d4)', teal: '#0d9488', cyan: '#06b6d4' };

const SUGGESTIONS = [
  '🏖️ Best beaches in Bangladesh',
  '🏔️ Mountain trekking spots',
  '💰 3-day trip under $200',
  '👨‍👩‍👧 Family-friendly destinations',
  '🌿 Eco-tourism options',
  '🏛️ Historical sites to visit',
];

export function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI travel assistant powered by TripGenie. Ask me anything about destinations, trip planning, budgets, or local tips! 🌍✈️" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await aiService.chat({ message: msg });
      if (res.success) {
        setMessages(p => [...p, { role: 'assistant', content: (res.data as AIChatResponse).reply }]);
      } else throw new Error();
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: "I'm having trouble responding right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f4c4c 60%, #0c4a6e 100%)', padding: '1.25rem 1.5rem', flexShrink: 0 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ width: '44px', height: '44px', borderRadius: '12px', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(13,148,136,0.5)', flexShrink: 0 }}>
            <FiCpu size={22} color="white" />
          </motion.div>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>AI Travel Assistant</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.125rem' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Online · Powered by TripGenie AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '800px', width: '100%', margin: '0 auto', alignSelf: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
              >
                {/* Avatar */}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'user' ? T.grad : 'linear-gradient(135deg, #1e293b, #334155)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  {msg.role === 'user' ? <FiUser size={16} color="white" /> : <FiCpu size={16} color="white" />}
                </div>
                {/* Bubble */}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '0.875rem 1.125rem',
                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    background: msg.role === 'user' ? T.grad : 'white',
                    color: msg.role === 'user' ? 'white' : '#1e293b',
                    fontSize: '0.9375rem', lineHeight: 1.65,
                    boxShadow: msg.role === 'user' ? '0 4px 14px rgba(13,148,136,0.3)' : '0 2px 12px rgba(0,0,0,0.08)',
                    border: msg.role === 'assistant' ? '1px solid #f1f5f9' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.375rem', textAlign: msg.role === 'user' ? 'right' : 'left', fontWeight: 500 }}>
                    {msg.role === 'user' ? 'You' : 'TripGenie AI'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiCpu size={16} color="white" />
              </div>
              <div style={{ padding: '0.875rem 1.25rem', background: 'white', borderRadius: '4px 18px 18px 18px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d }}
                    style={{ width: '7px', height: '7px', borderRadius: '50%', background: T.teal }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 1.5rem 1rem', maxWidth: '800px', width: '100%', margin: '0 auto', alignSelf: 'stretch' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Quick suggestions</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {SUGGESTIONS.map(s => (
              <motion.button key={s} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={() => send(s)}
                style={{ padding: '0.5rem 0.875rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '9999px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.color = T.teal; e.currentTarget.style.background = 'rgba(13,148,136,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'white'; }}>
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '1rem 1.5rem 1.25rem', background: 'white', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
        <form onSubmit={e => { e.preventDefault(); send(input); }}
          style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiGlobe size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about travel..." disabled={loading}
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '1.5px solid #e2e8f0', borderRadius: '14px', fontSize: '0.9375rem', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f8fafc'; }}
            />
          </div>
          <motion.button type="submit" disabled={loading || !input.trim()}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ width: '48px', height: '48px', borderRadius: '14px', background: input.trim() && !loading ? T.grad : '#e2e8f0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0, boxShadow: input.trim() && !loading ? '0 4px 14px rgba(13,148,136,0.4)' : 'none', transition: 'all 0.2s' }}>
            <FiSend size={18} color={input.trim() && !loading ? 'white' : '#94a3b8'} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
