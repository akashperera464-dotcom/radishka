import { useState } from 'react';

export default function Faq({ state }) {
  const faq = state.faq || [];
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <section className="sec" id="faq" style={{ background: 'var(--bg2)', borderBlock: '1px solid var(--line)' }}>
      <div className="wrap" style={{ maxWidth: '860px' }}>
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// QUESTIONS · <span className="si" style={{ letterSpacing: 0 }}>අහන දේවල්</span></p>
            <h2 className="sec-t" data-scramble data-txt="ASKED ALL THE TIME">ASKED ALL THE TIME</h2>
          </div>
        </div>
        <div id="faqList">
          {faq.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button className="faq-q" onClick={() => toggle(i)}>
                  {f.q}
                  <span className="fx">+</span>
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? '999px' : '0' }}>
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
