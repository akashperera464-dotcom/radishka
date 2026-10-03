import { useState, useRef, useEffect } from 'react';

function FaqItem({ q, a, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-q" onClick={onToggle}>
        {q}
        <span className="fx">+</span>
      </button>
      <div
        ref={contentRef}
        className="faq-a"
        style={{ maxHeight }}
      >
        <p>{a}</p>
      </div>
    </div>
  );
}

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
          {faq.map((f, i) => (
            <FaqItem
              key={i}
              q={f.q}
              a={f.a}
              isOpen={openIdx === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
