"use client";

import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useAudio = () => {
  const isAudioOn = useAppStore((state) => state.isAudioOn);

  const playSfx = useCallback((type: 'click' | 'hover') => {
    // Jika audio sedang di-mute, jangan bunyikan apa-apa
    if (!isAudioOn) return;

    try {
      const audio = new Audio(`/audio/${type}.mp3`);
      // Atur volume agar suara hover lebih kecil dari suara klik
      audio.volume = type === 'hover' ? 0.2 : 0.6;
      audio.play().catch((e) => {
        // Abaikan error jika file belum ada atau diblokir browser
        console.warn(`SFX ${type} tidak dapat diputar. Pastikan file /public/audio/${type}.mp3 sudah ada.`);
      });
    } catch (error) {
      // Catch error aman
    }
  }, [isAudioOn]);

  return { playSfx };
};