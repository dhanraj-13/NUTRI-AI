import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import type { ChatMessage } from '../../types';

const SUGGESTED_PROMPTS = [
  'What should I eat for better focus?',
  'Analyze my protein intake today',
  'Best foods for hydration?',
  'Why do I feel low energy after lunch?',
  'Suggest a high-protein breakfast',
  'Foods that improve sleep quality',
  'What is a good meal for weight management?',
  'How can I improve my nutrition score?',
];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: isUser
            ? 'linear-gradient(135deg,#18B89A,#0E9B81)'
            : 'rgba(24,184,154,0.1)',
          border: isUser ? 'none' : '1px solid rgba(24,184,154,0.2)',
        }}
      >
        {isUser
          ? <User size={14} color="#fff" />
          : <Bot size={14} style={{ color: '#18B89A' }} />
        }
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '72%' }}>
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, rgba(24,184,154,0.2), rgba(14,155,129,0.15))'
              : 'rgba(20,31,24,0.8)',
            border: isUser
              ? '1px solid rgba(24,184,154,0.25)'
              : '1px solid rgba(24,184,154,0.12)',
            borderBottomRightRadius: isUser ? 6 : 16,
            borderBottomLeftRadius: isUser ? 16 : 6,
          }}
        >
          {msg.isStreaming && !msg.content ? (
            <div className="flex items-center gap-1.5 py-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#E8F2ED' }}>
              {msg.content}
              {msg.isStreaming && <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ background: '#18B89A', verticalAlign: 'middle' }} />}
            </p>
          )}
        </div>
        <p className="text-xs mt-1 px-1" style={{ color: '#5A7A68', textAlign: isUser ? 'right' : 'left' }}>
          {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export function AIChatPage() {
  const { toast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadHistory = useCallback(async () => {
    const res = await api.get<{ history?: ChatMessage[] }>('/api/v1/memory/history');
    if (res.data?.history) setHistory(res.data.history);
  }, []);

  useEffect(() => {
    loadHistory();
    // Welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Nutrition Intelligence Coach, powered by RAG retrieval. I can help you with meal suggestions, nutrition analysis, hydration tips, and food-performance correlations. What would you like to know?',
      timestamp: new Date().toISOString(),
    }]);
  }, [loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const aiMsgId = `a-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setIsStreaming(true);

    await api.stream(
      '/api/v1/ai/chat/stream',
      { message: text.trim(), top_k: 5 },
      (word) => {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, content: m.content + word } : m
        ));
      },
      () => {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, isStreaming: false } : m
        ));
        setIsStreaming(false);
        loadHistory();
      },
      (err) => {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: `I encountered an error: ${err}. Please check the backend connection.`, isStreaming: false }
            : m
        ));
        setIsStreaming(false);
        toast('error', 'AI Error', err);
      }
    );
  }, [isStreaming, loadHistory, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-screen lg:h-[calc(100vh-64px)] overflow-hidden pt-14 lg:pt-0">
      {/* Left panel — history (desktop) */}
      <div className="hidden xl:flex flex-col w-72 flex-shrink-0"
        style={{ background: 'rgba(10,15,12,0.6)', borderRight: '1px solid rgba(24,184,154,0.08)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid rgba(24,184,154,0.06)' }}>
          <h3 className="font-display font-semibold text-sm" style={{ color: '#E8F2ED' }}>Conversation History</h3>
          <p className="text-xs mt-1" style={{ color: '#5A7A68' }}>AI remembers your patterns</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {history.length > 0 ? history.filter(h => h.role === 'user').slice(0, 10).map((h, i) => (
            <button key={i} onClick={() => sendMessage(h.content)}
              className="w-full text-left px-3 py-2.5 rounded-xl transition-all hover:bg-white/[0.03]"
              style={{ border: '1px solid rgba(24,184,154,0.06)' }}>
              <p className="text-xs truncate" style={{ color: '#9AB8A8' }}>{h.content}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5A7A68' }}>
                {new Date(h.timestamp).toLocaleDateString()}
              </p>
            </button>
          )) : (
            <div className="py-8 text-center">
              <p className="text-xs" style={{ color: '#5A7A68' }}>No history yet</p>
            </div>
          )}
        </div>

        <div className="p-3" style={{ borderTop: '1px solid rgba(24,184,154,0.06)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(24,184,154,0.05)' }}>
            <Sparkles size={13} style={{ color: '#18B89A', flexShrink: 0 }} />
            <p className="text-xs" style={{ color: '#9AB8A8' }}>RAG-Powered Nutrition AI</p>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
          style={{ background: 'rgba(6,10,8,0.6)', borderBottom: '1px solid rgba(24,184,154,0.08)', backdropFilter: 'blur(20px)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-glow"
            style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)' }}>
            <Bot size={18} style={{ color: '#18B89A' }} />
          </div>
          <div>
            <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>NUTRI AI Coach</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#8FD081' }} />
              <p className="text-xs" style={{ color: '#9AB8A8' }}>
                {isStreaming ? 'Thinking...' : 'RAG-Powered Nutrition Intelligence'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 no-scrollbar">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="px-4 md:px-8 pb-3">
            <p className="text-xs mb-2" style={{ color: '#5A7A68' }}>Suggested questions</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {SUGGESTED_PROMPTS.slice(0, 5).map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: 'rgba(24,184,154,0.06)', border: '1px solid rgba(24,184,154,0.14)', color: '#9AB8A8' }}>
                  {p} <ChevronRight size={12} style={{ color: '#18B89A' }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested prompts strip (when chatting) */}
        {messages.length > 1 && (
          <div className="px-4 md:px-8 pb-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTED_PROMPTS.slice(0, 4).map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all hover:bg-white/[0.04]"
                  style={{ background: 'rgba(24,184,154,0.04)', border: '1px solid rgba(24,184,154,0.1)', color: '#5A7A68' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="px-4 md:px-8 pb-4 md:pb-6 flex-shrink-0">
          <div className="flex items-end gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(15,23,18,0.8)', border: '1px solid rgba(24,184,154,0.15)', backdropFilter: 'blur(20px)' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI nutrition coach..."
              rows={1}
              disabled={isStreaming}
              className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
              style={{
                color: '#E8F2ED',
                maxHeight: 120,
                fontFamily: '"DM Sans", sans-serif',
              }}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: input.trim() && !isStreaming
                  ? 'linear-gradient(135deg,#18B89A,#0E9B81)'
                  : 'rgba(255,255,255,0.05)',
                color: input.trim() && !isStreaming ? '#fff' : '#5A7A68',
                transform: input.trim() ? 'scale(1)' : 'scale(0.95)',
              }}
            >
              <Send size={15} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-xs" style={{ color: '#5A7A68' }}>Enter to send · Shift+Enter for new line</p>
            <div className="flex items-center gap-1">
              <Clock size={10} style={{ color: '#5A7A68' }} />
              <p className="text-xs" style={{ color: '#5A7A68' }}>{input.length} chars</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
