"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

type Message = { sender: 'user' | 'buddy', text: string };

export default function CapsuleBuddy() {
  const { language } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sapaan awal diubah menggunakan nama TIGA
  const getGreeting = (lang: string) => {
    if (lang === 'en') return "Hi! I'm TIGA, the capsule keeper. Wanna chat? ✨";
    if (lang === 'ko') return "안녕! 난 캡슐 지킴이 TIGA야. 무슨 이야기 할까? ✨";
    return "Halo Tim Tiga! Aku TIGA, penjaga kapsul ini. Ada kenangan yang mau diceritain? ✨";
  };

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'buddy', text: getGreeting(language) }
  ]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ sender: 'buddy', text: getGreeting(language) }]);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { sender: 'buddy', text: data.reply || data.error }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'buddy', text: "Zzz... TIGA kehilangan koneksi..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 h-96 bg-capsule-cream border-[3px] border-capsule-navy rounded-2xl shadow-pixel flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-capsule-lavender text-capsule-navy font-bold p-3 border-b-2 border-capsule-navy flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span>TIGA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3 bg-white/50">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[85%] p-2.5 rounded-xl border-2 border-capsule-navy text-sm font-medium ${msg.sender === 'user' ? 'bg-capsule-pastelYellow self-end rounded-br-none' : 'bg-white self-start rounded-bl-none'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white self-start rounded-xl rounded-bl-none border-2 border-capsule-navy p-2.5">
                <Loader2 size={16} className="animate-spin text-capsule-navy" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-2 bg-capsule-cream border-t-2 border-capsule-navy flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik sesuatu untuk TIGA..." 
              className="flex-1 bg-white border-2 border-capsule-navy rounded-lg px-2 py-1.5 text-sm outline-none focus:bg-capsule-softBlue/20"
            />
            <button type="submit" disabled={isLoading} className="bg-capsule-mutedPink border-2 border-capsule-navy p-2 rounded-lg hover:translate-y-[1px] disabled:opacity-50">
              <Send size={16} className="text-capsule-navy" />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-capsule-pastelYellow border-2 border-capsule-navy rounded-full shadow-pixel hover:translate-y-[2px] hover:shadow-pixel-sm active:shadow-none transition-all flex items-center justify-center"
      >
        {isOpen ? <X size={28} className="text-capsule-navy" /> : <MessageSquare size={28} className="text-capsule-navy" />}
      </button>
    </div>
  );
}