import { useState, useCallback } from 'react';

const ADMIN_USER = 'radishka';
const ADMIN_PASS = 'radishka123*#';
const SESS_KEY = 'krs_admin_sess';

function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
const ADMIN_PASS_HASH = hashStr(ADMIN_PASS);

function getInitialLoggedIn() {
  try { return sessionStorage.getItem(SESS_KEY) === '1'; } catch (_) { return false; }
}

export function useAdmin() {
  const [loggedIn, setLoggedInState] = useState(getInitialLoggedIn);

  const setLogged = useCallback((v) => {
    try { v ? sessionStorage.setItem(SESS_KEY, '1') : sessionStorage.removeItem(SESS_KEY); } catch (_) {}
    setLoggedInState(!!v);
  }, []);

  const tryLogin = useCallback((user, pass) => {
    if (user.toLowerCase() === ADMIN_USER && hashStr(pass) === ADMIN_PASS_HASH) {
      setLogged(true);
      return true;
    }
    return false;
  }, [setLogged]);

  const logout = useCallback(() => setLogged(false), [setLogged]);

  return { loggedIn, tryLogin, logout, adminUser: ADMIN_USER };
}
