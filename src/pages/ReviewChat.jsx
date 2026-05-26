import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function ReviewChat() {
  const params = new URLSearchParams(window.location.search);
  const customerName = params.get('name') || 'there';
  const vehicle = params.get('vehicle') || '';
  const service = params.get('service') || '';

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  // Start conversation on mount
  useEffect(() => {
    const init = async () => {
      const convo = await base44.agents.createConversation({
        agent_name: 'review_collector',
        metadata: { name: `Review — ${customerName}`, customer_name: customerName, vehicle, service },
      });
      setConversation(convo);

      // Seed the agent with customer context via a hidden system-style first message
      const contextMsg = `Customer name: ${customerName}. Vehicle: ${vehicle}. Service received: ${service}.`;
      await base44.agents.addMessage(convo, { role: 'user', content: contextMsg });
      setStarted(true);
    };
    init();
  }, []);

  // Subscribe to live message updates
  useEffect(() => {
    if (!conversation) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [conversation]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation) return;
    setSending(true);
    const text = input;
    setInput('');
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Filter out the hidden context seed message from the UI
  const visibleMessages = messages.filter((m, i) => !(i === 0 && m.role === 'user'));

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter" style={{ maxHeight: '100dvh' }}>
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-3 bg-white">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/2e6205b93_A9FC99FF-3B15-4B74-89A3-67498ADDFCF3.png"
            alt="920 Detailing logo"
            className="h-8 w-auto"
          />
        </a>
        <div>
          <p className="font-inter font-black text-ink-black text-sm" style={{ letterSpacing: '-0.02em' }}>Leave a Review</p>
          <p className="small-caps-label text-tech-grey" style={{ fontSize: '0.6rem' }}>920 Detailing · Kewaunee, Wisconsin</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" style={{ minHeight: 0 }}>
        {!started && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 text-sm text-ink-black max-w-xs" style={{ lineHeight: 1.6 }}>
              Starting up…
            </div>
          </div>
        )}

        {visibleMessages.map((msg, i) => {
          const isUser = msg.role === 'user';
          if (!msg.content && !msg.tool_calls?.length) return null;
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-3 text-sm max-w-xs md:max-w-md ${isUser ? 'bg-ink-black text-white' : 'bg-muted text-ink-black border border-border'}`}
                style={{ lineHeight: 1.65, borderRadius: 0 }}
              >
                {isUser ? (
                  <p>{msg.content}</p>
                ) : (
                  <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-4 bg-white flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message…"
          rows={1}
          disabled={!started || sending}
          className="flex-1 input-underline resize-none text-sm"
          style={{ minHeight: 42, maxHeight: 120 }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending || !started}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.75rem', minHeight: 44 }}
        >
          {sending ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}