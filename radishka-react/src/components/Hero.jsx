import { useEffect, useRef } from 'react';

const FALLBACK_HERO_BG = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1600&auto=format&fit=crop';
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Hero({ state }) {
  const rigRef = useRef(null);

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig || REDUCED || !matchMedia('(hover:hover)').matches) return;
    const inner = rig.querySelector('.rig');
    const onMove = (e) => {
      const r = rig.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (inner) inner.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    };
    const onLeave = () => { if (inner) inner.style.transform = ''; };
    rig.addEventListener('mousemove', onMove);
    rig.addEventListener('mouseleave', onLeave);
    return () => { rig.removeEventListener('mousemove', onMove); rig.removeEventListener('mouseleave', onLeave); };
  }, []);

  const heroBg = (state.images?.heroBg && state.images.heroBg.trim()) ? state.images.heroBg : FALLBACK_HERO_BG;
  const s = state.site || {};
  const h = state.hero || {};

  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        {heroBg && <img id="heroBgImg" src={heroBg} alt="" data-prl="0.12" />}
      </div>
      <div className="wrap hero-grid">
        <div>
          <p className="kicker">{s.badge}</p>
          <h1>
            <span className="l1" data-scramble data-txt={h.t1 || 'YOU DREAM IT.'}>{h.t1 || 'YOU DREAM IT.'}</span>
            <span className="l2" data-scramble data-txt={h.t2 || 'WE ENGINEER IT.'}>{h.t2 || 'WE ENGINEER IT.'}</span>
          </h1>
          <p className="hero-si si">{h.kicker}</p>
          <p className="hero-sub">{h.sub}</p>
          <div className="hero-ctas">
            <a href="#request" className="btn btn-solid"><span>{h.cta1 || 'Request a Quote'}</span> <span className="ar">→</span></a>
            <a href="#builds" className="btn btn-ghost"><span>{h.cta2 || 'See Our Builds'}</span></a>
          </div>
          <div className="hero-meta">
            <span>{s.since || 'EST. 2013'}</span>
            <span>ONE-OFF BUILDS</span>
            <span>ISLAND-WIDE DELIVERY</span>
          </div>
        </div>
        <div className="rig-wrap" id="rigWrap" ref={rigRef}>
          <div className="rig">
            <div className="rig-3d">
              <i className="ring r1"></i><i className="ring r2"></i><i className="ring r3"></i>
              <div className="gear spin">
                <i className="bar b1"></i><i className="bar b2"></i><i className="bar b3"></i><i className="bar b4"></i>
                <span className="core"></span><span className="hub"></span>
              </div>
            </div>
          </div>
          <span className="rig-chip rc1">TORQUE ✓ OK</span>
          <span className="rig-chip rc2">2.2 kW · TESTED</span>
          <span className="rig-chip rc3">MADE IN SRI LANKA</span>
          <i className="spark" style={{ left: '20%', bottom: '10%', animationDelay: '0s' }}></i>
          <i className="spark" style={{ left: '55%', bottom: '6%', animationDelay: '1.2s' }}></i>
          <i className="spark" style={{ left: '75%', bottom: '14%', animationDelay: '2.4s' }}></i>
          <i className="spark" style={{ left: '38%', bottom: '4%', animationDelay: '3.1s' }}></i>
        </div>
      </div>
      <div className="wrap scroll-cue"><i></i> SCROLL</div>
    </section>
  );
}
