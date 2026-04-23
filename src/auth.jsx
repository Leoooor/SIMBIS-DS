import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const USERS_KEY   = "dp_users";
const SESSION_KEY = "dp_session";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setUser(JSON.parse(s));
    } catch {}
    setLoading(false);
  }, []);

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email === email))
      return { ok: false, error: "Email sudah terdaftar." };
    const newUser = { id: Date.now(), name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const session = { id: newUser.id, name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const login = (email, password) => {
    const found = getUsers().find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "Email atau password salah." };
    const session = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
