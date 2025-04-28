'use client';

import { useState } from 'react';

interface SuperUserLoginButtonProps {
  onClick: () => void;
}

export default function SuperUserLoginButton({ onClick }: SuperUserLoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full py-3 px-4 flex items-center justify-center rounded-md transition-all duration-300 ${
          isHovered 
            ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-1' 
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 mr-2 transition-all duration-300 ${isHovered ? 'animate-spin-slow' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
          />
        </svg>
        <span className="font-medium">Войти как суперпользователь (dmitriiming)</span>
      </button>
      <div className="mt-2 text-center text-xs text-gray-500">
        Имя пользователя: <span className="font-medium">dmitriiming</span>, Пароль: <span className="font-medium">007dd007dd</span>
      </div>
    </div>
  );
}
