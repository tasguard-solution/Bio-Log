import { useEffect, useRef } from 'react';

const STRAND_COUNT = 40;
const HELIX_RADIUS = 60;
const VERTICAL_SPACING = 28;
const STRAND_OFFSET = Math.PI;
const RUNG_EVERY = 3;

export function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.004;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const centerX = w * 0.5;
      const startY = (h - STRAND_COUNT * VERTICAL_SPACING) / 2;

      const strand1: { x: number; y: number; z: number }[] = [];
      const strand2: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < STRAND_COUNT; i++) {
        const angle = time + (i * Math.PI) / 8;
        const y = startY + i * VERTICAL_SPACING;

        strand1.push({
          x: centerX + Math.cos(angle) * HELIX_RADIUS,
          y,
          z: Math.sin(angle),
        });
        strand2.push({
          x: centerX + Math.cos(angle + STRAND_OFFSET) * HELIX_RADIUS,
          y,
          z: Math.sin(angle + STRAND_OFFSET),
        });
      }

      const baseAlpha = 0.12;
      const highlightAlpha = 0.25;

      const drawStrand = (
        points: { x: number; y: number; z: number }[],
        color: string,
      ) => {
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const avgZ = (p0.z + p1.z) / 2;
          const alpha = baseAlpha + (highlightAlpha - baseAlpha) * ((avgZ + 1) / 2);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = color.replace('1)', `${alpha})`);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        for (const p of points) {
          const alpha = baseAlpha + (highlightAlpha - baseAlpha) * ((p.z + 1) / 2);
          const radius = 2 + p.z * 0.8;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(radius, 1), 0, Math.PI * 2);
          ctx.fillStyle = color.replace('1)', `${alpha * 1.5})`);
          ctx.fill();
        }
      };

      drawStrand(strand1, 'rgba(43, 40, 36, 1)');
      drawStrand(strand2, 'rgba(82, 77, 69, 1)');

      for (let i = 0; i < STRAND_COUNT; i += RUNG_EVERY) {
        const p1 = strand1[i];
        const p2 = strand2[i];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = baseAlpha * 0.8 + (highlightAlpha - baseAlpha) * 0.4 * ((avgZ + 1) / 2);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(133, 126, 114, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(133, 126, 114, ${alpha * 1.2})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
