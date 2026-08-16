"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStore } from "../../store/useAppStore";
import { getGalleryPhotos } from "../../data/gallery";
import { X, ZoomIn } from "lucide-react";
import idLoc from "../../locales/id.json";
import enLoc from "../../locales/en.json";
import koLoc from "../../locales/ko.json";

const translations = { id: idLoc, en: enLoc, ko: koLoc };

export default function GalleryView() {
  const { setActiveView, language } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const galleryPhotos = getGalleryPhotos(language);
  const t = translations[language].world;
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" });
      gsap.fromTo(photosRef.current, { opacity: 0, y: -30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const closeGallery = () => {
    gsap.to(containerRef.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.3, ease: "power2.in", onComplete: () => setActiveView("3d") });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
      <div ref={containerRef} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-capsule-cream border-[3px] border-capsule-navy rounded-3xl shadow-pixel p-6 sm:p-8 custom-scrollbar">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-capsule-cream/90 backdrop-blur-md py-2 z-20 border-b-2 border-capsule-purple/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-capsule-navy tracking-tight">{t.titleGallery}</h2>
          <button onClick={closeGallery} className="p-2 bg-capsule-mutedPink text-capsule-navy rounded-xl border-2 border-capsule-navy shadow-pixel-sm hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 pb-8">
          {galleryPhotos.map((photo: any, index: number) => (
            <div key={photo.id} ref={(el) => { photosRef.current[index] = el; }} onClick={() => setSelectedPhoto(photo)} className={`group relative bg-white p-3 sm:p-4 pb-8 sm:pb-12 rounded-sm border-2 border-capsule-navy shadow-pixel-sm hover:shadow-pixel hover:-translate-y-2 hover:z-10 transition-all cursor-pointer ${photo.tilt}`}>
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 overflow-hidden border-2 border-capsule-navy/10 bg-gray-200">
                <img src={photo.url} alt={photo.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn className="text-white w-10 h-10 drop-shadow-md" /></div>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center font-medium text-capsule-navy text-sm px-2">{photo.caption}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            <button onClick={() => setSelectedPhoto(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-capsule-mutedPink transition-colors"><X size={32} /></button>
            <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full max-h-[75vh] object-contain rounded-xl border-4 border-white shadow-2xl" />
            <p className="mt-6 text-white text-lg font-medium text-center bg-black/50 px-6 py-2 rounded-full">{selectedPhoto.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}