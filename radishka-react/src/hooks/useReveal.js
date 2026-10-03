import { useEffect, useRef } from 'react';

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Attaches an IntersectionObserver to all .reveal and .lm elements inside a container ref.
 * Call after content renders that may introduce new reveal elements.
 */
export function useReveal(containerRef) {
  const ioRef = useRef(null);

  useEffect(() => {
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              ioRef.current.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
    }
    const io = ioRef.current;
    const root = containerRef?.current ?? document;
    root.querySelectorAll('.reveal:not([data-ro]),.lm:not([data-ro])').forEach(el => {
      el.dataset.ro = '1';
      if (REDUCED) { el.classList.add('in'); } else { io.observe(el); }
    });
  });
}

/**
 * Scramble text effect for a single element.
 */
const SCR_CHARS = '█▓▒░<>/\\|=+*#01';
export function scramble(el) {
  if (REDUCED) { el.textContent = el.dataset.txt; return; }
  const txt = el.dataset.txt;
  if (!txt || el.dataset.busy) return;
  el.dataset.busy = '1';
  const n = txt.length, dur = 850, t0 = performance.now();
  (function frame(t) {
    const p = Math.min(1, (t - t0) / dur), k = Math.floor(p * n);
    let out = txt.slice(0, k);
    for (let i = k; i < n; i++) out += txt[i] === ' ' ? ' ' : SCR_CHARS[Math.random() * SCR_CHARS.length | 0];
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
    else { el.textContent = txt; delete el.dataset.busy; }
  })(t0);
}

/**
 * Hook to watch [data-scramble] elements inside a ref and scramble them when visible.
 */
export function useScramble(containerRef) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); }
      }),
      { threshold: 0.4 }
    );
    root.querySelectorAll('[data-scramble]').forEach(el => {
      if (!el.dataset.txt) el.dataset.txt = el.textContent;
      if (el.closest('.hero')) setTimeout(() => scramble(el), 300);
      else io.observe(el);
    });
    return () => io.disconnect();
  });
}

/**
 * Animated count-up hook for [data-count] elements.
 */
export function useCountUp(containerRef) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        const target = parseFloat(el.dataset.v);
        if (isNaN(target)) { el.textContent = el.dataset.v; return; }
        if (REDUCED) { el.textContent = target; return; }
        const t0 = performance.now(), dur = 1300;
        (function step(t) {
          const p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      }),
      { threshold: 0.5 }
    );
    root.querySelectorAll('[data-count]').forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}
