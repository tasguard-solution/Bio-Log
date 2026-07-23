import React, { useEffect, useState } from 'react';

interface DnaProgressBarProps {
  percent: number; // 0 to 100
  level: number;
}

export function DnaProgressBar({ percent, level }: DnaProgressBarProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    // Add a slight delay for entry animation
    const timer = setTimeout(() => {
      setAnimatedPercent(percent);
    }, 300);
    return () => clearTimeout(timer);
  }, [percent]);

  // Create an SVG DNA strand
  // We'll use a viewBox of 0 0 400 40
  // Sine waves for the two backbones
  const width = 400;
  const height = 40;
  
  const generatePath = (phaseShift: number) => {
    const points = [];
    for (let x = 0; x <= width; x += 5) {
      // Scale x to [0, 4*PI] to get two full waves across the width
      const angle = (x / width) * Math.PI * 4 + phaseShift;
      const y = height / 2 + Math.sin(angle) * (height / 2 - 4);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const path1 = generatePath(0);
  const path2 = generatePath(Math.PI);

  // Generate rungs
  const rungs = [];
  for (let x = 15; x < width; x += 20) {
    const angle = (x / width) * Math.PI * 4;
    const y1 = height / 2 + Math.sin(angle) * (height / 2 - 4);
    const y2 = height / 2 + Math.sin(angle + Math.PI) * (height / 2 - 4);
    rungs.push({ x, y1, y2 });
  }

  return (
    <div className="w-full relative py-2">
      <div className="flex justify-between items-end mb-2">
        <span className="font-serif text-sm font-bold text-on-surface">Level {level}</span>
        <span className="text-xs font-mono text-primary font-medium">{Math.round(animatedPercent)}% to Next Level</span>
      </div>
      
      <div className="relative w-full h-10 rounded-full overflow-hidden bg-surface-container-high/50 border border-outline-variant/20 shadow-inner">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full drop-shadow-md" 
          preserveAspectRatio="none"
        >
          {/* Base Unfilled DNA */}
          {rungs.map((rung, i) => (
            <line 
              key={`unfilled-rung-${i}`}
              x1={rung.x} y1={rung.y1} x2={rung.x} y2={rung.y2}
              stroke="var(--color-outline-variant)" strokeWidth="2" strokeOpacity="0.3"
            />
          ))}
          <path d={path1} fill="none" stroke="var(--color-outline-variant)" strokeWidth="2" strokeOpacity="0.3" />
          <path d={path2} fill="none" stroke="var(--color-outline-variant)" strokeWidth="2" strokeOpacity="0.3" />

          {/* Filled DNA with clipPath */}
          <clipPath id="progress-clip">
            <rect 
              x="0" y="0" 
              width={`${(animatedPercent / 100) * width}`} 
              height={height} 
              className="transition-all duration-1000 ease-out"
            />
          </clipPath>

          <g clipPath="url(#progress-clip)">
            {/* Filled rungs */}
            {rungs.map((rung, i) => {
              // Color gradient across the strand
              const color = `hsl(142, 70%, ${40 + (rung.x / width) * 20}%)`; // Greenish
              return (
                <line 
                  key={`filled-rung-${i}`}
                  x1={rung.x} y1={rung.y1} x2={rung.x} y2={rung.y2}
                  stroke={color} strokeWidth="3"
                  className="transition-colors duration-500"
                />
              );
            })}
            
            {/* Filled backbones */}
            <path d={path1} fill="none" stroke="var(--color-primary)" strokeWidth="3" className="drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
            <path d={path2} fill="none" stroke="var(--color-secondary)" strokeWidth="3" className="drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
          </g>
        </svg>
      </div>
    </div>
  );
}
