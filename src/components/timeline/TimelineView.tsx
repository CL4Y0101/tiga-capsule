"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "../../store/useAppStore";
import { getTimelineData } from "../../data/timeline";
import { X } from "lucide-react";
import idLoc from "../../locales/id.json";
import enLoc from "../../locales/en.json";
import koLoc from "../../locales/ko.json";

const translations = { id: idLoc, en: enLoc, ko: koLoc };

export default function TimelineView() {
  const { setActiveView, language } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const timelineData = getTimelineData(language);
  const t = translations[language].world;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" });
      gsap.fromTo(itemsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const closeTimeline = () => {
    gsap.to(containerRef.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.3, ease: "power2.in", onComplete: () => setActiveView("3d") });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
      <div ref={containerRef} className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-capsule-cream border-[3px] border-capsule-navy rounded-3xl shadow-pixel p-6 sm:p-8 custom-scrollbar">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-capsule-cream/90 backdrop-blur-md py-2 z-20 border-b-2 border-capsule-purple/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-capsule-navy tracking-tight">{t.titleTimeline}</h2>
          <button onClick={closeTimeline} className="p-2 bg-capsule-mutedPink text-capsule-navy rounded-xl border-2 border-capsule-navy shadow-pixel-sm hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-capsule-lavender">
          {timelineData.map((item: any, index: number) => (
            <div key={item.id} ref={(el) => { itemsRef.current[index] = el; }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-capsule-cream bg-capsule-pastelYellow text-capsule-navy shadow-pixel-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 sm:p-5 rounded-2xl border-2 border-capsule-navy bg-white shadow-pixel-sm hover:-translate-y-1 hover:shadow-pixel transition-all cursor-default">
                <div className="inline-block px-2 py-1 mb-2 text-xs font-bold bg-capsule-lavender/30 text-capsule-purple rounded-lg">{item.label}</div>
                <h4 className="font-bold text-lg text-capsule-navy mb-2">{item.title}</h4>
                <p className="text-sm text-capsule-navy/70 leading-relaxed font-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}