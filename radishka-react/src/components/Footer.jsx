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
          <h4>ADMIN</h4>
          <a href="#" id="footAdmin" onClick={e => { e.preventDefault(); onAdminOpen(); }}>⚙ Admin settings &amp; requests</a>
          <p style={{ color: 'var(--dim)', fontSize: '.78rem', marginTop: '6px' }}>
            Authorised access only — sign in to view machine requests and edit site content.
          </p>
        </div>
      </div>
      <div className="wrap foot-bar">
        <span>© {year} {name} · HANDMADE IN SRI LANKA</span>
        <span>STAFF ACCESS — <a href="#" id="footGear" onClick={e => { e.preventDefault(); onAdminOpen(); }}>⚙ ADMIN PANEL</a></span>
      </div>
    </footer>
  );
}
