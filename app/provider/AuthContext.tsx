'use client';

import { User } from '@/type/User.type';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
// Kiểu cho user – có thể mở rộng sau


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Tạo context mặc định là undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const login = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
  };

  const logout = () => {
    localStorage.removeItem('user');
    toast.success("Đăng xuất thành công")
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để xài trong component
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải dùng bên trong AuthProvider!');
  return context;
};
