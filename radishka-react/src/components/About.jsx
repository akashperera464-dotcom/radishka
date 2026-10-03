const FALLBACK_IMG = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900&auto=format&fit=crop';

export default function About({ state }) {
  const a = state.about || {};
  const aboutImg = (state.images?.aboutImg && state.images.aboutImg.trim()) ? state.images.aboutImg : FALLBACK_IMG;

  return (
    <section className="sec" id="about">
      <div className="wrap about-grid">
        <figure className="about-frame reveal">
          <img
            src={aboutImg}
            onError={e => { e.target.src = FALLBACK_IMG; }}
            alt="Radishka at work"
          />
          <figcaption>ON THE FLOOR · WEWALWATTA, RATNAPURA</figcaption>
        </figure>
        <div className="about-txt reveal" style={{ '--d': '140ms' }}>
          <p className="overline">/// THE FOUNDER</p>
          <h2 className="sec-t" data-scramble data-txt={a.name || 'THE MINDS BEHIND THE MACHINES'}>
            {a.name || 'THE MINDS BEHIND THE MACHINES'}
          </h2>
          <p style={{ marginTop: '26px' }}>{a.p1}</p>
          <p>{a.p2}</p>
          <p className="about-sign">{a.sign}</p>
        </div>
      </div>
    </section>
  );
}
