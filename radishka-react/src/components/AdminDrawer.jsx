import { useState, useRef } from 'react';
import RequestModal from './RequestModal';
import { DEFAULT, clone, deepMerge, getPath, setPath, NOIMG, RKEY } from '../defaultContent';

const FIELDS = [
  { g: 'SITE IDENTITY', f: [['site.name','Company name'],['site.nameSi','Name (Sinhala)'],['site.logoUrl','Logo Image URL (Leave blank for animated gear)','image'],['site.badge','Hero badge line'],['site.since','Est. label'],['site.bandEn1','Big band line 1'],['site.bandEn2','Big band line 2'],['site.bandSi','Band Sinhala line']] },
  { g: 'HERO', f: [['hero.kicker','Sinhala tagline under title'],['hero.t1','Title line 1'],['hero.t2','Title line 2'],['hero.sub','Sub-text','textarea'],['hero.cta1','Primary button text'],['hero.cta2','Secondary button text']] },
  { g: 'FEATURED BUILD', f: [['featured.stamp','Stamp label'],['featured.title','Machine name'],['featured.si','Sinhala name'],['featured.quote','Quote (Sinhala)','textarea'],['featured.story','Story paragraph','textarea'],['featured.specs','Specs — one per line as LABEL: value','textarea'],['featured.img','Image URL','image']] },
  { g: 'IMAGES', f: [['images.heroBg','Hero background (optional)','image'],['images.bandImg','Full-width band image','image'],['images.aboutImg','About portrait','image']] },
  { g: 'ABOUT', f: [['about.name','Section title'],['about.p1','Paragraph 1','textarea'],['about.p2','Paragraph 2','textarea'],['about.sign','Signature line']] },
  { g: 'CONTACT & LOCATION', f: [['contact.phone','Phone'],['contact.whatsapp','WhatsApp Phone Number'],['contact.email','Email'],['contact.address','Address'],['contact.hours','Opening hours'],['contact.mapLat','Workshop Latitude (e.g. 6.705659)'],['contact.mapLng','Workshop Longitude (e.g. 80.557734)']] },
  { g: 'TICKER', f: [['ticker','Ticker items — one per line','lines']] },
];

const LISTS = [
  { path:'machines', g:'MACHINES / PROJECTS', add:'ADD MACHINE', fields:[['name','Name (EN)'],['si','Name (Sinhala)'],['cat','Category'],['img','Image URL','image'],['desc','Short description','textarea'],['spec','Spec line']] },
  { path:'services', g:'SERVICES', add:'ADD SERVICE', fields:[['t','Title'],['d','Description','textarea']] },
  { path:'process', g:'PROCESS STEPS', add:'ADD STEP', fields:[['t','Title'],['si','Sinhala title'],['d','Description','textarea']] },
  { path:'stats', g:'STATS', add:'ADD STAT', fields:[['v','Value'],['s','Suffix'],['l','Label']] },
  { path:'testimonials', g:'TESTIMONIALS', add:'ADD TESTIMONIAL', fields:[['q','Quote','textarea'],['n','Name'],['r','Role / place']] },
  { path:'faq', g:'FAQ', add:'ADD QUESTION', fields:[['q','Question','textarea'],['a','Answer','textarea']] },
];

const TPL = {
  machines:{name:'New machine',si:'',cat:'Custom',img:'',desc:'',spec:''},
  services:{t:'New service',d:''},
  process:{t:'New step',si:'',d:''},
  stats:{v:'0',s:'',l:'New stat'},
  testimonials:{q:'New testimonial',n:'Name',r:'Place'},
  faq:{q:'New question?',a:'Answer…'},
};

function FieldRow({ path, label, type, val, onImg, onChange }) {
  const [imgSrc, setImgSrc] = useState(val || '');
  if (type === 'textarea' || type === 'lines') {
    return (
      <div className="s-row">
        <label>{label}</label>
        <textarea data-path={path} value={type === 'lines' ? (Array.isArray(val) ? val.join('\n') : val) : (val || '')}
          onChange={e => onChange(path, e.target.value, type)} />
      </div>
    );
  }
  if (type === 'image') {
    return (
      <div className="s-row">
        <label>{label}</label>
        <div className="s-imgrow">
          <input type="text" data-path={path} value={val || ''} placeholder="https://res.cloudinary.com/…"
            onChange={e => { setImgSrc(e.target.value); onChange(path, e.target.value, type); }} />
          <img className="s-prev" src={imgSrc && imgSrc.trim() ? imgSrc : NOIMG} onError={e => { e.target.src = NOIMG; }} alt="" />
        </div>
      </div>
    );
  }
  return (
    <div className="s-row">
      <label>{label}</label>
      <input type="text" data-path={path} value={val || ''} onChange={e => onChange(path, e.target.value, 'text')} />
    </div>
  );
}

