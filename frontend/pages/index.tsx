import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ticketsApi } from '../services/api';
import { Ticket, TicketStatus, TicketFilters } from '../types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetcher = (url: string) => ticketsApi.getTickets();

const Home: NextPage = () => {
  const [filters, setFilters] = useState<TicketFilters>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeModal, setActiveModal] = useState<'complete' | 'cancel' | null>(null);

  const { data: tickets, error, isLoading } = useSWR<Ticket[]>(
    '/tickets',
    () => ticketsApi.getTickets(filters),
    { refreshInterval: 5000 }
  );

  // Обработчики фильтров
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    mutate('/tickets');
  };

  const resetFilters = () => {
    setFilters({});
    mutate('/tickets');
  };

  // Обработчики форм
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ticketsApi.createTicket({ title, description });
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
      mutate('/tickets');
      toast.success('Обращение успешно создано');
    } catch (error) {
      toast.error('Ошибка при создании обращения');
    }
  };

  const handleProcessTicket = async (id: number) => {
    try {
      await ticketsApi.takeTicketIntoWork(id);
      mutate('/tickets');
      toast.success('Обращение взято в работу');
    } catch (error) {
      toast.error('Ошибка при взятии обращения в работу');
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    
    try {
      await ticketsApi.completeTicket(selectedTicket.id, { solution });
      setSolution('');
      setSelectedTicket(null);
      setActiveModal(null);
      mutate('/tickets');
      toast.success('Обращение успешно завершено');
    } catch (error) {
      toast.error('Ошибка при завершении обращения');
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    
    try {
      await ticketsApi.cancelTicket(selectedTicket.id, { cancelReason });
      setCancelReason('');
      setSelectedTicket(null);
      setActiveModal(null);
      mutate('/tickets');
      toast.success('Обращение успешно отменено');
    } catch (error) {
      toast.error('Ошибка при отмене обращения');
    }
  };

  const handleCancelAllInProgress = async () => {
    if (!cancelReason) {
      toast.error('Укажите причину отмены');
      return;
    }
    
    try {
      await ticketsApi.cancelAllInProgressTickets({ cancelReason });
      setCancelReason('');
      mutate('/tickets');
      toast.success('Все обращения в работе успешно отменены');
    } catch (error) {
      toast.error('Ошибка при отмене обращений');
    }
  };

  // Открытие модальных окон
  const openCompleteModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setActiveModal('complete');
  };

  const openCancelModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setActiveModal('cancel');
  };

  // Вспомогательные функции
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  const getStatusClass = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.NEW:
        return 'bg-blue-100 text-blue-800';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case TicketStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TicketStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100';
    }
  };

  if (error) return <div className="p-4 text-red-500">Ошибка загрузки данных</div>;

  return (
    <div>
      <Head>
        <title>Система обращений</title>
        <meta name="description" content="Система для работы с обращениями" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Система обращений</h1>
        
        {/* Фильтры */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Фильтры</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Конкретная дата:</label>
              <input
                type="date"
                name="date"
                value={filters.date || ''}
                onChange={handleDateFilterChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Начальная дата:</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate || ''}
                onChange={handleDateFilterChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Конечная дата:</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate || ''}
                onChange={handleDateFilterChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Применить
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Сбросить
            </button>
          </div>
        </div>

        {/* Создание нового обращения */}
        <div className="mb-6">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Создать обращение
            </button>
          ) : (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">Новое обращение</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="mb-4">
                  <label className="block mb-1">Тема обращения:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Текст обращения:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Отправить
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Кнопка для отмены всех обращений в работе */}
        <div className="mb-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-red-800">Массовая отмена обращений</h2>
            <div className="mb-4">
              <label className="block mb-1">Причина отмены всех обращений в работе:</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
            <button
              onClick={handleCancelAllInProgress}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Отменить все обращения в работе
            </button>
          </div>
        </div>

        {/* Список обращений */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Список обращений</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2">Загрузка данных...</p>
            </div>
          ) : tickets && tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{ticket.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700">{ticket.description}</p>
                  </div>
                  
                  {ticket.solution && (
                    <div className="mb-4 p-3 bg-green-50 rounded">
                      <h4 className="font-semibold text-green-800">Решение:</h4>
                      <p>{ticket.solution}</p>
                    </div>
                  )}
                  
                  {ticket.cancelReason && (
                    <div className="mb-4 p-3 bg-red-50 rounded">
                      <h4 className="font-semibold text-red-800">Причина отмены:</h4>
                      <p>{ticket.cancelReason}</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Создано: {formatDate(ticket.createdAt)}</p>
                    <p>Обновлено: {formatDate(ticket.updatedAt)}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {ticket.status === TicketStatus.NEW && (
                      <button
                        onClick={() => handleProcessTicket(ticket.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Взять в работу
                      </button>
                    )}
                    
                    {ticket.status === TicketStatus.IN_PROGRESS && (
                      <>
                        <button
                          onClick={() => openCompleteModal(ticket)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Завершить
                        </button>
                        <button
                          onClick={() => openCancelModal(ticket)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Отменить
                        </button>
                      </>
                    )}
                    
                    {ticket.status === TicketStatus.NEW && (
                      <button
                        onClick={() => openCancelModal(ticket)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded">
              <p>Обращений не найдено</p>
            </div>
          )}
        </div>
      </main>

      {/* Модальное окно для завершения обращения */}
      {activeModal === 'complete' && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Завершение обращения</h2>
            <form onSubmit={handleCompleteSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Решение проблемы:</label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Завершить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTicket(null);
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно для отмены обращения */}
      {activeModal === 'cancel' && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Отмена обращения</h2>
            <form onSubmit={handleCancelSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Причина отмены:</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Отменить обращение
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTicket(null);
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;