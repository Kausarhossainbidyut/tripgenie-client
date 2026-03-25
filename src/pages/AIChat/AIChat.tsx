import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { aiService } from '../../services/ai.service';
import type { AIChatResponse } from '../../types';

export function AIChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI travel assistant. Ask me anything about travel destinations, trip planning, or recommendations! 🌍✈️'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await aiService.chat({ message: userMessage });
      
      if (response.success) {
        const aiResponse = (response.data as AIChatResponse).reply;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble responding right now. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Suggest a 3-day trip under $200",
    "Best beaches in Bangladesh",
    "Mountain trekking recommendations",
    "Family-friendly destinations"
  ];

  const handleSuggestedClick = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div style={{ 
      padding: '1rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 700, 
        color: '#111827', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🤖 AI Travel Assistant
      </h1>

      {/* Chat Messages */}
      <div className="card" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: msg.role === 'user' ? '#3b82f6' : '#e5e7eb',
                  color: msg.role === 'user' ? 'white' : '#111827',
                  borderBottomRightRadius: msg.role === 'user' ? '0' : '0.75rem',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '0.75rem',
                }}
              >
                <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#9ca3af', 
                marginTop: '0.25rem',
                textAlign: msg.role === 'user' ? 'right' : 'left'
              }}>
                {msg.role === 'user' ? 'You' : 'AI Assistant'}
              </p>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start' }}>
              <div style={{ 
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: '#e5e7eb',
              }}>
                <div className="animate-spin" style={{ 
                  width: '1.5rem', 
                  height: '1.5rem', 
                  borderRadius: '50%', 
                  border: '3px solid #3b82f6',
                  borderTopColor: 'transparent'
                }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Questions */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedClick(question)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            💡 {question}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about travel..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        />
        <Button type="submit" isLoading={loading} size="lg">
          Send
        </Button>
      </form>
    </div>
  );
}