function AuthGate({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = onLogin(user.trim().toLowerCase(), pass);
    if (!ok) { setErr('✕ Wrong username or password.'); setPass(''); }
  };

  return (
    <div className="adm-gate">
      <div className="adm-lock">⚙</div>
      <h3>Admin sign in</h3>
      <p>This area is for KRS KING staff. Sign in to read machine requests and edit the website content.</p>
      <form onSubmit={handleSubmit}>
        <div className="s-row"><label htmlFor="admUser">Username</label><input id="admUser" type="text" autoComplete="username" value={user} onChange={e => setUser(e.target.value)} placeholder="username" /></div>
        <div className="s-row"><label htmlFor="admPass">Password</label><input id="admPass" type="password" autoComplete="current-password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" /></div>
        {err && <div className="adm-errm" role="alert">{err}</div>}
        <button className="btn btn-solid" type="submit" style={{ width: '100%', justifyContent: 'center' }}><span>Sign in</span> <span className="ar">→</span></button>
      </form>
      <p className="s-hint" style={{ marginTop: '14px' }}>Forgot the password? It is stored in the site source.</p>
    </div>
  );
}

export default function AdminDrawer({ open, state, setState, onClose, loggedIn, adminUser, tryLogin, logout, contentError, loadRequests, saveToFirebase, showToast, loadFeedback, deleteFeedback }) {
  const [requests, setRequests] = useState([]);
  const [reqError, setReqError] = useState('');
  const [reqLoading, setReqLoading] = useState(false);
  const [viewReq, setViewReq] = useState(null);
  const [savedVisible, setSavedVisible] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [deletingFb, setDeletingFb] = useState(null);
  const savedTimer = useRef(null);
  const importRef = useRef(null);

  const flashSaved = () => {
    setSavedVisible(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSavedVisible(false), 1200);
  };

  const handleFieldChange = (path, rawVal, type) => {
    let v = rawVal;
    if (type === 'lines') v = rawVal.split('\n').map(x => x.trim()).filter(Boolean);
    setState(prev => {
      const next = clone(prev);
      setPath(next, path, v);
      if (path === 'ticker') next.ticker = v;
      return next;
    });
    // debounced save
    clearTimeout(handleFieldChange._t);
    handleFieldChange._t = setTimeout(() => {
      setState(s => { saveToFirebase(s).then(flashSaved); return s; });
    }, 600);
  };

  const handleListAction = (act, listPath, idx) => {
    const next = clone(state);
    const arr = getPath(next, listPath);
    let changed = true;
    if (act === 'add') arr.push(clone(TPL[listPath]));
    else if (act === 'del') { if (!window.confirm('Delete this item?')) return; arr.splice(idx, 1); }
    else if (act === 'up') { if (idx > 0) [arr[idx], arr[idx-1]] = [arr[idx-1], arr[idx]]; else changed = false; }
    else if (act === 'down') { if (idx < arr.length - 1) [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]]; else changed = false; }
    if (!changed) return;
    setState(next);
    saveToFirebase(next).then(flashSaved);
    showToast(act === 'add' ? 'Item added' : act === 'del' ? 'Item deleted' : 'Reordered');
  };

  const handleListFieldChange = (path, rawVal, type) => {
    let v = rawVal;
    setState(prev => {
      const next = clone(prev);
      setPath(next, path, v);
      return next;
    });
    clearTimeout(handleListAction._t);
    handleListAction._t = setTimeout(() => {
      setState(s => { saveToFirebase(s).then(flashSaved); return s; });
    }, 600);
  };

  const handleRefreshReq = async () => {
    setReqLoading(true);
    const { items, error } = await loadRequests();
    setRequests(items);
    setReqError(error);
    setReqLoading(false);
    showToast(error ? 'Could not load requests' : `${items.length} request(s) loaded`);
  };

  const handleRefreshFeedback = async () => {
    setFeedbackLoading(true);
    const { items, error } = await loadFeedback();
    setFeedbackItems(items);
    setFeedbackError(error);
    setFeedbackLoading(false);
    showToast(error ? 'Could not load feedback' : `${items.length} feedback item(s) loaded`);
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Remove this feedback permanently?')) return;
    setDeletingFb(id);
    const { ok } = await deleteFeedback(id);
    if (ok) {
      setFeedbackItems(prev => prev.filter(f => f.id !== id));
      showToast('Feedback removed');
    } else {
      showToast('Could not delete — check connection');
    }
    setDeletingFb(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'krs-king-content.json';
    a.click();
    showToast('Content exported');
  };

  const handleImport = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const obj = JSON.parse(r.result);
        const next = deepMerge(clone(DEFAULT), obj);
        setState(next);
        saveToFirebase(next).then(flashSaved);
        showToast('Content imported ✓');
      } catch (_) { showToast('Invalid JSON file'); }
    };
    r.readAsText(f);
    e.target.value = '';
  };

  const handleReset = () => {
    if (!window.confirm('Reset ALL content to the original defaults? Your edits will be lost.')) return;
    setState(clone(DEFAULT));
    saveToFirebase(clone(DEFAULT)).then(flashSaved);
    showToast('Reset to defaults');
  };

  const fmtWhen = (r) => {
    if (r.created && typeof r.created.toDate === 'function') { try { return r.created.toDate().toLocaleString(); } catch (_) {} }
    return r.d || '—';
  };

  // Load requests when drawer opens and user is logged in
  const prevOpen = useRef(false);
  if (open && !prevOpen.current && loggedIn) {
    prevOpen.current = true;
    handleRefreshReq();
  }
  if (!open) prevOpen.current = false;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser');
      return;
    }
    showToast('Detecting GPS coordinates…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setState(prev => {
          const next = clone(prev);
          if (!next.contact) next.contact = {};
          next.contact.mapLat = lat;
          next.contact.mapLng = lng;
          return next;
        });
        setState(s => { saveToFirebase(s).then(flashSaved); return s; });
        showToast(`Location set: ${lat.toFixed(6)}, ${lng.toFixed(6)} ✓`);
      },
      (err) => {
        showToast(`Could not get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const localReqs = (() => { try { return JSON.parse(localStorage.getItem(RKEY) || '[]'); } catch (_) { return []; } })();
  const displayReqs = requests.length ? requests.map(r => ({ ...r, _live: true })) : localReqs.map(r => ({ ...r, _live: false }));

  return (
    <>
      <div className={`drawer-veil${open ? ' show' : ''}`} onClick={onClose} />
      <aside className={`drawer${open ? ' open' : ''}`} role="dialog" aria-label="Admin settings">
        <div className="dr-head">
          <div>
            <b>{loggedIn ? '⚙ ADMIN PANEL' : '⚙ ADMIN'}</b>
            <small>
              {loggedIn
                ? <>CONTENT AUTO-SAVES TO FIREBASE<span className={`saved-flag${savedVisible ? ' show' : ''}`}>SAVED ✓</span></>
                : 'AUTHORISED ACCESS ONLY'}
            </small>
          </div>
          <button className="dr-close-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="dr-body">
          {!loggedIn ? (
            <AuthGate onLogin={(u, p) => { const ok = tryLogin(u, p); if (ok) showToast('Welcome back ✓'); return ok; }} />
          ) : (
            <>
              {/* Badge */}
              <div className="adm-badge">
                <div><b>Signed in as {adminUser}</b><small>ADMIN · FULL EDIT ACCESS</small></div>
                <button onClick={() => { logout(); showToast('Logged out'); }}>LOG OUT</button>
              </div>

              {/* Content error */}
              {contentError && (
                <div className="req-log" style={{ borderColor: '#ff7676' }}>
                  <b style={{ color: '#ff9a9a' }}>⚠ {contentError}</b>
                </div>
              )}

              {/* Requests inbox */}
              <details className="s-acc" open>
                <summary>📥 MACHINE REQUESTS</summary>
                <div className="s-in">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <button className="s-add" style={{ flex: 1 }} onClick={handleRefreshReq} disabled={reqLoading}>
                      {reqLoading ? '⟳ Loading…' : '⟳ REFRESH FROM FIREBASE'}
                    </button>
                  </div>
                  {reqError && <div className="req-log" style={{ borderColor: '#ff7676' }}><b style={{ color: '#ff9a9a' }}>⚠ {reqError}</b></div>}
                  <div className="req-log">
                    {displayReqs.length === 0 ? <i>No requests yet. New website requests appear here automatically.</i> :
                      displayReqs.map((r, i) => (
                        <div key={i} className="req-item">
                          <div className="rt">{r._live ? '● LIVE' : '○ OFFLINE'} · {fmtWhen(r)}</div>
                          <div><b>{r.name || '—'}</b>{r.phone && <> · <a href={`tel:${r.phone}`}>{r.phone}</a></>}</div>
                          <p>{r.idea}</p>
                          {r.msg && <p style={{ color: 'var(--dim)', marginTop: '4px' }}>{r.msg}</p>}
                          <button className="s-add" style={{ marginTop: '8px', padding: '8px' }} onClick={() => setViewReq(r)}>VIEW REQUEST</button>
                        </div>
                      ))
                    }
                  </div>
                  <p className="s-hint" style={{ marginTop: '10px' }}>Every request sent from the website form is stored in Firebase and listed here.</p>
                </div>
              </details>

              {/* Feedback manager */}
              <details className="s-acc">
                <summary>💬 CUSTOMER FEEDBACK</summary>
                <div className="s-in">
                  <button className="s-add" onClick={handleRefreshFeedback} disabled={feedbackLoading}>
                    {feedbackLoading ? '⟳ Loading…' : '⟳ REFRESH FEEDBACK'}
                  </button>
                  {feedbackError && <div className="req-log" style={{ borderColor: '#ff7676', marginTop: '8px' }}><b style={{ color: '#ff9a9a' }}>⚠ {feedbackError}</b></div>}
                  <div className="req-log" style={{ marginTop: '8px', maxHeight: '260px' }}>
                    {feedbackItems.length === 0
                      ? <i>No feedback loaded. Press refresh to load from Firebase.</i>
                      : feedbackItems.map(fb => (
                        <div key={fb.id} className="req-item">
                          <div className="rt">{'★'.repeat(fb.rating || 5)} · {fb.name} {fb.role ? `· ${fb.role}` : ''}</div>
                          <p style={{ margin: '4px 0', fontSize: '.85rem' }}>{fb.message}</p>
                          <button
                            className="fb-del-btn"
                            style={{ marginTop: '6px' }}
                            onClick={() => handleDeleteFeedback(fb.id)}
                            disabled={deletingFb === fb.id}
                          >
                            {deletingFb === fb.id ? 'Removing…' : '✕ Remove'}
                          </button>
                        </div>
                      ))
                    }
                  </div>
                  <p className="s-hint" style={{ marginTop: '8px' }}>Customer feedback is stored in the Firebase "feedback" collection. Remove inappropriate entries here.</p>
                </div>
              </details>

              {/* Field groups */}
              {FIELDS.map(gr => (
                <details key={gr.g} className="s-acc">
                  <summary>{gr.g}</summary>
                  <div className="s-in">
                    {gr.f.map(([path, label, type]) => (
                      <FieldRow key={path} path={path} label={label} type={type || 'text'} val={getPath(state, path)} onChange={handleFieldChange} />
                    ))}
                    {gr.g === 'CONTACT & LOCATION' && (
                      <button
                        type="button"
                        className="s-add"
                        style={{ marginTop: '10px', borderColor: 'var(--brass)', color: 'var(--brass)' }}
                        onClick={handleUseCurrentLocation}
                      >
                        📍 USE CURRENT LOCATION (GEO-LOCATE GPS)
                      </button>
                    )}
                  </div>
                </details>
              ))}

              {/* List groups */}
              {LISTS.map(L => {
                const arr = getPath(state, L.path) || [];
                return (
                  <details key={L.path} className="s-acc">
                    <summary>{L.g} ({arr.length})</summary>
                    <div className="s-in">
                      {arr.map((item, i) => (
                        <div key={i} className="s-item">
                          <div className="s-item-top">
                            <b>{L.g.split('/')[0].trim()} {String(i + 1).padStart(2, '0')}</b>
                            <span className="s-item-btns">
                              <button onClick={() => handleListAction('up', L.path, i)} title="Move up">▲</button>
                              <button onClick={() => handleListAction('down', L.path, i)} title="Move down">▼</button>
                              <button className="del" onClick={() => handleListAction('del', L.path, i)} title="Delete">✕</button>
                            </span>
                          </div>
                          {L.fields.map(([fk, flabel, ftype]) => (
                            <FieldRow
                              key={fk}
                              path={`${L.path}.${i}.${fk}`}
                              label={flabel}
                              type={ftype || 'text'}
                              val={item[fk]}
                              onChange={handleListFieldChange}
                            />
                          ))}
                        </div>
                      ))}
                      <button className="s-add" onClick={() => handleListAction('add', L.path, 0)}>+ {L.add}</button>
                    </div>
                  </details>
                );
              })}

              {/* Data tools */}
              <details className="s-acc">
                <summary>DATA &amp; TOOLS</summary>
                <div className="s-in">
                  <div className="s-btns">
                    <button onClick={handleExport}>⬇ EXPORT JSON</button>
                    <button onClick={() => importRef.current?.click()}>⬆ IMPORT JSON</button>
                    <button className="danger" onClick={() => { localStorage.removeItem(RKEY); showToast('Offline cache cleared'); }}>CLEAR OFFLINE CACHE</button>
                    <button className="danger" onClick={handleReset}>RESET DEFAULTS</button>
                  </div>
                  <p className="s-hint" style={{ marginTop: '12px' }}>Content auto-saves to Firebase. Export saves everything to a file — import it on another device to move the content.</p>
                  <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={handleImport} />
                </div>
              </details>
            </>
          )}
        </div>
      </aside>

      {viewReq && <RequestModal req={viewReq} onClose={() => setViewReq(null)} />}
    </>
  );
}
