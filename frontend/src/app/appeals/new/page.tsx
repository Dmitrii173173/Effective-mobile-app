'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AppealForm from '@/components/AppealForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAppeal() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  
  const handleSuccess = () => {
    setSubmitted(true);
    
    // Автоматически перенаправляем на список обращений через 3 секунды
    setTimeout(() => {
      router.push('/appeals');
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/appeals" className="text-primary-600 hover:text-primary-800 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Создать новое обращение</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">
                    Обращение успешно создано!
                  </h3>
                  <div className="mt-2 text-green-700">
                    <p>Ваше обращение принято в обработку. Вы будете перенаправлены на страницу со списком обращений.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Создать еще одно обращение
                      </button>
                      <Link
                        href="/appeals"
                        className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Перейти к списку обращений
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AppealForm onSuccess={handleSuccess} />
          )}
        </div>
      </main>
    </div>
  );
}
