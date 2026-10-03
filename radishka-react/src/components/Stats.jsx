import { useEffect, useRef, useState } from 'react';

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function StatItem({ v, s, l, delay }) {
  const [displayVal, setDisplayVal] = useState('0');
  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = parseFloat(v);
    if (isNaN(target)) {
      setDisplayVal(v);
      return;
    }
    if (REDUCED) {
      setDisplayVal(String(target));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting || animatedRef.current) return;
          animatedRef.current = true;
          io.unobserve(e.target);

          const t0 = performance.now();
          const dur = 1300;

          function step(t) {
            const p = Math.min(1, (t - t0) / dur);
            const ease = 1 - Math.pow(1 - p, 3);
            setDisplayVal(String(Math.round(target * ease)));
            if (p < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayVal(String(target));
            }
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [v]);

  return (
    <div ref={ref} className="stat reveal" style={{ '--d': `${delay}ms` }}>
      <div className="stat-num">
        <span>{displayVal}</span>
        <b>{s}</b>
      </div>
      <div className="stat-l">{l}</div>
    </div>
  );
}

export default function Stats({ state }) {
  const stats = state.stats || [];
  return (
    <section className="stats">
      <div className="wrap" id="statGrid">
        {stats.map((s, i) => (
          <StatItem
            key={i}
            v={s.v}
            s={s.s}
            l={s.l}
            delay={i * 90}
          />
        ))}
      </div>
    </section>
  );
}
