import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, apiMe, apiRefresh, isAccessTokenExpired } from '../api/auth';

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const clearLocalSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const persistTokens = useCallback((data) => {
    const access = data.accessToken || data.token;
    if (!access || !data.user) return;
    localStorage.setItem('token', access);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    else localStorage.removeItem('refreshToken');
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const completeLogin = useCallback(
    (data) => {
      persistTokens(data);
    },
    [persistTokens]
  );

  const logout = useCallback(async () => {
    const access = localStorage.getItem('token');
    try {
      if (access) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${access}` },
        });
      }
    } catch {
      /* ignorar red */
    }
    clearLocalSession();
    navigate('/');
  }, [clearLocalSession, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const access = localStorage.getItem('token');
      const refresh = localStorage.getItem('refreshToken');

      try {
        if (refresh && (!access || isAccessTokenExpired(access))) {
          const data = await apiRefresh(refresh);
          if (cancelled) return;
          persistTokens({
            ...data,
            refreshToken: data.refreshToken || refresh,
          });
          setReady(true);
          return;
        }

        if (access && !isAccessTokenExpired(access)) {
          try {
            const me = await apiMe(access);
            if (cancelled) return;
            const u = {
              id: me.id,
              nombre: me.nombre,
              role: me.role,
              zone_id: me.zone_id ?? null,
              plates: me.plates ?? null,
            };
            localStorage.setItem('user', JSON.stringify(u));
            setUser(u);
            setReady(true);
            return;
          } catch {
            if (refresh) {
              const data = await apiRefresh(refresh);
              if (cancelled) return;
              persistTokens({
                ...data,
                refreshToken: data.refreshToken || refresh,
              });
              setReady(true);
              return;
            }
          }
        }
      } catch {
        if (!cancelled) clearLocalSession();
      }

      if (!cancelled) {
        const u = readStoredUser();
        if (u && access && !isAccessTokenExpired(access)) setUser(u);
        setReady(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [clearLocalSession, persistTokens]);

  const value = useMemo(
    () => ({
      user,
      ready,
      completeLogin,
      logout,
      clearLocalSession,
    }),
    [user, ready, completeLogin, logout, clearLocalSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
