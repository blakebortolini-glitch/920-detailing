import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function AdvisorChat() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startConversation = async () => {
    setStarting(true);
    const conv = await base44.agents.createConversation({
      agent_name: 'detailing_advisor',
      metadata: { name: 'Website Chat' },
    });
    setConversation(conv);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages([...data.messages]);
    });

    // Send a greeting message from the agent
    await base44.agents.addMessage(conv, {
      role: 'user',
      content: 'Hi! I need help figuring out which detailing service is right for my vehicle.',
    });

    setStarting(false);
  };

  const handleOpen = () => {
    setOpen(true);
    if (!conversation) startConversation();
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !conversation) return;
    const text = input.trim();
    setInput('');
    setLoading(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-ink-black text-white px-5 py-3 shadow-2xl transition-all hover:scale-105 active:scale-95"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          <MessageCircle size={16} strokeWidth={2} />
          Ask the Advisor
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col bg-white border border-ink-black shadow-2xl"
          style={{ width: 360, height: 520, maxWidth: 'calc(100vw - 24px)', maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-ink-black text-white flex-shrink-0">
            <div>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                920 Detailing
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
                Service Advisor
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {starting && (
              <div className="flex justify-start">
                <div className="bg-secondary px-4 py-3 max-w-[85%]" style={{ fontSize: '0.85rem' }}>
                  <span className="animate-pulse text-tech-grey">Connecting…</span>
                </div>
              </div>
            )}
            {visibleMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-3 max-w-[85%] ${m.role === 'user' ? 'bg-ink-black text-white' : 'bg-secondary text-ink-black'}`}
                  style={{ fontSize: '0.85rem', lineHeight: 1.5 }}
                >
                  {m.role === 'assistant' ? (
                    <ReactMarkdown
                      className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      components={{
                        p: ({ children }) => <p className="my-1">{children}</p>,
                        ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                        li: ({ children }) => <li className="my-0.5">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary px-4 py-3" style={{ fontSize: '0.85rem' }}>
                  <span className="animate-pulse text-tech-grey">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-border flex items-start px-4 py-3 gap-3">
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about services, pricing, your vehicle…"
              disabled={starting || loading}
              className="flex-1 resize-none bg-transparent outline-none text-ink-black placeholder-tech-grey"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', lineHeight: 1.5 }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || starting}
              className="text-ink-black disabled:opacity-30 hover:opacity-60 transition-opacity flex-shrink-0"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}