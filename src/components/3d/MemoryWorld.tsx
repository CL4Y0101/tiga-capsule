"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Html } from "@react-three/drei";
import { Suspense, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAudio } from "../../hooks/useAudio";
import id from "../../locales/id.json";
import en from "../../locales/en.json";
import ko from "../../locales/ko.json";

const translations = { id, en, ko };

function PixelCloud({ position, isNight }: { position: [number, number, number], isNight: boolean }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[1, 0.6, 0.6]} /><meshStandardMaterial color={isNight ? "#4a5568" : "white"} /></mesh>
      <mesh position={[0.4, 0.4, 0]}><boxGeometry args={[0.8, 0.6, 0.6]} /><meshStandardMaterial color={isNight ? "#4a5568" : "white"} /></mesh>
    </group>
  );
}

function PixelTree({ position, isNight }: { position: [number, number, number], isNight: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.5, 0]}><boxGeometry args={[0.3, 0.8, 0.3]} /><meshStandardMaterial color={isNight ? "#4a3728" : "#8B4513"} /></mesh>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={isNight ? "#1a3a17" : "#2d5a27"} /></mesh>
    </group>
  );
}

function MemoryObject({ position, color, name, onClick, isEndingObj = false }: any) {
  const [hovered, setHovered] = useState(false);
  const { playSfx } = useAudio();

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={isEndingObj ? 2 : 1}>
      <mesh
        position={position}
        onClick={(e) => { e.stopPropagation(); playSfx('click'); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!hovered) playSfx('hover'); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
        scale={hovered ? 1.2 : 1}
      >
        {isEndingObj ? <octahedronGeometry args={[1, 0]} /> : <boxGeometry args={[1.2, 1.2, 1.2]} />}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : (isEndingObj ? 0.5 : 0.1)} />
        {hovered && (
          <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-capsule-navy shadow-pixel-sm text-capsule-navy font-bold text-xs whitespace-nowrap pointer-events-none select-none">{name}</div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

export default function MemoryWorld() {
  const { setActiveView, language, triggerEnding, isDarkMode } = useAppStore();
  const t = translations[language].world;

  return (
    <div className={`absolute inset-0 w-full h-full z-0 transition-colors duration-1000 ${isDarkMode ? 'bg-indigo-950' : 'bg-capsule-softBlue'}`}>
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <color attach="background" args={[isDarkMode ? "#1e1b4b" : "#A1C8E9"]} />
        <ambientLight intensity={isDarkMode ? 0.2 : 0.8} />
        <directionalLight position={[5, 10, 5]} intensity={isDarkMode ? 0.3 : 1} castShadow />
        
        <Suspense fallback={null}>
          <Stars radius={50} depth={50} count={isDarkMode ? 5000 : 1500} factor={4} saturation={0} fade speed={1.5} />

          <PixelCloud position={[-4, 3, -5]} isNight={isDarkMode} />
          <PixelCloud position={[3, 4, -4]} isNight={isDarkMode} />
          <PixelTree position={[-5, -1, -2]} isNight={isDarkMode} />
          <PixelTree position={[5, -1, -2]} isNight={isDarkMode} />

          <MemoryObject position={[-3, 0, 0]} color="#FDEBA6" name={t.objTimeline} onClick={() => setActiveView('timeline')} />
          <MemoryObject position={[0, 0, 0]} color="#F4AAB9" name={t.objGallery} onClick={() => setActiveView('gallery')} />
          <MemoryObject position={[3, 0, 0]} color="#CDB4DB" name={t.objMessages} onClick={() => setActiveView('messages')} />
          <MemoryObject position={[0, 3.5, -2]} color="#FFFFFF" name={t.objGoodbye} onClick={triggerEnding} isEndingObj={true} />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}