'use client';

import { getUser } from '@/services/auth-service';
import { getAllCategories, getCategoryById } from '@/services/category-service';
import { User } from '@/type/User.type';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
// Kiểu cho user – có thể mở rộng sau

interface Category {
    updated_at: string;
    name: string;
    created_at: string;
    id: number;
    slug: string;
}
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  categories: Category[];
}

// Tạo context mặc định là undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        try {
          let isTokenValid = await getUser();
          if(isTokenValid) {
            setUser(user);
          }
        }catch(error) {
          console.log(error)
          toast.error("Trạng thái đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    };
    const fetchCategories = async () => {
      if(categories.length === 0) {
        const categoriesJson = await getAllCategories();
        
        if (categoriesJson) {
          setCategories(categoriesJson.categories);
        }
      }
    }
    fetchUser();
    fetchCategories();
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
    <AuthContext.Provider value={{ user, login, logout, categories }}>
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
