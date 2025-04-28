'use client';

import { useState } from 'react';
import { Todo, todos } from '@/lib/api';
import toast from 'react-hot-toast';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(todo.task);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleToggleComplete = async () => {
    try {
      setIsUpdating(true);
      await todos.update(todo.id, { completed: !todo.completed });
      onUpdate();
    } catch (error) {
      toast.error('Не удалось обновить задачу');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdateTask = async () => {
    if (!task.trim()) {
      toast.error('Задача не может быть пустой');
      return;
    }
    
    try {
      setIsUpdating(true);
      await todos.update(todo.id, { task });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('Не удалось обновить задачу');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await todos.delete(todo.id);
      toast.success('Задача удалена');
      onUpdate();
    } catch (error) {
      toast.error('Не удалось удалить задачу');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow mb-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        disabled={isUpdating}
        className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      
      {isEditing ? (
        <div className="ml-3 flex-grow">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="input"
            autoFocus
          />
          <div className="flex mt-2 space-x-2">
            <button
              onClick={handleUpdateTask}
              disabled={isUpdating}
              className="btn btn-primary text-sm"
            >
              {isUpdating ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={() => {
                setTask(todo.task);
                setIsEditing(false);
              }}
              className="btn btn-secondary text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <span 
          className={`ml-3 flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
        >
          {todo.task}
        </span>
      )}
      
      {!isEditing && (
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
