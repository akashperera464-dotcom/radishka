import { useEffect, useRef, useState } from 'react';

export default function Process({ state }) {
  const steps = state.process || [];
  const [activeStep, setActiveStep] = useState(0);
  const listRef = useRef(null);
  const barWidth = steps.length ? ((activeStep + 1) / steps.length * 100) + '%' : '25%';

  useEffect(() => {
    const list = listRef.current;
    if (!list || !steps.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveStep(Number(e.target.dataset.i));
        });
      },
      { rootMargin: '-42% 0px -42% 0px' }
    );
    list.querySelectorAll('.step').forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [steps]);

  return (
    <section className="sec" id="process">
      <div className="wrap proc-grid">
        <div className="proc-left">
          <div className="proc-sticky reveal">
            <p className="overline">/// HOW IT WORKS · <span className="si" style={{ letterSpacing: 0 }}>හදන හැටි</span></p>
            <h2 className="sec-t" data-scramble data-txt="FROM IDEA TO IRON">FROM IDEA TO IRON</h2>
            <div className="proc-num">
              <span id="procNum">{String(activeStep + 1).padStart(2, '0')}</span>
              <span className="tot" id="procTot">/ {String(steps.length).padStart(2, '0')}</span>
            </div>
            <div className="proc-bar">
              <i id="procBar" style={{ width: barWidth }}></i>
            </div>
          </div>
        </div>
        <div className="proc-right" id="procList" ref={listRef}>
          {steps.map((s, i) => (
            <div
              key={i}
              className={`step reveal${activeStep === i ? ' on' : ''}`}
              data-i={i}
              style={{ '--d': `${i * 70}ms` }}
            >
              <span className="s-idx mono">STEP {String(i + 1).padStart(2, '0')}</span>
              <h3>{s.t}</h3>
              <span className="si">{s.si}</span>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
