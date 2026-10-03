export default function Footer({ state, onAdminOpen }) {
  const c = state.contact || {};
  const name = state.site?.name || 'KRS KING (PVT) LTD';
  const year = new Date().getFullYear();

  return (
    <footer id="contact">
      <div className="wrap"><div className="foot-word">{name}</div></div>
      <div className="wrap foot-grid">
        <div>
          <h4>THE WORKSHOP</h4>
          <p>{c.address}</p>
          <p>{c.hours}</p>
        </div>
        <div>
          <h4>REACH US</h4>
          <a href={`tel:${c.phone}`}>{c.phone || '+94 76 159 9289'}</a>
          <a href={`mailto:${c.email}`}>{c.email || 'hello@krsking.lk'}</a>
        </div>
        <div>
          <h4>SHORTCUTS</h4>
          <a href="#builds">Build log</a>
          <a href="#civil">Civil works</a>
          <a href="#process">How it works</a>
          <a href="#request">Request a quote</a>
          <a href="#top">Back to top ↑</a>
        </div>
        <div>
          <h4>COMPANY</h4>
          <p style={{ color: 'var(--mut)', fontSize: '.86rem', lineHeight: 1.7 }}>
            KRS KING (PVT) LTD · Falcon ICM · Panther EC · Phoenix IA. Precision engineering and civil infrastructure built to order from Ratnapura across Sri Lanka.
          </p>
        </div>
      </div>
      <div className="wrap foot-bar">
        <span>© {year} {name} · SRI LANKA</span>
        <span>All Rights Reserved · <a href="#admin" onClick={e => { e.preventDefault(); onAdminOpen(); }} style={{ color: 'var(--dim)', textDecoration: 'none', opacity: 0.7 }} title="Authorized personnel only">Staff Login</a></span>
      </div>
    </footer>
  );
}
