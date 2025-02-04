import React from 'react';

export default function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        >
          <span className="text-red-500 opacity-30" style={{ fontSize: `${20 + Math.random() * 20}px` }}>
            ❤️
          </span>
        </div>
      ))}
    </div>
  );
}