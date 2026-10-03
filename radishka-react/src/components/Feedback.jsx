import { useState, useEffect } from 'react';

const STARS = [5, 4, 3, 2, 1];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="fb-stars" role="group" aria-label="Star rating">
      {STARS.map(s => (
        <button
          key={s}
          type="button"
          className={`fb-star ${s <= (hovered || value) ? 'lit' : ''}`}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
        >★</button>
      )).reverse()}
    </div>
  );
}

function FeedbackCard({ item, isAdmin, onDelete, deleting }) {
  return (
    <div className="fb-card reveal">
      <div className="fb-card-stars">
        {'★'.repeat(item.rating || 5)}
        <span className="fb-dim-stars">{'★'.repeat(5 - (item.rating || 5))}</span>
      </div>
      <p className="fb-msg">&ldquo;{item.message}&rdquo;</p>
      <div className="fb-who">
        <b>{item.name}</b>
        {item.role && <span>{item.role}</span>}
      </div>
      {isAdmin && (
        <button
          className="fb-del-btn"
          onClick={() => onDelete(item.id)}
          disabled={deleting === item.id}
          title="Remove this feedback"
        >
          {deleting === item.id ? '…' : '✕ Remove'}
        </button>
      )}
    </div>
  );
}

export default function Feedback({ submitFeedback, loadFeedback, deleteFeedback, isAdmin }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', role: '', message: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadFeedback().then(({ items }) => {
      setItems(items);
      setLoading(false);
    });
  }, [loadFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitting(true);
    const { ok } = await submitFeedback(form);
    if (ok) {
      setSubmitted(true);
      setFormOpen(false);
      // reload
      const { items: fresh } = await loadFeedback();
      setItems(fresh);
      setForm({ name: '', role: '', message: '', rating: 5 });
      setTimeout(() => setSubmitted(false), 4000);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this feedback?')) return;
    setDeleting(id);
    const { ok } = await deleteFeedback(id);
    if (ok) setItems(prev => prev.filter(i => i.id !== id));
    setDeleting(null);
  };

  return (
    <section className="sec" id="feedback">
      <div className="wrap">
        {/* Header */}
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// CUSTOMER VOICE · <span className="si" style={{ letterSpacing: 0 }}>ගනුදෙනුකරුවන්ගේ අදහස්</span></p>
            <h2 className="sec-t" data-scramble data-txt="WHAT CLIENTS SAY">WHAT CLIENTS SAY</h2>
          </div>
          <span className="num">{String(items.length).padStart(2, '0')}</span>
        </div>

        {/* Feedback cards grid */}
        {loading ? (
          <p className="fb-loading">Loading feedback…</p>
        ) : items.length === 0 ? (
          <p className="fb-empty">No feedback yet — be the first to share your experience!</p>
        ) : (
          <div className="fb-grid">
            {items.map(item => (
              <FeedbackCard
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </div>
        )}

        {/* Submit feedback CTA */}
        <div className="fb-cta-wrap reveal">
          {submitted && (
            <div className="fb-success">
              ✓ ඔබේ අදහස ලැබිණ! ස්තූතියි · Thank you for your feedback!
            </div>
          )}
          {!formOpen ? (
            <button className="btn btn-ghost" onClick={() => setFormOpen(true)}>
              ✦ Share Your Experience <span className="ar">→</span>
            </button>
          ) : (
            <form className="fb-form" onSubmit={handleSubmit}>
              <div className="fb-form-head">
                <b>ඔබේ අත්දැකීම බෙදාගන්න · Share your experience</b>
                <button type="button" className="fb-form-close" onClick={() => setFormOpen(false)}>✕</button>
              </div>

              <div className="fb-form-row">
                <div className="fb-form-field">
                  <label>Your name · ඔබේ නම</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Kamal Perera"
                  />
                </div>
                <div className="fb-form-field">
                  <label>Location / role · ස්ථානය</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Ratnapura, Farmer"
                  />
                </div>
              </div>

              <div className="fb-form-field">
                <label>Rating · ශ්‍රේණිගත කිරීම</label>
                <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
              </div>

              <div className="fb-form-field">
                <label>Your feedback · ඔබේ අදහස <span className="fb-req">*</span></label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="ඔබේ අත්දැකීම ගැන කෙටියෙන් කියන්න... / Tell us about your experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="fb-form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setFormOpen(false)} style={{ padding: '11px 20px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-solid" disabled={submitting} style={{ padding: '11px 24px' }}>
                  {submitting ? 'Sending…' : 'Submit Feedback →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
