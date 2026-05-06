import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'pet-shelter-auth-user';

const readStoredUser = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    return parsed
      ? {
          ...parsed,
          id: parsed.id ?? parsed.Id,
          email: parsed.email ?? parsed.Email,
          firstName: parsed.firstName ?? parsed.FirstName,
          lastName: parsed.lastName ?? parsed.LastName,
          roles: parsed.roles ?? parsed.Roles ?? [],
        }
      : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(readStoredUser()));
  const [loading, setLoading] = useState(false);

  const persistUser = (nextUser) => {
    if (!nextUser) {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      setIsAuthenticated(false);
      return;
    }

    // Normalize role property casing so frontend always reads `roles` (lowercase)
    const normalized = {
      ...nextUser,
      id: nextUser.id ?? nextUser.Id,
      email: nextUser.email ?? nextUser.Email,
      firstName: nextUser.firstName ?? nextUser.FirstName,
      lastName: nextUser.lastName ?? nextUser.LastName,
      roles: nextUser.roles ?? nextUser.Roles ?? [],
    };

    setUser(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setIsAuthenticated(true);
  };

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const currentUser = await authService.me();
        if (!active) {
          return;
        }

        persistUser(currentUser);
      } catch {
        if (!active) {
          return;
        }

        persistUser(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const roles = data?.roles ?? data?.Roles ?? [];
    persistUser({
      id: data?.id ?? data?.Id,
      email: data?.email ?? data?.Email ?? credentials.email,
      roles,
    });
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    persistUser({ email: payload.email, roles: ['User'] });
    return data;
  };

  const logout = async () => {
    await authService.logout();
    persistUser(null);
  };

  const deleteAccount = async () => {
    const data = await authService.deleteAccount();
    persistUser(null);
    return data;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    deleteAccount,
    setUser: persistUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}