'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Если пользователь уже авторизован, перенаправляем на dashboard
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(username, password);
      toast.success('Успешный вход в систему');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 404) {
        toast.error('Пользователь не найден');
      } else if (error.response?.status === 401) {
        toast.error('Неверный пароль');
      } else {
        toast.error('Ошибка входа в систему');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Вход в систему</h1>
            <p className="mt-2 text-gray-600">
              Войдите в свою учетную запись для доступа к задачам
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full mb-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>
              
              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Нет учетной записи?{' '}
                  <Link href="/register" className="text-primary-600 hover:text-primary-800">
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
