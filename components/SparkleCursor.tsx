
import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
}

const SparkleCursor: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newSparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 10 + 5,
      };
      setSparkles((prev) => [...prev.slice(-15), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute text-yellow-400 animate-ping opacity-75"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default SparkleCursor;
