import { NOIMG } from '../defaultContent';

export default function FeaturedBuild({ state }) {
  const f = state.featured || {};
  const specsLines = String(f.specs || '').split('\n').map(line => {
    const i = line.indexOf(':');
    if (i < 1 || !line.trim()) return null;
    return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
  }).filter(Boolean);

  return (
    <section className="sec" id="featured">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// FILE 001 · THE STORY WE TELL</p>
            <h2 className="sec-t" data-scramble data-txt="THE CARDAMOM PROBLEM">THE CARDAMOM PROBLEM</h2>
          </div>
          <span className="num">01</span>
        </div>
        <div className="feat-grid">
          <div className="feat-frame reveal">
            <span className="stamp">{f.stamp || 'FEATURED BUILD · FILE 001'}</span>
            <div className="feat-imgbox">
              <img
                src={f.img && f.img.trim() ? f.img : NOIMG}
                onError={e => { e.target.src = NOIMG; }}
                alt="Cardamom grinder"
              />
            </div>
          </div>
          <div className="reveal" style={{ '--d': '120ms' }}>
            <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '2.2rem', textTransform: 'uppercase', letterSpacing: '.02em' }}>
              {f.title || 'Cardamom Grinder'}{' '}
              <span className="si" style={{ color: 'var(--brass)', fontSize: '1.1rem', display: 'block', marginTop: '6px' }}>{f.si}</span>
            </h3>
            <blockquote className="feat-quote">{f.quote}</blockquote>
            <p className="feat-story">{f.story}</p>
            <dl className="feat-specs">
              {specsLines.map((s, i) => (
                <div key={i}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
