import { useState, useEffect, useRef } from 'react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop';
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function attachTilt(container) {
  if (REDUCED || !matchMedia('(hover:hover)').matches) return () => {};
  const tiles = container.querySelectorAll('.m-tilt');
  const handlers = [];
  tiles.forEach(t => {
    const onMove = (e) => {
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translateY(-4px)`;
    };
    const onLeave = () => { t.style.transform = ''; };
    t.addEventListener('mousemove', onMove);
    t.addEventListener('mouseleave', onLeave);
    handlers.push({ el: t, onMove, onLeave });
  });
  return () => handlers.forEach(({ el, onMove, onLeave }) => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  });
}

export default function Machines({ state, onImageClick }) {
  const machines = state.machines || [];
  const cats = ['All', ...new Set(machines.map(m => m.cat || 'Other'))];
  const [activeCat, setActiveCat] = useState('All');
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cleanup = attachTilt(gridRef.current);
    return cleanup;
  }, [machines, activeCat]);

  return (
    <section className="sec" id="builds">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// THE BUILD LOG · <span className="si" style={{ letterSpacing: 0 }}>අපගේ නිෂ්පාදන එකතුව</span></p>
            <h2 className="sec-t" data-scramble data-txt="MACHINES WE'VE BUILT">MACHINES WE&apos;VE BUILT</h2>
          </div>
          <div className="chips" id="chips">
            {cats.map(c => (
              <button
                key={c}
                className={`chip${activeCat === c ? ' on' : ''}`}
                data-cat={c}
                onClick={() => setActiveCat(c)}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
          <span className="num">02</span>
        </div>
        <div className="m-grid" id="mGrid" ref={gridRef}>
          {machines.map((m, i) => {
            const img = m.img && m.img.trim() ? m.img : FALLBACK_IMG;
            const hidden = activeCat !== 'All' && (m.cat || 'Other') !== activeCat;
            return (
              <article
                key={i}
                className={`m-card reveal${hidden ? ' hide' : ''}`}
                data-cat={m.cat || 'Other'}
                style={{ '--d': `${(i % 3) * 90}ms` }}
              >
                <div className="m-tilt">
                  <div
                    className="m-img"
                    onClick={() => onImageClick?.({
                      src: img,
                      title: m.name,
                      si: m.si,
                      desc: m.desc,
                      spec: m.spec
                    })}
                    title="Click to view full image"
                  >
                    <img loading="lazy" src={img} alt={m.name} onError={e => { e.target.src = FALLBACK_IMG; }} />
                    <span className="m-cat">{m.cat || 'CUSTOM'}</span>
                  </div>
                  <div className="m-body">
                    <h3>{m.name}</h3>
                    <span className="si">{m.si}</span>
                    <p className="desc">{m.desc}</p>
                    <p className="m-spec mono">▸ {m.spec}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
