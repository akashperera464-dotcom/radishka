export default function Testimonials({ state }) {
  const testimonials = state.testimonials || [];
  return (
    <section className="sec" id="reviews">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// WORD FROM THE FIELD</p>
            <h2 className="sec-t" data-scramble data-txt="CUSTOMERS ON RECORD">CUSTOMERS ON RECORD</h2>
          </div>
          <span className="num">05</span>
        </div>
        <div className="t-grid" id="tGrid">
          {testimonials.map((t, i) => (
            <div key={i} className="t-card reveal" style={{ '--d': `${i * 110}ms` }}>
              <p className="t-q">&ldquo;{t.q}&rdquo;</p>
              <div className="t-who">
                <b>{t.n}</b>
                <span>{t.r}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
