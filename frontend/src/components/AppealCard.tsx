'use client';

import { useState } from 'react';
import { Appeal, appeals } from '@/lib/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

interface AppealCardProps {
  appeal: Appeal;
  onUpdate: () => void;
}

export default function AppealCard({ appeal, onUpdate }: AppealCardProps) {
  const { isAdmin, isSuperUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [solution, setSolution] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="badge badge-new">Новое</span>;
      case 'in_progress':
        return <span className="badge badge-in-progress">В работе</span>;
      case 'completed':
        return <span className="badge badge-completed">Завершено</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Отменено</span>;
      default:
        return null;
    }
  };
  
  const handleProcess = async () => {
    try {
      setIsProcessing(true);
      await appeals.process(appeal.id);
      toast.success('Обращение взято в работу');
      onUpdate();
    } catch (error) {
      toast.error('Ошибка при изменении статуса обращения');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution.trim()) {
      toast.error('Добавьте решение проблемы');
      return;
    }
    
    try {
      setIsCompleting(true);
      await appeals.complete(appeal.id, solution);
      toast.success('Обращение успешно завершено');
      setSolution('');
      setIsCompleting(false);
      onUpdate();
    } catch (error) {
      toast.error('Ошибка при завершении обращения');
      console.error(error);
      setIsCompleting(false);
    }
  };
  
  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      toast.error('Укажите причину отмены');
      return;
    }
    
    try {
      setIsCancelling(true);
      await appeals.cancel(appeal.id, cancelReason);
      toast.success('Обращение отменено');
      setCancelReason('');
      setIsCancelling(false);
      onUpdate();
    } catch (error) {
      toast.error('Ошибка при отмене обращения');
      console.error(error);
      setIsCancelling(false);
    }
  };
  
  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{appeal.subject}</h3>
        {getStatusBadge(appeal.status)}
      </div>
      
      <p className="text-gray-700 mb-2">{appeal.description}</p>
      
      {appeal.solution && (
        <div className="mt-3 p-3 bg-green-50 rounded-md">
          <h4 className="font-medium text-green-800">Решение:</h4>
          <p className="text-green-700">{appeal.solution}</p>
        </div>
      )}
      
      {appeal.cancelReason && (
        <div className="mt-3 p-3 bg-red-50 rounded-md">
          <h4 className="font-medium text-red-800">Причина отмены:</h4>
          <p className="text-red-700">{appeal.cancelReason}</p>
        </div>
      )}
      
      <div className="mt-3 text-sm text-gray-500">
        <p>Создано: {formatDate(appeal.createdAt)}</p>
        <p>Обновлено: {formatDate(appeal.updatedAt)}</p>
      </div>
      
      {/* Кнопки управления статусом */}
      <div className="mt-4 space-y-4">
        {isAdmin() && appeal.status === 'new' && (
          <button 
            onClick={handleProcess} 
            disabled={isProcessing}
            className="btn btn-primary w-full"
          >
            {isProcessing ? 'Обработка...' : 'Взять в работу'}
          </button>
        )}
        
        {isAdmin() && appeal.status === 'in_progress' && (
          <div className="space-y-3">
            <form onSubmit={handleComplete}>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Опишите решение проблемы"
                className="input mb-2"
                rows={3}
                required
              />
              <button 
                type="submit" 
                disabled={isCompleting}
                className="btn btn-primary w-full"
              >
                {isCompleting ? 'Сохранение...' : 'Завершить обращение'}
              </button>
            </form>
            
            <form onSubmit={handleCancel}>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Укажите причину отмены"
                className="input mb-2"
                rows={2}
                required
              />
              <button 
                type="submit" 
                disabled={isCancelling}
                className="btn btn-danger w-full"
              >
                {isCancelling ? 'Отмена...' : 'Отменить обращение'}
              </button>
            </form>
          </div>
        )}
        
        {!isAdmin() && appeal.status === 'new' && (
          <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
            Ваше обращение зарегистрировано и ожидает обработки.
          </div>
        )}
        
        {!isAdmin() && appeal.status === 'in_progress' && (
          <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-700">
            Ваше обращение находится в обработке. Мы работаем над решением вашей проблемы.
          </div>
        )}
      </div>
    </div>
  );
}
