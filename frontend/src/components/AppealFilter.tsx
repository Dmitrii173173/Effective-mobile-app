'use client';

import { useState } from 'react';

interface AppealFilterProps {
  onFilter: (filters: FilterParams) => void;
}

export interface FilterParams {
  date?: string;
  startDate?: string;
  endDate?: string;
}

export default function AppealFilter({ onFilter }: AppealFilterProps) {
  const [filterType, setFilterType] = useState<'single' | 'range'>('single');
  const [date, setDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const handleFilter = () => {
    if (filterType === 'single') {
      onFilter({ date });
    } else {
      onFilter({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    }
  };
  
  const clearFilters = () => {
    setDate('');
    setStartDate('');
    setEndDate('');
    onFilter({});
  };
  
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-3">Фильтрация обращений</h2>
      
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 text-primary-600"
              checked={filterType === 'single'}
              onChange={() => setFilterType('single')}
            />
            <span className="ml-2">По конкретной дате</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 text-primary-600"
              checked={filterType === 'range'}
              onChange={() => setFilterType('range')}
            />
            <span className="ml-2">По диапазону дат</span>
          </label>
        </div>
        
        {filterType === 'single' ? (
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Дата
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Начальная дата
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Конечная дата
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleFilter}
          className="btn btn-primary flex-1"
        >
          Применить фильтр
        </button>
        <button
          onClick={clearFilters}
          className="btn btn-secondary"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
