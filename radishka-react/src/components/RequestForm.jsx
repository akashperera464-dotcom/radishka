import { useState } from 'react';
import ContactMap from './ContactMap';

export default function RequestForm({ state, onSubmit, onAdminOpen }) {
  const c = state.contact || {};
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', idea: '', msg: '' });

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.idea) return;
    setSending(true);
    await onSubmit(form);
    setSending(false);
    setForm({ name: '', phone: '', idea: '', msg: '' });
  };

  return (
    <section className="sec" id="request">
      <div className="wrap">
        <div className="req-grid">
          <div className="reveal">
            <p className="overline">/// START YOUR PROJECT · <span className="si" style={{ letterSpacing: 0 }}>ඔබේ ව්‍යාපෘතිය අරඹන්න</span></p>
            <h2 className="sec-t" data-scramble data-txt="REQUEST A QUOTE">REQUEST A QUOTE</h2>
            <p className="hero-sub" style={{ marginTop: '18px' }}>
              Describe the job — a machine that doesn&apos;t exist yet, a technical solution, or a construction project. You&apos;ll get an honest answer and a fixed quote, usually within a day.
            </p>
            <div className="req-info">
              <a href={`tel:${c.phone}`}>
                <span><b>CALL</b></span>
                <span>{c.phone || '+94 76 159 9289'}</span>
              </a>
              <a href={`mailto:${c.email}`}>
                <span><b>EMAIL</b></span>
                <span>{c.email || 'hello@krsking.lk'}</span>
              </a>
              <div><span><b>WORKSHOP</b></span><span>{c.address}</span></div>
              <div><span><b>HOURS</b></span><span>{c.hours}</span></div>
            </div>
          </div>
          <form className="form reveal" id="reqForm" style={{ '--d': '140ms' }} onSubmit={handleSubmit}>
            <div className="f-row">
              <label htmlFor="rName">Your name · ඔබේ නම</label>
              <input id="rName" name="name" required placeholder="Nimal Perera" value={form.name} onChange={handleChange} />
            </div>
            <div className="f-row">
              <label htmlFor="rPhone">Phone · දුරකථන අංකය</label>
              <input id="rPhone" name="phone" required placeholder="07X XXX XXXX" value={form.phone} onChange={handleChange} />
            </div>
            <div className="f-row">
              <label htmlFor="rIdea">Required machine / service · අවශ්‍ය යන්ත්‍රය හෝ සේවාව</label>
              <input id="rIdea" name="idea" required placeholder="e.g. A machine to grind cardamom without heating it" value={form.idea} onChange={handleChange} />
            </div>
            <div className="f-row">
              <label htmlFor="rMsg">Project details · ව්‍යාපෘති විස්තරය</label>
              <textarea id="rMsg" name="msg" placeholder="Capacity, space, budget — anything that helps" value={form.msg} onChange={handleChange}></textarea>
            </div>
            <button className="btn btn-solid" type="submit" id="reqSubmit" disabled={sending}>
              <span>{sending ? 'Sending…' : 'Send request'}</span> <span className="ar">→</span>
            </button>
            <p className="s-hint" style={{ marginTop: '14px' }}>
              Your request goes straight to our workshop admin panel and is saved securely to our Firebase database. We answer usually within a day.
            </p>
            <p className="s-hint" style={{ marginTop: '8px' }}>
              Workshop staff: <a href="#" id="formAdmin" style={{ color: 'var(--brass)' }} onClick={e => { e.preventDefault(); onAdminOpen(); }}>⚙ open admin / settings</a>
            </p>
          </form>
        </div>

        {/* Embedded Interactive Workshop Map */}
        <ContactMap lat={c.mapLat} lng={c.mapLng} address={c.address} />
      </div>
    </section>
  );
}
