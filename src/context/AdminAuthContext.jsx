import React, { createContext, useContext, useState } from 'react';
import { api } from '../lib/api';

const AdminAuthContext = createContext();

function readValidToken() {
  const token = localStorage.getItem('adminToken');
  const expiry = localStorage.getItem('adminTokenExpiry');
  if (!token || !expiry) return null;
  if (Date.now() > Number(expiry)) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    return null;
  }
  return token;
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(readValidToken()));
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setError(null);
    try {
      const data = await api.login(username, password);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminTokenExpiry', String(Date.now() + data.expiresIn * 1000));
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
