'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AppealCard from '@/components/AppealCard';
import AppealFilter, { FilterParams } from '@/components/AppealFilter';
import CancelAllAppealsModal from '@/components/CancelAllAppealsModal';
import { Appeal, appeals } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Appeals() {
  const { isAdmin, isSuperUser, userRole } = useAuth();
  const [appealsList, setAppealsList] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const data = await appeals.getAll(filters);
      setAppealsList(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appeals:', error);
      setError('Не удалось загрузить список обращений');
      toast.error('Ошибка при загрузке обращений');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppeals();
  }, [filters]);
  
  const handleFilter = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };
  
  // Подсчет количества обращений по статусам
  const statusCounts = {
    new: appealsList.filter(a => a.status === 'new').length,
    in_progress: appealsList.filter(a => a.status === 'in_progress').length,
    completed: appealsList.filter(a => a.status === 'completed').length,
    cancelled: appealsList.filter(a => a.status === 'cancelled').length
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <CancelAllAppealsModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={fetchAppeals}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Обращения</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/appeals/new" className="btn btn-primary">
              Создать обращение
            </Link>
            
            {isSuperUser() && statusCounts.in_progress > 0 && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn btn-danger flex items-center"
              >
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Отменить все в работе ({statusCounts.in_progress})
              </button>
            )}
          </div>
        </div>
        
        {isAdmin() && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm leading-5 font-medium text-yellow-800">
                  Режим {userRole === 'superuser' ? 'суперпользователя' : 'администратора'} активен
                </p>
                <p className="text-sm leading-5 text-yellow-700 mt-1">
                  Вы можете управлять всеми обращениями: брать обращения в работу, завершать или отменять их.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AppealFilter onFilter={handleFilter} />
            
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Статистика</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                    Новые
                  </span>
                  <span className="font-medium">{statusCounts.new}</span>
                </div>
                <div className="flex justify-between">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                    В работе
                  </span>
                  <span className="font-medium">{statusCounts.in_progress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                    Завершено
                  </span>
                  <span className="font-medium">{statusCounts.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                    Отменено
                  </span>
                  <span className="font-medium">{statusCounts.cancelled}</span>
                </div>
                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Всего</span>
                    <span>{appealsList.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-md text-red-700">
                {error}
                <button 
                  onClick={fetchAppeals}
                  className="ml-2 underline"
                >
                  Попробовать снова
                </button>
              </div>
            ) : appealsList.length === 0 ? (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Нет обращений</h3>
                <p className="text-gray-500 mb-4">
                  {Object.keys(filters).length > 0 
                    ? 'Не найдено обращений по заданным параметрам фильтрации' 
                    : 'В системе пока нет ни одного обращения'}
                </p>
                {Object.keys(filters).length > 0 ? (
                  <button
                    onClick={() => setFilters({})}
                    className="btn btn-secondary"
                  >
                    Сбросить фильтры
                  </button>
                ) : (
                  <Link href="/appeals/new" className="btn btn-primary">
                    Создать обращение
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {appealsList.map(appeal => (
                  <AppealCard 
                    key={appeal.id} 
                    appeal={appeal} 
                    onUpdate={fetchAppeals} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
