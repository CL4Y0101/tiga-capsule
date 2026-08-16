"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useAppStore } from "../store/useAppStore";
import { useAudio } from "../hooks/useAudio";
import id from "../locales/id.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import { Sparkles, Volume2, VolumeX, Sun, Moon } from "lucide-react";
import TimelineView from "../components/timeline/TimelineView";
import GalleryView from "../components/gallery/GalleryView";
import MessagesView from "../components/messages/MessagesView";
import CapsuleBuddy from "../components/chatbot/CapsuleBuddy";
import FinalGoodbye from "../components/ui/FinalGoodbye";

const MemoryWorld = dynamic(() => import("../components/3d/MemoryWorld"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center bg-capsule-softBlue text-capsule-navy font-bold">...</div>
});

const translations = { id, en, ko };

export default function LandingPage() {
  const { language, setLanguage, isAudioOn, toggleAudio, hasEnteredCapsule, enterCapsule, activeView, isEnding, isDarkMode, toggleTheme } = useAppStore();
  const { playSfx } = useAudio(); 
  
  const t = translations[language].home;
  const tWorld = translations[language].world;

  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const bgmRef = useRef<HTMLAudioElement>(null); 

  useEffect(() => {
    if (bgmRef.current) {
      if (isAudioOn && !isEnding) {
        bgmRef.current.volume = 1;
        bgmRef.current.play().catch(() => {});
      } else if (isEnding) {
        gsap.to(bgmRef.current, { volume: 0, duration: 3, onComplete: () => bgmRef.current?.pause() });
      } else {
        bgmRef.current.pause();
      }
    }
  }, [isAudioOn, isEnding]);

  useEffect(() => {
    if (hasEnteredCapsule) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(text1Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
        .fromTo(text2Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2 }, "+=0.8")
        .fromTo(text3Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2 }, "+=0.8")
        .fromTo(btnRef.current, { opacity: 0, scale: 0.9, pointerEvents: "none" }, { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.8, ease: "back.out(1.7)" }, "+=0.5");
    }, containerRef);
    return () => ctx.revert();
  }, [hasEnteredCapsule]);

  const handleEnter = () => {
    playSfx('click'); 
    gsap.to(containerRef.current, { opacity: 0, scale: 1.05, duration: 1, ease: "power2.inOut", onComplete: () => enterCapsule() });
  };

  const handleToggleAudio = () => {
    if (!isAudioOn) playSfx('click');
    toggleAudio();
  };

  return (
    <>
      <audio ref={bgmRef} src="/audio/bgm.mp3" loop preload="auto" />

      {hasEnteredCapsule ? (
        <main key="3d-world" className="fixed inset-0 w-full h-full overflow-hidden bg-capsule-softBlue opacity-100">
          
          {!isEnding && (
            <>
              <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-capsule-navy shadow-pixel-sm text-capsule-navy font-bold text-xs sm:text-sm animate-pulse">
                  {tWorld.instruction}
                </div>
              </div>
              
              <div className="absolute top-6 right-6 z-10 flex gap-2">
                <button onClick={() => { playSfx('click'); toggleTheme(); }} className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border-2 border-capsule-navy shadow-pixel-sm text-capsule-navy hover:bg-capsule-pastelYellow transition-colors flex items-center justify-center">
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button onClick={handleToggleAudio} className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border-2 border-capsule-navy shadow-pixel-sm text-capsule-navy hover:bg-capsule-pastelYellow transition-colors flex items-center justify-center">
                  {isAudioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button 
                  onClick={() => { playSfx('click'); window.location.reload(); }}
                  className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl border-2 border-capsule-navy shadow-pixel-sm text-capsule-navy font-bold text-xs hover:bg-capsule-mutedPink transition-colors"
                >
                  {tWorld.close}
                </button>
              </div>

              {activeView === "timeline" && <TimelineView />}
              {activeView === "gallery" && <GalleryView />}
              {activeView === "messages" && <MessagesView />}
              <CapsuleBuddy />
            </>
          )}

          {isEnding && <FinalGoodbye />}
          <MemoryWorld />
        </main>
      ) : (
        <main key="landing-page" ref={containerRef} className="fixed inset-0 flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden bg-capsule-cream">
          <header className="w-full max-w-4xl flex justify-between items-center z-10">
            <div className="flex gap-2 bg-white/70 backdrop-blur-sm p-1.5 rounded-xl border-2 border-capsule-navy shadow-pixel-sm">
              {(["id", "en", "ko"] as const).map((lang) => (
                <button 
                  key={lang} 
                  onClick={() => { playSfx('click'); setLanguage(lang); }} 
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${language === lang ? "bg-capsule-pastelYellow text-capsule-navy shadow-inner" : "text-capsule-purple hover:bg-black/5"}`}
                >
                  {lang === "id" ? "🇮🇩 ID" : lang === "en" ? "🇺🇸 EN" : "🇰🇷 한국어"}
                </button>
              ))}
            </div>
            <button onClick={handleToggleAudio} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 backdrop-blur-sm text-xs font-bold rounded-xl border-2 border-capsule-navy shadow-pixel-sm hover:translate-y-0.5 transition-all text-capsule-navy">
              {isAudioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isAudioOn ? "♫ ON" : "♫ OFF"}</span>
            </button>
          </header>

          <div className="flex flex-col items-center text-center max-w-xl my-auto z-10 px-4 space-y-6">
            <div className="space-y-4">
              <h2 ref={text1Ref} className="text-lg sm:text-xl font-medium text-capsule-purple tracking-wide opacity-0">{t.title}</h2>
              <h1 ref={text2Ref} className="text-2xl sm:text-4xl font-extrabold text-capsule-navy tracking-tight opacity-0">{t.subtitle}</h1>
              <p ref={text3Ref} className="text-base sm:text-lg text-capsule-purple italic opacity-0">{t.line3}</p>
            </div>
            <button 
              ref={btnRef} 
              onClick={handleEnter} 
              className="opacity-0 pointer-events-none group relative inline-flex items-center gap-3 px-8 py-4 bg-capsule-pastelYellow text-capsule-navy font-black text-sm sm:text-base tracking-wider rounded-2xl border-2 border-capsule-navy shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pixel-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <Sparkles className="w-5 h-5 text-capsule-navy group-hover:rotate-12 transition-transform" />
              <span>{t.enterBtn}</span>
            </button>
          </div>
          <footer className="text-xs text-capsule-purple/70 tracking-wider z-10 absolute bottom-6">✦ a digital memory capsule ✦</footer>
        </main>
      )}
    </>
  );
}