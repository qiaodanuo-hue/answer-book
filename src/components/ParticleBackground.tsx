/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  attuneActive: boolean;
  touchX?: number;
  touchY?: number;
  category: 'general' | 'love' | 'career' | 'destiny';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function ParticleBackground({
  attuneActive,
  touchX,
  touchY,
  category,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool
    const particles: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    const maxParticles = attuneActive 
      ? (isMobile ? 100 : 220) 
      : (isMobile ? 40 : 80);

    // Handle Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = canvas.width = entryWidth;
        height = canvas.height = entryHeight;
      }
    });
    resizeObserver.observe(canvas.parentElement || document.body);

    // Seed initial particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const isGold = Math.random() > 0.4;
      
      let regularColor = `rgba(${255}, ${78 + Math.floor(Math.random() * 60)}, 0,`; // default (destiny)
      if (category === 'general') {
        regularColor = `rgba(${99 + Math.floor(Math.random() * 20)}, ${102 + Math.floor(Math.random() * 30)}, 241,`;
      } else if (category === 'love') {
        regularColor = `rgba(${244}, ${63 + Math.floor(Math.random() * 30)}, ${94 + Math.floor(Math.random() * 20)},`;
      } else if (category === 'career') {
        regularColor = `rgba(${52 + Math.floor(Math.random() * 20)}, 211, ${153 + Math.floor(Math.random() * 30)},`;
      }

      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + 10,
        size: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(Math.random() * 0.7 + 0.2),
        alpha: Math.random() * 0.7 + 0.3,
        decay: Math.random() * 0.002 + 0.001,
        color: isGold
          ? `rgba(${230 + Math.floor(Math.random() * 25)}, ${180 + Math.floor(Math.random() * 30)}, 40,`
          : regularColor,
      };
    }

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Base background theme color sets
      let baseBg = '#0a0502';
      let radialGlow1 = 'rgba(58, 21, 16, 0.75)';
      let radialGlow2 = 'rgba(255, 78, 0, 0.22)';
      let nonGoldGlowHex = '#ff4e00';

      if (category === 'general') {
        baseBg = '#04040a';
        radialGlow1 = 'rgba(30, 27, 75, 0.75)';
        radialGlow2 = 'rgba(79, 70, 229, 0.22)';
        nonGoldGlowHex = '#6366f1';
      } else if (category === 'love') {
        baseBg = '#0c0406';
        radialGlow1 = 'rgba(76, 5, 25, 0.75)';
        radialGlow2 = 'rgba(225, 29, 72, 0.2)';
        nonGoldGlowHex = '#f43f5e';
      } else if (category === 'career') {
        baseBg = '#020704';
        radialGlow1 = 'rgba(6, 45, 27, 0.75)';
        radialGlow2 = 'rgba(16, 185, 129, 0.18)';
        nonGoldGlowHex = '#34d399';
      }

      ctx.fillStyle = baseBg;
      ctx.fillRect(0, 0, width, height);

      // Radial Glow 1 (burgundy at peak middle top)
      const grad1 = ctx.createRadialGradient(
        width / 2,
        height * 0.3,
        0,
        width / 2,
        height * 0.3,
        Math.max(width, height) * 0.6
      );
      grad1.addColorStop(0, radialGlow1);
      grad1.addColorStop(1, 'rgba(10, 5, 2, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Radial Glow 2 (vermilion hot spot at bottom left)
      const grad2 = ctx.createRadialGradient(
        width * 0.1,
        height * 0.8,
        0,
        width * 0.1,
        height * 0.8,
        Math.max(width, height) * 0.5
      );
      grad2.addColorStop(0, radialGlow2);
      grad2.addColorStop(1, 'rgba(10, 5, 2, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Constellation grid/nebula star backdrop
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 0.5;
      const spacing = 40;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          if ((x + y) % (spacing * 4) === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill();
          }
        }
      }

      // Render starfield
      particles.forEach((p, index) => {
        // Gravitational pull to touch coordinates if attuning
        if (attuneActive && touchX !== undefined && touchY !== undefined) {
          const dx = touchX - p.x;
          const dy = touchY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 400 && dist > 10) {
            // Stronger pull closer to touch
            const force = (400 - dist) / 400;
            p.vx += (dx / dist) * force * 0.18;
            p.vy += (dy / dist) * force * 0.18;
            
            // Speed limit inside gravity
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 4.5) {
              p.vx = (p.vx / speed) * 4.5;
              p.vy = (p.vy / speed) * 4.5;
            }
          }
        } else {
          // Normal drifts
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy -= Math.random() * 0.012;
          
          // Speed limit
          const speedY = Math.abs(p.vy);
          if (speedY > 1.3) p.vy = -1.3;
          if (speedY < 0.18) p.vy = -0.18;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw soft outer halo glow on larger particles without slow canvas shadows
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.fillStyle = p.color.includes('230') ? `rgba(212, 175, 55, ${p.alpha * 0.25})` : `${p.color.replace('rgba(', '').split(',')[0]}, ${p.color.replace('rgba(', '').split(',')[1]}, ${p.color.replace('rgba(', '').split(',')[2]}, ${p.alpha * 0.15})`;
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Recreate dead or out-of-bounds particles
        if (
          p.alpha <= 0 ||
          p.x < -10 ||
          p.x > width + 10 ||
          p.y < -10 ||
          p.y > height + 10
        ) {
          particles[index] = createParticle(false);
        }
      });

      // Special golden/colored magical vortex when attune is active
      if (attuneActive && touchX !== undefined && touchY !== undefined) {
        ctx.beginPath();
        const glowGrad = ctx.createRadialGradient(
          touchX,
          touchY,
          0,
          touchX,
          touchY,
          110
        );
        let centerColor = 'rgba(255, 78, 0, 0.28)';
        let middleColor = 'rgba(212, 175, 55, 0.09)';
        
        if (category === 'general') {
          centerColor = 'rgba(99, 102, 241, 0.32)';
          middleColor = 'rgba(99, 102, 241, 0.1)';
        } else if (category === 'love') {
          centerColor = 'rgba(244, 63, 94, 0.32)';
          middleColor = 'rgba(244, 63, 94, 0.1)';
        } else if (category === 'career') {
          centerColor = 'rgba(52, 211, 153, 0.32)';
          middleColor = 'rgba(52, 211, 153, 0.1)';
        } else if (category === 'destiny') {
          centerColor = 'rgba(255, 78, 0, 0.28)';
          middleColor = 'rgba(212, 175, 55, 0.09)';
        }
        
        glowGrad.addColorStop(0, centerColor);
        glowGrad.addColorStop(0.5, middleColor);
        glowGrad.addColorStop(1, 'rgba(10, 5, 2, 0)');
        ctx.fillStyle = glowGrad;
        ctx.arc(touchX, touchY, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [attuneActive, touchX, touchY, category]);

  return (
    <canvas
      ref={canvasRef}
      id="cosmic-particle-canvas"
      className="absolute inset-0 block w-full h-full pointer-events-none z-0"
    />
  );
}
