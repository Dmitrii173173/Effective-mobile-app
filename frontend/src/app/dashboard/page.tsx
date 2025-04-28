'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import TodoItem from '@/components/TodoItem';
import { Todo, todos } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading, isSuperUser, username } = useAuth();
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Защита страницы - редирект на страницу логина, если пользователь не авторизован
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);
  
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todos.getAll();
      setTodosList(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Не удалось загрузить список задач');
      toast.error('Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);
  
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      toast.error('Введите текст задачи');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await todos.create(newTask);
      setNewTask('');
      toast.success('Задача добавлена');
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Не удалось создать задачу');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </main>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Редирект произойдет через useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Мои задачи</h1>
        
        {isSuperUser && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm leading-5 font-medium text-yellow-800">
                  Вы вошли как суперпользователь <span className="font-bold">{username}</span>
                </p>
                <p className="text-sm leading-5 text-yellow-700 mt-1">
                  У вас есть доступ ко всем функциям системы управления обращениями.
                </p>
              </div>
            </div>
          </div>
        )
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Создать новую задачу</h2>
            
            <form onSubmit={handleCreateTodo} className="flex">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="input flex-grow mr-3"
                placeholder="Введите текст задачи"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Добавление...' : 'Добавить'}
              </button>
            </form>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Список задач</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-md text-red-700">
                {error}
                <button 
                  onClick={fetchTodos}
                  className="ml-2 underline"
                >
                  Попробовать снова
                </button>
              </div>
            ) : todosList.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">У вас пока нет задач</h3>
                <p className="text-gray-500 mb-4">
                  Добавьте свою первую задачу с помощью формы выше
                </p>
              </div>
            ) : (
              <div>
                {/* Группируем по статусу */}
                {todosList.some(todo => !todo.completed) && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Активные</h3>
                    {todosList
                      .filter(todo => !todo.completed)
                      .map(todo => (
                        <TodoItem 
                          key={todo.id} 
                          todo={todo} 
                          onUpdate={fetchTodos} 
                        />
                      ))
                    }
                  </div>
                )}
                
                {todosList.some(todo => todo.completed) && (
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Завершенные</h3>
                    {todosList
                      .filter(todo => todo.completed)
                      .map(todo => (
                        <TodoItem 
                          key={todo.id} 
                          todo={todo} 
                          onUpdate={fetchTodos} 
                        />
                      ))
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
