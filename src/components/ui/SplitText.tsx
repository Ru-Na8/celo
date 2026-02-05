"use client";

import { motion, useInView, type Transition } from "framer-motion";
import { useRef } from "react";

/**
 * SplitText - Word-by-word or character-by-character text animation
 *
 * Creates dramatic, cinematic text reveals commonly seen in
 * luxury brand websites and award-winning portfolios.
 *
 * Animation strategy:
 * - Uses clip-path for clean reveal edges
 * - Staggered delays create a "wave" effect
 * - Custom easing (expo-out) for premium feel
 * - Intersection Observer triggers animation when visible
 */

type SplitType = "words" | "characters" | "lines";
type AnimationType = "reveal" | "fade-up" | "fade" | "blur";

interface SplitTextProps {
  children: string;
  className?: string;
  splitBy?: SplitType;
  animation?: AnimationType;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  once?: boolean;
}

// Premium easing - expo out curve
const expoOut: Transition = {
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// Get initial/animate states for each animation type
const getAnimationStates = (animation: AnimationType) => {
  switch (animation) {
    case "reveal":
      return {
        initial: { y: "100%", opacity: 0 },
        animate: { y: "0%", opacity: 1 },
      };
    case "fade-up":
      return {
        initial: { y: 40, opacity: 0 },
        animate: { y: 0, opacity: 1 },
      };
    case "blur":
      return {
        initial: { opacity: 0, filter: "blur(10px)", y: 20 },
        animate: { opacity: 1, filter: "blur(0px)", y: 0 },
      };
    case "fade":
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
  }
};

export function SplitText({
  children,
  className = "",
  splitBy = "words",
  animation = "reveal",
  staggerDelay = 0.05,
  initialDelay = 0,
  duration = 0.8,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  // Split text into parts
  const splitText = (text: string, type: SplitType): string[] => {
    switch (type) {
      case "characters":
        return text.split("");
      case "lines":
        return text.split("\n");
      case "words":
      default:
        return text.split(" ");
    }
  };

  const parts = splitText(children, splitBy);
  const { initial, animate } = getAnimationStates(animation);

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={children}>
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: "top" }}
        >
          <motion.span
            className="inline-block"
            initial={initial}
            animate={isInView ? animate : initial}
            transition={{
              duration,
              delay: initialDelay + index * staggerDelay,
              ...expoOut,
            }}
            style={{
              ...(splitBy === "words" && index !== parts.length - 1
                ? { marginRight: "0.25em" }
                : {}),
            }}
          >
            {part}
            {splitBy === "characters" && part === " " && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * SplitLines - Animate each line separately
 * Good for multi-line headlines
 */
interface SplitLinesProps {
  children: string[];
  className?: string;
  lineClassName?: string;
  animation?: AnimationType;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  once?: boolean;
}

export function SplitLines({
  children,
  className = "",
  lineClassName = "",
  animation = "reveal",
  staggerDelay = 0.15,
  initialDelay = 0,
  duration = 1,
  once = true,
}: SplitLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  const { initial, animate } = getAnimationStates(animation);

  return (
    <div ref={ref} className={className}>
      {children.map((line, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            className={lineClassName}
            initial={initial}
            animate={isInView ? animate : initial}
            transition={{
              duration,
              delay: initialDelay + index * staggerDelay,
              ...expoOut,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/**
 * AnimatedHeadline - Pre-configured for hero sections
 * Combines multiple animation techniques with 3D rotation
 */
interface AnimatedHeadlineProps {
  lines: string[];
  className?: string;
  delay?: number;
}

export function AnimatedHeadline({
  lines,
  className = "",
  delay = 0.6,
}: AnimatedHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <h1 ref={ref} className={className}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="overflow-hidden">
          <motion.div
            initial={{ y: "110%", rotateX: -80 }}
            animate={
              isInView
                ? { y: "0%", rotateX: 0 }
                : { y: "110%", rotateX: -80 }
            }
            transition={{
              duration: 1.2,
              delay: delay + lineIndex * 0.12,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </h1>
  );
}
