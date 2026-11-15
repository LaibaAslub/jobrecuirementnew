'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 900,
  className = '',
  as: Component = 'div',
  threshold = 0.12,
  style = {},
  ...props
}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Compute transform based on animation type
  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translateY(24px)';
      case 'fade-down':
        return 'translateY(-20px)';
      case 'fade-left':
        return 'translateX(24px)';
      case 'fade-right':
        return 'translateX(-24px)';
      case 'scale':
        return 'scale(0.95)';
      case 'fade':
      default:
        return 'none';
    }
  };

  const animationStyle = {
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? 'none' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
    ...style,
  };

  return (
    <Component
      ref={ref}
      className={`reveal-wrapper ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={animationStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
