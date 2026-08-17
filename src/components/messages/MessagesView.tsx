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

// Kamus lokal khusus untuk UI Messages agar bisa 3 bahasa
const localUi = {
  id: {
    subtitle: "Tinggalkan pesan untuk Tim Tiga. Tidak perlu mendaftar! 💌",
    sealed: "Pesan Tersegel!",
    sealedDesc: "Pesanmu telah disimpan dengan aman di dalam kapsul.",
    namePlaceholder: "Nama / Inisial",
    msgPlaceholder: "Tulis pesan manismu di sini...",
    sendBtn: "KIRIM PESAN",
    empty: "Belum ada pesan. Jadilah yang pertama meninggalkan pesan! ✨",
    sending: "MENGIRIM...",
    errorConn: "Terjadi kesalahan koneksi ke server.",
    errorSend: "Gagal mengirim pesan"
  },
  en: {
    subtitle: "Leave a message for Tim Tiga. No registration needed! 💌",
    sealed: "Message Sealed!",
    sealedDesc: "Your message has been safely stored in the capsule.",
    namePlaceholder: "Name / Initials",
    msgPlaceholder: "Write your sweet message here...",
    sendBtn: "SEND MESSAGE",
    empty: "No messages yet. Be the first to leave one! ✨",
    sending: "SENDING...",
    errorConn: "Connection error to the server.",
    errorSend: "Failed to send message"
  },
  ko: {
    subtitle: "팀 티가에게 메시지를 남겨주세요. 가입이 필요 없습니다! 💌",
    sealed: "메시지 보관 완료!",
    sealedDesc: "메시지가 캡슐에 안전하게 저장되었습니다.",
    namePlaceholder: "이름 / 이니셜",
    msgPlaceholder: "여기에 따뜻한 메시지를 적어주세요...",
    sendBtn: "메시지 보내기",
    empty: "아직 메시지가 없습니다. 첫 번째로 메시지를 남겨보세요! ✨",
    sending: "전송 중...",
    errorConn: "서버 연결 오류가 발생했습니다.",
    errorSend: "메시지 전송 실패"
  }
};

export default function MessagesView() {
  const { setActiveView, language } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const t = translations[language].world;
  const ui = localUi[language]; // Gunakan bahasa yang aktif
  
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // WAJIB bernama NEXT_PUBLIC_API_URL di Cloudflare environment
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
            alert(newMsg.error || ui.errorSend);
            setIsSending(false);
            gsap.to(formRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.3 });
          }
        } catch (error) {
          console.error("Gagal terhubung ke server:", error);
          alert(ui.errorConn);
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
            {ui.subtitle}
          </p>

          <div className="relative min-h-[250px]">
            {showSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-capsule-pastelYellow border-2 border-capsule-navy rounded-full flex items-center justify-center mb-4 shadow-pixel">
                  <Mail className="text-capsule-navy w-8 h-8" />
                </div>
                <h3 className="font-bold text-capsule-navy text-lg">{ui.sealed}</h3>
                <p className="text-sm text-capsule-purple">{ui.sealedDesc}</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder={ui.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-3 bg-white border-2 border-capsule-navy rounded-xl text-capsule-navy font-medium outline-none focus:bg-capsule-softBlue/10 transition-colors"
                  disabled={isSending}
                />
                <textarea
                  placeholder={ui.msgPlaceholder}
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
                  <span>{isSending ? ui.sending : ui.sendBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 flex-1 bg-capsule-softBlue/20 border-2 border-capsule-navy/20 rounded-2xl p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-capsule-purple/60 text-sm font-medium">
              {ui.empty}
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