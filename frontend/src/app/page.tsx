'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Система управления обращениями
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Простая и удобная система для создания и отслеживания обращений. Решайте проблемы эффективно!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/appeals" className="btn btn-primary text-lg px-8 py-3">
              Просмотр обращений
            </Link>
            <Link href="/appeals/new" className="btn btn-secondary text-lg px-8 py-3">
              Создать обращение
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Создание обращений</h2>
            <p className="text-gray-600">
              Легко создавайте новые обращения, указывая тему и подробное описание проблемы.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Отслеживание статусов</h2>
            <p className="text-gray-600">
              Наблюдайте за изменением статуса вашего обращения: новое, в работе, завершено или отменено.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Фильтрация по датам</h2>
            <p className="text-gray-600">
              Удобно фильтруйте обращения по конкретной дате или выбирайте произвольный диапазон дат.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Система обращений. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
