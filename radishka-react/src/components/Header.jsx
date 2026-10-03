import { useState } from 'react';

const GearIcon = () => (
  <svg className="gear-ic" viewBox="0 0 24 24">
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 5.2-2.1.4c-.1.5-.3 1-.5 1.4l1.2 1.8-1.7 1.7-1.8-1.2c-.4.2-.9.4-1.4.5l-.4 2.1h-2.4l-.4-2.1c-.5-.1-1-.3-1.4-.5L8.7 18.5 7 16.8l1.2-1.8c-.2-.4-.4-.9-.5-1.4l-2.1-.4v-2.4l2.1-.4c.1-.5.3-1 .5-1.4L7 7.2 8.7 5.5l1.8 1.2c.4-.2.9-.4 1.4-.5l.4-2.1h2.4l.4 2.1c.5.1 1 .3 1.4.5l1.8-1.2 1.7 1.7-1.2 1.8c.2.4.4.9.5 1.4l2.1.4v2.4z"/>
  </svg>
);

export default function Header({ state, scrolled, onAdminOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header id="hdr" className={scrolled ? 'scrolled' : ''}>
      <div className="wrap hd">
        <a className="logo" href="#top">
          {state.site?.logoUrl ? (
            <img src={state.site.logoUrl} alt={state.site?.name || 'KRS KING'} className="logo-img" />
          ) : (
            <GearIcon />
          )}
          <span className="logo-txt">
            <b>{state.site?.name || 'KRS KING (PVT) LTD'}</b>
          </span>
        </a>
        <nav className={`main${menuOpen ? ' openm' : ''}`} id="nav">
          <a href="#builds" onClick={() => setMenuOpen(false)}>BUILDS</a>
          <a href="#civil" onClick={() => setMenuOpen(false)}>CIVIL</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>PROCESS</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#request" className="btn btn-solid" style={{ padding: '11px 20px' }} onClick={() => setMenuOpen(false)}>
            {state.hero?.cta1 || 'Request a Quote'}
          </a>
          <a href="#" id="navAdmin" title="Admin settings" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onAdminOpen(); }}>⚙ ADMIN</a>
        </nav>
        <button id="burger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>☰</button>
      </div>
    </header>
  );
}
