'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Если пользователь уже авторизован, перенаправляем на dashboard
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(username, password);
      toast.success('Регистрация прошла успешно');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.status === 503) {
        toast.error('Ошибка на сервере или пользователь уже существует');
      } else {
        toast.error('Ошибка регистрации');
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
            <h1 className="text-3xl font-bold">Регистрация</h1>
            <p className="mt-2 text-gray-600">
              Создайте учетную запись для доступа к системе
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
                  placeholder="Придумайте имя пользователя"
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
                  placeholder="Придумайте пароль"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Подтверждение пароля
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Повторите пароль"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full mb-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
              
              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Уже есть аккаунт?{' '}
                  <Link href="/login" className="text-primary-600 hover:text-primary-800">
                    Войти
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
