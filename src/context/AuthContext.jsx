// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Key under which we’ll keep our “database” of users
const USERS_KEY = 'app_users';
// Key for the currently logged‑in user
const CURRENT_KEY = 'app_currentUser';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, rehydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Helper to read/write our local “DB”
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  };
  const saveUsers = (users) =>
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // REGISTER: simulate async, then add to localStorage
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.find((u) => u.email === userData.email)) {
          return reject(new Error('Email already in use'));
        }
        // you might hash passwords here in prod
        users.push(userData);
        saveUsers(users);

        // auto‑login after register
        localStorage.setItem(CURRENT_KEY, JSON.stringify(userData));
        setUser(userData);

        resolve(userData);
      }, 300);
    });
  };

  // LOGIN: simulate async, check against localStorage users
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const found = users.find(
          (u) => u.email === email && u.password === password
        );
        if (!found) {
          return reject(new Error('Invalid email or password'));
        }
        localStorage.setItem(CURRENT_KEY, JSON.stringify(found));
        setUser(found);
        resolve(found);
      }, 300);
    });
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
