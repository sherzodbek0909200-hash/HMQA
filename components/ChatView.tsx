
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Salom! Men Ziyo AI yordamchisiman. Sizga qanday yordam bera olaman?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.chat(input, []);
      setMessages(prev => [...prev, {
        role: 'model',
        content: response || "Kechirasiz, xatolik yuz berdi.",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Xizmatda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
          <i className="fa-solid fa-comments"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Ziyo Chat</h2>
          <p className="text-slate-400 text-sm">Gemini 3 Flash-ga asoslangan</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-hide mb-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'glass text-slate-200 border-l-4 border-l-indigo-500'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className="text-[10px] mt-2 opacity-50 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="glass p-4 rounded-2xl flex gap-2 items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="glass p-2 rounded-2xl flex items-center gap-2 border-slate-700 sticky bottom-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Xabar yozing..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder-slate-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 transition-all"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatView;
