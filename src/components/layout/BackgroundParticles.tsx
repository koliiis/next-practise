'use client'

import { useEffect, useRef } from "react";

type Wave = {
  amplitude: number;
  wavelength: number;
  speed: number;
  phase: number;
  color: string;
};

type Point = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
};

export const EmojiRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const wavesCount = 3;
    const waves: Wave[] = [];

    for (let i = 0; i < wavesCount; i++) {
      waves.push({
        amplitude: 20 + 15 * i,
        wavelength: 200 + 150 * i,
        speed: 0.02 + 0.01 * i,
        phase: 0,
        color: `rgba(139, 92, 246, ${0.3 - i * 0.1})`,
      });
    }

    const pointsCount = 80;
    const points: Point[] = [];

    for (let i = 0; i < pointsCount; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    function drawWave(wave: Wave) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      for (let x = 0; x <= w; x += 10) {
        const y =
          h / 2 +
          wave.amplitude *
            Math.sin((2 * Math.PI * (x / wave.wavelength)) + wave.phase);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    }

    function drawPoints() {
      for (const p of points) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 255, ${p.opacity})`;
        ctx.shadowColor = "rgba(200, 200, 255, 0.7)";
        ctx.shadowBlur = 8;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
      }
    }

    let animationId: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#1a202c";
      ctx.fillRect(0, 0, w, h);

      waves.forEach((wave) => {
        drawWave(wave);
        wave.phase += wave.speed;
      });

      drawPoints();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="emoji-rain-canvas"
      className="fixed inset-0 -z-10 w-screen h-screen"
    />
  );
};
