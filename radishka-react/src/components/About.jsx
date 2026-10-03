import { NOIMG } from '../defaultContent';

export default function About({ state }) {
  const a = state.about || {};
  const aboutImg = state.images?.aboutImg;
  return (
    <section className="sec" id="about">
      <div className="wrap about-grid">
        <figure className="about-frame reveal">
          <img
            src={aboutImg && aboutImg.trim() ? aboutImg : NOIMG}
            onError={e => { e.target.src = NOIMG; }}
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
