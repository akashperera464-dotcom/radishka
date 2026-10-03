export default function RequestModal({ req, onClose }) {
  if (!req) return null;
  const fmtWhen = (r) => {
    if (r.created && typeof r.created.toDate === 'function') {
      try { return r.created.toDate().toLocaleString(); } catch (_) {}
    }
    return r.d || '—';
  };
  const rows = [
    ['NAME', req.name],
    ['PHONE', req.phone],
    ['NEED', req.idea],
    ['DETAILS', req.msg],
    ['RECEIVED', fmtWhen(req)],
    ['SOURCE', req.source || 'website'],
    ['ID', req.id || '—(offline copy)'],
  ].filter(x => x[1]);

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,6,9,.72)', backdropFilter: 'blur(3px)', zIndex: 319 }}
        onClick={onClose}
      />
      <div className="req-modal open" style={{ display: 'block' }}>
        <div className="rm-head">
          <b>REQUEST · {String(req.name || '').toUpperCase()}</b>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="rm-body">
          {rows.map(([label, val]) => (
            <div key={label} className="rm-row">
              <b>{label}</b>
              <span>{String(val)}</span>
            </div>
          ))}
          {req.phone && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a className="btn btn-ghost" href={`tel:${req.phone}`}>CALL BACK</a>
              <a className="btn btn-ghost" href={`mailto:?subject=${encodeURIComponent('KRS KING — your machine request')}`}>EMAIL</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
