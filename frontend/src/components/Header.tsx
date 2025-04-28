'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout, username, userRole } = useAuth();
  const pathname = usePathname();
  
  // Определяем активный пункт меню
  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary-700' : '';
  };
  
  // Функция для получения отображаемого названия роли
  const getRoleDisplayName = () => {
    switch(userRole) {
      case 'superuser':
        return 'Суперпользователь';
      case 'admin':
        return 'Администратор';
      default:
        return 'Пользователь';
    }
  };
  
  // Функция для получения иконки роли
  const getRoleIcon = () => {
    switch(userRole) {
      case 'superuser':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'admin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  return (
    <header className="bg-primary-600 text-white shadow-md">
    <div className="container mx-auto px-4">
    <div className="flex justify-between items-center py-4">
    <Link href="/" className="text-2xl font-bold">
    Система обращений
    </Link>
    
    <nav className="flex space-x-1">
    <Link 
    href="/appeals" 
    className={`px-3 py-2 rounded hover:bg-primary-700 ${isActive('/appeals')}`}
    >
    Обращения
    </Link>
    
    {isAuthenticated ? (
    <>
    <Link 
    href="/dashboard" 
    className={`px-3 py-2 rounded hover:bg-primary-700 ${isActive('/dashboard')}`}
    >
    Мои задачи
    </Link>
    {isAuthenticated && (
    <span className={`px-3 py-2 flex items-center ${userRole === 'superuser' ? 'text-yellow-300' : userRole === 'admin' ? 'text-green-300' : 'text-white'}`}>
    <div className="flex items-center">
    {getRoleIcon()}
    {username} ({getRoleDisplayName()})
    </div>
    </span>
    )}
    <button 
    onClick={logout} 
    className="px-3 py-2 rounded hover:bg-primary-700"
    >
    Выйти
    </button>
    </>
    ) : (
              <>
                <Link 
                  href="/login" 
                  className={`px-3 py-2 rounded hover:bg-primary-700 ${isActive('/login')}`}
                >
                  Войти
                </Link>
                <Link 
                  href="/register" 
                  className={`px-3 py-2 rounded hover:bg-primary-700 ${isActive('/register')}`}
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
