"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "../../store/useAppStore";
import idLoc from "../../locales/id.json";
import enLoc from "../../locales/en.json";
import koLoc from "../../locales/ko.json";
import { Sparkles } from "lucide-react";

const translations = { id: idLoc, en: enLoc, ko: koLoc };

export default function FinalGoodbye() {
  const { language, resetCapsule } = useAppStore();
  const t = translations[language].ending;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const text1 = useRef<HTMLParagraphElement>(null);
  const text2 = useRef<HTMLParagraphElement>(null);
  const text3 = useRef<HTMLParagraphElement>(null);
  const text4 = useRef<HTMLParagraphElement>(null);
  const finalTitle = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Layar pelan-pelan jadi hitam total
      tl.to(containerRef.current, { backgroundColor: "#0f172a", duration: 3, ease: "power2.inOut" })
        
        // Teks 1
        .to(text1.current, { opacity: 1, y: 0, duration: 2 })
        .to(text1.current, { opacity: 0, y: -10, duration: 2, delay: 1 })
        
        // Teks 2
        .to(text2.current, { opacity: 1, y: 0, duration: 2 })
        .to(text2.current, { opacity: 0, y: -10, duration: 2, delay: 1 })
        
        // Teks 3 & 4
        .to(text3.current, { opacity: 1, y: 0, duration: 2 })
        .to(text4.current, { opacity: 1, y: 0, duration: 2, delay: 0.5 })
        .to([text3.current, text4.current], { opacity: 0, y: -10, duration: 2, delay: 1.5 })
        
        // Final Title & Button
        .to(finalTitle.current, { opacity: 1, scale: 1, duration: 2, ease: "back.out(1.2)" })
        // MENGUBAH POINTER EVENTS AGAR BISA DIKLIK SAAT MUNCUL
        .to(btnRef.current, { opacity: 1, pointerEvents: "auto", duration: 1 }, "+=1");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-transparent pointer-events-auto">
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <p ref={text1} className="text-xl sm:text-2xl text-white font-medium opacity-0 translate-y-4 absolute">{t.line1}</p>
        <p ref={text2} className="text-xl sm:text-2xl text-white font-medium opacity-0 translate-y-4 absolute">{t.line2}</p>
        
        <div className="flex flex-col items-center absolute">
          <p ref={text3} className="text-xl sm:text-2xl text-white font-medium opacity-0 translate-y-4 mb-2">{t.line3}</p>
          <p ref={text4} className="text-xl sm:text-2xl text-capsule-softBlue font-medium opacity-0 translate-y-4">{t.line4}</p>
        </div>

        <div className="flex flex-col items-center absolute">
          <h1 ref={finalTitle} className="text-3xl sm:text-5xl font-black text-capsule-pastelYellow tracking-wider opacity-0 scale-90 mb-12 text-center drop-shadow-[0_0_15px_rgba(253,235,166,0.5)]">
            {t.final}
          </h1>
          <button 
            ref={btnRef}
            onClick={resetCapsule}
            // MENAMBAHKAN POINTER-EVENTS-NONE DI AWAL
            className="opacity-0 pointer-events-none group relative inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-900 font-bold text-sm tracking-wider rounded-xl hover:bg-capsule-pastelYellow transition-colors"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
}