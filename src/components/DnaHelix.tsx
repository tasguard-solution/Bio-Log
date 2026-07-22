import { useEffect, useRef } from 'react';

const STRAND_COUNT = 40;
const HELIX_RADIUS = 60;
const VERTICAL_SPACING = 28;
const STRAND_OFFSET = Math.PI;
const RUNG_EVERY = 3;
const PARTICLE_COUNT = 50;

const BASE_PAIRS = ['A - T', 'T - A', 'C - G', 'G - C'];

export function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    let mouseX = -1000;
    let mouseY = -1000;

    let scanProgress = -1; // -1 means inactive
    let scanStartTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScan = () => {
      scanStartTime = performance.now();
      scanProgress = 0;
    };
    window.addEventListener('biometric-scan', handleScan);

    const PULSE_COLORS = [
      '56, 189, 248', // Cyan
      '248, 113, 113', // Light Red
      '250, 204, 21',  // Gold
      '74, 222, 128',  // Green
    ];
    let pulseColor = PULSE_COLORS[0];
    let pulseStartTime = -7000; // Start inactive

    const handleCanvasClick = (e: MouseEvent) => {
      if (e.target === canvas) {
        // Prevent re-triggering if already pulsing
        if (performance.now() - pulseStartTime > 7000) {
          pulseStartTime = performance.now();
          pulseColor = PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)];
        }
      }
    };
    window.addEventListener('click', handleCanvasClick);

    // Particles setup
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.2 + Math.random() * 0.5,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.3 + 0.1,
      ceiling: Math.random() * 5, // Gather right at the very top edge
      gathered: false,
      age: 0,
      lifetime: Math.random() * 300 + 200 // Frames to stay gathered before respawning
    }));

    // Assign base pair labels to rungs
    const rungLabels: string[] = [];
    for (let i = 0; i < STRAND_COUNT; i += RUNG_EVERY) {
      rungLabels.push(BASE_PAIRS[Math.floor(Math.random() * BASE_PAIRS.length)]);
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach(p => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
      });
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (currentTime: number) => {
      time += 0.004;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Pulse logic
      let pulseY = -1000;
      const pulseElapsed = currentTime - pulseStartTime;
      if (pulseElapsed < 7000) {
        const pulseCycleValue = pulseElapsed / 7000; // 0 to 1 over 7 seconds
        pulseY = h - (pulseCycleValue * h * 1.5); // Pulse moves from bottom to top
      }

      // Scan logic
      if (scanProgress >= 0) {
        const elapsed = currentTime - scanStartTime;
        if (elapsed > 1200) {
          scanProgress = -1;
        } else {
          scanProgress = elapsed / 1200; // 0 to 1
        }
      }
      const scanY = scanProgress >= 0 ? scanProgress * h : -1000;

      // Draw Particles
      particles.forEach(p => {
        if (!p.gathered) {
          p.y -= p.speed;
          if (p.y <= p.ceiling) {
            p.gathered = true;
            p.age = 0;
          }
        } else {
          p.age++;
          // Drift horizontally slightly while gathered
          p.x += Math.sin(time * 50 + p.radius) * 0.2;
          
          if (p.age > p.lifetime) {
            // Respawn at bottom
            p.y = h + 10;
            p.x = Math.random() * w;
            p.gathered = false;
            p.ceiling = Math.random() * 5; // Gather right at the very top edge
          }
        }

        // Particle brightness affected by pulse and scan
        let brightness = 1;
        if (Math.abs(p.y - pulseY) < 60) brightness = 2.5; // Shorter distance
        if (Math.abs(p.y - scanY) < 50) brightness = 3;

        // Fading out near the end of lifetime
        let currentAlpha = p.alpha;
        if (p.gathered) {
          const fadeStart = p.lifetime * 0.7;
          if (p.age > fadeStart) {
            currentAlpha = p.alpha * (1 - (p.age - fadeStart) / (p.lifetime - fadeStart));
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        if (Math.abs(p.y - scanY) < 50) {
          ctx.fillStyle = `rgba(34, 197, 94, ${currentAlpha * brightness})`; // Neon green for scan
        } else if (Math.abs(p.y - pulseY) < 60) {
          ctx.fillStyle = `rgba(${pulseColor}, ${currentAlpha * brightness})`; // Dynamic color for pulse
        } else {
          ctx.fillStyle = `rgba(82, 77, 69, ${currentAlpha * 1.5})`;
        }
        ctx.fill();
      });

      const centerX = w * 0.5;
      const startY = (h - STRAND_COUNT * VERTICAL_SPACING) / 2;

      // Magnetic Shift
      const getMagneticShift = (x: number, y: number) => {
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;
        if (dist < maxDist) {
          const force = Math.pow((maxDist - dist) / maxDist, 2);
          return { x: dx * force * 0.2, y: dy * force * 0.2, dist };
        }
        return { x: 0, y: 0, dist: 9999 };
      };

      const strand1: any[] = [];
      const strand2: any[] = [];
      const allPoints: any[] = [];

      for (let i = 0; i < STRAND_COUNT; i++) {
        const angle = time + (i * Math.PI) / 8;
        const y = startY + i * VERTICAL_SPACING;

        const p1x = centerX + Math.cos(angle) * HELIX_RADIUS;
        const p1z = Math.sin(angle);
        const shift1 = getMagneticShift(p1x, y);

        const p2x = centerX + Math.cos(angle + STRAND_OFFSET) * HELIX_RADIUS;
        const p2z = Math.sin(angle + STRAND_OFFSET);
        const shift2 = getMagneticShift(p2x, y);

        const node1 = { x: p1x + shift1.x, y: y + shift1.y, z: p1z, isStrand1: true };
        const node2 = { x: p2x + shift2.x, y: y + shift2.y, z: p2z, isStrand1: false };
        
        strand1.push(node1);
        strand2.push(node2);
        allPoints.push(node1, node2);
      }

      const segments: any[] = [];
      for (let i = 0; i < STRAND_COUNT - 1; i++) {
        segments.push({ p1: strand1[i], p2: strand1[i+1], color: 'rgba(43, 40, 36, 1)' });
        segments.push({ p1: strand2[i], p2: strand2[i+1], color: 'rgba(82, 77, 69, 1)' });
      }

      const rungs: any[] = [];
      let rungIndex = 0;
      for (let i = 0; i < STRAND_COUNT; i += RUNG_EVERY) {
        rungs.push({ p1: strand1[i], p2: strand2[i], label: rungLabels[rungIndex++] });
      }

      const baseAlpha = 0.12;
      const highlightAlpha = 0.25;

      const getElementColor = (baseColor: string, y: number, baseAlphaVal: number) => {
        let alpha = baseAlphaVal;
        
        if (Math.abs(y - scanY) < 60) {
          return `rgba(34, 197, 94, ${Math.min(alpha * 4, 1)})`; // Green scan
        } else if (Math.abs(y - pulseY) < 60) {
          const intensity = 1 - (Math.abs(y - pulseY) / 60);
          return `rgba(${pulseColor}, ${Math.min(alpha + (intensity * 0.5), 1)})`; // Dynamic pulse
        }
        
        return baseColor.replace('1)', `${alpha})`);
      };

      const drawSegments = (segs: any[]) => {
        for (const s of segs) {
          const avgZ = (s.p1.z + s.p2.z) / 2;
          const avgY = (s.p1.y + s.p2.y) / 2;
          const alpha = baseAlpha + (highlightAlpha - baseAlpha) * ((avgZ + 1) / 2);
          
          ctx.beginPath();
          ctx.moveTo(s.p1.x, s.p1.y);
          ctx.lineTo(s.p2.x, s.p2.y);
          ctx.strokeStyle = getElementColor(s.color, avgY, alpha);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      };

      const drawRungs = (rungsList: any[]) => {
        for (const r of rungsList) {
          const avgZ = (r.p1.z + r.p2.z) / 2;
          const alpha = baseAlpha * 0.8 + (highlightAlpha - baseAlpha) * 0.4 * ((avgZ + 1) / 2);
          
          const midX = (r.p1.x + r.p2.x) / 2;
          const midY = (r.p1.y + r.p2.y) / 2;

          ctx.beginPath();
          ctx.moveTo(r.p1.x, r.p1.y);
          ctx.lineTo(r.p2.x, r.p2.y);
          ctx.strokeStyle = getElementColor('rgba(133, 126, 114, 1)', midY, alpha);
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(midX, midY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = getElementColor('rgba(133, 126, 114, 1)', midY, alpha * 1.2);
          ctx.fill();

          // Interactive Decoding (Text)
          const dx = mouseX - midX;
          const dy = mouseY - midY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const opacity = 1 - (dist / 80);
            ctx.font = '10px monospace';
            ctx.fillStyle = `rgba(133, 126, 114, ${opacity})`;
            ctx.textAlign = 'center';
            // Slight floating offset
            ctx.fillText(r.label, midX, midY - 10);
          }
        }
      };

      const drawNodes = (points: any[]) => {
        for (const p of points) {
          const color = p.isStrand1 ? 'rgba(43, 40, 36, 1)' : 'rgba(82, 77, 69, 1)';
          const alpha = baseAlpha + (highlightAlpha - baseAlpha) * ((p.z + 1) / 2);
          const radius = 2 + p.z * 0.8;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(radius, 1), 0, Math.PI * 2);
          ctx.fillStyle = getElementColor(color, p.y, alpha * 1.5);
          ctx.fill();
        }
      };

      // Scan Laser Line
      if (scanProgress >= 0) {
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
        gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.4)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 20, w, 40);
        
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Back elements
      drawSegments(segments.filter(s => (s.p1.z + s.p2.z) / 2 < 0));
      drawRungs(rungs.filter(r => (r.p1.z + r.p2.z) / 2 < 0));
      drawNodes(allPoints.filter(p => p.z < 0));

      // Front elements
      drawSegments(segments.filter(s => (s.p1.z + s.p2.z) / 2 >= 0));
      drawRungs(rungs.filter(r => (r.p1.z + r.p2.z) / 2 >= 0));
      drawNodes(allPoints.filter(p => p.z >= 0));

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('biometric-scan', handleScan);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.8 }}
    />
  );
}
