'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Parses numbers with prefixes, suffixes, decimals, and commas.
 * Examples:
 *   "1,400+"  -> { prefix: "", target: 1400, suffix: "+", decimals: 0, hasComma: true }
 *   "99.2%"   -> { prefix: "", target: 99.2, suffix: "%", decimals: 1, hasComma: false }
 *   "48hr"    -> { prefix: "", target: 48, suffix: "hr", decimals: 0, hasComma: false }
 *   "$145k"   -> { prefix: "$", target: 145, suffix: "k", decimals: 0, hasComma: false }
 *   "5,000+"  -> { prefix: "", target: 5000, suffix: "+", decimals: 0, hasComma: true }
 *   "$168.4k" -> { prefix: "$", target: 168.4, suffix: "k", decimals: 1, hasComma: false }
 *   "100%"    -> { prefix: "", target: 100, suffix: "%", decimals: 0, hasComma: false }
 *   "1.2M+"   -> { prefix: "", target: 1.2, suffix: "M+", decimals: 1, hasComma: false }
 */
export function parseNumberString(str) {
  if (typeof str === 'number') {
    return {
      prefix: '',
      target: str,
      suffix: '',
      decimals: Number.isInteger(str) ? 0 : 1,
      hasComma: str >= 1000,
    };
  }

  const s = String(str).trim();
  // Match prefix, numeric part (including comma/dot), and suffix
  const match = s.match(/^([^\d.-]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: '', target: 0, suffix: s, decimals: 0, hasComma: false };
  }

  const prefix = match[1];
  const numStr = match[2];
  const suffix = match[3];

  const hasComma = numStr.includes(',');
  const cleanNumStr = numStr.replace(/,/g, '');
  const target = parseFloat(cleanNumStr) || 0;

  const decimals = cleanNumStr.includes('.') ? cleanNumStr.split('.')[1].length : 0;

  return { prefix, target, suffix, decimals, hasComma };
}

/**
 * Format a number back with same decimal precision, comma separation, prefix, and suffix
 */
export function formatNumber(val, { prefix, suffix, decimals, hasComma }) {
  let formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();

  if (hasComma) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }

  return `${prefix}${formatted}${suffix}`;
}

export default function AnimatedCounter({
  value,
  duration = 1800,
  className = '',
  startValue = 0,
}) {
  const ref = useRef(null);
  const parsed = parseNumberString(value);
  const [displayValue, setDisplayValue] = useState(
    formatNumber(startValue, parsed)
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(formatNumber(parsed.target, parsed));
      return;
    }

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const targetVal = parsed.target;
      const startVal = startValue;

      // Smooth ease-out cubic curve: slow down gently as it finishes
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const frame = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = startVal + (targetVal - startVal) * eased;

        setDisplayValue(formatNumber(current, parsed));

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          setDisplayValue(formatNumber(targetVal, parsed));
        }
      };

      requestAnimationFrame(frame);
    };

    // Use IntersectionObserver to start counting only when user reaches the section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, startValue]);

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}
