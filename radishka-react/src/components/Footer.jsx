export default function Footer({ state, onAdminOpen }) {
  const c = state.contact || {};
  const name = state.site?.name || 'KRS KING (PVT) LTD';
  const year = new Date().getFullYear();
  const phone = c.phone || '+94 76 159 9289';
  const email = c.email || 'hello@krsking.lk';

  return (
    <footer id="contact">
      <div className="wrap">
        <div className="foot-word">{name}</div>
        <div className="foot-intro">
          <span>ENGINEERING · FABRICATION · CIVIL INFRASTRUCTURE</span>
          <p>Purpose-built machinery and project support for agricultural, industrial, and construction operations across Sri Lanka.</p>
        </div>
      </div>

      <div className="wrap foot-grid">
        <section className="foot-card foot-company" aria-label="Company">
          <h4>COMPANY</h4>
          <b>{name}</b>
          <p>KRS KING operates through Falcon ICM, Panther EC, and Phoenix IA, delivering practical engineering solutions from Ratnapura.</p>
        </section>

        <section className="foot-card" aria-label="Contact details">
          <h4>CONTACT</h4>
          <a className="foot-link strong" href={`tel:${phone}`}>{phone}</a>
          <a className="foot-link" href={`mailto:${email}`}>{email}</a>
          <a className="foot-action" href="#request">Request a quote</a>
        </section>

        <section className="foot-card" aria-label="Workshop details">
          <h4>WORKSHOP</h4>
          <p>{c.address || 'Wewalwatta, Ratnapura, Sri Lanka'}</p>
          <p>{c.hours || 'Mon-Sat · 8.00 - 18.00'}</p>
        </section>

        <section className="foot-card" aria-label="Website shortcuts">
          <h4>EXPLORE</h4>
          <nav className="foot-nav" aria-label="Footer navigation">
            <a href="#builds">Build log</a>
            <a href="#civil">Civil works</a>
            <a href="#process">How it works</a>
            <a href="#about">About</a>
            <a href="#feedback">Feedback</a>
            <a href="#top">Back to top</a>
          </nav>
        </section>
      </div>

      <div className="wrap foot-bar">
        <span>© {year} {name} · SRI LANKA</span>
        <span>
          All Rights Reserved · <a href="#admin" onClick={e => { e.preventDefault(); onAdminOpen(); }} title="Authorized personnel only">Staff Login</a>
        </span>
      </div>
    </footer>
  );
}