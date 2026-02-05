"use client";

import { useEffect, useRef } from "react";

/**
 * GrainOverlay - Cinematic film grain texture
 *
 * Creates an atmospheric, premium feel by adding subtle noise.
 * Uses canvas for performance (no SVG filter jank on scroll).
 *
 * Performance considerations:
 * - Renders once, no re-renders on scroll
 * - Uses CSS animation for movement (GPU-accelerated)
 * - Opacity kept low to avoid visual fatigue
 */
export function GrainOverlay({
  opacity = 0.035,
  blendMode = "overlay"
}: {
  opacity?: number;
  blendMode?: "overlay" | "soft-light" | "multiply";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size canvas to cover viewport with some buffer for animation
    const size = 256; // Small texture that tiles
    canvas.width = size;
    canvas.height = size;

    // Generate grain texture
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 255;   // A (full opacity, controlled by CSS)
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <>
      {/* Grain texture canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
        style={{
          opacity,
          mixBlendMode: blendMode,
          // Tile the small texture across the viewport
          imageRendering: "pixelated",
          transform: "scale(4)", // Scale up the 256px texture
          transformOrigin: "0 0",
          animation: "grain 0.5s steps(10) infinite",
        }}
      />

      {/* CSS animation for grain movement */}
      <style jsx global>{`
        @keyframes grain {
          0%, 100% {
            transform: translate(0, 0) scale(4);
          }
          10% {
            transform: translate(-2%, -2%) scale(4);
          }
          20% {
            transform: translate(2%, 2%) scale(4);
          }
          30% {
            transform: translate(-1%, 1%) scale(4);
          }
          40% {
            transform: translate(1%, -1%) scale(4);
          }
          50% {
            transform: translate(-2%, 2%) scale(4);
          }
          60% {
            transform: translate(2%, -2%) scale(4);
          }
          70% {
            transform: translate(-1%, -1%) scale(4);
          }
          80% {
            transform: translate(1%, 1%) scale(4);
          }
          90% {
            transform: translate(-2%, -1%) scale(4);
          }
        }
      `}</style>
    </>
  );
}

/**
 * Alternative: SVG Filter Grain (static, more subtle)
 * Use this if you prefer no animation
 */
export function StaticGrainOverlay({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.80"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="monoNoise"
            />
            <feBlend
              in="SourceGraphic"
              in2="monoNoise"
              mode="multiply"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain-filter)"
          fill="transparent"
        />
      </svg>
    </div>
  );
}
