
import React, { useEffect, useState } from 'react';

const HeartBackground: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-20), // Keep max 20 hearts
        {
          id: Date.now(),
          left: Math.random() * 100,
          duration: 5 + Math.random() * 10,
          size: 10 + Math.random() * 30,
        },
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-particle text-rose-300 opacity-60"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
            bottom: '-50px',
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default HeartBackground;
