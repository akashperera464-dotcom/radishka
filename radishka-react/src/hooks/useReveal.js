import { useEffect, useRef } from 'react';

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Attaches an IntersectionObserver to all .reveal and .lm elements.
 * Sets data-in="1" so elements stay permanently visible even after React re-renders.
 */
export function useReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current ?? document;

    // Immediately restore 'in' on elements that were already revealed
    root.querySelectorAll('.reveal[data-in="1"], .lm[data-in="1"]').forEach(el => {
      el.classList.add('in');
    });

    if (REDUCED) {
      root.querySelectorAll('.reveal, .lm').forEach(el => {
        el.classList.add('in');
        el.setAttribute('data-in', '1');
      });
      return;
    }

    const unrevealed = root.querySelectorAll('.reveal:not([data-in="1"]), .lm:not([data-in="1"])');
    if (!unrevealed.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            e.target.setAttribute('data-in', '1');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    unrevealed.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/**
 * Scramble text effect for a single element.
 */
const SCR_CHARS = '█▓▒░<>/\\|=+*#01';

export function scramble(el) {
  if (REDUCED) {
    if (el.dataset.txt) el.textContent = el.dataset.txt;
    el.setAttribute('data-scrambled', '1');
    return;
  }
  const txt = el.dataset.txt || el.textContent;
  if (!txt || el.dataset.busy || el.dataset.scrambled === '1') return;
  el.dataset.busy = '1';
  const n = txt.length, dur = 850, t0 = performance.now();

  (function frame(t) {
    const p = Math.min(1, (t - t0) / dur);
    const k = Math.floor(p * n);
    let out = txt.slice(0, k);
    for (let i = k; i < n; i++) {
      out += txt[i] === ' ' ? ' ' : SCR_CHARS[Math.random() * SCR_CHARS.length | 0];
    }
    el.textContent = out;
    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = txt;
      delete el.dataset.busy;
      el.setAttribute('data-scrambled', '1');
    }
  })(t0);
}

/**
 * Watches [data-scramble] elements and runs scramble effect once when scrolled into view.
 */
export function useScramble(containerRef) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const unscrambled = root.querySelectorAll('[data-scramble]:not([data-scrambled="1"])');
    if (!unscrambled.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            scramble(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    unscrambled.forEach(el => {
      if (!el.dataset.txt) el.dataset.txt = el.textContent;
      if (el.closest('.hero')) {
        setTimeout(() => scramble(el), 300);
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  });
}
