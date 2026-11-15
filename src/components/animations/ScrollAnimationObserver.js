'use client';

import { useEffect } from 'react';
import { parseNumberString, formatNumber } from './AnimatedCounter';

export default function ScrollAnimationObserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // 1. Reveal Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-delay') || 0;

            if (delay && delay > 0 && !prefersReducedMotion) {
              setTimeout(() => {
                el.classList.add('is-revealed');
              }, parseInt(delay, 10));
            } else {
              el.classList.add('is-revealed');
            }

            revealObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    // 2. Counter Observer
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetAttr =
              el.getAttribute('data-count-to') ||
              el.getAttribute('data-counter') ||
              el.innerText;
            const parsed = parseNumberString(targetAttr);

            if (prefersReducedMotion) {
              el.innerText = formatNumber(parsed.target, parsed);
              counterObserver.unobserve(el);
              return;
            }

            const duration = parseInt(
              el.getAttribute('data-counter-duration') || '1800',
              10
            );
            const startTime = performance.now();
            const startVal = 0;
            const targetVal = parsed.target;

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const frame = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOutCubic(progress);
              const current = startVal + (targetVal - startVal) * eased;

              el.innerText = formatNumber(current, parsed);

              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                el.innerText = formatNumber(targetVal, parsed);
              }
            };

            requestAnimationFrame(frame);
            counterObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    // Function to scan and observe elements
    const scanElements = () => {
      // Find all reveal elements
      const revealTargets = document.querySelectorAll(
        '.reveal-on-scroll:not(.is-revealed), [data-reveal]:not(.is-revealed)'
      );
      revealTargets.forEach((el) => {
        if (prefersReducedMotion) {
          el.classList.add('is-revealed');
        } else {
          revealObserver.observe(el);
        }
      });

      // Find all counter elements
      const counterTargets = document.querySelectorAll(
        '[data-count-to]:not([data-counter-active]), [data-counter]:not([data-counter-active])'
      );
      counterTargets.forEach((el) => {
        el.setAttribute('data-counter-active', 'true');
        if (prefersReducedMotion) {
          const parsed = parseNumberString(
            el.getAttribute('data-count-to') || el.getAttribute('data-counter')
          );
          el.innerText = formatNumber(parsed.target, parsed);
        } else {
          counterObserver.observe(el);
        }
      });
    };

    // Initial scan
    scanElements();

    // Observe future DOM changes (dynamic cards, new items, page routing)
    const mutationObserver = new MutationObserver(() => {
      scanElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
