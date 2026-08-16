"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStore } from "../../store/useAppStore";
import { X, Send, Mail } from "lucide-react";
import idLoc from "../../locales/id.json";
import enLoc from "../../locales/en.json";
import koLoc from "../../locales/ko.json";

const translations = { id: idLoc, en: enLoc, ko: koLoc };

type PublicMessage = { id: number; name: string; text: string; date: string };

export default function MessagesView() {
  const { setActiveView, language } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const t = translations[language].world;
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Ambil URL backend dari env (Fly.io) atau fallback ke localhost untuk development
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 1. Ambil data pesan dari backend saat komponen dimuat
  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch((err) => console.error("Gagal memuat pesan dari server:", err));
  }, [API_URL]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const closeMessages = () => {
    gsap.to(containerRef.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.3, ease: "power2.in", onComplete: () => setActiveView("3d") });
  };

  // 2. Kirim pesan baru ke backend Fly.io
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSending(true);

    gsap.to(formRef.current, { 
      y: -50, opacity: 0, scale: 0.8, duration: 0.6, ease: "power2.in",
      onComplete: async () => {
        try {
          const res = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
          });
          
          const newMsg = await res.json();
          
          if (res.ok) {
            setMessages((prev) => [newMsg, ...prev]);
            setName("");
            setMessage("");
            setIsSending(false);
            setShowSuccess(true);
            
            setTimeout(() => {
              setShowSuccess(false);
              gsap.fromTo(formRef.current, { y: 20, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" });
            }, 3000);
          } else {
            alert(newMsg.error || "Gagal mengirim pesan");
            setIsSending(false);
            gsap.to(formRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.3 });
          }
        } catch (error) {
          console.error("Gagal terhubung ke server:", error);
          alert("Terjadi kesalahan koneksi ke server.");
          setIsSending(false);
          gsap.to(formRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.3 });
        }
      }
    });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
      <div ref={containerRef} className="relative w-full max-w-4xl h-[85vh] flex flex-col md:flex-row gap-6 bg-capsule-cream border-[3px] border-capsule-navy rounded-3xl shadow-pixel p-6 sm:p-8">
        
        <button onClick={closeMessages} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-capsule-mutedPink text-capsule-navy rounded-xl border-2 border-capsule-navy shadow-pixel-sm hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all z-20">
          <X size={24} strokeWidth={3} />
        </button>

        <div className="w-full md:w-1/3 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-capsule-navy tracking-tight mb-2">
            {t.titleMessages}
          </h2>
          <p className="text-sm text-capsule-purple font-medium mb-6">
            Tinggalkan pesan untuk Tim Tiga. Tidak perlu mendaftar! 💌
          </p>

          <div className="relative min-h-[250px]">
            {showSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-capsule-pastelYellow border-2 border-capsule-navy rounded-full flex items-center justify-center mb-4 shadow-pixel">
                  <Mail className="text-capsule-navy w-8 h-8" />
                </div>
                <h3 className="font-bold text-capsule-navy text-lg">Pesan Tersegel!</h3>
                <p className="text-sm text-capsule-purple">Pesanmu telah disimpan dengan aman di dalam kapsul.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nama / Inisial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-3 bg-white border-2 border-capsule-navy rounded-xl text-capsule-navy font-medium outline-none focus:bg-capsule-softBlue/10 transition-colors"
                  disabled={isSending}
                />
                <textarea
                  placeholder="Tulis pesan manismu di sini..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-2 border-capsule-navy rounded-xl text-capsule-navy font-medium outline-none focus:bg-capsule-softBlue/10 transition-colors resize-none custom-scrollbar"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending || !name.trim() || !message.trim()}
                  className="group relative flex justify-center items-center gap-2 w-full py-3 bg-capsule-pastelYellow text-capsule-navy font-black tracking-wider rounded-xl border-2 border-capsule-navy shadow-pixel hover:translate-y-[2px] hover:shadow-pixel-sm active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  <span>KIRIM PESAN</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 flex-1 bg-capsule-softBlue/20 border-2 border-capsule-navy/20 rounded-2xl p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-capsule-purple/60 text-sm font-medium">
              Belum ada pesan. Jadilah yang pertama meninggalkan pesan! ✨
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white p-4 rounded-2xl border-2 border-capsule-navy shadow-pixel-sm hover:-translate-y-1 transition-transform">
                  <p className="text-capsule-navy text-sm font-medium leading-relaxed mb-4">
                    "{msg.text}"
                  </p>
                  <div className="flex justify-between items-center text-xs font-bold text-capsule-purple">
                    <span>— {msg.name}</span>
                    <span className="opacity-50">{msg.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}