const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function StatNum({ v, s }) {
  return (
    <div className="stat-num">
      <span data-count data-v={v}>0</span>
      <b>{s}</b>
    </div>
  );
}

export default function Stats({ state }) {
  const stats = state.stats || [];
  return (
    <section className="stats">
      <div className="wrap" id="statGrid">
        {stats.map((s, i) => (
          <div key={i} className="stat reveal" style={{ '--d': `${i * 90}ms` }}>
            <StatNum v={s.v} s={s.s} />
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
