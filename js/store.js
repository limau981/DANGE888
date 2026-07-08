export const state = {
  cart: {}, // id -> qty
  session: null, // { identifier, identifierDisplay }
};

export const AUTH_USERS_KEY = 'dange888_users_v1';
export const AUTH_SESSION_KEY = 'dange888_session_v1';

export function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function getUsers() {
  const raw = localStorage.getItem(AUTH_USERS_KEY);
  const users = safeJsonParse(raw, {});
  return users && typeof users === 'object' ? users : {};
}

export function setUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

export function normalizeIdentifier(s) {
  return (s || '').toString().trim().toLowerCase();
}

export function getSession() {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  return safeJsonParse(raw, null);
}

export function setSession(session) {
  state.session = session;
  if (!session) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function isLoggedIn() {
  return !!state.session;
}

