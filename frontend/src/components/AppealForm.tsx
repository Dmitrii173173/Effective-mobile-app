'use client';

import { useState } from 'react';
import { appeals } from '@/lib/api';
import toast from 'react-hot-toast';

interface AppealFormProps {
  onSuccess?: () => void;
}

export default function AppealForm({ onSuccess }: AppealFormProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await appeals.create(subject, description);
      toast.success('Обращение успешно создано');
      setSubject('');
      setDescription('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Не удалось создать обращение');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Новое обращение</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Тема обращения
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
            placeholder="Укажите тему обращения"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание проблемы
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            rows={5}
            placeholder="Опишите вашу проблему подробно"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить обращение'}
        </button>
      </form>
    </div>
  );
}
