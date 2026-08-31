"use client";

import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const ANIMATION_CONFIGS = [
  // Far left image
  {
    src: "/images/media_1788196104138.png",
    alt: "Smiling women laptops",
    baseClasses: "absolute top-[20%] -left-[10%] w-[35%] aspect-[4/3] z-10",
    parallaxFactor: 2,
    entranceDelay: 0,
    animate: { y: [0, -7, 0], rotate: [-4, -3, -4] },
    duration: 7,
    baseRotation: -4
  },
  // Left image
  {
    src: "/images/media_1788196054973.png",
    alt: "Working hackathon",
    baseClasses: "absolute top-[40%] left-[10%] w-[28%] aspect-square z-20",
    parallaxFactor: 4,
    entranceDelay: 0.12,
    animate: { y: [0, 6, 0], x: [0, 3, 0], rotate: [2, 1.5, 2] },
    duration: 6,
    baseRotation: 2
  },
  // Center image
  {
    src: "/images/media_1788196042570.png",
    alt: "Group photo",
    baseClasses: "absolute top-[10%] left-[25%] w-[50%] aspect-[16/10] z-30",
    parallaxFactor: 5,
    entranceDelay: 0.24,
    animate: { y: [0, -3, 0], scale: [1, 1.008, 1], rotate: [0, 0, 0] },
    duration: 8,
    baseRotation: 0
  },
  // Right-center image
  {
    src: "/images/media_1788196072710.jpg",
    alt: "Speaker presentation",
    baseClasses: "absolute top-[35%] right-[10%] w-[32%] aspect-[4/3] z-40",
    parallaxFactor: 4,
    entranceDelay: 0.36,
    animate: { y: [0, -6, 0], x: [0, -3, 0], rotate: [-2, -1.5, -2] },
    duration: 7,
    baseRotation: -2
  },
  // Far right image
  {
    src: "/images/media_1788196107920.png",
    alt: "Brainstorming group",
    baseClasses: "absolute top-[15%] -right-[5%] w-[28%] aspect-square z-20",
    parallaxFactor: 2,
    entranceDelay: 0.48,
    animate: { y: [0, 8, 0], rotate: [5, 4, 5] },
    duration: 6.5,
    baseRotation: 5
  },
  // Bottom center image (Hired handshake)
  {
    src: "/images/media_1788197640018.jpg",
    alt: "Hired handshake",
    baseClasses: "absolute top-[60%] left-[38%] w-[22%] aspect-[3/4] z-50",
    parallaxFactor: 6,
    entranceDelay: 0.60,
    animate: { y: [0, 5, 0], x: [0, 2, 0], rotate: [3, 2, 3] },
    duration: 7.5,
    baseRotation: 3
  },
  // Bottom left image (Collaboration)
  {
    src: "/images/media_1788197768612.png",
    alt: "Collaboration group",
    baseClasses: "absolute top-[65%] left-[5%] w-[26%] aspect-[4/3] z-40",
    parallaxFactor: 5,
    entranceDelay: 0.72,
    animate: { y: [0, -4, 0], rotate: [-2, -1, -2] },
    duration: 8.5,
    baseRotation: -2
  }
];

function HeroVisualImage({
  config,
  index,
  scrollYProgress,
  prefersReducedMotion,
  mousePosition,
  isHovering,
  setIsHovering
}: {
  config: (typeof ANIMATION_CONFIGS)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  prefersReducedMotion: boolean;
  mousePosition: { x: number; y: number };
  isHovering: number | null;
  setIsHovering: (val: number | null) => void;
}) {
  const isHovered = isHovering === index;
  const hoverScale = isHovered ? 1.02 : 1;
  const hoverY = isHovered ? -2 : 0;
  
  const scrollParallaxY = useTransform(
    scrollYProgress, 
    [0, 1], 
    [10 * config.parallaxFactor, -10 * config.parallaxFactor]
  );

  return (
    <div className={`${config.baseClasses}`}>
      <motion.div
        className="w-full h-full"
        style={{
          y: prefersReducedMotion ? 0 : scrollParallaxY,
          x: prefersReducedMotion ? 0 : -mousePosition.x * config.parallaxFactor * 10,
        }}
      >
        <motion.div
          className="w-full h-full pointer-events-auto rounded-3xl"
          initial={{ opacity: 0, scale: 0.96, rotate: config.baseRotation, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: prefersReducedMotion ? 1 : hoverScale, 
            rotate: config.baseRotation,
            y: prefersReducedMotion ? 0 : hoverY + (-mousePosition.y * config.parallaxFactor * 2),
          }}
          transition={{
            opacity: { delay: config.entranceDelay, duration: 0.8, ease: "easeOut" },
            scale: { delay: config.entranceDelay, duration: isHovered ? 0.35 : 0.8, ease: "easeOut" },
            rotate: { delay: config.entranceDelay, duration: 0.8, ease: "easeOut" },
            y: { duration: 0.35, ease: "easeOut" },
          }}
          onMouseEnter={() => setIsHovering(index)}
          onMouseLeave={() => setIsHovering(null)}
        >
          <motion.div
            className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-white/10 ring-1 ring-black/5"
            animate={prefersReducedMotion ? {} : config.animate}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          >
            <Image
              src={config.src}
              alt={config.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            
            {!prefersReducedMotion && (
              <div 
                className="absolute inset-0 z-10 opacity-30 mix-blend-overlay transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
                }}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="relative mt-16 sm:mt-24 w-full max-w-6xl mx-auto h-[400px] sm:h-[600px] lg:h-[700px] pointer-events-none"
      style={{
        WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)",
        maskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)"
      }}
    >
      {ANIMATION_CONFIGS.map((config, i) => (
        <HeroVisualImage 
          key={i} 
          config={config} 
          index={i} 
          scrollYProgress={scrollYProgress}
          prefersReducedMotion={prefersReducedMotion ?? false}
          mousePosition={mousePosition}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
        />
      ))}
    </div>
  );
}
