import { useState, useCallback, useRef } from 'react';
import { getDoc, setDoc, onSnapshot, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { SITE_DOC, REQUESTS_COL } from '../firebase';
import { DEFAULT, clone, deepMerge, RKEY } from '../defaultContent';

function needsRules(e) {
  return /permission|insufficient|PERMISSION_DENIED/i.test(String((e && (e.code || e.message)) || ''));
}

export function useFirebase() {
  const [state, setStateRaw] = useState(clone(DEFAULT));
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [contentError, setContentError] = useState('');
  const stateRef = useRef(clone(DEFAULT));

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      stateRef.current = next;
      return next;
    });
  }, []);

  const loadFromFirebase = useCallback(async () => {
    try {
      const snap = await getDoc(SITE_DOC);
      if (snap.exists()) {
        const merged = deepMerge(clone(DEFAULT), snap.data());
        setState(merged);
        setFirebaseReady(true);
      } else {
        await setDoc(SITE_DOC, stateRef.current);
        setFirebaseReady(true);
      }
    } catch (e) {
      console.warn('Firebase load failed, using localStorage fallback', e);
      setContentError(
        needsRules(e)
          ? 'Firestore refused access to the site content. Publish the rules file so the "site" collection is readable — until then edits stay on this device.'
          : 'Firebase was unreachable — the site is showing its built-in defaults.'
      );
      try {
        const raw = localStorage.getItem('krs_king_site_v1');
        if (raw) setState(s => deepMerge(clone(s), JSON.parse(raw)));
      } catch (_) {}
    }
  }, [setState]);

  const saveToFirebase = useCallback(async (currentState) => {
    if (!firebaseReady) return;
    try {
      await setDoc(SITE_DOC, currentState);
    } catch (e) {
      console.warn('Firebase save failed', e);
      setContentError(
        needsRules(e)
          ? 'Firestore refused the save — edits stored on this device only.'
          : 'Could not reach Firebase — your edit is saved on this device only.'
      );
      try { localStorage.setItem('krs_king_site_v1', JSON.stringify(currentState)); } catch (_) {}
    }
  }, [firebaseReady]);

  const listenToFirebase = useCallback(() => {
    return onSnapshot(SITE_DOC, (snap) => {
      if (snap.exists() && snap.data()) {
        const remote = snap.data();
        if (JSON.stringify(remote) !== JSON.stringify(stateRef.current)) {
          setState(s => deepMerge(clone(s), remote));
        }
      }
    }, (err) => {
      console.warn('Live sync unavailable', err);
      setContentError(
        needsRules(err)
          ? 'Firestore refused access. Publish the rules file so the "site" collection is readable.'
          : 'Live sync is offline — the site is showing the content stored on this device.'
      );
    });
  }, [setState]);

  const submitRequest = useCallback(async ({ name, phone, idea, msg }) => {
    try {
      await addDoc(REQUESTS_COL, { name, phone, idea, msg, created: serverTimestamp(), source: 'website' });
      return { ok: true };
    } catch (err) {
      console.warn('Failed to save request to Firestore', err);
      try {
        const list = JSON.parse(localStorage.getItem(RKEY) || '[]');
        list.unshift({ d: new Date().toISOString().slice(0, 10), name, phone, idea, msg });
        localStorage.setItem(RKEY, JSON.stringify(list.slice(0, 50)));
      } catch (_) {}
      return { ok: false };
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      let snap;
      try { snap = await getDocs(query(REQUESTS_COL, orderBy('created', 'desc'), limit(100))); }
      catch (e) { snap = await getDocs(REQUESTS_COL); }
      const items = [];
      snap.forEach(d => items.push({ id: d.id, ...d.data() }));
      return { items, error: '' };
    } catch (e) {
      const errMsg = needsRules(e)
        ? 'Firestore refused the read. Publish the rules file (krs-king-firestore.rules), then press refresh.'
        : 'Could not reach Firebase. Check internet connection, then press refresh.';
      return { items: [], error: errMsg };
    }
  }, []);

  return {
    state, setState, stateRef,
    firebaseReady, contentError,
    loadFromFirebase, saveToFirebase,
    listenToFirebase, submitRequest, loadRequests,
  };
}
