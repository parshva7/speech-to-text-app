import React, { useEffect, useRef } from "react";

// Realistic audio waveform animation
const HeartbeatWave = ({ active }) => {
  const barsRef = useRef([]);

  useEffect(() => {
    let anim;
    function animate() {
      barsRef.current.forEach((bar, i) => {
        if (bar) {
          const t = Date.now() / 200;
          // Create more realistic audio wave pattern with varied amplitudes
          const frequencies = [0.8, 1.2, 1.5, 1.8, 2.0, 1.8, 1.5, 1.2, 0.8, 0.5];
          const baseAmplitude = [6, 12, 18, 24, 28, 24, 18, 12, 6, 4];
          
          // Multiple sine waves for complex motion
          const wave1 = Math.sin(t + i * 0.5) * baseAmplitude[i];
          const wave2 = Math.sin(t * frequencies[i] + i) * (baseAmplitude[i] * 0.5);
          const wave3 = Math.sin(t * 2 + i * 0.3) * (baseAmplitude[i] * 0.3);
          
          // Combine waves for realistic audio visualization
          const combinedWave = wave1 + wave2 + wave3;
          const height = Math.max(4, Math.abs(combinedWave) + 8);
          
          // Center the bars
          const yPos = 40 - height / 2;
          
          bar.setAttribute("y", yPos);
          bar.setAttribute("height", height);
          
          // Subtle opacity variation for depth
          const opacity = 0.7 + Math.abs(Math.sin(t + i * 0.2)) * 0.3;
          bar.setAttribute("opacity", opacity);
        }
      });
      if (active) anim = requestAnimationFrame(animate);
    }
    if (active) animate();
    return () => anim && cancelAnimationFrame(anim);
  }, [active]);

  return (
    <svg width={120} height={80} style={{ display: "inline-block", verticalAlign: "middle" }}>
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {[...Array(10)].map((_, i) => (
        <rect
          key={i}
          ref={el => barsRef.current[i] = el}
          x={i * 12}
          y={35}
          width={8}
          height={10}
          rx={2}
          fill="url(#waveGradient)"
          opacity={0.8}
        />
      ))}
    </svg>
  );
};

export default HeartbeatWave;
