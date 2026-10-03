export default function Services({ state }) {
  const services = state.services || [];
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// WHAT WE DO · <span className="si" style={{ letterSpacing: 0 }}>අපේ සේවාවන්</span></p>
            <h2 className="sec-t" data-scramble data-txt="WORKSHOP SERVICES">WORKSHOP SERVICES</h2>
          </div>
          <span className="num">04</span>
        </div>
        <div id="svcList">
          {services.map((s, i) => (
            <div key={i} className="svc-row reveal" style={{ '--d': `${i * 60}ms` }}>
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="ar">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
